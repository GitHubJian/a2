require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const Injector = require('./injector')
const injector = new Injector()

const AppController = require('../../test/app.controller')

;(async () => {
  // 收集依赖
  
  await injector.loadInstanceOfComponent()
  await injector.loadInstance({
    name: AppController.name,
    metatype: AppController,
    instance: null,
    isResolved: false,
    instance: Object.create(AppController.prototype)
  })
})()
