// src/auth/service/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  findRefreshToken,
  createRefreshToken,
  updateRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokenForUser,
} from "../repository/auth.repository.js";
import { isAllowedSchoolEmail } from "../../utils/domain.js";

// ── Helpers ──────────────────────────────────────────────────────────
const signAT = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
  });

const signRT = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || "7d",
  });

/**
 * **[Auth]**
 * **<🧠 Service>**
 * ***register***
 * '회원가입' 기능의 서비스 레이어입니다.
 * 이메일 중복을 검사한 뒤 비밀번호를 해시 처리하여 DB에 유저를 생성하고,
 * 생성된 유저의 주요 정보를 반환합니다.
 * @param {object} data - { email: string, password: string, nickname?: string, grade?: number, gender?: "Male"|"Female" }
 * @returns {Promise<object>} - { id, email, nickname, grade, gender }
 */
export const register = async ({
  email,
  password,
  nickname,
  grade,
  gender,
}) => {
  if (!isAllowedSchoolEmail(email)) {
    const err = new Error("School email required");
    err.status = 400;
    err.code = "NOT_SCHOOL_EMAIL";
    throw err;
  }
  const exists = await findUserByEmail(email);
  if (exists) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({
    email,
    passwordHash,
    nickname,
    grade,
    gender,
  });

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    grade: user.grade,
    gender: user.gender,
  };
};

/**
 * **[Auth]**
 * **<🧠 Service>**
 * ***login***
 * '로그인' 기능의 서비스 레이어입니다.
 * 이메일/비밀번호를 검증하고 Access Token(JWT)과 Refresh Token(JWT)을 발급한 뒤,
 * DB에 리프레시 토큰을 저장하여 세션을 시작합니다.
 * @param {object} data - { email: string, password: string }
 * @returns {Promise<object>} - { user: { id, email, nickname, grade, gender }, accessToken: string, refreshTokenValue: string }
 */
export const login = async ({ email, password }) => {
  if (!isAllowedSchoolEmail(email)) {
    const err = new Error("School email required");
    err.status = 400;
    err.code = "NOT_SCHOOL_EMAIL";
    throw err;
  }
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = signAT(user.id);
  const refreshTokenValue = signRT(user.id);
  await createRefreshToken({ userId: user.id, token: refreshTokenValue });
  return {
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      grade: user.grade,
      gender: user.gender,
    },
    accessToken,
    refreshTokenValue,
  };
};

/**
 * **[Auth]**
 * **<🧠 Service>**
 * ***refresh***
 * '토큰 재발급' 기능의 서비스 레이어입니다.
 * 전달된 Refresh Token(JWT)을 검증하고, DB에 등록된 토큰인지 확인한 뒤
 * Access Token과 새 Refresh Token을 회전(rotate) 발급하여 반환합니다.
 * @param {object} data - { refreshTokenValue: string }
 * @returns {Promise<object>} - { accessToken: string, refreshTokenValue: string }
 */
export const refresh = async ({ refreshTokenValue }) => {
  if (!refreshTokenValue) {
    const err = new Error("Missing refresh token");
    err.status = 401;
    throw err;
  }

  // 1) RT JWT 검증 (exp/서명 확인)
  let payload;
  try {
    payload = jwt.verify(refreshTokenValue, process.env.JWT_REFRESH_SECRET);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.status = 401;
    throw err;
  }

  // 2) DB에 현재 등록된 RT인지 확인 (회전/로그아웃 대비)
  const row = await findRefreshToken({
    token: refreshTokenValue,
    userId: payload.sub,
  });
  if (!row) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    throw err;
  }

  // 3) 새 AT/RT 발급 + 회전(같은 row에 덮어쓰기)
  const accessToken = signAT(payload.sub);
  const newRefreshTokenValue = signRT(payload.sub);

  await updateRefreshToken({ id: row.id, newToken: newRefreshTokenValue });

  return {
    accessToken,
    refreshTokenValue: newRefreshTokenValue,
  };
};

/**
 * **[Auth]**
 * **<🧠 Service>**
 * ***logout***
 * '로그아웃' 기능의 서비스 레이어입니다.
 * 전달된 Refresh Token을 DB에서 삭제하여 현재 기기의 세션을 종료하거나,
 * allDevices=true와 userId를 함께 전달하면 해당 유저의 모든 기기 세션을 종료합니다.
 * @param {object} data - { refreshTokenValue?: string, allDevices?: boolean, userId?: number }
 * @returns {Promise<void>}
 */
export const logout = async ({
  refreshTokenValue,
  allDevices = false,
  userId = null,
}) => {
  if (allDevices && userId != null) {
    await deleteRefreshTokenForUser(userId);
    return;
  }
  if (refreshTokenValue) {
    await deleteRefreshToken(refreshTokenValue);
  }
};

export const authService = { register, login, refresh, logout };
