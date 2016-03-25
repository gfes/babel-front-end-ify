/* Created by tommyZZM on 2016/3/14. */
"use strict"
const path =require("path");

module.exports = function(p){
    if(!path.isAbsolute(p) && !/^\./.test(p)){
        p = "./"+p
    }

    return p.replace(/\\/g, "/")
}