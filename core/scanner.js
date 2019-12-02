const Container = require('./injector/container')

class DependenciesScanner {
  constructor() {
    this.container = new Container()
  }

  async scan(module) {
    await this.scanForModules(module)
  }

  async scanForModules(module) {
    await this.storeModule(module)
  }

  async storeModule(module) {
    await this.container.addModule(module, scope)
  }
}

module.exports = DependenciesScanner
