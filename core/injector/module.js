const ModuleRef = require('./module-ref')
const random_string_generator_util = require('../../common/utils/random-string-generator.util')
const ReflectorService = require('../services/reflector.service')

class Module {
  constructor(_metatype) {
    this._metatype = _metatype
    this._components = new Map()
    this._injectables = new Map()
    this._id = random_string_generator_util.randomStringGenerator()
  }

  routes(module) {
    return {
      name: module.name,
      metatype: module,
      instance: null,
      isResolved: false
    }
  }
}

module.exports = Module
