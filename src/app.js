import express from 'express'
import httpStatus from 'http-status'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import expressWinston from 'express-winston'

import APIError, { unifiyError } from 'utils/APIError'
import winstonInstance from 'utils/winston'
import config from './config'
import routes from './routes'

const app = express()

// Secure by setting various HTTP headers
app.use(helmet())

// Enable CORS - Cross Origin Resource Sharing
app.use(cors({
  origin: true,
  exposedHeaders: ['X-Total-Count']
}))

// Parse body params
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// Detailed API logging in dev env
if (config.ENV === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }))
}

// Mounting the routes
app.use('/', routes)

// 404
app.use((req, res, next) => {
  const error = new APIError('Not Found', 404, true)
  next(error)
})

// Error Handling
// Unifie Errors
app.use((err, req, res, next) => {
  next(unifiyError(err))
})
// Log error in winston transports except when executing test suite
if (config.ENV !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}
// Send Error
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.ENV === 'development' ? err.stack : undefined
  })
})

export default app
