const { isValidBook, isValidBooks, validator } = require('../validator')
const { APIError, errors } = require('../errors')

describe('validator', () => {
  test('isValidBook', () => {
    expect(isValidBook('book')).toBeTruthy()
    expect(isValidBook('')).toBeFalsy()
    expect(isValidBook(null)).toBeFalsy()
    expect(isValidBook(undefined)).toBeFalsy()
  })

  test('isValidBooks', () => {
    expect(isValidBooks('book1', 'book2')).toBeFalsy()
    expect(isValidBooks(null, 'book1')).toBeTruthy()
    expect(isValidBooks(undefined, 'book1')).toBeTruthy()
    expect(isValidBooks('', 'book1')).toBeTruthy()
  })

  test('validator', () => {
    const next = jest.fn()
    validator({ body: {}, method: 'POST' }, {}, next)
    expect(next).toHaveBeenCalledWith(new APIError(400, errors.invalidBook))

    validator({ body: {}, method: 'DELETE' }, {}, next)
    expect(next).toHaveBeenCalledWith(new APIError(400, errors.invalidBook))

    validator({ method: 'DELETE' }, {}, next)
    expect(next).toHaveBeenCalledWith(new APIError(400, errors.isBody))

    validator({ body: { orignal_book: 'book' }, method: 'PATCH' }, {}, next)
    expect(next).toHaveBeenCalledWith(new APIError(400, errors.invalidBook))
  })
})
