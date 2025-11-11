const toNum = (v) => (v == null ? null : Number(v));

export function toSubjectRes(s) {
  return {
    id: s.id,
    name: s.name,
    color: s.color,
    target_weekly_min: s.target_weekly_min,

    // ✅ 새 필드
    credit: toNum(s.credit),            // Decimal? -> number|null
    difficulty: s.difficulty || "Normal",

    // 기존
    weight: toNum(s.weight),            // Decimal -> number
    archived: s.archived,

    // 타임스탬프
    created_at: s.created_at,
    updated_at: s.updated_at,
  };
}

export function toSubjectListItem(s) {
  return {
    id: s.id,
    name: s.name,
    color: s.color,
    credit: toNum(s.credit),
    difficulty: s.difficulty || "Normal",
    weight: toNum(s.weight),
    archived: s.archived,
    updated_at: s.updated_at,
  };
}

