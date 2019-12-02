exports.isUndefined = obj => typeof obj === 'undefined'
exports.isFunction = fn => typeof fn === 'function'
exports.isObject = fn => !exports.isNil(fn) && typeof fn === 'object'
exports.isString = fn => typeof fn === 'string'
exports.isConstructor = fn => fn === 'constructor'
exports.validatePath = path =>
  path ? (path.charAt(0) !== '/' ? '/' + path : path) : ''
exports.isNil = obj => exports.isUndefined(obj) || obj === null
exports.isEmpty = array => !(array && array.length > 0)
exports.isSymbol = fn => typeof fn === 'symbol'
