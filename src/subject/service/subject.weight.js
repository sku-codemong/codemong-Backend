const DIFF_MUL = { Easy: 0.9, Normal: 1.0, Hard: 1.2 };

export async function recalcSubjectWeight(prisma, userId, subjectId) {
  const s = await prisma.subjects.findFirst({
    where: { id: subjectId, user_id: userId },
    select: { credit: true, difficulty: true },
  });
  if (!s) throw new Error("SUBJECT_NOT_FOUND");
  if (s.archived) return null;

  const credit = Number(s.credit ?? 0);
  const diffMul = DIFF_MUL[s.difficulty ?? "Normal"] ?? 1.0;

  const now = new Date();
  const soon = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

  const [openEst, urgentCnt] = await Promise.all([
    prisma.subject_tasks.aggregate({
      _sum: { estimated_min: true },
      where: {
        user_id: userId,
        subject_id: subjectId,
        status: { in: ["todo", "in_progress"] },
      },
    }),
    prisma.subject_tasks.count({
      where: {
        user_id: userId,
        subject_id: subjectId,
        status: { in: ["todo", "in_progress"] },
        due_at: { gte: now, lte: soon },
      },
    }),
  ]);

  const totalEst = Number(openEst._sum.estimated_min ?? 0); // 분
  // 간단 규칙(원하는대로 조정 가능)
  const creditMul = credit > 0 ? Math.min(1.4, 0.8 + credit / 3.5) : 1.0;
  const loadMul = 1 + Math.min(0.5, totalEst / 600); // 10시간(600분) 기준 최대 +0.5
  const urgentMul = 1 + Math.min(0.3, urgentCnt * 0.1);

  let w = 1.0 * diffMul * creditMul * loadMul * urgentMul;
  w = Math.max(0.5, Math.min(3.0, Math.round(w * 100) / 100));

  await prisma.subjects.update({
    where: { id: subjectId },
    data: { weight: w },
  });
  return w;
}
