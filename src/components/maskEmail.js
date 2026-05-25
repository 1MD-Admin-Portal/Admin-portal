export const maskEmail = (email) => {
  if (!email || typeof email !== "string") return "N/A";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(local.length - 2, 4));
  return `${visible}${masked}@${domain}`;
};