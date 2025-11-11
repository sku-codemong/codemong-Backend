import { Router } from "express";
import * as ctrl from "../controller/subject.controller.js";
import { requireAuth } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// router.use(requireAuth); // 인증 미들웨어 붙일거면

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: 과목(Subject) 관리 API
 */

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: 과목 생성
 *     description: 유저 소유의 과목을 생성한다.
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "자료구조"
 *               color:
 *                 type: string
 *                 example: "#7C3AED"
 *               target_weekly_min:
 *                 type: integer
 *                 minimum: 0
 *                 example: 300
 *               weight:
 *                 type: number
 *                 format: float
 *                 example: 1.5
 *     responses:
 *       "201":
 *         description: 생성된 과목
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 */
router.post("/", requireAuth(), ctrl.createSubject);

/**
 * @swagger
 * /api/subjects/{id}:
 *   patch:
 *     summary: 과목 수정
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "운영체제" }
 *               color: { type: string, example: "#10B981" }
 *               target_weekly_min: { type: integer, minimum: 0, example: 240 }
 *               weight: { type: number, format: float, example: 1.0 }
 *     responses:
 *       "200":
 *         description: 수정된 과목
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 */
router.patch("/:id", requireAuth(), ctrl.updateSubject);

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: 과목 단건 조회
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       "200":
 *         description: 조회 결과
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 */
router.patch("/:id/archive", requireAuth(), ctrl.archiveSubject);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: 과목 목록/검색
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: 과목명 검색(부분일치, 대소문자 무시)
 *       - in: query
 *         name: includeArchived
 *         schema: { type: boolean }
 *         example: false
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50 }
 *         example: 20
 *       - in: query
 *         name: cursor
 *         schema: { type: integer }
 *     responses:
 *       "200":
 *         description: 목록 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 items:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Subject' }
 *                 nextCursor: { type: integer, nullable: true }
 */
router.get("/:id", requireAuth(), ctrl.getSubjectById);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: 과목 목록/검색
 *     tags: [Subjects]
 */
router.get("/", requireAuth(), ctrl.listSubjects);

export default router;
