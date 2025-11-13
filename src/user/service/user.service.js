import { findUserProfileById } from "../repository/user.repository.js";

export async function getMyProfileService(userId) {
  const user = await findUserProfileById(userId);

  if (!userId) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return user;
}
