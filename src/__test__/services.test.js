const { getBookList, saveItemOnDatabase } = require('../services')

describe('Services', () => {
  test('getBookList', done => {
    const list = ['book1', 'book2']
    const expected = 'book1;book2'
    const index = 0
    getBookList(list, index, result => {
      expect(result).toEqual(expected)
      done()
    })
  })

  test('saveItemOnDatabase', done => {
    const name = 'book'
    saveItemOnDatabase(name, result => {
      expect(result).toEqual(name)
      done()
    })
  })
})
