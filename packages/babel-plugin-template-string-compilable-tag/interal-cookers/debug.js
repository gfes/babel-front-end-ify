/* Created by tommyZZM on 2016/3/21. */
"use strict"

module.exports = function(source){
    console.log("source",source);
    return string => {
        console.log("passing,",string);
        return string
    }
}