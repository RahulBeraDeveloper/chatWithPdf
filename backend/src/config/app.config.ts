export const APP_CONFIG = {
  PORT: process.env.PORT || 5000,

  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : [],
};