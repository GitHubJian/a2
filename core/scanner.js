const Container = require('./injector/container')
const InstanceLoader = require('./injector/instance-loader')

class DependenciesScanner {
  constructor() {
    this.container = new Container()
    this.instanceLoader = new InstanceLoader(this.container)
  }
  async scan(module) {
    await this.scanForModules(module)
    debugger
    await instanceLoader.createInstancesOfDependencies()
  }
  async scanForModules(module) {
    await this.storeModule(module)
  }
  async storeModule(module) {
    await this.container.addModule(module)
  }
}

module.exports = DependenciesScanner
