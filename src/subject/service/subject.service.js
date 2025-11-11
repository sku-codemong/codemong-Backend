import * as repo from "../repository/subject.repository.js";

function assertUser(userId) {
  if (!userId) {
    const err = new Error("Unauthenticated");
    err.status = 401;
    throw err;
  }
}

/**
 * **[Subject]**
 * **<🧠 Service>**
 * ***createSubject***
 * 유저 소유로 과목을 생성합니다.
 * 유효성은 DTO에서, DB 입력은 Repository에서 처리합니다.
 */
export async function createSubject(userId, dto) {
  assertUser(userId);
  return repo.create(userId, dto);
}

/**
 * **[Subject]**
 * **<🧠 Service>**
 * ***updateSubject***
 * 과목 존재/소유권을 확인한 뒤 일부 필드(name/color/target_weekly_min/weight)를 수정합니다.
 */
export async function updateSubject(userId, id, dto) {
  assertUser(userId);
  const existing = await repo.findById(userId, id);
  if (!existing) throw new Error("Subject not found");
  return repo.updateById(userId, id, dto);
}

/**
 * **[Subject]**
 * **<🧠 Service>**
 * ***setArchive***
 * 과목의 archived 상태를 보관/복구로 변경합니다. 존재/소유권을 확인합니다.
 */
export async function setArchive(userId, id, archived) {
  assertUser(userId);
  const existing = await repo.findById(userId, id);
  if (!existing) throw new Error("Subject not found");
  return repo.setArchived(userId, id, archived);
}

/**
 * **[Subject]**
 * **<🧠 Service>**
 * ***getSubject***
 * 과목 단건을 조회합니다. 존재하지 않거나 타 유저 소유면 오류를 던집니다.
 */
export async function getSubject(userId, id) {
  assertUser(userId);
  const s = await repo.findById(userId, id);
  if (!s) throw new Error("Subject not found");
  return s;
}

/**
 * **[Subject]**
 * **<🧠 Service>**
 * ***listSubjects***
 * 검색어(q), 보관 포함 여부(includeArchived), limit, cursor 조건으로 목록을 조회합니다.
 */
export async function listSubjects(userId, query) {
  assertUser(userId);
  return repo.list(userId, query);
}
