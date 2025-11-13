import { Router } from "express";
import * as ctrl from "../controller/session.report.controller.js"; // 리포트용 컨트롤러

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SessionReports
 *   description: 공부 리포트(일간/주간/추천) API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DailyReport:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2025-11-14"
 *         total_duration_min:
 *           type: integer
 *           example: 120
 *         by_subject:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subject_id: { type: integer, example: 3 }
 *               subject_name: { type: string, example: "자료구조" }
 *               duration_min: { type: integer, example: 60 }
 *
 *     WeeklyReport:
 *       type: object
 *       properties:
 *         week_start:
 *           type: string
 *           example: "2025-11-10"
 *         week_end:
 *           type: string
 *           example: "2025-11-16"
 *         total_duration_min:
 *           type: integer
 *           example: 540
 *         by_subject:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subject_id: { type: integer, example: 1 }
 *               subject_name: { type: string, example: "운영체제" }
 *               duration_min: { type: integer, example: 220 }
 *
 *     TodayRecommendation:
 *       type: object
 *       properties:
 *         today:
 *           type: string
 *           example: "2025-11-14"
 *         recommended:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subject_id: { type: integer, example: 4 }
 *               subject_name: { type: string, example: "알고리즘" }
 *               weight: { type: number, example: 1.35 }
 *               recommended_min:
 *                 type: integer
 *                 example: 50
 *
 *     ReportResponse:
 *       type: object
 *       properties:
 *         ok: { type: boolean }
 *         report:
 *           type: object
 */

/**
 * @swagger
 * /api/sessions/report/daily:
 *   get:
 *     summary: 일간 리포트 조회
 *     description: "특정 날짜(YYYY-MM-DD)의 공부 총 시간 및 과목별 공부 시간을 조회합니다."
 *     tags: [SessionReports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-11-14"
 *         description: 조회할 날짜(YYYY-MM-DD)
 *     responses:
 *       "200":
 *         description: 일간 리포트
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 report:
 *                   $ref: '#/components/schemas/DailyReport'
 */
router.get("/report/daily", ctrl.getDailyReport);

/**
 * @swagger
 * /api/sessions/report/weekly:
 *   get:
 *     summary: 주간 리포트 조회
 *     description: "해당 주(week_start 기준)의 공부 총 시간과 과목별 공부 시간을 조회합니다."
 *     tags: [SessionReports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: week_start
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-11-10"
 *         description: 주 시작 날짜(월요일) YYYY-MM-DD
 *     responses:
 *       "200":
 *         description: 주간 리포트
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 report:
 *                   $ref: '#/components/schemas/WeeklyReport'
 */
router.get("/report/weekly", ctrl.getWeeklyReport);

/**
 * @swagger
 * /api/sessions/recommend/today:
 *   get:
 *     summary: 오늘의 공부 분배 추천
 *     description: "Subject의 weight(가중치)를 기반으로 오늘 추천되는 공부량을 계산합니다."
 *     tags: [SessionReports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200":
 *         description: 오늘의 분배 추천 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 recommendation:
 *                   $ref: '#/components/schemas/TodayRecommendation'
 */
router.get("/recommend/today", ctrl.getTodayRecommendation);

export default router;
