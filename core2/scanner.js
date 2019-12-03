const Container = require('./injector/container')
const InstanceLoader = require('./injector/instance-loader')

class DependenciesScanner {
  constructor() {
    this.container = new Container()
    this.instanceLoader = new InstanceLoader(this.container)
  }
  async scan(module) {
    try {
      this.container.addModule(module)
      await this.instanceLoader.createInstancesOfDependencies()
    } catch (error) {
      debugger
    }
    debugger
  }
}

module.exports = DependenciesScanner

