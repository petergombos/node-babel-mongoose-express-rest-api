import expressValidation from 'express-validation'
import mongoose from 'mongoose'

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor (message, status, isPublic) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.isPublic = isPublic
    this.isOperational = true  // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name)
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor (message, status = 500, isPublic = false) {
    super(message, status, isPublic)
  }
}

const unifiyError = (err) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return error
  } else if (err instanceof mongoose.Error.ValidationError) {
    const unifiedErrorMessage = Object.keys(err.errors)
      .reduce((mem, errorKey) => {
        mem += `${err.errors[errorKey].message} `
        return mem
      }, 'Cannot save model! ').trim()
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return error
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return apiError
  }
}

export { unifiyError }

export default APIError
