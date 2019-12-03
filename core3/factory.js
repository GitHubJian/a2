const scanner_1 = require('./scanner')
const instance_loader = require('./instance-loader')

class FactoryStatic {
  async create(metatype) {
    const module = await this.initialize(metatype)

    return module
  }

  async initialize(module) {
    const instanceLoader = new instance_loader.InstanceLoader()
    const dependenciesScanner = new scanner_1.DependenciesScanner()

    try {
      const _module = await dependenciesScanner.scan(module)
      await instanceLoader.createInstancesOfDependencies(_module)

      return _module.components.get(module.name).instance
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = {
  FactoryStatic,
  Factory: new FactoryStatic()
}
