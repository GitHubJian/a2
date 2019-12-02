const Injector = require('./injector')

class ModuleRef {
  constructor(container) {
    this.container = container
    this.injector = new Injector()
  }
}

module.exports = ModuleRef
