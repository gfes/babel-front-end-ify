/* Created by tommyZZM on 2016/3/22. */
"use strict"

module.exports = function (object) {
    return Object.keys(object).map(function(key){
        return object[key]
    })
}