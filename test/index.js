require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const AppController = require('./app.controller')

const Scanner = require('../core/scanner')

const scanner = new Scanner()
debugger
const ctrl = scanner.scan(AppController)

ctrl.hello()
