const ModuleCompiler = require('./compiler')
const Module = require('./module')

class Container {
  constructor() {
    this.moduleCompiler = new ModuleCompiler()
    this.modules = new Map()
  }
  async addModule(metatype) {
    try {
      const { type, token } = this.moduleCompiler.compile(metatype)
      debugger
      if (this.modules.has(token)) {
        return
      }

      const module = new Module(type, this)
      this.modules.set(token, module)
    } catch (error) {
      debugger
    }
  }
  getModules() {
    return this.modules
  }
}

module.exports = Container
