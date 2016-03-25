/* Created by tommyZZM on 2016/3/19. */
"use strict"
const babylon = require("babylon");

const minify = require("html-minifier").minify;

module.exports = function(source){
    let sourceMinified = minify(source,{
        collapseWhitespace:true
        ,removeComments:true
    })

    let astMinified = babylon.parse(sourceMinified).program.body[0].expression;

    return (_,state)=>{
        let index = state.index;
        return astMinified.quasis[index].value.raw
    }
}