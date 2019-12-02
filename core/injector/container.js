const ModuleCompiler = require('./compiler')

class Container {
  constructor() {
    this.moduleCompiler = new ModuleCompiler()
  }

  async addModule(metatype) {
    const { type, token } = await this.moduleCompiler.compile(metatype)
    if (this.modules.has(token)) {
      return
    }

    const module = new Module(type, this)
    this.modules.set(token, module)
  }
}

module.exports = Container
