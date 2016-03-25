/* Created by tommyZZM on 2016/3/11. */
"use strict"

const template = require("babel-template")
const generate = require("babel-generator").default
const objectPath = require("object-path")

module.exports = function(babel){
    let types = babel.types;

    const visitor = {
        JSXElement:function(path, state){
            let options = state.opts
            let acceptors = options.acceptors || {};/**should be { key:?(:function) } **/

            let element = path.node.openingElement;
            let elementName = element.name;
            let elementSelfClosing = element.selfClosing;

            //TODO: if elementName === "import" &&
            if(types.isJSXIdentifier(elementName) && elementName.name==="import" && elementSelfClosing){
                //TODO: if match <import from="xxx" as="xxx">
                let elementAttributes = jsxElementAttributesToObjectArray(element.attributes);
                let from = elementAttributes.filter(attribute=>attribute.name==="from")[0];
                let as = elementAttributes.filter(attribute=>attribute.name==="as")[0];

                if(!from || !as){
                    return path.replaceWith(types.nullLiteral());
                }

                from = from.value;
                as = as.value;

                let options = elementAttributes.reduce((object,ele)=>{
                    object[ele.name] = ele.value;
                    return object;
                },{})

                let acceptor = acceptors[as]
                let acceptIdentifier = null;
                if(typeof acceptor === "function"){
                    let parentFileName = objectPath.get(state,"file.opts.filename");
                    let acceptResult = acceptor.apply({
                        template
                        ,generate
                        ,t:types
                    },[parentFileName,options])


                    if(types.isIdentifier(acceptResult) || types.isStatement(acceptResult)){
                        acceptIdentifier = acceptResult;
                    }else {
                        if(typeof acceptResult==="string"){
                            acceptIdentifier = types.stringLiteral(acceptResult)
                        }else if(typeof acceptResult==="boolean"){
                            acceptIdentifier = types.booleanLiteral(acceptResult)
                        }
                    }

                    //TODO:node.replaceAs(transformTo)
                }
                if ( !acceptIdentifier ) {
                    //TODO:warning
                    //if no acceptor then replace as null object
                }

                return path.replaceWith( acceptIdentifier || types.nullLiteral() )
            }

            //TODO:remove Children Elements named import with closing

            //console.log(elementSelfClosing,element.attributes,element.name)
        }
    }

    return {
        visitor
    };

    function jsxElementAttributesToObjectArray(attributes){
        return attributes
            .filter(attribute=>types.isJSXIdentifier(attribute.name) && (types.isStringLiteral(attribute.value)||!attribute.value))
            .map(attribute=>{
                return {
                    name:attribute.name.name
                    ,value:attribute.value?attribute.value.value:true
                }
            })
    }
}