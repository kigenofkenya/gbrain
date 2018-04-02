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
exports.VFP_NODE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _graphUtil = require("./graphUtil");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VFP_NODE = exports.VFP_NODE = function () {
    function VFP_NODE() {
        _classCallCheck(this, VFP_NODE);
    }

    _createClass(VFP_NODE, null, [{
        key: "getSrc",
        value: function getSrc(customCode, geometryLength) {
            return [["RGB"],

            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████║█████╗  ███████║██║  ██║
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ██╔══██║██╔══╝  ██╔══██║██║  ██║
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ██║  ██║███████╗██║  ██║██████╔╝
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
            'varying vec4 vVertexColor;\n' + 'varying vec4 vVertexColorNetError;\n' + 'varying vec4 vUV;\n' + 'varying vec2 vVertexUV;\n' + 'varying float vUseTex;\n' + 'varying vec4 vWNMatrix;\n' + 'varying float vNodeId;\n' + 'varying float vNodeIdOpposite;\n' + 'varying float vDist;\n' + 'varying float vVisibility;\n' + 'varying float vIsSelected;\n' + 'varying float vIsHover;\n' + 'varying float vUseCrosshair;\n' + 'varying float vIstarget;\n' + 'vec2 get2Dfrom1D(float idx, float columns) {' + 'float n = idx/columns;' + 'float row = float(int(n));' + 'float col = fract(n)*columns;' + 'float ts = 1.0/columns;' + 'return vec2(ts*col, ts*row);' + '}' + 'mat4 lookAt(vec3 eye, vec3 center, vec3 up) {' + 'vec3 zaxis = normalize(center - eye);' + 'vec3 xaxis = normalize(cross(up, zaxis));' + 'vec3 yaxis = cross(zaxis, xaxis);' + 'mat4 matrix;' +
            //Column Major
            'matrix[0][0] = xaxis.x;' + 'matrix[1][0] = yaxis.x;' + 'matrix[2][0] = zaxis.x;' + 'matrix[3][0] = 0.0;' + 'matrix[0][1] = xaxis.y;' + 'matrix[1][1] = yaxis.y;' + 'matrix[2][1] = zaxis.y;' + 'matrix[3][1] = 0.0;' + 'matrix[0][2] = xaxis.z;' + 'matrix[1][2] = yaxis.z;' + 'matrix[2][2] = zaxis.z;' + 'matrix[3][2] = 0.0;' + 'matrix[0][3] = -dot(xaxis, eye);' + 'matrix[1][3] = -dot(yaxis, eye);' + 'matrix[2][3] = -dot(zaxis, eye);' + 'matrix[3][3] = 1.0;' + 'return matrix;' + '}' + 'mat4 transpose(mat4 m) {' + 'return mat4(  m[0][0], m[1][0], m[2][0], m[3][0],' + 'm[0][1], m[1][1], m[2][1], m[3][1],' + 'm[0][2], m[1][2], m[2][2], m[3][2],' + 'm[0][3], m[1][3], m[2][3], m[3][3]);' + '}' + 'mat4 rotationMatrix(vec3 axis, float angle) {' + 'axis = normalize(axis);' + 'float s = sin(angle);' + 'float c = cos(angle);' + 'float oc = 1.0 - c;' + 'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,' + 'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,' + 'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,' + '0.0,                                0.0,                                0.0,                                1.0);' + '}' + _graphUtil.GraphUtils.adjMatrix_Autolink_GLSLFunctionString(geometryLength) + Utils.degToRadGLSLFunctionString() + Utils.radToDegGLSLFunctionString() + Utils.cartesianToSphericalGLSLFunctionString() + Utils.sphericalToCartesianGLSLFunctionString() + Utils.getVectorGLSLFunctionString() + 'vec3 getVV(vec3 crB, float acum) {' + 'vec3 ob = cartesianToSpherical(crB);' + 'float angleLat = ob.y;' + 'float angleLng = ob.z;' + 'float desvLat = 0.0;' + // (vecNoise.x*180.0)-90.0
            'float desvLng = 10.0;' + // (vecNoise.x*180.0)-90.0
            //'angleLat += (degrees*desvLat);'+
            'angleLng += (acum*desvLng);' + 'return sphericalToCartesian(vec3(1.0, angleLat, angleLng));' + '}' + 'float getOddEven(float repeatId) {' + 'return (ceil(fract(repeatId/2.0)) == 0.0) ? 1.0*floor(repeatId/2.0) : -1.0*floor(repeatId/2.0);' + '}' + 'vec3 getFirstDispl(float nodeId, vec4 currentPosition, float repeatId) {' + 'float repeatDistribution = -0.1;' +
            // first check output edges of own node and return the node (textCoord for get posXYZW) with max available angle to the right
            'vec4 adjMatrix = idAdjMatrix_Autolink(nodeId, currentPosition.xyz);' + 'vec3 initialVec = normalize(posXYZW[adjMatrix.xy].xyz-currentPosition.xyz)*vec3(1.0, -1.0, 1.0);' + 'float totalAngleRelations = adjMatrix.z;' +
            // then first sum half of available angle received
            'initialVec = getVV(initialVec, (totalAngleRelations/2.0)*repeatDistribution);' +
            // and now left or right (oddEven)
            'return getVV(initialVec, getOddEven(repeatId)*totalAngleRelations*0.01);' + '}' + 'float checkLinkArrowVisibility(float currentTimestamp, float bornDate, float dieDate, float bornDateOpposite, float dieDateOpposite, float linkBornDate, float linkDieDate) {' + 'float visible =1.0;' + 'if(dieDate != 0.0) {' + 'if((currentTimestamp < bornDate || currentTimestamp > dieDate) || (currentTimestamp < bornDateOpposite || currentTimestamp > dieDateOpposite)) {' + 'visible = 0.0;' + '} else {' +
            // now check link
            'if(linkDieDate != 0.0) {' + 'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {' + 'visible = 0.0;' + '}' + '}' + '}' + '} else {' +
            // now check link
            'if(linkDieDate != 0.0) {' + 'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {' + 'visible = 0.0;' + '}' + '}' + '}' + 'return visible;' + '}',

            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            'float nodeId = data[].x;' + 'float nodeIdOpposite = data[].y;' + 'float currentLineVertex = data[].z;' + // this is isTarget for arrows
            'float repeatId = data[].w;' + 'vec2 xGeometryNode = get_global_id(nodeId, bufferNodesWidth, ' + geometryLength.toFixed(1) + ');' + // bufferWidth6, geometryLength
            'vec2 xGeometryNode_opposite = get_global_id(nodeIdOpposite, bufferNodesWidth, ' + geometryLength.toFixed(1) + ');' + 'vec2 xGeometryLinks = get_global_id(nodeId, bufferLinksWidth, 2.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryLinks_opposite = get_global_id(nodeIdOpposite, bufferLinksWidth, 2.0);' + 'vec2 xGeometryArrows = get_global_id(nodeId, bufferArrowsWidth, 3.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryArrows_opposite = get_global_id(nodeIdOpposite, bufferArrowsWidth, 3.0);' + 'vec2 xGeometryText = get_global_id(nodeId, bufferTextsWidth, 4.0*12.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryText_opposite = get_global_id(nodeIdOpposite, bufferTextsWidth, 4.0*12.0);' + 'vec4 nodeVertexPosition = nodeVertexPos[];\n' + 'vec4 nodeVertexTex = nodeVertexTexture[];\n' + 'float linkBornDate = dataC[].x;' + 'float linkDieDate = dataC[].y;' + 'float bornDate = dataB[xGeometryNode].x;' + 'float dieDate = dataB[xGeometryNode].y;' + 'float foutput = dataB[xGeometryNode].z;' + 'float error = dataF[xGeometryNode].x;' + 'float bornDateOpposite = dataB[xGeometryNode_opposite].x;' + 'float dieDateOpposite = dataB[xGeometryNode_opposite].y;' + 'vec4 currentPosition = posXYZW[xGeometryNode];\n' + 'vec3 oppositePosition = posXYZW[xGeometryNode_opposite].xyz;\n' + 'vec4 nodeVertexColor = vec4(1.0, 1.0, 1.0, 1.0);\n' + 'vec4 nodeVertexColorNetError = vec4(1.0, 1.0, 1.0, 1.0);\n' + 'vec3 dir = oppositePosition-vec3(currentPosition.x, currentPosition.y, currentPosition.z);' + 'float dist = length(dir);' + 'float vertexCount = 1.0;' + 'float lineIncrements = dist/vertexCount;' + 'vec3 dirN = normalize(dir);' + 'vec3 cr = cross(dirN, vec3(0.0, 1.0, 0.0));' + 'float currentLineVertexSQRT = abs( currentLineVertex-(vertexCount/2.0) )/(vertexCount/2.0);' + 'currentLineVertexSQRT = sqrt(1.0-currentLineVertexSQRT);' + 'vVertexUV = vec2(-1.0, -1.0);' + 'vDist = max(0.3, 1.0-(distance(currentPosition.xyz, oppositePosition)*0.01));\n' + // dist/acum

            'mat4 nodepos = nodeWMatrix;' + 'if(isNode == 1.0) {' + 'vVisibility = 1.0;' + 'currentPosition += vec4(0.0, 0.1, 0.0, 1.0);' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'float nodeImgId = nodeImgId[];' + 'if(nodeImgId != -1.0) {' + 'vUseTex = 1.0;' + 'vVertexUV = get2Dfrom1D(nodeImgId, nodeImgColumns)+vec2(nodeVertexTexture.x/nodeImgColumns,nodeVertexTexture.y/nodeImgColumns);' + '}' + 'if(dieDate != 0.0 && (currentTimestamp < bornDate || currentTimestamp > dieDate)) ' + 'vVisibility = 0.0;' + 'if(enableNeuronalNetwork == 1.0) {' + 'nodeVertexColor = vec4(0.0, 0.0, 0.0, 1.0);' + 'if(foutput > 0.0) ' + 'nodeVertexColor = vec4(abs(foutput), abs(foutput), abs(foutput), 1.0);' + 'else if(foutput < 0.0) ' + 'nodeVertexColor = vec4(abs(foutput), 0.0, 0.0, 1.0);' + 'if(error > 0.0) ' + 'nodeVertexColorNetError = vec4(abs(error), 0.0, 0.0, 1.0);' + 'else if(error < 0.0) ' + 'nodeVertexColorNetError = vec4(0.0, abs(error), 0.0, 1.0);' + 'else ' + 'nodeVertexColorNetError = vec4(0.0,0.0,0.0, 0.0);' + '}' + 'vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;' + '}' + 'if(isLink == 1.0) {' + 'if(xGeometryLinks != xGeometryLinks_opposite) {' +
            // displacing from center to first point
            'currentPosition += vec4(dirN*(lineIncrements*currentLineVertex), 1.0);' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) ' + 'currentPosition += vec4(cr*currentLineVertexSQRT*getOddEven(repeatId)*4.0, 1.0);' + '} else {' + // is Autolink
            'float currentLineVertexMM = abs( currentLineVertex-(vertexCount/2.0) );' + 'currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;' +

            // displacing from center to first point
            'vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);' + 'currentPosition += vec4(initialVec*(5.0*currentLineVertexMM), 1.0);' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {' + 'float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;' + 'vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);' + 'float hhSCount = (vertexCount/2.0)/2.0;' + 'float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));' + 'currentPosition += vec4((crB*sig)*currentLineVertexMMB*1.0, 1.0);' + '}' + '}' + 'vVisibility = checkLinkArrowVisibility(currentTimestamp, bornDate, dieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);' + 'vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;' + 'if(enableNeuronalNetwork == 1.0) {' + 'nodeVertexColor = vec4(abs(foutput), abs(foutput), abs(foutput), 1.0);' + 'if(error > 0.0) ' + 'nodeVertexColorNetError = vec4(0.0, abs(error), 0.0, 1.0);' + 'else if(error < 0.0) ' + 'nodeVertexColorNetError = vec4(abs(error), 0.0, 0.0, 1.0);' + 'else ' + 'nodeVertexColorNetError = vec4(0.0,0.0,0.0, 0.0);' + '}' + '}' + 'if(isArrow == 1.0) {' + 'vec3 currentPositionTMP;' + 'if(xGeometryArrows != xGeometryArrows_opposite) {' +
            // displacing from center to first point
            'float currentLineVertexU = vertexCount-1.0;' + 'currentPositionTMP = oppositePosition+((dirN*-1.0)*(lineIncrements*currentLineVertexU));' +

            // displacing from first point to cross direction (repeatId)
            'currentPositionTMP -= cr*(currentLineVertexSQRT*getOddEven(repeatId)*4.0);' + '} else {' + // is Autolink
            'float currentLineVertexU = vertexCount-1.0;' + 'float currentLineVertexMM = abs( currentLineVertexU-(vertexCount/2.0) );' + 'currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;' +

            // displacing from center to first point
            'vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);' + 'currentPositionTMP = oppositePosition+(initialVec*(5.0*currentLineVertexMM));' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {' + 'float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;' + 'vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);' + 'float hhSCount = (vertexCount/2.0)/2.0;' + 'float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));' + 'currentPositionTMP += (crB*sig)*currentLineVertexMMB*1.0;' +
            //'currentPositionTMP -= vec4((crB*sig)*(currentLineVertexSQRT*(repeatId+1.0)*4.0), 1.0);'+
            '}' + '}' + 'mat4 pp = lookAt(currentPositionTMP, vec3(currentPosition.x, currentPosition.y, currentPosition.z), vec3(0.0, 1.0, 0.0));' + 'pp = transpose(pp);' + 'nodepos[0][0] = pp[0][0];' + 'nodepos[0][1] = pp[1][0];' + 'nodepos[0][2] = pp[2][0];' + 'nodepos[1][0] = pp[0][1];' + 'nodepos[1][1] = pp[1][1];' + 'nodepos[1][2] = pp[2][1];' + 'nodepos[2][0] = pp[0][2];' + 'nodepos[2][1] = pp[1][2];' + 'nodepos[2][2] = pp[2][2];' +

            // displace from center to node border
            'dir = currentPositionTMP-vec3(currentPosition.x, currentPosition.y, currentPosition.z);' + 'currentPosition += vec4(normalize(dir),1.0)*2.0;' + 'vVisibility = checkLinkArrowVisibility(currentTimestamp, bornDate, dieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);' + 'vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;' + '}' + 'if(isNodeText == 1.0) {' + 'float letId = letterId[];\n' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'vVertexUV = get2Dfrom1D(letId, fontImgColumns)+vec2(nodeVertexTexture.x/fontImgColumns,nodeVertexTexture.y/fontImgColumns);' + 'nodeVertexPosition = vec4(nodeVertexPosition.x*0.1, nodeVertexPosition.y*0.1, nodeVertexPosition.z*0.1, 1.0);' + 'currentPosition.z += 2.5;' + 'vVisibility = 1.0;' + 'vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;' + '}' + 'nodepos[3][0] = currentPosition.x;' + 'nodepos[3][1] = currentPosition.y;' + 'nodepos[3][2] = currentPosition.z;' + 'mat4 nodeposG = nodeWMatrix;' + 'vWNMatrix = nodeposG * nodeVertexNormal[];\n' + 'vUseCrosshair = 0.0;' + 'vIstarget = (currentLineVertex == 1.0) ? 1.0 : 0.0;' + customCode + 'vVertexColor = nodeVertexColor;' + 'vVertexColorNetError = nodeVertexColorNetError;' + 'vUV = nodeVertexTexture;' + 'vNodeId = nodeId;\n' + 'vNodeIdOpposite = nodeIdOpposite;\n' + 'gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPosition;\n',

            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████║█████╗  ███████║██║  ██║
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ██╔══██║██╔══╝  ██╔══██║██║  ██║
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ██║  ██║███████╗██║  ██║██████╔╝
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
            'varying vec4 vVertexColor;\n' + 'varying vec4 vVertexColorNetError;\n' + 'varying vec4 vUV;\n' + 'varying vec2 vVertexUV;\n' + 'varying float vUseTex;\n' + 'varying vec4 vWNMatrix;\n' + 'varying float vNodeId;\n' + 'varying float vNodeIdOpposite;\n' + 'varying float vDist;\n' + 'varying float vVisibility;\n' + 'varying float vIsSelected;\n' + 'varying float vIsHover;\n' + 'varying float vUseCrosshair;\n' + 'varying float vIstarget;\n',

            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            'vec4 color = vVertexColor;\n' + 'vec4 colorB = vVertexColorNetError;\n' + 'vec4 colorOrange = vec4(255.0/255.0, 131.0/255.0, 0.0/255.0, 1.0);' + 'vec4 colorOrangeDark = vec4(255.0/255.0, 80.0/255.0, 0.0/255.0, 1.0);' + 'vec4 colorPurple = vec4(132.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);' + 'vec4 fcolor = vec4(0.0, 0.0, 0.0, 1.0);' + 'if(isNode == 1.0) {' + 'if(vUseTex == 1.0) {' + 'vec4 tex;' + 'if(vUseCrosshair == 1.0) {' + 'tex = nodesImgCrosshair[vVertexUV.xy];' + '} else if(vIsSelected == 1.0) {' + 'color = colorOrangeDark;' + 'tex = nodesImgCrosshair[vVertexUV.xy];' + '} else if(vIsHover == 1.0) {' + 'color = colorPurple;' + 'tex = nodesImg[vVertexUV.xy];' + '} else {' + 'tex = nodesImg[vVertexUV.xy];' + '}' + 'color = ' + _graphUtil.GraphUtils.nodesDrawMode(geometryLength) + ';\n' + '}' + 'if(color.a < 0.1) discard;' + 'fcolor = color;\n' + 'if(enableNeuronalNetwork == 1.0) {' +
            // half up: ouput; half down: error
            'if(vUV.y > (0.7)) ' + 'fcolor = colorB;\n' + // 0.75-(colorB.w*1.0)   'fcolor = (vUV.y < (0.5)) ? color : ((colorB.w == 0.0)?color:colorB);\n'+
            '}' + '} else if(isLink == 1.0) {' + 'if(vIsSelected == 1.0) ' + 'color = colorOrange;' + 'else if(vIsHover == 1.0) ' + 'color = colorPurple;' + 'if(enableNeuronalNetwork == 1.0) {' +
            // weight color
            'vec2 xAdjMatCurrent = get_global_id(vec2(vNodeIdOpposite, vNodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n' + 'vec4 pixAdjMatCCurrent = adjacencyMatrixC[xAdjMatCurrent];\n' +

            // x weight
            'if(pixAdjMatACurrent.z > 0.0) ' + 'fcolor = vec4(0.0, pixAdjMatACurrent.z, 0.0, 1.0);\n' + 'else ' + 'fcolor = vec4(abs(pixAdjMatACurrent.z), 0.0, 0.0, 1.0);\n' +

            /*'if(pixAdjMatCCurrent.x > 0.0) '+
                'fcolor *= vec4(0.0, abs(pixAdjMatCCurrent.x), 0.0, 1.0);'+
            'else if(pixAdjMatCCurrent.x < 0.0) '+
                'fcolor *= vec4(abs(pixAdjMatCCurrent.x), 0.0, 0.0, 1.0);'+
            'else '+
                'fcolor *= vec4(0.0,0.0,0.0, 0.0);'+*/

            // x output
            'if(multiplyOutput == 1.0) ' + 'fcolor *= vec4(color.xyz, 1.0);\n' + '} else ' + 'fcolor = vec4(color.xyz, 1.0);\n' + '} else if(isArrow == 1.0) {' + 'if(vIstarget == 1.0) {' + 'if(vIsSelected == 1.0) {' + 'color = vec4(colorOrange.rgb*vDist, 1.0);\n' + '} else if(vIsHover == 1.0) {' + 'color = vec4(colorPurple.rgb*vDist, 1.0);\n' + '}' + '} else {' + 'color = vec4(1.0, 0.0, 0.0, 0.0);' + '}' + 'fcolor = color;\n' + '} else if(isNodeText == 1.0) {' + 'fcolor = fontsImg[vVertexUV.xy];\n' + '}' + 'if(vVisibility == 0.0) ' + 'discard;' + 'return [fcolor];'];
        }
    }]);

    return VFP_NODE;
}();

