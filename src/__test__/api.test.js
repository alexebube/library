const request = require('supertest')
const App = require('../app')
const routes = require('../routes')
const { errors } = require('../errors')
const library = require('../library')

describe('API', () => {
  const app = new App()
    .asWebService()
    .addRoute('/', routes)
    .addErrorHandler().app

  beforeEach(() => library.resetDB())

  describe('POST', () => {
    test('request succeeds', () =>
      request(app)
        .post('/')
        .send({ book: 'book' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.data).toEqual('book')
        })
    )

    test('request fail if book parameter is missing', () =>
      request(app)
        .post('/')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body.data).toEqual(errors.invalidBook)
        })
    )

    test('request fail if duplicate book', () => {
      library.insert('duplicate book')
      return request(app)
        .post('/')
        .send({ book: 'duplicate book' })
        .expect('Content-Type', /json/)
        .expect(500)
        .then(res => {
          expect(res.body.data).toEqual(errors.exists('duplicate book'))
        })
    })
  })

  describe('DELETE', () => {
    test('request succeeds if book exits', () => {
      library.insert('book to delete')
      return request(app)
        .delete('/')
        .send({ book: 'book to delete' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.data).toEqual('book to delete')
        })
    })

    test('request fails if book does not exits', () => {
      library.insert('book found')
      return request(app)
        .delete('/')
        .send({ book: 'book not found' })
        .expect('Content-Type', /json/)
        .expect(500)
        .then(res => {
          expect(res.status).toEqual(500)
          expect(res.body.data).toEqual(errors.notExists('book not found'))
        })
    })

    test('request fail if book parameter is missing', () =>
      request(app)
        .delete('/')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body.data).toEqual(errors.invalidBook)
        })
    )
  })

  describe('PATCH', () => {
    test('request succeeds', () => {
      library.insert('original book')
      return request(app)
        .patch('/')
        .send({ original_book: 'original book', new_book: 'new book' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.data).toEqual('new book')
        })
    })

    test('request fails if original book does not exists', async () => {
      library.insert('original book 1')
      return request(app)
        .patch('/')
        .send({ original_book: 'original book 2', new_book: 'new book 2' })
        .expect('Content-Type', /json/)
        .expect(500)
        .then(res => {
          expect(res.body.data).toEqual(errors.notExists('original book 2'))
        })
    })

    test('request fails if new book already exists', () => {
      library.seedDB(['original book 3', 'new book 3'])
      return request(app)
        .patch('/')
        .send({ original_book: 'original book 3', new_book: 'new book 3' })
        .expect('Content-Type', /json/)
        .expect(500)
        .then(res => {
          expect(res.body.data).toEqual(errors.exists('new book 3'))
        })
    })

    test('request fails if a request parameter is missing', () => {
      return request(app)
        .patch('/')
        .send({ new_book: 'new book 3' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body.data).toEqual(errors.invalidBook)
        })
    })
  })

  describe('GET', () => {
    test('request succeeds', async () => {
      const book1 = 'get new book 1'
      const book2 = 'get new book 2'
      const expected = `${book1};${book2}`
      library.seedDB([book1, book2])

      return request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.data).toEqual(expected)
        })
    })
  })

  describe('PUT', () => {
    test('request succeeds', () => {
      library.seedDB(['book1', 'book2', 'book3'])

      return request(app)
        .put('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.data).toHaveProperty('book1')
          expect(res.body.data).toHaveProperty('book2')
          expect(res.body.data).toHaveProperty('book3')
        })
    })
  })
})
