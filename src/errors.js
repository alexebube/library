class APIError extends Error {
  constructor (status, message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError)
    }

    this.name = 'APIError'
    this.status = status
    this.message = message
  }
}

const errors = {
  exists: book => `Book ${book} already exists in the library`,
  notExists: book => `Book ${book} does not exists in the library`,
  invalidBook: 'Parameter is not valid',
  isBody: 'Body is required'
}

module.exports = {
  APIError,
  errors
}
