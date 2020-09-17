const { errors } = require('./errors')

class Library {
  constructor (db) {
    this.db = db
  }

  hasBook (book) {
    return this.db.includes(book)
  }

  insert (book) {
    if (this.hasBook(book)) {
      throw new Error(errors.exists(book))
    }
    this.db.push(book)
    return book
  }

  delete (book) {
    if (!this.hasBook(book)) {
      throw new Error(errors.notExists(book))
    }

    this.db.splice(this.db.lastIndexOf(book), 1)
    return book
  }

  update (existing, update) {
    if (!this.hasBook(existing)) {
      throw new Error(errors.notExists(existing))
    }

    if (this.hasBook(update)) {
      throw new Error(errors.exists(update))
    }

    this.db.splice(this.db.lastIndexOf(existing), 1, update)
    return update
  }

  seedDB (data) {
    this.db = data
  }

  resetDB () {
    this.db = []
  }
}

module.exports = new Library([])
