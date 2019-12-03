const ModuleCompiler = require('./compiler')
const Module = require('./module')

class Container {
  constructor() {
    this.moduleCompiler = new ModuleCompiler()
    this.modules = new Map()
  }
  addModule(metatype) {
    const { type, token } = this.moduleCompiler.compile(metatype)

    if (this.modules.has(token)) {
      return
    }

    const module = new Module(type, this)
    this.modules.set(token, module)
  }
  getModules() {
    return this.modules
  }
}

module.exports = Container
