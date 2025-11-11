import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/router/auth.router.js";
import { swaggerUi, specs } from "../swagger/swagger.js";
const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // ← Models 섹션 자체를 숨김
      docExpansion: "none", // 태그들도 처음엔 접기(선택)
    },
    // 혹시 브라우저/버전에 따라 남아있으면 CSS로도 한번 더 숨김
    customCss: `.swagger-ui .models { display: none !important; }`,
  })
);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`서버 열림 - 포트 : ${PORT}`);
});
