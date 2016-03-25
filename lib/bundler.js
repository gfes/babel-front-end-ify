/* Created by tommyZZM on 2016/3/12. */
"use strict"
const template = require("babel-template");
const t = require("babel-types");
const through = require("through2");
const merge = require("merge-stream");
const isStream = require("is-stream")
const generate = require("babel-generator").default;
const streamify = require("streamifier").createReadStream;
const babylon = require("babylon");

module.exports = function(bundlesCourier){
    let exportAssetsTemplate = template("exports[ASSET_NAME] = ASSET_BODY;\n",{sourceType:'module'})
    let defaultBody = t.nullLiteral();
    return through((_,enc,done)=>{
        let merged = merge();
        let assetsNodes = [];

        Object.keys(bundlesCourier).forEach(identity=>{
            let bundle = bundlesCourier[identity]
            //TODO:bundle is Stream of Promise or plain object

            if(typeof bundle==="string"){
                bundle = t.stringLiteral(bundle)
            }

            if(!isStream(bundle)){
                bundle = streamify(bundle);
            }

            return merged.add(
                bundle.pipe(through.obj((literal, enc, next)=> {
                    assetsNodes.push(exportAssetsTemplate({
                        ASSET_NAME:t.stringLiteral(identity)
                        , ASSET_BODY:literal
                    }));
                    next()
                }))
            );
        })

        merged.on("finish",_=> {
            let buf = new Buffer(generate(t.program(assetsNodes)).code)
            //console.log(buf.toString());
            done(null,buf)
        } )

    })
}

