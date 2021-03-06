const Injector = require('./injector')

class InstanceLoader {
  constructor(container) {
    this.container = container
    this.injector = new Injector()
    this.logger = console
  }

  async createInstancesOfDependencies(module) {
    await this.createInstances(module)
  }

  async createInstances(modules) {
    await Promise.all(
      [...modules.values()].map(async module => {
        await this.createInstancesOfComponents(module)
        await this.createInstancesOfInjectables(module)

        const { name } = module.metatype

        console.log(`Compiler Success -> ${name}`)
      })
    )
  }

  async createInstancesOfComponents(module) {
    await Promise.all(
      [...module.components.values()].map(
        async wrapper =>
          await this.injector.loadInstanceOfComponent(wrapper, module)
      )
    )
  }

  createPrototypesOfInjectables(module) {
    module.injectables.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper, module.injectables)
    })
  }

  async createInstancesOfInjectables(module) {
    await Promise.all(
      [...module.injectables.values()].map(
        async wrapper =>
          await this.injector.loadInstanceOfInjectable(wrapper, module)
      )
    )
  }
}

module.exports = InstanceLoader
