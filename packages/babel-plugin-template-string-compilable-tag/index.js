/* Created by tommyZZM on 2016/3/17. */
"use strict";

const template = require("babel-template")
const generate = require("babel-generator").default
const objectPath = require("object-path");

const arrayf = require("../arrayf")

module.exports = function(babel) {
    let t = babel.types;
    let defaultcookers = {
        "nowrap":require("./interal-cookers/nowrap")
        ,"html":require("./interal-cookers/html")
        ,"_debug":require("./interal-cookers/debug")
    }
    const TAG_MODULE_NAME = "#tags";
    const TAG_API = "tag";

    const visitor = {

        ImportDeclaration(path, state){
            if(path.node.source.value === TAG_MODULE_NAME){
                path.remove();
            }
        }

        ,TaggedTemplateExpression(path, state){
            let cookers = Object.assign({},state.opts.cookers,defaultcookers);
            let sourceFile = objectPath.get(state,"file.opts.filename");
            
            let tagCall = path.get("tag").node;

            if(!t.isCallExpression(tagCall)){
                path.replaceWith(templateString);
                return;
            }

            let cookersArray = tagCall["arguments"]
                .filter(arg=>t.isStringLiteral(arg))
                .map(arg=>arg.value)
                .filter(Boolean);
            if(cookersArray.length === 0)
                cookersArray.push(Object.keys(defaultcookers)[0]);

            //console.log(cookersArray)
            cookers = Object.keys(cookers).reduce((array,key)=>{
                if(cookersArray.indexOf(key)>=0){
                    array.push(cookers[key])
                }
                return array;
            },[])

            let templateString = path.node.quasi;
            let tagbinding = path.scope.getOwnBinding/**hasBinding??**/(TAG_API);
            if(!tagbinding ) {
                path.replaceWith(templateString);
                return;
            }

            let tagbindingParent = tagbinding.path.parent;//

            if(!( t.isImportDefaultSpecifier(tagbinding.path.node)
                    && t.isImportDeclaration(tagbindingParent)
                    && tagbindingParent.source.value === TAG_MODULE_NAME)){
                return;
            }

            let sourceCode = state.file.code.substring(templateString.start,templateString.end);
            let templateQuasis = templateString.quasis;
            let strings = templateQuasis
                .map((q,index)=>{
                    if(!t.isTemplateElement(q)){
                        return null
                    }
                    return {
                        value:q.value.raw
                        ,index
                        ,begin:index===0
                        ,tail:q.tail
                    }
                }).filter(Boolean)

            let cookedStrings = cookpipelineSync(cookers,strings,sourceCode,sourceFile);

            cookedStrings.forEach((ele)=>{
                templateQuasis[ele.index].value.cooked = ele.value;
            })

            path.replaceWith(templateString);
        }
    }

    return {
        visitor
    }

    function cookpipelineSync(cookers,strings,source,sourceFile){
        cookers = cookers
            .filter(cook=>typeof cook === "function")
            .map(cook=>cook(source,sourceFile))
            .filter(cook=>typeof cook === "function");

        return strings.map((s)=> {
            return { value:cookers
                .reduce((v, cook)=>cook(v,{
                    get isTail(){return s.tail}
                    ,get isBegin(){return s.begin}
                    ,get index(){return s.index}
                }) || "", s.value)
                ,index:s.index
            }

        }).reduce((result, s)=> {
            result.push(s)
            return result
        }, [])
    }
}