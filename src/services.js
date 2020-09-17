const library = require('./library')

const getBookList = (list, index, callback, result = '') => {
  if (list.length === 0 || list.length === index) {
    callback(result)
  } else {
    const res = result.length === 0 ? list[index] : result.concat(...[';', list[index]])
    const idx = index + 1
    return getBookList(list, idx, callback, res)
  }
}

const saveItemOnDatabase = (name, callback) => {
  const interval = Math.floor((Math.random()) * name.length) + name.length
  const handle = setInterval(() => {
    callback(name)
    clearInterval(handle)
  }, interval)
}

const services = {
  addBook (book) {
    return library.insert(book)
  },

  deleteBook (book) {
    return library.delete(book)
  },

  patchBook (originalBook, newBook) {
    return library.update(originalBook, newBook)
  },

  getBooks () {
    return new Promise((resolve) => {
      getBookList(library.db, 0, data => {
        return resolve(data)
      })
    })
  },

  async putBooks () {
    const result = {}

    const saveItemOnDatabasePromise = (name) => new Promise((resolve) => {
      saveItemOnDatabase(name, () => {
        resolve(Date.now())
      })
    })

    const timelapse = Date.now()
    for (const book of library.db) {
      const time = await saveItemOnDatabasePromise(book)
      result[book] = time - timelapse
    }

    return result
  }
}

module.exports = {
  library,
  services,
  getBookList,
  saveItemOnDatabase
}
