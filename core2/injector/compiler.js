const ModuleTokenFactory = require('./module-token-factory')

class ModuleCompiler {
  constructor() {
    this.moduleTokenFactory = new ModuleTokenFactory()
  }

  compile(metatype) {
    // const { type } = await this.extractMetadata(metatype)
    const token = this.moduleTokenFactory.create(metatype)

    return {
      type: metatype,
      token
    }
  }

  // async extractMetadata(metatype) {
  //   debugger
  //   metatype = await metatype

  //   return {
  //     type: metatype
  //   }
  // }
}

module.exports = ModuleCompiler
