/* Created by tommyZZM on 2016/3/23. */
"use strict"
import tag from "#tags"

module.exports = {
    a:tag("html")`
        <div>
            <p>should save space</p>
            <span>${variable} </span>
        </div>
    `
    ,b:`
         <div>
            <p>should save space</p>
            <span>${variable} </span>
        </div>
    `
}