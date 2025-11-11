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
  ...base,
  path: "/api/auth",
  maxAge: /* 7d */ 7 * 24 * 60 * 60 * 1000,
};
