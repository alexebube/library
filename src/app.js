const express = require('express')
const bodyParser = require('body-parser')

const port = process.env.PORT || 80

module.exports = class App {
  constructor () {
    this.app = express()
  }

  start () {
    this.app.listen(port, () => {
      console.log(`🚀 server started at http://localhost:${port}`)
    })
    return this
  }

  asWebService () {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    return this
  }

  addRoute (path, routeConfig) {
    this.app.use(path, routeConfig({ router: express.Router() }))
    return this
  }

  addErrorHandler () {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500
      const data = err.message || 'Internal Server Error'
      res.status(status).send({ data })
    })

    return this
  }
}
