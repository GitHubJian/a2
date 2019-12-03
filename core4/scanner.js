const module_1 = require('./module')
const constants = require('../common/constants')

class DependenciesScanner {
  constructor() {
    this._module = null
    this._components = new Map()
  }
  get module() {
    return this._module
  }
  get components() {
    return this._components
  }
  async scan(metatype) {
    this._module = new module_1.Module(metatype)

    const components = [
      ...this.reflectMetadata(metatype, constants.METADATA.PROVIDERS)
    ]

    components.forEach(component => {
      this.storeComponent(component)
    })

    return this._module
  }
  storeComponent(component) {
    return this._module.addComponent(component)
  }
  reflectMetadata(metatype, metadataKey) {
    return Reflect.getMetadata(metadataKey, metatype) || []
  }
}

exports.DependenciesScanner = DependenciesScanner
