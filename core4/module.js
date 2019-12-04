class Module {
  constructor(_metatype) {
    this._metatype = _metatype
    this._components = new Map()
    this.addCoreInjectables()
  }
  get components() {
    return this._components
  }
  addComponent(component) {
    this._components.set(component.name, {
      name: component.name,
      metatype: component,
      instance: null,
      isResolved: false
    })

    return component.name
  }
  addCoreInjectables() {
    this.addModuleAsComponent()
  }
  addModuleAsComponent() {
    this._components.set(this._metatype.name, {
      name: this._metatype.name,
      metatype: this._metatype,
      instance: null,
      isResolved: false
    })
  }
}

exports.Module = Module
