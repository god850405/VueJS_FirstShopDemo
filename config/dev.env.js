'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    VUE_APP_API: '"https://zchenapi.herokuapp.com"'
    // VUE_APP_API: '"https://localhost:6001"'
})
