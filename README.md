
> Browserify plugin for babel transfrom , implemented some useful feature for front-end engineering

### Install

```bash
$ npm install babel-front-end-ify --save
```

### Useage

```javascript
"use strict"
const browserify = require("browserify")

let b = browserify(["test/resources/entry-alias.js"])
            .plugin("babel-front-end-ify",{
                alias:{
                    vue:{global:"Vue"}
                    ,module1:"./test/resources/alias/module1" 
                    ,module2:"./test/resources/alias/module2"
                    ,module3:"./test/resources/alias/module3"
                }
                , plugins:[...]
                , presets:[...]
                , roots:["./packages"]
                , stringTags:{...}
            })
            
//...
```

##### single babel transform with default presets

##### alias

##### resources rely

##### template string precompile tags

##### lazy import json

### Changelog
