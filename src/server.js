const App = require('./app')
const routes = require('./routes')

new App()
  .start()
  .asWebService()
  .addRoute('/', routes)
  .addErrorHandler()
