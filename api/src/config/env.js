export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  dbSecretArn: process.env.DB_SECRET_ARN,
  nodeEnv: process.env.NODE_ENV || 'development',
};