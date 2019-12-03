const shared_utils = require('../../common/utils/shared.utils')

class Injector {
  async loadInstanceOfInjectable(wrapper, module) {
    const injectables = module.injectables
    await this.loadInstance(wrapper, injectables, module)
  }
  async loadInstance(wrapper, collection, module) {
    if (wrapper.isPending) {
      return wrapper.done$
    }
    const done = this.applyDoneHook(wrapper)
    const { name, inject } = wrapper

    const targetWrapper = collection.get(name)
    if (shared_utils.isUndefined(targetWrapper)) {
      throw new Error('run time error.')
    }
    if (targetWrapper.isResolved) {
      return
    }

    const callback = async instances => {
      const properties = await this.resolveProperties(wrapper, module, inject)
      const instance = await this.instantiateClass(
        instances,
        wrapper,
        targetWrapper
      )

      this.applyProperties(instance, properties)
      done()
    }

    await this.resolveConstructorParams(wrapper, module, inject, callback)
  }
  applyDoneHook(wrapper) {
    let done
    wrapper.done$ = new Promise((resolve, reject) => {
      done = resolve
    })
    wrapper.isPending = true

    return done
  }
  async resolveConstructorParams(wrapper, module, inject, callback) {
    const dependencies = shared_utils.isNil(inject)
      ? this.reflectConstructorParams(wrapper.metatype)
      : inject
    let isResolved = true
    const instances = await Promise.all(
      dependencies.map(async (param, index) => {
        try {
          const paramWrapper = await this.resolveSingleParam(
            wrapper,
            param,
            { index, dependencies },
            module
          )

          if (!paramWrapper.isResolved) {
            isResolved = false
          }

          return paramWrapper.instance
        } catch (e) {
          console.error(e)
          console.error(e.stack)

          return undefined
        }
      })
    )
    isResolved && (await callback(instances))
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
    return components.get(name)
  }
  loadPrototypeOfInstance({ metatype, name }, collection) {
    if (!collection) {
      return null
    }

    const target = collection.get(name)
    // if (
    //   target.isResolvedisResolved ||
    //   !shared_utils.isNil(target.inject) ||
    //   !metatype.prototype
    // ) {
    //   return null
    // }
    debugger
    collection.set(
      name,
      Object.assign({}, collection.get(name), {
        instance: Object.create(metatype.prototype)
      })
    )
  }
}

module.exports = Injector
