module.exports = {
  EMAIL_VALIDATION_REGEX: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/,
  PG_DB_SCHEMA: (process.env.DB_SCHEMA ?? 'postgres'),
  PG_DB_USER: (process.env.DB_USER ?? 'postgres'),
  PG_DB_PASSWORD: (process.env.DB_PASSWORD ?? 'postgres'),
  PG_DB_HOST: (process.env.DB_HOST ?? 'postgres'),
  PG_DB_DATABASE: (process.env.DB_DATABASE ?? 'community_feedback_db'),
  PG_DB_URL: (process.env.DB_URL ?? 'postgresql://postgres:postgres@postgres:5432/community_feedback_db'),
  JWT_SHARED_SECRET: (process.env.JWT_SHARED_SECRET ?? 'some_shared_secret'),
};
