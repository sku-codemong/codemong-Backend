// src/auth/cookie.util.js
const isProd = process.env.NODE_ENV === "production";

// TTL 문자열(예: "7d", "15m")을 ms로
function parseTTL(str) {
  const m = /^(\d+)([smhd])$/.exec(str);
  if (!m) throw new Error(`Invalid TTL format: ${str}`);
  const n = Number(m[1]);
  const unit = m[2];
  const mult = { s: 1, m: 60, h: 3600, d: 86400 }[unit];
  return n * mult * 1000; // ms
}

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
