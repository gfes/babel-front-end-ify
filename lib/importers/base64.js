/* Created by tommyZZM on 2016/3/11. */
"use strict"
const template = require("babel-template");
const t = require("babel-types");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const through = require("through2");
const streamify = require("streamifier").createReadStream;

const pngquant = require("../../packages/gulp-pngquant-native");

module.exports = function(filepath,attrs){
    let mimeType = mime.lookup(attrs.from);
    let mimeTypeStructure = /image\/(\w+)/.exec(mimeType);
    let buf = " ";

    if(fs.existsSync(filepath)){
        buf = fs.readFileSync(filepath)
    }else{
        return t.nullLiteral();
    }

    let buftoIiteral = through.obj((buf,enc,next)=>{
        next(null,t.stringLiteral(buf.toString()))
    })

    if(mimeTypeStructure){
        let imageType = mimeTypeStructure[1]
        let readbuf = streamify(buf);
        let resultbuf = through((buf, enc ,next)=>{
            next(null,buf2base64url(buf,mimeType))
        });

        if(["png","jpeg"].indexOf(imageType)>0){
            return readbuf
                .pipe(pngquant.buffer())
                .pipe(resultbuf)
                .pipe(buftoIiteral)
        }else{
            return readbuf
                .pipe(resultbuf)
                .pipe(buftoIiteral)
        }

    }else {
        return streamify(buf2base64url(""))
            .pipe(buftoIiteral)
    }
}


function buf2base64url(buf,mimeType){
    if(mimeType===void 0)mimeType = "text/plain";
    return "data:"+mimeType+";base64,"+buf.toString("base64");
}

