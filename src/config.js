const env = process.env.NODE_ENV || 'development'
export default {
  APP_PORT: process.env.APP_PORT || env === 'test' ? 3001 : 3000,
  ENV: env,
  DB: `mongodb://${process.env.DB || 'localhost'}/mailflow-${env}`
}
