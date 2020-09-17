const { services } = require('./services')
const { validator } = require('./validator')

const controller = {
  get (req, res, next) {
    return services.getBooks().then(data =>
      res.status(200).send({ data })
    )
  },

  post (req, res, next) {
    try {
      const { body: { book } } = req
      const data = services.addBook(book)
      return res.status(200).send({ data })
    } catch (e) {
      return next(e)
    }
  },

  put (req, res, next) {
    return services.putBooks().then(data =>
      res.status(200).send({ data })
    )
  },

  patch (req, res, next) {
    try {
      const { body: { original_book: originalBook, new_book: newBook } } = req
      const data = services.patchBook(originalBook, newBook)
      return res.status(200).send({ data })
    } catch (e) {
      return next(e)
    }
  },

  del (req, res, next) {
    try {
      const { body: { book } } = req
      const data = services.deleteBook(book)
      return res.status(200).send({ data })
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = ({ router }) => {
  router.get('/', controller.get)
  router.post('/', validator, controller.post)
  router.put('/', controller.put)
  router.patch('/', validator, controller.patch)
  router.delete('/', validator, controller.del)
  return router
}
