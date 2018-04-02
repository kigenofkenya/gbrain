(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KERNEL_ADJMATRIX_UPDATE = exports.KERNEL_ADJMATRIX_UPDATE = function () {
    function KERNEL_ADJMATRIX_UPDATE() {
        _classCallCheck(this, KERNEL_ADJMATRIX_UPDATE);
    }

    _createClass(KERNEL_ADJMATRIX_UPDATE, null, [{
        key: "getSrc",
        value: function getSrc(geometryLength) {
            return ["x", ["adjacencyMatrix"],
            // head
            "",

            // source
            // adjacencyMatrix= bornDate, dieDate, weight(childs), isParent(1.0:parent;0.5:child)
            // adjacencyMatrixB= linkMultiplier, activationFunc, nodeId, nodeIdInv
            "vec4 adjMat = adjacencyMatrix[x]; \n            vec4 adjMatB = adjacencyMatrixB[x]; \n            vec4 adjMatC = adjacencyMatrixC[x]; \n\n            float linkBornDate = adjMat.x;\n            float linkDieDate = adjMat.y;\n            float linkWeight = adjMat.z;\n            float linkTypeParent = adjMat.w;\n\n            float id = adjMatB.z;\n            float idInv = adjMatB.w;\n            float linkLayerNum = adjMatC.y;\n\n           if(linkTypeParent == 0.5) {\n                vec2 xGeometryCurrentChild = get_global_id(id, bufferNodesWidth, " + geometryLength.toFixed(1) + ");\n                vec2 xGeometryParent = get_global_id(idInv, bufferNodesWidth, " + geometryLength.toFixed(1) + ");\n\n                float childGOutputA = dataB[xGeometryCurrentChild].z;\n                float parentGErrorA = dataB[xGeometryParent].w;\n                \n                float childGOutputB = dataF[xGeometryCurrentChild].x;\n                float parentGErrorB = dataF[xGeometryParent].y;\n                \n                float childGOutputC = dataF[xGeometryCurrentChild].z;\n                float parentGErrorC = dataF[xGeometryParent].w;\n                \n                float childGOutputD = dataG[xGeometryCurrentChild].x;\n                float parentGErrorD = dataG[xGeometryParent].y;\n                \n                float childGOutputE = dataG[xGeometryCurrentChild].z;\n                float parentGErrorE = dataG[xGeometryParent].w;\n                \n                float childGOutputF = dataH[xGeometryCurrentChild].x;\n                float parentGErrorF = dataH[xGeometryParent].y;\n                \n                float childGOutputG = dataH[xGeometryCurrentChild].z;\n                float parentGErrorG = dataH[xGeometryParent].w;                \n            \n                if(linkLayerNum > 0.0) {                        \n                    float learningRate = 0.01;\n                    float l2_decay = 0.01;\n                    float cpu_batch_repeats = 7.0;\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputA*parentGErrorA))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputB*parentGErrorB))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputC*parentGErrorC))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputD*parentGErrorD))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputE*parentGErrorE))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputF*parentGErrorF))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputG*parentGErrorG))/(7.0*cpu_batch_repeats));\n                }\n            }\n            \n            return [vec4(linkBornDate, linkDieDate, linkWeight, linkTypeParent)];\n            "];
        }
    }]);

    return KERNEL_ADJMATRIX_UPDATE;
}();

global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
