const constants = require('../common/constants')

class DependenciesScanner {
  constructor() {
    this._components = new Map()
  }
  async scan(module) {
    await this.scanModulesForDependencies(module)
  }
  async scanModulesForDependencies(metatype) {
    this.reflectComponents(metatype)
  }
  reflectComponents(module) {
    const components = [
      ...this.reflectMetadata(module, constants.METADATA.PROVIDERS)
    ]

    components.forEach(component => {
      this.storeComponent(component)
    })
  }
  reflectMetadata(metatype, metadataKey) {
    return Reflect.getMetadata(metadataKey, metatype) || []
  }
  storeComponent(component) {
    this._components.set(component.name, {
      name: component.name,
      metatype: component,
      instance: null,
      isResolved: false
    })

    return component.name
  }
}

exports.DependenciesScanner = DependenciesScanner
