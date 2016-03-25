/* Created by tommyZZM on 2016/3/11. */
"use strict"
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require("browserify")
const through = require("through2")
const expect = require("chai").expect;
const self = require("../")

describe('developing', function() {
    it.skip("go",function(done){

        let b = browserify(["test/resources/entry-alias.js"])
            .plugin(self,{
                alias:{
                    vue:{global:"Vue"}
                    ,module1:"./test/resources/alias/module1"
                    ,module2:"./test/resources/alias/module2"
                    ,module3:"./test/resources/alias/module3"
                }
            })

        return b.bundle()/*.on("end",_=>console.log("end"))*/
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(through.obj((file ,enc ,next)=>{
                console.log(file.contents.toString())
                return next(null ,file)
            },()=>done()))

    })
})
//






