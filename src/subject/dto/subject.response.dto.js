export function toSubjectRes(s) {
  return {
    id: s.id,
    name: s.name,
    color: s.color,
    target_weekly_min: s.target_weekly_min,
    weight: Number(s.weight),
    archived: s.archived,
    created_at: s.created_at,
    updated_at: s.updated_at,
  };
}

export const toSubjectListItem = toSubjectRes;
