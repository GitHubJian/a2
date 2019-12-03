const Module = require('./module');

class ModuleCompiler {
  compile(metatype) {
    const module = new Module(metatype)
    return module
  }
}

module.exports = ModuleCompiler
