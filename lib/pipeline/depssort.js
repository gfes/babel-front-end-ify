/* Created by tommyZZM on 2016/3/22. */
"use strict"

const through = require("through2")
const merge = require("merge-stream")

// generate courier after all files has been deped
// and push couriers to the top of file

// 模块排序,并且生成(重定向和imports两个)内联模块
module.exports = function(callback,map){
    let rows = [];
    let couriers = [];

    return through.obj(function (row, enc, next) {
        if(map[row.file]){
            couriers.push(row);
        }else{
            rows.push(row);
        }

        next();
    },function (end) {

        let merged = merge();

        couriers.forEach(row=>{
            let tr = map[row.file](row.file);
            tr.on("data",buf=>row.source=buf.toString())
            merged.add(tr);
        })

        if(couriers.length===0){
            let tr = through.obj();
            tr.push(null);
            merged.add(tr);
        }

        merged.on("finish",_=>{
            couriers.concat(rows).forEach((row)=>{
                this.push(row);
            });
            end()
        })
    })
}

