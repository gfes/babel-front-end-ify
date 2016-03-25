/* Created by tommyZZM on 2016/3/22. */
"use strict"

module.exports = function (object,callback) {
    return Object.keys(object).reduce((newobj,key,index)=>{
        newobj[key] = callback(object[key],key);
        return newobj;
    },{})
}