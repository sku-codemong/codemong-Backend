import { prisma } from "../../db.config.js";

/**
 * **[Subject]**
 * **<🗄️ Repository>**
 * ***create***
 * subjects 테이블에 새로운 레코드를 insert 합니다.
 */
export async function create(userId, data) {
  return prisma.subjects.create({
    data: {
      user_id: userId,
      name: data.name,
      color: data.color,
      target_weekly_min: data.target_weekly_min,
      weight: data.weight,
    },
  });
}

/**
 * **[Subject]**
 * **<🗄️ Repository>**
 * ***updateById***
 * 과목 ID 기준으로 레코드를 업데이트합니다. (소유권 검증은 상위 계층)
 */
export async function updateById(userId, id, data) {
  return prisma.subjects.update({
    where: { id },
    data,
    // 유저 소유권 체크를 안전하게 하고 싶으면 updateMany로 바꾸고 count==1 확인
  });
}

/**
 * **[Subject]**
 * **<🗄️ Repository>**
 * ***findById***
 * 유저 소유 조건으로 과목 단건을 조회합니다.
 */
export async function findById(userId, id) {
  return prisma.subjects.findFirst({
    where: { id, user_id: userId },
  });
}

/**
 * **[Subject]**
 * **<🗄️ Repository>**
 * ***setArchived***
 * 과목의 archived 플래그를 변경합니다.
 */
export async function setArchived(userId, id, archived) {
  return prisma.subjects.update({
    where: { id },
    data: { archived },
  });
}

/**
 * **[Subject]**
 * **<🗄️ Repository>**
 * ***list***
 * 검색/보관여부/커서/limit 조건으로 과목 목록을 조회합니다.
 */
export async function list(userId, { q, includeArchived, limit, cursor }) {
  const where = {
    user_id: userId,
    ...(includeArchived ? {} : { archived: false }),
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(cursor ? { id: { gt: cursor } } : {}),
  };

  const items = await prisma.subjects.findMany({
    where,
    take: limit,
    orderBy: { id: "asc" },
  });

  const nextCursor = items.length === limit ? items[items.length - 1].id : null;
  return { items, nextCursor };
}
