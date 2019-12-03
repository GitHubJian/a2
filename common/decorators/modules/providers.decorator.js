function Providers(providers) {
  return function(target) {
    Reflect.defineMetadata('providers', providers, target)
  }
}

exports.Providers = Providers
