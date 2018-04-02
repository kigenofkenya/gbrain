(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var exp = { "ArrayGenerator": "./ArrayGenerator.class",
            "Component": "./Component.class.js",
            "Component_GPU": "./Component_GPU.class.js",
            "ComponentControllerTransformTarget": "./ComponentControllerTransformTarget.class.js",
            "ComponentKeyboardEvents": "./ComponentKeyboardEvents.class.js",
            "ComponentMouseEvents": "./ComponentMouseEvents.class.js",
            "ComponentProjection": "./ComponentProjection.class.js",
            "ComponentTransform": "./ComponentTransform.class.js",
            "ComponentTransformTarget": "./ComponentTransformTarget.class.js",
            "Constants": "./Constants.js",
            "Mesh": "./Mesh.class.js",
            "Node": "./Node.class.js",
            "Project": "./Project.class.js",
            "SCE": "./SCE.class.js",
            "Stage": "./Stage.class.js",
            "StormM16": "./StormMath.class.js",
            "StormV3": "./StormMath.class.js",
            "SystemEvents": "./SystemEvents.class.js",
            "Utils": "./Utils.class.js",
            "VFP_RGB": "./VFP_RGB.class.js",

            "Grid": "./Prefabs/Grid/Grid.class.js",
            "SimpleCamera": "./Prefabs/SimpleCamera/SimpleCamera.class.js",
            "SimpleNode": "./Prefabs/SimpleNode/SimpleNode.class.js"
};

for(var key in exp)
    exports[key] = require(exp[key]);

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProccessImg = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProccessImg = exports.ProccessImg = function () {
    function ProccessImg(jsonIn) {
        _classCallCheck(this, ProccessImg);

        this.stackNodesImg = jsonIn.stackNodesImg;
        this.drawedImages = 0;
        this.output = {
            "nodesImg": null,
            "nodesImgCrosshair": null };

        var NODE_IMG_WIDTH = jsonIn.NODE_IMG_WIDTH;
        this.NODE_IMG_COLUMNS = jsonIn.NODE_IMG_COLUMNS;
        this.NODE_IMG_SPRITE_WIDTH = NODE_IMG_WIDTH / this.NODE_IMG_COLUMNS;

        var nodesImgMask = jsonIn.nodesImgMask;
        this.datMask = Utils.getUint8ArrayFromHTMLImageElement(nodesImgMask);

        var nodesImgCrosshair = jsonIn.nodesImgCrosshair;
        this.datCrosshair = Utils.getUint8ArrayFromHTMLImageElement(nodesImgCrosshair);

        this.canvasNodeImg = document.createElement('canvas');
        this.canvasNodeImg.width = NODE_IMG_WIDTH;
        this.canvasNodeImg.height = NODE_IMG_WIDTH;
        this.ctxNodeImg = this.canvasNodeImg.getContext('2d');

        this.canvasNodeImgCrosshair = document.createElement('canvas');
        this.canvasNodeImgCrosshair.width = NODE_IMG_WIDTH;
        this.canvasNodeImgCrosshair.height = NODE_IMG_WIDTH;
        this.ctxNodeImgCrosshair = this.canvasNodeImgCrosshair.getContext('2d');

        var canvasNodeImgTMP = document.createElement('canvas');
        canvasNodeImgTMP.width = this.NODE_IMG_SPRITE_WIDTH;
        canvasNodeImgTMP.height = this.NODE_IMG_SPRITE_WIDTH;
        var ctxNodeImgTMP = canvasNodeImgTMP.getContext('2d');

        for (var n = 0; n < this.stackNodesImg.length; n++) {
            var currStack = this.stackNodesImg[n];
            var image = new Image();
            image.onload = function (image, currStack) {
                ctxNodeImgTMP.clearRect(0, 0, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH);
                var quarter = this.NODE_IMG_SPRITE_WIDTH / 4;
                ctxNodeImgTMP.drawImage(image, 0, 0, image.width, image.height, quarter, quarter, this.NODE_IMG_SPRITE_WIDTH / 2, this.NODE_IMG_SPRITE_WIDTH / 2);

                new Utils().getImageFromCanvas(canvasNodeImgTMP, function (currStack, img) {
                    currStack.image = Utils.getUint8ArrayFromHTMLImageElement(img);

                    var allImg = true;
                    for (var nb = 0; nb < this.stackNodesImg.length; nb++) {
                        if (this.stackNodesImg[nb].image == null) {
                            allImg = false;
                            break;
                        }
                    }

                    if (allImg === true) this.generateAll(jsonIn);
                }.bind(this, currStack));
            }.bind(this, image, currStack);
            image.src = currStack.url;
        }
    }

    _createClass(ProccessImg, [{
        key: "generateAll",
        value: function generateAll(jsonIn) {
            var drawOnAtlas = function (currStack, ctx, newImgData) {
                var _this = this;

                var get2Dfrom1D = function ( /*Int*/idx, /*Int*/columns) {
                    var n = idx / columns;
                    var row = parseFloat(parseInt(n));
                    var col = Utils.fract(n) * columns;

                    return {
                        "col": col,
                        "row": row };
                }.bind(this);

                var readAll = function (onend) {
                    var pasteImg = function (onend, imgname, img) {
                        this.output[imgname] = img;
                        if (this.output.nodesImg != null && this.output.nodesImgCrosshair != null) onend(this.output);
                    }.bind(this, onend);

                    new Utils().getImageFromCanvas(this.canvasNodeImg, function (imgAtlas) {
                        pasteImg("nodesImg", imgAtlas);
                    }.bind(this));
                    new Utils().getImageFromCanvas(this.canvasNodeImgCrosshair, function (imgAtlas) {
                        pasteImg("nodesImgCrosshair", imgAtlas);
                    }.bind(this));
                }.bind(this, jsonIn.onend);

                new Utils().getImageFromCanvas(Utils.getCanvasFromUint8Array(newImgData, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH), function (imgB) {
                    // draw image on atlas
                    var loc = get2Dfrom1D(currStack.locationIdx, _this.NODE_IMG_COLUMNS);
                    ctx.drawImage(imgB, loc.col * _this.NODE_IMG_SPRITE_WIDTH, loc.row * _this.NODE_IMG_SPRITE_WIDTH, _this.NODE_IMG_SPRITE_WIDTH, _this.NODE_IMG_SPRITE_WIDTH);

                    _this.drawedImages++;
                    if (_this.drawedImages === _this.stackNodesImg.length * 2) readAll();
                });
            }.bind(this);

            for (var n = 0; n < this.stackNodesImg.length; n++) {
                var currStack = this.stackNodesImg[n];
                var newImgData = this.stackNodesImg[n].image;

                // masked image
                for (var nb = 0; nb < this.datMask.length / 4; nb++) {
                    var idx = nb * 4;
                    if (newImgData[idx + 3] > 0) newImgData[idx + 3] = this.datMask[idx + 3];
                }
                drawOnAtlas(currStack, this.ctxNodeImg, newImgData);

                // crosshair image
                for (var _nb = 0; _nb < this.datCrosshair.length / 4; _nb++) {
                    var _idx = _nb * 4;

                    newImgData[_idx] = (this.datCrosshair[_idx] * this.datCrosshair[_idx + 3] + newImgData[_idx] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 1] = (this.datCrosshair[_idx + 1] * this.datCrosshair[_idx + 3] + newImgData[_idx + 1] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 2] = (this.datCrosshair[_idx + 2] * this.datCrosshair[_idx + 3] + newImgData[_idx + 2] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 3] = (this.datCrosshair[_idx + 3] * this.datCrosshair[_idx + 3] + newImgData[_idx + 3] * (255 - this.datCrosshair[_idx + 3])) / 255;
                }
                drawOnAtlas(currStack, this.ctxNodeImgCrosshair, newImgData);
            }
        }
    }]);

    return ProccessImg;
}();

global.ProccessImg = ProccessImg;
module.exports.ProccessImg = ProccessImg;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"scejs":1}]},{},[2]);
