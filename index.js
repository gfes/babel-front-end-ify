/* Created by tommyZZM on 2016/3/5. */
"use strict"
const cwd = process.cwd();
const path = require("path");
const fs = require("fs");
const extend = require("deep-extend")
const babel = require("babelify");
const template = require("babel-template");
const babylon = require("babylon");
const t = require("babel-types");
const selfBabelPreset = require("./lib/preset");
const builtins = require("browserify/lib/builtins");
const through = require("through2");
const streamify = require("streamifier").createReadStream;
const bresolve = require('browser-resolve');
const merge = require("merge-stream");
const insertGlobals = require('insert-module-globals');

const bundler = require("./lib/bundler");
const md5hex = require("md5-hex");
const Objectf = require("./packages/Objectf")
const pathStandardize = require("./packages/path-standardize")

const context = {
    _loaders:{},
    importer:function(name,loader){
        if(typeof loader === "function" && !this._loaders[name]){
            this._loaders[name] = loader;
        }
        return plugin
    }
    ,use:function(){
        return plugin;
    }
}

function plugin( b, options ){
    if(options === void 0)options = {};

    let plugins = options.plugins;
    let presets = options.presets;
    let stringTags = options.stringTags;
    if(!Array.isArray(plugins))plugins = []
    if(!Array.isArray(presets))presets = []

    //alias
    const aliasCourier = "@alias@";
    const aliasCourierPath = path.join(__dirname,'./smart_builtins/_alias.js');

    let alias = options.alias||{};
    let globalAlias = Object.keys(alias).filter((key)=>alias[key].global)
        .reduce((object,key)=>{
        object[key] = babylon.parse("global."+alias[key].global).program.body;
        return object
    },{})

    let redirectAlias = Object.keys(alias).filter((key)=>typeof alias[key]==="string")
        .reduce((object,key)=>{
        let alia = alias[key];
        let aliafile = false;

        [alia,path.join(alia,"index.js"),alia+".js"].some((rpath,i)=>{
            if(fs.existsSync(rpath)){
                aliafile = alia
                return true;
            }
        })

        if(aliafile){
            object[key] = pathStandardize(aliafile)
        }
        return object
    },{})

    let aliasTransform = Object.assign({},globalAlias);
    let aliasBuiltins = Object.keys(globalAlias)
        .reduce((object,key)=>{
            object[key] = path.join(__dirname,'./smart_builtins/_alias_global.js');
            return object
        },{})

    b._bresolve = (id, opts, cb)=>{
        if(Array.isArray(options.roots)){
            opts.moduleDirectory = options.roots.filter(root=>root!=="node_modules").concat(["node_modules"]);
        }
        return bresolve(id, opts, cb)
    }

    //import
    const importCourier = "@import@";
    const importCourierPath = path.join(__dirname,'./smart_builtins/_bundle.js');

    this._loaders = options.loaders || {}
    this.importer("base64",require("./lib/importers/base64"));
    this.importer("reference",require("./lib/importers/reference"));

    let importsTransform = {};

    let loaders = Object.assign({},this._loaders);

    let acceptorResult = template("require(\'"+importCourier+"\').IDENTIFY")
    b.transform(babel,{
        presets:presets.concat([
            selfBabelPreset
        ])
        , plugins:plugins.concat([
            [require("./packages/babel-plugin-smart-import"),{
                acceptors:Object.keys(loaders).reduce((object,name)=>{
                    let loader = loaders[name]
                    object[name] = (parent,attrs)=>{
                        if(attrs["base"]===true)attrs["base"] = cwd;
                        let filepath = attrs["base"]?
                            path.join(attrs["base"],attrs.from):
                            path.join(path.dirname(parent),attrs.from);

                        let filepathHex = md5hex(filepath).substring(0,10);
                        let identify = (name+"_from_"+filepathHex)
                            .replace(/[^a-zA-Z0-9$_]/gi,"_");

                        if(!importsTransform[identify]){
                            let bundle = loader(filepath,attrs);
                            importsTransform[identify] = bundle;
                        }

                        return acceptorResult({
                            IDENTIFY:t.identifier(identify)
                        })
                    }
                    return object;
                },{})
            }]
            ,[require("./lib/babel-plugins/alias-redirect.js")({
                alias:redirectAlias
            },b)]
            //-----------------------------------------
            ,[require("./packages/babel-plugin-template-string-compilable-tag"),{
                cookers:stringTags || {}
            }]
        ])
    })

    //re initlize browserify
    //use browserify's interal reset API is better than a monkey patch
    let lastEntries = b._options.entries;
    b._bundled = true;//prevent duplicate transform of global
    b.on("reset",()=>{
        importsTransform = {};
        steupPipeline();
    })
    b.reset({
        builtins:extend(builtins,b._options.builtins,{
            [importCourier] : importCourierPath
            ,[aliasCourier] : aliasCourierPath
        },aliasBuiltins)
    })
    b.add(lastEntries)

    return b;

    function steupPipeline(){
        let depsSort = require("./lib/pipeline/depssort");
        let depsAlia = require("./lib/pipeline/depsalia");

        b.pipeline.get('deps').push(depsAlia(aliasCourier,aliasBuiltins))
        b.pipeline.get('deps').push(depsSort(sort,{
                [aliasCourierPath] :
                    (filepath)=>transform(aliasTransform).pipe(insertGlobals(filepath))
                ,[importCourierPath] :
                    (filepath)=>transform(importsTransform)
            }));

        function sort() {
        }

        function transform(bundlesCourier){
            let entryStream = through();
            entryStream.push(" ");
            entryStream.push(null);
            return entryStream.pipe(bundler(bundlesCourier))
        }
    }
}

//@static method use(...) to apply custom plugin
plugin.use = function(){
    return context.use.apply(context,arguments)
}
plugin.importer = function(){
    return context.importer.apply(context,arguments)
}

module.exports = plugin.bind(context);
