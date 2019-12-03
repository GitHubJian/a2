const injector_1 = require('./injector')

class InstanceLoader {
  constructor() {
    this.injector = new injector_1.Injector()
  }
  async createInstancesOfDependencies(module) {
    // 创建属性
    this.createPrototypes(module)
    // 创建实例
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
  }
}

exports.InstanceLoader = InstanceLoader
