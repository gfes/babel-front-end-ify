/* Created by tommyZZM on 2016/3/17. */
"use strict"


exports.pushWithoutDuplicate = (array,ele) => {
    if(!Array.isArray(array)){
        return ele
    }
    if(array.indexOf(ele)<0){
        array.push(ele)
    }

    return ele
}

function callSomeMatch(array,callback,thisArg) {
    let _callback = callback;

    if(typeof _callback !== "function"){
        _callback = ()=>false
    }

    let _result = void 0;
    array.some((ele,i)=>{
        if(_callback(ele,i)){
            _result = {ele,i};
            return true
        }
    },thisArg)
    return (cb)=>{
        if(typeof cb==="function" && !!_result){
            cb(_result.ele,_result.i)
        }else {
            cb(false)
        }
        return _result;
    }
}

exports.someMatch = (array,callback,thisAry) => {
    let _ele = void 0;
    callSomeMatch(array,callback,thisAry)((ele,i)=>{
        _ele = ele;
    });
    return _ele;
}

exports.indexOfMatch = (array,callback,thisAry) => {
    let _index = -1;
    callSomeMatch(array,callback,thisAry)((ele,i)=>{
        _index = i;
    });
    return _index;
}