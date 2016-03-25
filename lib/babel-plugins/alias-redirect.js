/* Created by tommyZZM on 2016/3/13. */
"use strict"
const cwd = process.cwd();
const path = require("path");
const template = require("babel-template");
const t  = require("babel-types");
const objectPath = require("object-path");
const pathStandardize = require("../../packages/path-standardize");

module.exports = function (options,b) {

    let alias = options.alias || {};
    let regexIsModuleRely = /^[^\./]/
    let aliasRegexs = Object.keys(alias).map(key=>{
        let regex = new RegExp("("+key+")(\\/(.*))?");
        return {
            exec(str){
                let result = regex.exec(str);
                regex.lastIndex = 0;
                return result;
            }
        }
    })

    return function() {
        let visitor = {
            ImportDeclaration(astpath, state){
                let fileName = objectPath.get(state,"file.opts.filename");

                if(t.isStringLiteral(astpath.node.source) && !!fileName){
                    let aliaparse = null;
                    let aliaable = aliasRegexs.some(regex=>{
                        let value = astpath.node.source.value
                        let parse = regex.exec(value);

                        if(!!parse && regexIsModuleRely.test(value)){
                            aliaparse = parse
                            return true;
                        }
                    })

                    if(!aliaable)return;
                    aliaparse = aliaparse.map(ele=>ele?ele:"")

                    let fileDir = path.dirname(fileName)
                    let key = aliaparse[1];

                    //redirect source if aliaed~
                    let key_source = pathStandardize(path.relative(fileDir, path.join(cwd,alias[key],aliaparse[2])))
                    astpath.node.source.value = key_source;
                }
            }
        }

        return {
            visitor
        }
    }
}