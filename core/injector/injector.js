const constants = require('../../common/constants')
const shared_utils = require('../../common/utils/shared.utils')

class Injector {
  async loadInstanceOfComponent(wrapper) {
    await this.loadInstance(wrapper)
  }
  applyDoneHook(wrapper) {
    let done
    wrapper.done$ = new Promise(function(resolve, reject) {
      done = resolve
    })
    wrapper.isPending = true

    return done
  }
  async loadInstance(wrapper) {
    if (wrapper.isPending) {
      return wrapper.done$
    }
    const done = this.applyDoneHook(wrapper)
    const { inject } = wrapper

    if (shared_utils.isUndefined(wrapper)) {
      throw new Error('run time exception.')
    }
    if (wrapper.isResolved) {
      return
    }

    const callback = async instances => {
      const properties = await this.resolveProperties(wrapper, inject)
      const instance = await this.instantiateClass(instances, wrapper, wrapper)

      this.applyProperties(instance, properties)

      done()
    }

    await this.resolveConstructorParams(wrapper, inject, callback)
  }
  async resolveProperties(wrapper, inject) {
    if (!shared_utils.isNil(inject)) {
      return []
    }
    const properties = this.reflectProperties(wrapper.metatype)
    const instances = await Promise.all(
      properties.map(async item => {
        try {
          const dependencyContext = {
            key: item.key,
            name: item.name
          }

          const paramWrapper = await this.resolveSingleParam(
            wrapper,
            item.name,
            dependencyContext
          )

          return (paramWrapper && paramWrapper.instance) || undefined
        } catch (err) {
          return undefined
        }
      })
    )

    return properties.map((item, index) =>
      Object.assign({}, item, { instance: instances[index] })
    )
  }
  reflectProperties(type) {
    const properties =
      Reflect.getMetadata(constants.PROPERTY_DEPS_METADATA, type) || []

    return properties.map(item =>
      Object.assign({}, item, {
        name: item.type
      })
    )
  }
  applyProperties(instance, properties) {
    if (!shared_utils.isObject(instance)) {
      return undefined
    }

    properties
      .filter(item => !shared_utils.isNil(item.instance))
      .forEach(item => (instance[item.key] = item.instance))
  }
  async instantiateClass(instances, wrapper, targetMetatype) {
    debugger
    const { metatype, inject } = wrapper
    if (shared_utils.isNil(inject)) {
      targetMetatype.instance = new metatype(...instances)
    } else {
      const factoryResult = targetMetatype.metatype(...instances)
      targetMetatype.instance = await factoryResult
    }

    targetMetatype.isResolved = true

    return targetMetatype.instance
  }
  async resolveConstructorParams(wrapper, inject, callback) {
    const dependencies = shared_utils.isNil(inject)
      ? this.reflectConstructorParams(wrapper.metatype)
      : inject
    let isResolved = true
    const instances = await Promise.all(
      dependencies.map(async (param, index) => {
        try {
          const paramWrapper = await this.resolveSingleParam(wrapper, param, {
            index,
            dependencies
          })
         

          if (!paramWrapper.isResolved) {
            isResolved = false
          }
          debugger
          return paramWrapper.instance
        } catch (err) {
          debugger
          console.error(err)

          return undefined
        }
      })
    )
    isResolved && (await callback(instances))
  }
  reflectConstructorParams(type) {
    const paramtypes =
      Reflect.getMetadata(constants.PARAMTYPES_METADATA, type) || []
    const selfParams = this.reflectSelfParams(type)
    selfParams.forEach(({ index, param }) => (paramtypes[index] = param))

    return paramtypes
  }
  reflectSelfParams(type) {
    return (
      Reflect.getMetadata(constants.SELF_DECLARED_DEPS_METADATA, type) || []
    )
  }
  async resolveSingleParam(wrapper, param) {
    debugger
    if (shared_utils.isUndefined(param)) {
      throw new Error('undefined dependency exception.')
    }
    const componentInstance = await this.resolveComponentInstance(param)

    return componentInstance
  }
  async resolveComponentInstance(dependency) {
    const instanceWrapper = await this.loadInstanceOfComponent({
      name: dependency.name,
      metatype: dependency,
      instance: null,
      isResolved: false,
      instance: Object.create(dependency.prototype)
    })
    debugger
    return instanceWrapper
  }
  async lookupComponent(components, module, dependencyContext, wrapper) {
    const { name } = dependencyContext
    return components.get(name)
  }
}

module.exports = Injector
