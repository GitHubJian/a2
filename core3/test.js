require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const factory = require('./factory')

const AppController = require('../test/app.controller')

;(async () => {
  // 收集依赖
  const ctrl = await factory.Factory.create(AppController)

  ctrl.hello()
})()
