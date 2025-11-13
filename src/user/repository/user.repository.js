import { prisma } from "../../db.config.js";

export async function findUserProfileById(userId) {
  return prisma.users.findUnique({
    where: { id: userId },
    select: {
        id: true,
        email: true,
        nickname: true,
        grade: true,
        gender: true,
        is_completed: true,
        created_at: true,
        updated_at: true,
    }
  });
}
