function ensureString(v, name) {
  if (typeof v !== "string" || v.trim() === "")
    throw new Error(`${name} is required`);
  return v.trim();
}
function toIntOrNull(v, name) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${name} must be a non-negative integer`);
  return n;
}
function toNumberOrNull(v, name) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`${name} must be a number`);
  return n;
}

export function parseCreateDto(body) {
  return {
    name: ensureString(body.name, "name"),
    color: body.color?.trim() || null,
    target_weekly_min:
      toIntOrNull(body.target_weekly_min, "target_weekly_min") ?? 0,
    weight: toNumberOrNull(body.weight, "weight") ?? 1.0,
  };
}

export function parseUpdateDto(body) {
  const dto = {};
  if (body.name !== undefined) dto.name = ensureString(body.name, "name");
  if (body.color !== undefined) dto.color = body.color?.trim() || null;
  if (body.target_weekly_min !== undefined)
    dto.target_weekly_min = toIntOrNull(
      body.target_weekly_min,
      "target_weekly_min"
    );
  if (body.weight !== undefined)
    dto.weight = toNumberOrNull(body.weight, "weight");
  return dto;
}

export function parseArchiveDto(body) {
  if (typeof body.archived !== "boolean")
    throw new Error("archived must be boolean");
  return { archived: body.archived };
}

export function parseListQueryDto(qs) {
  return {
    q: typeof qs.q === "string" ? qs.q.trim() : "",
    includeArchived: qs.includeArchived === "true",
    limit: Math.min(50, toIntOrNull(qs.limit, "limit") ?? 20),
    cursor: qs.cursor ? Number(qs.cursor) : null, // id 기반 커서
  };
}
