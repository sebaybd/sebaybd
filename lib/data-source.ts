export function shouldUseSampleData() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return true;

  const placeholderHints = ["username:password", "cluster.mongodb.net/sheba_connect"];
  return placeholderHints.some((hint) => dbUrl.includes(hint));
}
