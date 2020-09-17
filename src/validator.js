const { APIError, errors } = require('./errors')

const isString = s => s && typeof s.valueOf() === 'string'

const isValidBook = book => book && isString(book)

const isValidBooks = (...books) => books.some(book => !isValidBook(book))

const validator = (req, res, next) => {
  const { body, method } = req
  const methods = ['POST', 'DELETE']

  if (!body) {
    return next(new APIError(400, errors.isBody))
  }

  const { book, original_book: originalBook, new_book: newBook } = body

  if (methods.includes(method) && !isValidBook(book)) {
    return next(new APIError(400, errors.invalidBook))
  }

  if (method === 'PATCH' && isValidBooks(originalBook, newBook)) {
    return next(new APIError(400, errors.invalidBook))
  }

  return next()
}

module.exports = {
  validator,
  isValidBook,
  isValidBooks
}
