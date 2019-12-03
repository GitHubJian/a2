const { Providers, Dependencies, Inject, UseGuards } = require('../common')

// const AuthGuard = require('./app.guard')
const AppService = require('./app.service')

@Providers([AppService])
@Dependencies(AppService)
class AppController {
  // @Inject(AppService)
  // appService

  hello() {
    this.appService.sayHello()
  }
}

module.exports = AppController
