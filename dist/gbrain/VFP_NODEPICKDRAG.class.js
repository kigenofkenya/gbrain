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
'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});
exports.VFP_NODEPICKDRAG = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('scejs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VFP_NODEPICKDRAG = exports.VFP_NODEPICKDRAG = function () {
            function VFP_NODEPICKDRAG() {
                        _classCallCheck(this, VFP_NODEPICKDRAG);
            }

            _createClass(VFP_NODEPICKDRAG, null, [{
                        key: 'getSrc',
                        value: function getSrc(geometryLength) {
                                    return [[undefined],
                                    // vertex head
                                    'varying vec4 vColor;\n' +
                                    //'uniform sampler2D posXYZW;\n'+
                                    Utils.packGLSLFunctionString() + 'mat4 rotationMatrix(vec3 axis, float angle) {' + 'axis = normalize(axis);' + 'float s = sin(angle);' + 'float c = cos(angle);' + 'float oc = 1.0 - c;' + 'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,' + 'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,' + 'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,' + '0.0,                                0.0,                                0.0,                                1.0);' + '}',

                                    // vertex source
                                    'vec2 xGeometry = get_global_id(data[].x, uBufferWidth, ' + geometryLength.toFixed(1) + ');' + 'vec4 nodePosition = posXYZW[xGeometry];\n' + 'float bornDate = dataB[xGeometry].x;' + 'float dieDate = dataB[xGeometry].y;' + 'mat4 nodepos = nodeWMatrix;' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'nodepos[3][0] = nodePosition.x;' + 'nodepos[3][1] = nodePosition.y;' + 'nodepos[3][2] = nodePosition.z;' + 'vColor = vec4(1.0, 1.0, 1.0, 1.0);' + 'int mak = 0;' + 'if(dieDate != 0.0) {' + 'if(currentTimestamp > bornDate && currentTimestamp < dieDate) ' + 'mak = 1;' + '} else ' + 'mak = 1;' + 'if(mak == 1) {' + 'vColor = pack((data[].x+1.0)/1000000.0);' + '}' + 'if(vColor.x == 1.0 && vColor.y == 1.0 && vColor.z == 1.0 && vColor.w == 1.0) ' + 'nodepos[3][0] = 10000.0;' + 'gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPos[];\n' + 'gl_PointSize = 10.0;\n',

                                    // fragment head
                                    'varying vec4 vColor;\n',

                                    // fragment source
                                    //'vec2 x = get_global_id();'+ // no needed

                                    'return [vColor];\n'];
                        }
            }]);

            return VFP_NODEPICKDRAG;
}();

global.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
module.exports.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"scejs":1}]},{},[2]);
