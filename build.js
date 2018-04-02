var fs = require("fs");
var glob = require("glob");
var browserify = require('browserify');
var uglifyjs = require('uglify-js');
var watchify = require('watchify');

// watchify main.js -v --debug -o dist/bundle.js
// yarn && mkdirp dist
// eslint main.js


var args = process.argv.slice(2);

var hasArg = function(argName, args) {
    for(var n=0; n < args.length; n++) {
        var expl = args[n].split("=");
        if(expl[0] === argName) {
            if(expl.length > 1)
                return expl[1];
            else
                return true;
        }
    }
    return false;
};

var bT = {  "presets": [
        "es2015"
    ],
    "plugins": [
        "syntax-async-functions",
        "transform-regenerator"
    ],
    "sourceMaps": false};

var arrSrcScripts = [];
var arrDistScripts = [];

glob("src/**/*.js", {}, function (er, files) {
    arrSrcScripts = files;
    for(var n=0; n < arrSrcScripts.length; n++)
        arrDistScripts.push(arrSrcScripts[n].replace("src/", "dist/"));

    // BUILD & WATCH
    if(hasArg("-b", args) !== false) {
        for(var n=0; n < arrSrcScripts.length; n++) {
            if(arrSrcScripts[n].match(/index.js/gi) === null) {
                var b = browserify(arrSrcScripts[n], {"debug": hasArg("-s", args), cache: {}, packageCache: {}, plugin: [watchify]});
                b.on('update', bundle.bind(this, b, n));
                bundle(b, n);

                function bundle(b, n) {
                    b.transform("babelify", bT).bundle().pipe(fs.createWriteStream(arrDistScripts[n]));
                    console.log("- UPDATED: "+arrDistScripts[n]);
                }
            }
        }
    }

    // DEPLOY
    if(hasArg("-db", args) !== false) {
        for(var n=0; n < arrSrcScripts.length; n++) {
            if(arrSrcScripts[n].match(/index.js/gi) !== null) {
                b = browserify(arrSrcScripts[n], {"debug": false});
                b.transform("babelify", bT).bundle().pipe(fs.createWriteStream(arrDistScripts[n]));
            }

        }
    }
    if(hasArg("-d", args) !== false) {
        var deployFile = hasArg("-d", args);
        for(var n=0; n < arrDistScripts.length; n++) {
            if(arrDistScripts[n].match(/index.js/gi) !== null) {
                var f = fs.readFileSync(arrDistScripts[n], "utf8");
                var options = {
                    mangle: {
                        toplevel: true,
                    }
                };
                console.log(f);
                fs.writeFileSync(deployFile, uglifyjs.minify(f, options).code, "utf8");
            }
        }
    }
});