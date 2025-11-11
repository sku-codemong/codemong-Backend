import { prisma } from "../../db.config.js";

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***findUserByEmail***
 * '이메일로 유저 조회' 기능의 레포지토리 레이어입니다.
 * DB의 users 테이블에서 해당 이메일을 가진 유저를 조회합니다.
 * @param {string} email - 조회할 유저의 이메일
 * @returns {Promise<object|null>} - 존재하면 유저 객체, 없으면 null
 */
export const findUserByEmail = (email) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***findUserById***
 * 'ID로 유저 조회' 기능의 레포지토리 레이어입니다.
 * DB의 users 테이블에서 해당 ID를 가진 유저를 조회합니다.
 * @param {number} id - 조회할 유저의 ID
 * @returns {Promise<object|null>} - 존재하면 유저 객체, 없으면 null
 */
export const findUserById = (id) => {
  return prisma.users.findUnique({
    where: { id },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***createUser***
 * '회원가입' 기능의 레포지토리 레이어입니다.
 * DB의 users 테이블에 새로운 유저 정보를 삽입하고 생성된 유저의 주요 정보를 반환합니다.
 * @param {object} data - { email, passwordHash, nickname, grade, gender }
 * @returns {Promise<object>} - 생성된 유저의 id, email, nickname, grade, gender
 */
export const createUser = ({
  email,
  passwordHash,
  nickname,
  grade,
  gender,
}) => {
  return prisma.users.create({
    data: {
      email,
      password_hash: passwordHash,
      nickname,
      grade,
      gender,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      grade: true,
      gender: true,
    },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***createRefreshToken***
 * '리프레시 토큰 생성' 기능의 레포지토리 레이어입니다.
 * DB의 refresh_token 테이블에 새 토큰 레코드를 삽입합니다.
 * @param {object} data - { userId, token }
 * @returns {Promise<object>} - 생성된 토큰의 id, user_id, updated_at
 */
export const createRefreshToken = ({ userId, token }) => {
  return prisma.refresh_token.create({
    data: {
      user_id: userId,
      token,
    },
    select: { id: true, user_id: true, updated_at: true },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***findRefreshToken***
 * '리프레시 토큰 조회' 기능의 레포지토리 레이어입니다.
 * DB의 refresh_token 테이블에서 토큰 값(또는 userId와 함께)을 조건으로 토큰을 조회합니다.
 * @param {object} data - { token, userId }
 * @returns {Promise<object|null>} - 존재하면 토큰 객체, 없으면 null
 */
export const findRefreshToken = ({ token, userId }) => {
  return prisma.refresh_token.findFirst({
    where: userId ? { token, user_id: userId } : { token },
    orderBy: { updated_at: "desc" },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***updateRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어입니다.
 * 지정된 id의 토큰 값을 새 토큰으로 업데이트합니다.
 * @param {object} data - { id, newToken }
 * @returns {Promise<object>} - 수정된 토큰의 id, updated_at
 */
export const updateRefreshToken = ({ id, newToken }) => {
  return prisma.refresh_token.update({
    where: { id },
    data: { token: newToken },
    select: { id: true, updated_at: true },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***deleteRefreshToken***
 * '리프레시 토큰 삭제' 기능의 레포지토리 레이어입니다.
 * DB의 refresh_token 테이블에서 특정 토큰 값을 가진 레코드를 삭제합니다.
 * @param {string} token - 삭제할 토큰 값
 * @returns {Promise<object>} - 삭제된 행의 개수 정보(count)
 */
export const deleteRefreshToken = (token) => {
  return prisma.refresh_token.deleteMany({
    where: { token },
  });
};

/**
 * **[Auth]**
 * **<📦 Repository>**
 * ***deleteRefreshTokenForUser***
 * '유저의 모든 리프레시 토큰 삭제' 기능의 레포지토리 레이어입니다.
 * 특정 user_id를 가진 모든 리프레시 토큰을 삭제합니다.
 * @param {number} userId - 삭제할 유저의 ID
 * @returns {Promise<object>} - 삭제된 행의 개수 정보(count)
 */
export const deleteRefreshTokenForUser = (userId) => {
  return prisma.refresh_token.deleteMany({
    where: { user_id: userId },
  });
};
