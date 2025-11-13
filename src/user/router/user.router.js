// src/user/router/user.router.js
import { Router } from "express";
import { getMyProfile } from "../controller/user.controller.js";
import { requireAuth } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: 유저 관련 API
 *
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "test@example.com"
 *         nickname:
 *           type: string
 *           nullable: true
 *           example: "현준"
 *         grade:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         gender:
 *           type: string
 *           nullable: true
 *           enum: [Male, Female]
 *         is_completed:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           example: true
 *         user:
 *           $ref: '#/components/schemas/UserProfile'
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags: [Users]
 *     summary: 내 프로필 조회
 *     description: 로그인된 유저의 프로필 정보를 조회합니다.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 내 프로필 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 인증 실패 (토큰 없음/유효하지 않음)
 *       404:
 *         description: 유저를 찾을 수 없음
 */
router.get("/me", getMyProfile);

export default router;
