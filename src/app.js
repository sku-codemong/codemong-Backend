// app.js (필요한 import 확인)
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";

import authRoutes from "./auth/auth.routes.js";
import subjectRouter from "./subject/router/subject.router.js";
import { requireAuth } from "./auth/auth.middleware.js"; // export 방식에 맞게

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Swagger (기존 코드 유지)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      swaggerOptions: { withCredentials: true },
    },
    customCss: `.swagger-ui .models { display: none !important; }`,
  })
);

// ✅ 라우트는 listen 위에!
app.use("/api/auth", authRoutes);
app.use(
  "/api/subjects",
  requireAuth({ allowCookie: true, cookieName: "at" }),
  subjectRouter
);

// ✅ 마지막에 서버 시작
app.listen(PORT, () => {
  console.log(`서버 열림 - 포트 : ${PORT}`);
});

export default app;
