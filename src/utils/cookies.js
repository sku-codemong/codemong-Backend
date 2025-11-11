const isProd = process.env.NODE_ENV === "production";
const base = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

export const accessCookieName = "at";
export const accessCookieOptions = {
  ...base,
  path: "/",
  maxAge: /* 15m */ 15 * 60 * 1000,
};

export const refreshCookieName = "rt";
export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd ? true : false, // 로컬 개발: false, 배포: true
  sameSite: isProd ? "lax" : "lax", // SPA 크로스 도메인이면 "none"+secure true
  domain: process.env.COOKIE_DOMAIN || "localhost",
  path: "/api/auth",
  maxAge: parseTTL(process.env.REFRESH_TOKEN_TTL || "7d"),
};

// 👇 Access Token 쿠키
export const accessCookieName = "at";
export const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  domain: process.env.COOKIE_DOMAIN || "localhost",
  path: "/", // 전역
  maxAge: parseTTL(process.env.ACCESS_TOKEN_TTL || "15m"),
};
