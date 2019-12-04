const shared_utils = require('../common/utils/shared.utils')
const constants = require('../common/constants')

class Injector {
  loadPrototypeOfInstance({ metatype, name }, collection) {
    if (!collection) {
      return null
    }

    const target = collection.get(name)
    if (target.isResolved || !metatype.prototype) {
      return null
    }

    collection.set(
      name,
      Object.assign({}, collection.get(name), {
        instance: Object.create(metatype.prototype)
      })
    )
  }
  async loadInstanceOfComponent(wrapper, module) {
    const components = module.components
    await this.loadInstance(wrapper, components, module)
  }
  async loadInstance(wrapper, collection, module) {
    if (wrapper.isPending) {
      return wrapper.done$
    }
    const done = this.applyDoneHook(wrapper)
    const { name } = wrapper
    const targetWrapper = collection.get(name)
    if (shared_utils.isUndefined(targetWrapper)) {
      throw new Error('runtime exception.')
    }
    if (targetWrapper.isResolved) {
      return
    }

    const properties = await this.resolveProperties(wrapper, module)
    const instance = await this.instantiateClass(wrapper, targetWrapper)

    debugger
    this.applyProperties(instance, properties)
    done()
  }
  applyProperties(instance, properties) {
    if (!shared_utils.isObject(instance)) {
      return undefined
    }

    properties
      .filter(item => !shared_utils.isNil(item.instance))
      .forEach(item => (instance[item.key] = item.instance))
  }
  applyDoneHook(wrapper) {
    let done
    wrapper.done$ = new Promise((resolve, reject) => {
      done = resolve
    })
    wrapper.isPending = true

    return done
  }
  async resolveProperties(wrapper, module) {
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
            dependencyContext,
            module
          )

          return (paramWrapper && paramWrapper.instance) || undefined
        } catch (err) {
          console.log(err)
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

    const props = properties.map(item =>
      Object.assign({}, item, {
        name: item.type
      })
    )

    return props
  }
  async resolveSingleParam(wrapper, param, dependencyContext, module) {
    if (shared_utils.isUndefined(param)) {
      throw new Error('undefined dependency exception.')
    }

    const token = this.resolveParamToken(wrapper, param)

    return await this.resolveComponentInstance(
      module,
      shared_utils.isFunction(token) ? token.name : token,
      dependencyContext,
      wrapper
    )
  }
  resolveParamToken(wrapper, param) {
    return param
  }
  async resolveComponentInstance(module, name, dependencyContext, wrapper) {
    const components = module.components
    const instanceWrapper = await this.lookupComponent(
      components,
      module,
      Object.assign({}, dependencyContext, { name }),
      wrapper
    )

    return instanceWrapper
  }
  async lookupComponent(components, module, dependencyContext, wrapper) {
    const { name } = dependencyContext
    const component = components.get(name)

    return component
  }
  async instantiateClass(wrapper, targetMetatype) {
    const { metatype } = wrapper

    targetMetatype.instance = new metatype()

    targetMetatype.isResolved = true
    return targetMetatype.instance
  }

  reflectConstructorParams(type) {
    const paramtypes =
      Reflect.getMetadata(constants.PARAMTYPES_METADATA, type) || []

    // const selfParams = this.reflectSelfParams(type)
    // selfParams.forEach(({ index, param }) => (paramtypes[index] = param))

    return paramtypes
  }
  // reflectSelfParams(type) {
  //   return (
  //     Reflect.getMetadata(constants.SELF_DECLARED_DEPS_METADATA, type) || []
  //   )
  // }
}

exports.Injector = Injector