global.VFP_NODE = VFP_NODE;
module.exports.VFP_NODE = VFP_NODE;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./graphUtil":3,"scejs":1}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphUtils = exports.GraphUtils = function () {
    function GraphUtils() {
        _classCallCheck(this, GraphUtils);
    }

    _createClass(GraphUtils, null, [{
        key: "nodesDrawMode",
        value: function nodesDrawMode(geometryLength) {
            if (geometryLength === 1) return "vec4(color.rgb, 1.0)";else return "vec4(tex.rgb*color.rgb, tex.a)";
        }
    }, {
        key: "adjMatrix_ForceLayout_GLSLFunctionString",
        value: function adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount) {
            return '' + "vec3 sphericalColl(vec3 currentDir, vec3 currentDirB, vec3 dirToBN) {\n            vec3 currentDirN = normalize(currentDir);\n            float pPoint = abs(dot(currentDirN, dirToBN));\n            vec3 reflectV = reflect(currentDirN*-1.0, dirToBN);\n\n            vec3 currentDirBN = normalize(currentDirB);\n            float pPointB = abs(dot(currentDirBN, dirToBN));\n\n            vec3 repulsionForce = (reflectV*-1.0)* (((1.0-pPoint)*length(currentDir))+((pPointB)*length(currentDirB)));\n\n            return (repulsionForce.x > 0.0 && repulsionForce.y > 0.0 && repulsionForce.z > 0.0) ? repulsionForce : dirToBN*-0.1;\n        }\n\n        struct CalculationResponse {\n            vec3 atraction;\n            float acumAtraction;\n            vec3 repulsion;\n            float collisionExists;\n            float netChildInputSumA;\n            float netParentErrorWeightA;\n            float netChildInputSumB;\n            float netParentErrorWeightB;\n            float netChildInputSumC;\n            float netParentErrorWeightC;\n            float netChildInputSumD;\n            float netParentErrorWeightD;\n            float netChildInputSumE;\n            float netParentErrorWeightE;\n            float netChildInputSumF;\n            float netParentErrorWeightF;\n            float netChildInputSumG;\n            float netParentErrorWeightG;\n        };" +

            // pixAdjMatA (bornDate, dieDate, weight (parent:-2;child:w), isParent (1.0:parent;0.0:child))
            // pixAdjMatA (linkMultiplier, activationFunction)
            "CalculationResponse calculate(float nodeId,\n                                        vec4 pixAdjMatACurrent, vec4 pixAdjMatAOpposite,\n                                        vec4 pixAdjMatBCurrent, vec4 pixAdjMatBOpposite,\n                                        vec2 xGeomCurrent, vec2 xGeomOpposite,\n                                        vec3 currentPos, vec3 currentDir,\n                                        vec3 atraction, float acumAtraction, vec3 repulsion,\n                                        float enableNeuronalNetwork,\n                                        float netChildInputSumA, float netParentErrorWeightA,\n                                        float netChildInputSumB, float netParentErrorWeightB,\n                                        float netChildInputSumC, float netParentErrorWeightC,\n                                        float netChildInputSumD, float netParentErrorWeightD,\n                                        float netChildInputSumE, float netParentErrorWeightE,\n                                        float netChildInputSumF, float netParentErrorWeightF,\n                                        float netChildInputSumG, float netParentErrorWeightG) {" +
            // pixAdjMatACurrent
            "float currentBornDate = pixAdjMatACurrent.x;\n            float currentDieDate = pixAdjMatACurrent.y;\n            float currentWeight = pixAdjMatACurrent.z;\n            float currentIsParent = pixAdjMatACurrent.w;" +

            // pixAdjMatAOpposite
            "float oppositeBornDate = pixAdjMatAOpposite.x;\n            float oppositeDieDate = pixAdjMatAOpposite.y;\n            float oppositeWeight = pixAdjMatAOpposite.z;\n            float oppositeIsParent = pixAdjMatAOpposite.w;" +

            // pixAdjMatBCurrent
            "float currentLinkMultiplier = pixAdjMatBCurrent.x;\n            float currentActivationFn = pixAdjMatBCurrent.y;" +

            // pixAdjMatBOpposite
            "float oppositeLinkMultiplier = pixAdjMatBOpposite.x;\n            float oppositeActivationFn = pixAdjMatBOpposite.y;" +

            // dataB Current
            //'float currentBornDate = dataB[xGeomCurrent].x;'+
            //'float currentDieDate = dataB[xGeomCurrent].y;'+
            //'float currentNetOutput = dataB[xGeomCurrent].z;'+
            //'float currentNetError = dataB[xGeomCurrent].w;'+

            // dataB Opposite
            //'float oppositeBornDate = dataB[xGeomOpposite].x;'+
            //'float oppositeDieDate = dataB[xGeomOpposite].y;'+
            "float oppositeNetOutputA = dataB[xGeomOpposite].z;\n            float oppositeNetErrorA = dataB[xGeomOpposite].w;\n\n            float oppositeNetOutputB = dataF[xGeomOpposite].x;\n            float oppositeNetErrorB = dataF[xGeomOpposite].y;\n        \n            float oppositeNetOutputC = dataF[xGeomOpposite].z;\n            float oppositeNetErrorC = dataF[xGeomOpposite].w;\n        \n            float oppositeNetOutputD = dataG[xGeomOpposite].x;\n            float oppositeNetErrorD = dataG[xGeomOpposite].y;\n        \n            float oppositeNetOutputE = dataG[xGeomOpposite].z;\n            float oppositeNetErrorE = dataG[xGeomOpposite].w;\n        \n            float oppositeNetOutputF = dataH[xGeomOpposite].x;\n            float oppositeNetErrorF = dataH[xGeomOpposite].y;\n        \n            float oppositeNetOutputG = dataH[xGeomOpposite].z;\n            float oppositeNetErrorG = dataH[xGeomOpposite].w;" +

            // pos & dir Current
            //'vec3 currentPos = posXYZW[xGeomCurrent].xyz;\n'+
            //'vec3 currentDir = dir[xGeomCurrent].xyz;\n'+

            // pos & dir Opposite
            "vec3 oppositePos = posXYZW[xGeomOpposite].xyz;\n            vec3 oppositeDir = dir[xGeomOpposite].xyz;" +

            // dir / dist to opposite
            'vec3 dirToOpposite = (oppositePos-currentPos);\n' + 'vec3 dirToOppositeN = normalize(dirToOpposite);\n' + 'float dist = distance(oppositePos, currentPos);\n' + // near=0.0 ; far=1.0
            'float distN = max(0.0,dist)/100000.0;' + 'float p = 1.0;' + 'if(currentDieDate != 0.0 && (currentTimestamp < currentBornDate || currentTimestamp > currentDieDate)) ' + 'p = 0.0;' + 'if(oppositeDieDate != 0.0 && (currentTimestamp < oppositeBornDate || currentTimestamp > oppositeDieDate)) ' + 'p = 0.0;' + 'if(p == 1.0) {' + 'float m1 = (enableNeuronalNetwork == 1.0) ? 0.0 : 400000.0;' + 'float m2 = (enableNeuronalNetwork == 1.0) ? 0.0 : 48.0;' + 'if(currentIsParent == 1.0) {' +
            //'if(enableNeuronalNetwork == 1.0) '+
            'netChildInputSumA += oppositeNetOutputA*oppositeWeight;' + 'netChildInputSumB += oppositeNetOutputB*oppositeWeight;' + 'netChildInputSumC += oppositeNetOutputC*oppositeWeight;' + 'netChildInputSumD += oppositeNetOutputD*oppositeWeight;' + 'netChildInputSumE += oppositeNetOutputE*oppositeWeight;' + 'netChildInputSumF += oppositeNetOutputF*oppositeWeight;' + 'netChildInputSumG += oppositeNetOutputG*oppositeWeight;' +
            //'else {'+
            'atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));\n' + 'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '} else if(currentIsParent == 0.5) {' +
            //'if(enableNeuronalNetwork == 1.0) '+
            'netParentErrorWeightA += oppositeNetErrorA*currentWeight;' + 'netParentErrorWeightB += oppositeNetErrorB*currentWeight;' + 'netParentErrorWeightC += oppositeNetErrorC*currentWeight;' + 'netParentErrorWeightD += oppositeNetErrorD*currentWeight;' + 'netParentErrorWeightE += oppositeNetErrorE*currentWeight;' + 'netParentErrorWeightF += oppositeNetErrorF*currentWeight;' + 'netParentErrorWeightG += oppositeNetErrorG*currentWeight;' +
            //'else {'+
            'atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);\n' + 'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '}' +

            //'if(enableNeuronalNetwork == 0.0) {'+
            'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '}' + ("float collisionExists = 0.0;\n            if(enableForceLayoutCollision == 1.0 && dist < 4.0) {\n                collisionExists = 1.0;\n                atraction = sphericalColl(currentDir, oppositeDir, dirToOppositeN);\n            }\n\n            return CalculationResponse(atraction, acumAtraction, repulsion, collisionExists,\n                                        netChildInputSumA, netParentErrorWeightA,\n                                        netChildInputSumB, netParentErrorWeightB,\n                                        netChildInputSumC, netParentErrorWeightC,\n                                        netChildInputSumD, netParentErrorWeightD,\n                                        netChildInputSumE, netParentErrorWeightE,\n                                        netChildInputSumF, netParentErrorWeightF,\n                                        netChildInputSumG, netParentErrorWeightG);\n        }\n        struct idAdjMatrixResponse {\n            vec3 force;\n            float collisionExists;\n            float netFOutputA;\n            float netErrorWeightA;\n            float netFOutputB;\n            float netErrorWeightB;\n            float netFOutputC;\n            float netErrorWeightC;\n            float netFOutputD;\n            float netErrorWeightD;\n            float netFOutputE;\n            float netErrorWeightE;\n            float netFOutputF;\n            float netErrorWeightF;\n            float netFOutputG;\n            float netErrorWeightG;\n        };\n        float tanh(float val) {\n            float tmp = exp(val);\n            float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);\n            return tanH;\n        }\n        float sigm(float val) {\n            return (1.0 / (1.0 + exp(-val)));\n        }\n        idAdjMatrixResponse idAdjMatrix_ForceLayout(float nodeId, vec3 currentPos, vec3 currentDir, float numOfConnections, float currentTimestamp, float bornDate, float dieDate, float enableNeuronalNetwork) {\n            vec3 atraction = vec3(0.0, 0.0, 0.0);\n            float acumAtraction = 1.0;\n            vec3 repulsion = vec3(0.0, 0.0, 0.0);\n\n            float collisionExists = 0.0;\n            vec3 force = vec3(0.0, 0.0, 0.0);\n\n\n            float netChildInputSumA = 0.0;\n            float foutputA = 0.0;\n            float netParentErrorWeightA = 0.0;\n            \n            float netChildInputSumB = 0.0;\n            float foutputB = 0.0;\n            float netParentErrorWeightB = 0.0;\n            \n            float netChildInputSumC = 0.0;\n            float foutputC = 0.0;\n            float netParentErrorWeightC = 0.0;\n            \n            float netChildInputSumD = 0.0;\n            float foutputD = 0.0;\n            float netParentErrorWeightD = 0.0;\n            \n            float netChildInputSumE = 0.0;\n            float foutputE = 0.0;\n            float netParentErrorWeightE = 0.0;\n            \n            float netChildInputSumF = 0.0;\n            float foutputF = 0.0;\n            float netParentErrorWeightF = 0.0;\n            \n            float netChildInputSumG = 0.0;\n            float foutputG = 0.0;\n            float netParentErrorWeightG = 0.0;\n            \n\n            if(nodeId < nodesCount) {\n                float currentActivationFn = 0.0;\n                vec2 xGeomCurrent = get_global_id(nodeId, uBufferWidth, " + geometryLength.toFixed(1) + ");\n                for(int n=0; n < 4096; n++) {\n                    if(float(n) >= nodesCount) {break;}\n                    if(float(n) != nodeId) {\n                        vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, " + geometryLength.toFixed(1) + ");\n\n\n                        vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);\n                        vec2 xAdjMatOpposite = get_global_id(vec2(nodeId, float(n)), widthAdjMatrix);\n\n                        vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n                        vec4 pixAdjMatAOpposite = adjacencyMatrix[xAdjMatOpposite];\n\n                        vec4 pixAdjMatBCurrent = adjacencyMatrixB[xAdjMatCurrent];\n                        vec4 pixAdjMatBOpposite = adjacencyMatrixB[xAdjMatOpposite];\n\n\n                        CalculationResponse calcResponse = calculate(nodeId,\n                                                                    pixAdjMatACurrent, pixAdjMatAOpposite,\n                                                                    pixAdjMatBCurrent, pixAdjMatBOpposite,\n                                                                    xGeomCurrent, xGeomOpposite,\n                                                                    currentPos, currentDir,\n                                                                    atraction, acumAtraction, repulsion,\n                                                                    enableNeuronalNetwork,\n                                                                    netChildInputSumA, netParentErrorWeightA,\n                                                                    netChildInputSumB, netParentErrorWeightB,\n                                                                    netChildInputSumC, netParentErrorWeightC,\n                                                                    netChildInputSumD, netParentErrorWeightD,\n                                                                    netChildInputSumE, netParentErrorWeightE,\n                                                                    netChildInputSumF, netParentErrorWeightF,\n                                                                    netChildInputSumG, netParentErrorWeightG);\n                        atraction = calcResponse.atraction;\n                        acumAtraction = calcResponse.acumAtraction;\n                        repulsion = calcResponse.repulsion;\n                        \n                        \n                        netChildInputSumA = calcResponse.netChildInputSumA;\n                        netParentErrorWeightA = calcResponse.netParentErrorWeightA;\n                        \n                        netChildInputSumB = calcResponse.netChildInputSumB;\n                        netParentErrorWeightB = calcResponse.netParentErrorWeightB;\n                        \n                        netChildInputSumC = calcResponse.netChildInputSumC;\n                        netParentErrorWeightC = calcResponse.netParentErrorWeightC;\n                        \n                        netChildInputSumD = calcResponse.netChildInputSumD;\n                        netParentErrorWeightD = calcResponse.netParentErrorWeightD;\n                        \n                        netChildInputSumE = calcResponse.netChildInputSumE;\n                        netParentErrorWeightE = calcResponse.netParentErrorWeightE;\n                        \n                        netChildInputSumF = calcResponse.netChildInputSumF;\n                        netParentErrorWeightF = calcResponse.netParentErrorWeightF;\n                        \n                        netChildInputSumG = calcResponse.netChildInputSumG;\n                        netParentErrorWeightG = calcResponse.netParentErrorWeightG;\n\n\n                        if(calcResponse.collisionExists == 1.0) {\n                            collisionExists = 1.0;\n                            force = calcResponse.atraction;\n                            break;\n                        }\n\n                        if(dieDate != 0.0) {\n                            if(currentTimestamp < bornDate || currentTimestamp > dieDate) {\n                                force = vec3(0.0, 0.0, 0.0);\n                                break;\n                            }\n                        }\n                    }\n                }\n\n                if(collisionExists == 0.0) {\n                    force += (atraction/acumAtraction)*1.0;\n                    force += (repulsion/acumAtraction)*1.0;\n                }\n\n                if(enableNeuronalNetwork == 1.0) {\n                    " + GraphUtils.efferentNodesStr(efferentStart, efferentNodesCount) + "\n                }\n            }\n\n            return idAdjMatrixResponse(vec3(force), collisionExists,\n                                        foutputA, netParentErrorWeightA,\n                                        foutputB, netParentErrorWeightB,\n                                        foutputC, netParentErrorWeightC,\n                                        foutputD, netParentErrorWeightD,\n                                        foutputE, netParentErrorWeightE,\n                                        foutputF, netParentErrorWeightF,\n                                        foutputG, netParentErrorWeightG);\n        }");
        }
    }, {
        key: "efferentNodesStr",
        value: function efferentNodesStr(efferentStart, efferentNodesCount) {
            var str = "\n            if(nodeId < afferentNodesCount) {\n                for(float n=0.0; n < 1024.0; n+=1.0) {\n                    if(n >= afferentNodesCount) {\n                        break;\n                    }\n                    if(nodeId == n) {\n                        foutputA = afferentNodesA[int(n)];\n                        foutputB = afferentNodesB[int(n)];\n                        foutputC = afferentNodesC[int(n)];\n                        foutputD = afferentNodesD[int(n)];\n                        foutputE = afferentNodesE[int(n)];\n                        foutputF = afferentNodesF[int(n)];\n                        foutputG = afferentNodesG[int(n)];\n                        break;\n                    }\n                }\n            } else {\n                foutputA = max(0.0, netChildInputSumA); " + "\n                foutputB = max(0.0, netChildInputSumB);\n                foutputC = max(0.0, netChildInputSumC);\n                foutputD = max(0.0, netChildInputSumD);\n                foutputE = max(0.0, netChildInputSumE);\n                foutputF = max(0.0, netChildInputSumF);\n                foutputG = max(0.0, netChildInputSumG);\n            }";

            str += "\n        if(nodeId == " + efferentStart.toFixed(1) + (") {\n            netParentErrorWeightA = (efferentNodesA[0] != 0.0) ? netChildInputSumA-efferentNodesA[0] : 0.0;\n            " + "\n            netParentErrorWeightB = (efferentNodesB[0] != 0.0) ? netChildInputSumB-efferentNodesB[0] : 0.0;\n            " + "\n            netParentErrorWeightC = (efferentNodesC[0] != 0.0) ? netChildInputSumC-efferentNodesC[0] : 0.0;\n            " + "\n            netParentErrorWeightD = (efferentNodesD[0] != 0.0) ? netChildInputSumD-efferentNodesD[0] : 0.0;\n            " + "\n            netParentErrorWeightE = (efferentNodesE[0] != 0.0) ? netChildInputSumE-efferentNodesE[0] : 0.0;\n            " + "\n            netParentErrorWeightF = (efferentNodesF[0] != 0.0) ? netChildInputSumF-efferentNodesF[0] : 0.0;\n            " + "\n            netParentErrorWeightG = (efferentNodesG[0] != 0.0) ? netChildInputSumG-efferentNodesG[0] : 0.0;\n            " + "\n        }");
            for (var n = efferentStart + 1; n < efferentStart + efferentNodesCount; n++) {
                str += "\n            else if(nodeId == " + n.toFixed(1) + ") {\n                netParentErrorWeightA = (efferentNodesA[" + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumA-efferentNodesA[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightB = (efferentNodesB[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumB-efferentNodesB[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightC = (efferentNodesC[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumC-efferentNodesC[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightD = (efferentNodesD[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumD-efferentNodesD[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightE = (efferentNodesE[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumE-efferentNodesE[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightF = (efferentNodesF[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumF-efferentNodesF[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightG = (efferentNodesG[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumG-efferentNodesG[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n            }");
            }str += "\n        else {\n            if(foutputA <= 0.0) {\n                netParentErrorWeightA = 0.0;\n            }\n            if(foutputB <= 0.0) {\n                netParentErrorWeightB = 0.0;\n            }\n            if(foutputC <= 0.0) {\n                netParentErrorWeightC = 0.0;\n            }\n            if(foutputD <= 0.0) {\n                netParentErrorWeightD = 0.0;\n            }\n            if(foutputE <= 0.0) {\n                netParentErrorWeightE = 0.0;\n            }\n            if(foutputF <= 0.0) {\n                netParentErrorWeightF = 0.0;\n            }\n            if(foutputG <= 0.0) {\n                netParentErrorWeightG = 0.0;\n            }\n        }";

            return str;
        }
    }, {
        key: "adjMatrix_Autolink_GLSLFunctionString",
        value: function adjMatrix_Autolink_GLSLFunctionString(geometryLength) {
            return '' + 'float GetAngle(vec3 A, vec3 B) {' + // from -180.0 to 180.0
            'vec3 cr = cross(A, B);' + 'float d = dot(A, B);' + 'if(cr.y < 0.0) {' + 'if(d > 0.0) {' + 'd =        (1.0-d)*90.0;' + '} else {' + 'd = 90.0+  (abs(d)*90.0);' + '}' + '} else {' + 'if(d > 0.0) {' + 'd = 270.0+ (d*90.0);' + '} else {' + 'd = 180.0+ ((1.0-abs(d))*90.0);' + '}' + '}' + 'return d;' + '}' + 'vec4 idAdjMatrix_Autolink(float nodeId, vec3 currentPos) {\n' +
            // INIT VARS
            'vec2 totalIDrelation = vec2(0.0, 0.0);' + 'float totalAngleRelations = 0.0;' +
            // END INIT VARS

            'if(nodeId < nodesCount) {\n' + 'for(int n=0; n < 4096; n++) {\n' + 'if(float(n) >= nodesCount) break;\n' + 'if(float(n) != nodeId) {' + 'vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n' +

            // RELATION FOUND
            'if(pixAdjMatACurrent.x > 0.0) {' + 'vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, ' + geometryLength.toFixed(1) + ');\n' + 'vec3 currentPosB = posXYZW[xGeomOpposite].xyz;\n' + 'vec3 dirToBN = normalize(currentPosB-currentPos);\n' + 'vec2 IDrelation = vec2(0.0, 0.0);' + 'float angleRelations = 360.0;' + 'if(nodeId < nodesCount) {\n' + 'for(int nB=0; nB < 4096; nB++) {\n' + 'if(float(nB) >= nodesCount) break;\n' + 'if(float(nB) != float(n) && float(nB) != nodeId) {' + 'vec2 xAdjMatCurrentB = get_global_id(vec2(float(nB), nodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent_B = adjacencyMatrix[xAdjMatCurrentB];\n' + 'if(pixAdjMatACurrent_B.x > 0.0) {' + 'vec2 xGeom_oppoB = get_global_id(float(nB), uBufferWidth, ' + geometryLength.toFixed(1) + ');\n' + 'vec3 currentPosBB = posXYZW[xGeom_oppoB].xyz;\n' + 'vec3 dirToBBN = normalize(currentPosBB-currentPos);\n' + 'float angle = GetAngle(dirToBN,dirToBBN);' + 'if(angle > 0.0 && angle < angleRelations) {' + 'IDrelation = xGeom_oppoB;' + 'angleRelations = angle;' + '}' + '}' + '}' + '}' + '}' + 'if(angleRelations < 360.0 && angleRelations > totalAngleRelations) {' + 'totalIDrelation = IDrelation;' + 'totalAngleRelations = angleRelations;' + '}' + '}' +
            // END RELATION FOUND

            '}' + '}' +
            // SUMMATION
            // END SUMMATION

            '}' + 'return vec4(totalIDrelation, totalAngleRelations, 0.0);' + '}';
        }
    }]);

    return GraphUtils;
}();

global.GraphUtils = GraphUtils;
module.exports.GraphUtils = GraphUtils;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
