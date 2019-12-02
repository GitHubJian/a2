const { Inject, UseGuards } = require('../common')

const AuthGuard = require('./app.guard')
require('./app.service')

@Dependencies('AppService')
class AppController {
  @Inject('AppService')
  appService

  @UseGuards(new AuthGuard())
  hello() {
    this.appService.sayHello()
  }
}

module.exports = AppController
