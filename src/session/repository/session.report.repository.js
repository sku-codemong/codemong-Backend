import { prisma } from "../../db.config.js";

export const findSessionsBetween = (user_id, start, end) => {
  return prisma.sessions.findMany({
    where: {
      user_id,
      start_at: { gte: start, lt: end },
    },
    include: {
      subject: true,
    },
    orderBy: { start_at: "asc" },
  });
};

export const findUserSubjects = (user_id) => {
  return prisma.subjects.findMany({
    where: { user_id, archived: false },
  });
};
