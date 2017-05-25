import 'babel-polyfill'
import mongoose from 'mongoose'

import app from './app'
import config from './config'

mongoose.connect(config.DB, { server: { socketOptions: { keepAlive: 1 } } })
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.db}`)
})

app.listen(config.APP_PORT, () =>
  console.log(`Server is running on port ${config.APP_PORT}`)
)

export default app
