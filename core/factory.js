class FactoryStatic {
  async createInstancesOfDependencies(module) {
    this.createPrototypes(module)
  }
  createPrototypes(module) {
    this.createPrototypesOfComponents(module)
  }
  createPrototypesOfComponents(module) {
    module.components.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper)
    })
  }
}
