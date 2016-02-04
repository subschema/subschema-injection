"use strict";
var ctx = require.context('.', false, /(?!.*index.js$)\.jsx?$/);
module.exports = ctx.keys().reduce(function (ret, key) {
    var nkey = key.replace(/\.\/(.*)\.jsx?$/, '$1');
    if (nkey === 'index') return ret;
    ret[nkey] = ctx(key).default;
    return ret;
}, {});