/* Created by tommyZZM on 2016/3/12. */
"use strict"
const cwd = process.cwd();
const path = require("path")
const t = require("babel-types");

module.exports = function(filepath,attrs){
    let basedir = attrs.base || cwd;
    return t.stringLiteral(path.relative(basedir,filepath).replace(/\\/g,"\/"));
}