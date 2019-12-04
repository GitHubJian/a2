const { Providers, Inject, UseGuards } = require('../common')

const AppService = require('./app.service')

@Providers([AppService])
class AppController {
  @Inject('AppService')
  appService
  
  @UseGuards()
  hello() {
    this.appService.sayHello()
  }
}

module.exports = AppController
