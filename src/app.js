import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/router/auth.router.js";
import { requireAuth } from "./auth/middleware/auth.middleware.js";
import subjectRouter from "./subject/router/subject.router.js";
import { swaggerUi, specs } from "../swagger/swagger.js";
const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(helmet());
const allowlist = new Set(["http://localhost:3000", "http://localhost:4000"]);
app.use(
  cors({
    origin(origin, cb) {
      // origin이 undefined인 경우(같은 오리진, curl 등)도 허용
      if (!origin || allowlist.has(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true, // ✅ 쿠키 허용
  })
);
app.use(express.json());
app.use(cookieParser());
// swagger 주석

app.use("/api/auth", authRoutes);
app.use(
  "/api/subjects",
  requireAuth({ allowCookie: true, cookieName: "at" }),
  subjectRouter
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // ← Models 섹션 자체를 숨김
      swaggerOptions: { withCredentials: true },
    },
    // 혹시 브라우저/버전에 따라 남아있으면 CSS로도 한번 더 숨김
    customCss: `.swagger-ui .models { display: none !important; }`,
  })
);
app.listen(PORT, () => {
  console.log(`서버 열림 - 포트 : ${PORT}`);
});
