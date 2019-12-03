require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const scanner = require('./scanner')

const AppController = require('../test/app.controller')

;(async () => {
  // 收集依赖
  const ds = new scanner.DependenciesScanner()
  await ds.scan(AppController)
})()
