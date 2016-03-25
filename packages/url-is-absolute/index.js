/* Created by tommyZZM on 2016/3/12. */
"use strict"

var regexIsUrlAbsolute = /(^(?:\w+:)\/\/)/ ;
var regexIsUrlBase64 = /data:(\w+)\/(\w+);/
module.exports = (url) => {
    if (typeof url !== 'string') {
        throw new TypeError('url-is-absolute expected a string');
    }

    if(regexIsUrlAbsolute.test(url)){
        return true;
    }

    return !!regexIsUrlBase64.test(url);
}