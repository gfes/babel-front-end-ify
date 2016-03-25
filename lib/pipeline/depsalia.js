/* Created by tommyZZM on 2016/3/12. */
"use strict"

const path = require("path");
const template = require("babel-template")
const t  = require("babel-types")
const generate = require("babel-generator").default
const objectPath = require("object-path");
const babylon = require("babylon");
const through = require("through2")
const Objectf = require("../../packages/Objectf")

module.exports = function (courier,alias) {

    let sources = Objectf.map(alias,(ele,key)=>{
        return {
            file:key
            ,id:key
            ,source:"module.exports = require('"+courier+"')['"+key+"']"
            ,deps:{
                [courier]:path.join(__dirname,"../../smart_builtins/_alias.js")
            }
        };
    })

    let rows = []

    return through.obj(function (row, enc, next) {
        rows.push(row)
        next()
    },function (end) {
        Objectf.values(sources).filter(row=>rows.some(r=>r.deps[row.id]))
            .concat(rows.filter(row=>row.file !==
                path.join(__dirname,"../../smart_builtins/_alias_global.js"))
            .map(row=>{
                row.deps = Objectf.map(row.deps,(ele,key)=>{
                    if(!!sources[key]){
                        return sources[key].file
                    }
                    return ele
                })
                return row
            }))
            .forEach(row=>{
                this.push(row)
            })

        end()
    })
}


//
// module.exports = function (b,options) {
//
//     let alias = options.alias || {};
//     let courier = options.courier || "noop"
//
//     b.on("reset",function(){
//         let readFileOrigin = this._mdeps.readFile.bind(this._mdeps);
//         let resolverOrigin = this._mdeps.resolver.bind(b._mdeps);
//         let redirect2Courier = {}
//
//         this._mdeps.resolver = function (id, parent, cb) {
//
//             if(alias[id]){
//                 if(!redirect2Courier[id]){
//                     redirect2Courier[id] = "module.exports = require('"+courier+"')['"+id+"']";
//                 }
//                 return cb(null, "redirect:"+id, {})
//             }
//             return resolverOrigin(id,parent,cb)
//         }
//
//         this._mdeps.readFile =  function (file, id, pkg) {
//             let tr = through();
//             if(!!redirect2Courier[id]){
//                 tr = through()
//                 tr.push(redirect2Courier[id])
//                 tr.push(null);
//             }else{
//                 tr = readFileOrigin(file,id,pkg)
//             }
//             return tr
//         }
//     })
//
//     return b;
// }