/* Created by tommyZZM on 2016/3/11. */
"use strict"
const browserify = require("browserify");
const through = require("through2");
const expect = require("chai").expect;
const self = require("../")

describe('test', function() {
    it("alias",function(done){
        let b = browserify(["test/resources/entry-alias.js"])
            .plugin(self,{
                alias:{
                    vue:{global:"Vue"}
                    ,module1:"./test/resources/alias/module1"
                    ,module2:"./test/resources/alias/module2"
                    ,module3:"./test/resources/alias/module3"
                }
            })

        let bufstr = "";

        return b.bundle()
            .pipe(through((buf ,enc ,next)=>{
                bufstr+=(buf.toString())
                next();
            },()=>{
                expect(bufstr).to.include("console.log(\"module1 by path\");");
                done()
            }))
    })

    it("html minifiy",function(done){
        let b = browserify(["test/resources/entry-html.js"])
            .plugin(self)

        let bufstr = "";

        return b.bundle()
            .pipe(through((buf ,enc ,next)=>{
                bufstr+=(buf.toString())
                next();
            },()=>{
                expect(bufstr).to.include("<div><p>should save space</p><span>");
                done()
            }))
    })
    
    
})