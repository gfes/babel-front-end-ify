/* Created by tommyZZM on 2016/3/10. */
"use strict"

//babel-plugin-transform-undefined-to-void
//babel-preset-es2015-loose
//babel-plugin-syntax-jsx

module.exports = {
    presets:["es2015-loose"]
    ,plugins:[
        require("babel-plugin-syntax-jsx")
        ,require("babel-plugin-syntax-decorators")
    ]
};
