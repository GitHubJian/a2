const shared_utils = require('../../utils/shared.utils')
const validate_util = require('../../utils/validate-each.util')
const extend_metadata_util = require('../../utils/extend-metadata.util')
const constants = require('../../constants')

function UseGuards(...guards) {
  return function(target, key, descriptor) {
    const isValidGuard = guard =>
      guard &&
      (shared_utils.isFunction(guard) ||
        shared_utils.isFunction(guard.canActivate))

    if (descriptor) {
      validate_util.validateEach(
        target.constructor,
        guards,
        isValidGuard,
        '@UseGuards',
        'guard'
      )

      extend_metadata_util.extendArrayMetadata(
        constants.GUARDS_METADATA,
        guards,
        descriptor
      )

      return descriptor
    }

    validate_util.validateEach(
      target,
      guards,
      isValidGuard,
      '@UseGuards',
      'guard'
    )

    extend_metadata_util.extendArrayMetadata(
      constants.GUARDS_METADATA,
      guards,
      target
    )

    return target
  }
}

exports.UseGuards = UseGuards
