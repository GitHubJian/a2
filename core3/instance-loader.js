const injector_1 = require('./injector')

class InstanceLoader {
  constructor() {
    this.injector = new injector_1.Injector()
  }
  async createInstancesOfDependencies(module) {
    this.createPrototypes(module)
    await this.createInstances(module)
  }
  createPrototypes(module) {
    this.createPrototypesOfComponents(module)
  }
  createPrototypesOfComponents(module) {
    module.components.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper, module.components)
    })
  }
  async createInstances(module) {
    await this.createInstancesOfComponents(module)
  }
  async createInstancesOfComponents(module) {
    await Promise.all(
      [...module.components.values()].map(
        async wrapper =>
          await this.injector.loadInstanceOfComponent(wrapper, module)
      )
    )

    console.log('依赖实例化完成')
  }
}

exports.InstanceLoader = InstanceLoader
