/* Created by tommyZZM on 2016/3/18. */
"use strict"

module.exports = function(source){
    return (string,state)=>{
        string = string.replace(/(\n)/g,"");
        string = string.replace(/(\s+)/g," ");
        if(state.isBegin){
            string = string.replace(/^(\s+)/g,"");
        }else if(state.isTail){
            string = string.replace(/(\s+)$/g,"");
        }

        return string
    }
}