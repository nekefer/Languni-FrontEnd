/**
 * Derive display initials from a user object.
 * Falls back to first email character, then "?".
 */
export function getUserInitials(user) {
  if (!user) return "?";
  const combined = (
    (user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")
  ).toUpperCase();
  return combined.trim() || user.email?.[0]?.toUpperCase() || "?";
}
