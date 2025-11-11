// src/auth/controller/auth.controller.js
import { authService } from "../service/auth.service.js";
import {
  refreshCookieName,
  refreshCookieOptions,
  accessCookieName,
  accessCookieOptions,
} from "../../utils/cookies.js";
import {
  parseRegisterRequest,
  parseLoginRequest,
  parseLogoutRequest,
} from "../dto/auth.request.dto.js";

/**
 * **[Auth]**
 * **<🎮 Controller>**
 * ***register***
 * '회원가입' HTTP 핸들러입니다.
 * DTO로 요청을 검증/정규화한 뒤 서비스에 전달합니다.
 * @param {import('express').Request} req - body: { email, password, nickname?, grade?, gender? }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>} - 201 + { user }
 */
export const register = async (req, res, next) => {
  try {
    const dto = parseRegisterRequest(req.body);
    const user = await authService.register(dto);
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};

/**
 * **[Auth]**
 * **<🎮 Controller>**
 * ***login***
 * '로그인' HTTP 핸들러입니다.
 * DTO로 검증 후 서비스 호출 → AT/RT 발급, RT는 httpOnly 쿠키로 설정.
 * @param {import('express').Request} req - body: { email, password }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>} - 200 + { user, accessToken }
 */
export const login = async (req, res, next) => {
  try {
    const dto = parseLoginRequest(req.body);
    const { user, accessToken, refreshTokenValue } = await authService.login(
      dto
    );
    res.cookie(refreshCookieName, refreshTokenValue, refreshCookieOptions);
    res.cookie(accessCookieName, accessToken, accessCookieOptions);
    res.json({ user, accessToken });
  } catch (e) {
    next(e);
  }
};

/**
 * **[Auth]**
 * **<🎮 Controller>**
 * ***refresh***
 * '토큰 재발급' HTTP 핸들러입니다.
 * 쿠키에서 RT를 읽어 서비스에 전달 → 새 AT/RT 발급. RT 쿠키 교체.
 * @param {import('express').Request} req - cookies: { rt }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>} - 200 + { accessToken }
 */
export const refresh = async (req, res, next) => {
  try {
    const cur = req.cookies?.[refreshCookieName];
    const { accessToken, refreshTokenValue } = await authService.refresh({
      refreshTokenValue: cur,
    });
    res.cookie(refreshCookieName, refreshTokenValue, refreshCookieOptions);
    res.cookie(accessCookieName, accessToken, accessCookieOptions);
    res.json({ accessToken });
  } catch (e) {
    next(e);
  }
};

/**
 * **[Auth]**
 * **<🎮 Controller>**
 * ***logout***
 * '로그아웃' HTTP 핸들러입니다.
 * DTO로 옵션을 파싱한 뒤, 쿠키의 RT를 사용해 세션 종료.
 * allDevices=true + userId가 있으면 해당 유저의 모든 기기를 로그아웃합니다.
 * @param {import('express').Request} req - cookies: { rt }, body?: { allDevices?: boolean, userId?: number }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>} - 204 No Content
 */
export const logout = async (req, res, next) => {
  try {
    const { allDevices, userId } = parseLogoutRequest(req.body ?? {});
    const cur = req.cookies?.[refreshCookieName];
    await authService.logout({ refreshTokenValue: cur, allDevices, userId });
    res.clearCookie(accessCookieName, accessCookieOptions);
    res.clearCookie(refreshCookieName, refreshCookieOptions);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
