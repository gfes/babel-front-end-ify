/* Created by tommyZZM on 2016/3/22. */
"use strict"

module.exports = function (object,callback) {
    return Object.keys(object)
        .filter((key,index)=>{
            return callback(object[key],key)
        })
        .reduce((newobj,key,index)=>{
            newobj[key] = object[key]
            return newobj;
        },{})
}