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
exports.Graph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _KERNEL_DIR = require("./KERNEL_DIR.class");

var _KERNEL_ADJMATRIX_UPDATE = require("./KERNEL_ADJMATRIX_UPDATE.class");

var _VFP_NODE = require("./VFP_NODE.class");

var _VFP_NODEPICKDRAG = require("./VFP_NODEPICKDRAG.class");

var _ProccessImg = require("./ProccessImg.class");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @class
 * @param {SCE} sce
 * @param {Object} jsonIn
 * @param {boolean} jsonIn.enableFonts
 * @param {String} [jsonIn.nodeDrawMode="plane"] - "plane" or "point"
*/
var Graph = exports.Graph = function () {
    function Graph(sce, jsonIn) {
        var _this = this;

        _classCallCheck(this, Graph);

        this._sce = sce;
        this._project = this._sce.getLoadedProject();
        this._gl = this._project.getActiveStage().getWebGLContext();
        this._utils = new Utils();

        this.MAX_ITEMS_PER_ARRAY = 4294967295 /*4294967295*/; // unsigned int 65535 for limit on indices of 16bit; long unsigned int 4294967295
        this.NODE_IMG_COLUMNS = 8.0;
        this.NODE_IMG_WIDTH = 2048;

        this._enableFont = jsonIn && jsonIn.enableFonts === true;
        this._enableHover = false;
        this._enableAutoLink = true;
        this._enabledForceLayout = false;
        this._MAX_ADJ_MATRIX_WIDTH = 2048;

        this._playAnimation = false;
        this._loop = false;
        this._animationFrames = 500;

        this._geometryLength = jsonIn === undefined || jsonIn && jsonIn.nodeDrawMode === undefined || jsonIn && jsonIn.nodeDrawMode === "plane" ? 4 : 1;
        this.circleSegments = 12;
        this.nodesTextPlanes = 12;

        this.lineVertexCount = 1;

        this._enableNeuronalNetwork = false;
        this.batch_size = null;
        this.layerCount = 0;
        this.afferentNodesCount = 0;
        this.efferentNodesCount = 0;
        this.trainTickCount = 0;
        this.onAction = null;
        this.onTrained = null;
        this.afferentNeuron = [];
        this.efferentNeuron = [];
        this.v_val = 0.0;
        this.return_v = false;

        this._only2d = false;
        this.multiplyOutput = 1;

        this._nodesByName = {};
        this._nodesById = {};
        this._links = {};
        this._customArgs = {}; // {ARG: {"arg": String, "value": Array<Float>}}


        this.arrAdjMatrix = null; // linkBornDate, linkDieDate, linkWeight, columnAsParent
        this.arrAdjMatrixB = null;
        this.arrAdjMatrixC = null;

        this.currentTrainLayer = -3;
        this._ADJ_MATRIX_WIDTH = null;

        this._initTimestamp = 0;
        this._currentFrame = 0;
        this._endTimestamp = Date.now();
        this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;

        this.readPixel = false;
        this.selectedId = -1;
        this._initialPosDrag = null;

        this._onClickNode = null;
        this._onAnimationStep = null;
        this._onAnimationEnd = null;

        // meshes
        this.mesh_nodes = this._geometryLength === 1 ? new Mesh().loadPoint() : new Mesh().loadQuad(4.0, 4.0);
        this.mesh_arrows = new Mesh().loadTriangle({ "scale": 1.75, "side": 0.3 });
        this.mesh_nodesText = new Mesh().loadQuad(4.0, 4.0);

        // nodes image
        this.objNodeImages = {};

        this._stackNodesImg = [];
        this.nodesImgMask = null;
        this.nodesImgMaskLoaded = false;
        this.nodesImgCrosshair = null;
        this.nodesImgCrosshairLoaded = false;

        this.FONT_IMG_COLUMNS = 7.0;

        this.disabVal = 0.0;

        // nodes
        this.arrayNodeData = []; // nodeId, acums, bornDate, dieDate
        // if(own networkWaitData == this.disabVal)
        // own has been read. then see networkWaitData of childs, calculate weights & save output in own networkWaitData & networkProcData(for visualization).
        // else if(own networkWaitData != this.disabVal)
        // own networkWaitData is being read. then set own networkWaitData to disabVal()
        this.arrayNodeDataB = []; // bornDate, dieDate, networkWaitData, networkProcData (SHARED with LINKS, ARROWS & NODESTEXT)
        this.arrayNodeDataF = [];
        this.arrayNodeDataG = [];
        this.arrayNodeDataH = [];
        this.arrayNodePosXYZW = [];
        this.arrayNodeVertexPos = [];
        this.arrayNodeVertexNormal = [];
        this.arrayNodeVertexTexture = [];
        this.startIndexId = 0;
        this.arrayNodeIndices = [];

        this.arrayNodeImgId = [];

        this.arrayNodeDir = [];

        this.currentNodeId = 0;
        this.nodeArrayItemStart = 0;

        // links
        this.linksObj = [];
        this.currentLinksObjItem = -1;
        this.currentLinkId = 0;

        // arrows
        this.arrowsObj = [];
        this.currentArrowsObjItem = -1;
        this.currentArrowId = 0;

        /*this.arrayArrowData = [];
        this.arrayArrowDataC = [];
        this.arrayArrowNodeName = [];
        this.arrayArrowPosXYZW = [];
        this.arrayArrowVertexPos = [];
        this.arrayArrowVertexNormal = [];
        this.arrayArrowVertexTexture = [];
        this.startIndexId_arrow = 0;
        this.arrayArrowIndices = [];
          this.currentArrowId = 0;
        this.arrowArrayItemStart = 0;*/

        // nodesText
        this.arrayNodeTextData = [];
        this.arrayNodeTextNodeName = [];
        this.arrayNodeTextPosXYZW = [];
        this.arrayNodeTextVertexPos = [];
        this.arrayNodeTextVertexNormal = [];
        this.arrayNodeTextVertexTexture = [];
        this.startIndexId_nodestext = 0;
        this.arrayNodeTextIndices = [];

        this.arrayNodeText_itemStart = [];
        this.arrayNodeTextLetterId = [];

        this.currentNodeTextId = 0;
        this.nodeTextArrayItemStart = 0;

        this.layout = null;

        this.currHiddenNeuron = 0;
        this.nodSep = 5.0;

        //**************************************************
        //  NODES
        //**************************************************
        this.nodes = new Node();
        this.nodes.setName("graph_nodes");
        this._project.getActiveStage().addNode(this.nodes);

        // ComponentTransform
        this.nodes.addComponent(new ComponentTransform());

        // Component_GPU
        this.comp_renderer_nodes = new Component_GPU();
        this.nodes.addComponent(this.comp_renderer_nodes);

        // ComponentMouseEvents
        var comp_mouseEvents = new ComponentMouseEvents();
        this.nodes.addComponent(comp_mouseEvents);
        comp_mouseEvents.onmousedown(function (evt) {
            _this.selectedId = -1;
            _this.mouseDown();
        });
        comp_mouseEvents.onmouseup(function (evt) {
            if (_this.selectedId !== -1) {
                var _n = _this._nodesById[_this.selectedId];
                if (_n !== undefined && _n !== null && _n.onmouseup !== undefined && _n.onmouseup !== null) _n.onmouseup(_n, evt);
            }
            _this.mouseUp();
        });
        comp_mouseEvents.onmousemove(function (evt, dir) {
            _this.makeDrag(evt, dir);
        });
        comp_mouseEvents.onmousewheel(function (evt) {});

        //**************************************************
        //  LINKS
        //**************************************************
        this.createLinksObjItem();

        //**************************************************
        //  ARROWS
        //**************************************************
        this.createArrowsObjItem();

        /*let arrows = new Node();
        arrows.setName("graph_arrows");
        this._project.getActiveStage().addNode(arrows);
          // ComponentTransform
        arrows.addComponent(new ComponentTransform());
          // Component_GPU
        let comp_renderer_arrows = new Component_GPU();
        arrows.addComponent(comp_renderer_arrows);*/

        //**************************************************
        //  NODESTEXT
        //**************************************************
        this.nodesText = null;
        this.comp_renderer_nodesText = null;
        if (this._enableFont === true) {
            this.nodesText = new Node();
            this.nodesText.setName("graph_nodesText");
            this._project.getActiveStage().addNode(this.nodesText);

            // ComponentTransform
            this.nodesText.addComponent(new ComponentTransform());

            // Component_GPU
            this.comp_renderer_nodesText = new Component_GPU();
            this.nodesText.addComponent(this.comp_renderer_nodesText);
        }
    }

    _createClass(Graph, [{
        key: "createLinksObjItem",
        value: function createLinksObjItem() {
            this.currentLinksObjItem++;

            this.linksObj.push({
                "node": new Node(),
                "componentTransform": new ComponentTransform(),
                "componentRenderer": new Component_GPU(),
                "arrayLinkData": [], // nodeId origin, nodeId target, currentLineVertex, repeatId
                "arrayLinkDataC": [], // linkBornDate, linkDieDate, linkWeight, 0
                "arrayLinkNodeName": [],
                "arrayLinkPosXYZW": [],
                "arrayLinkVertexPos": [],
                "startIndexId_link": 0,
                "arrayLinkIndices": [] });

            this.linksObj[this.currentLinksObjItem].node.setName("graph_links" + this.currentLinksObjItem);
            this._project.getActiveStage().addNode(this.linksObj[this.currentLinksObjItem].node);

            this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentTransform);

            this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentRenderer);
        }
    }, {
        key: "createArrowsObjItem",
        value: function createArrowsObjItem() {
            this.currentArrowsObjItem++;

            this.arrowsObj.push({
                "node": new Node(),
                "componentTransform": new ComponentTransform(),
                "componentRenderer": new Component_GPU(),
                "arrayArrowData": [],
                "arrayArrowDataC": [],
                "arrayArrowNodeName": [],
                "arrayArrowPosXYZW": [],
                "arrayArrowVertexPos": [],
                "arrayArrowVertexNormal": [],
                "arrayArrowVertexTexture": [],
                "startIndexId_arrow": 0,
                "arrayArrowIndices": [],
                "arrowArrayItemStart": 0 });

            this.arrowsObj[this.currentArrowsObjItem].node.setName("graph_arrows" + this.currentArrowsObjItem);
            this._project.getActiveStage().addNode(this.arrowsObj[this.currentArrowsObjItem].node);

            this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentTransform);

            this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentRenderer);
        }
    }, {
        key: "onClickNode",


        /**
         * @param {Function} fn
         */
        value: function onClickNode(fn) {
            this._onClickNode = fn;
        }
    }, {
        key: "getBornDieTS",
        value: function getBornDieTS(bornD, dieD) {
            var _this2 = this;

            var generateRandomBornAndDie = function generateRandomBornAndDie() {
                var bornDate = _this2._initTimestamp + Math.round(Math.random() * Math.max(0, _this2._animationFrames - 20)) * _this2._timeFrameIncrement;
                var dieDate = void 0;
                while (true) {
                    dieDate = _this2._initTimestamp + Math.round(Math.random() * _this2._animationFrames) * _this2._timeFrameIncrement;
                    if (dieDate > bornDate) break;
                }
                //console.log(bornDate);
                //console.log(dieDate);

                return { bornDate: bornDate, dieDate: dieDate };
            };

            var bd = void 0;
            var dd = void 0;
            if (bornD != null) {
                if (bornD.constructor === String) {
                    if (bornD === "RANDOM") {
                        var rbdd = generateRandomBornAndDie();
                        bd = rbdd.bornDate;
                        dd = rbdd.dieDate;
                    } else {
                        bd = Graph.datetimeToTimestamp(bornD);
                        dd = Graph.datetimeToTimestamp(dieD);
                    }
                } else {
                    bd = bornD;
                    dd = dieD;
                }
            } else {
                bd = 1.0;
                dd = 0.0;
            }

            return { "bornDate": bd, "dieDate": dd };
        }
    }, {
        key: "showTimeline",


        /**
         * @param {HTMLDivElement} target
         */
        value: function showTimeline(target) {
            var _this3 = this;

            var eSlider = document.createElement("input");
            eSlider.type = "range";
            eSlider.min = "0";
            eSlider.max = this._animationFrames.toString();
            eSlider.step = "1";
            eSlider.value = "0";
            eSlider.style.verticalAlign = "middle";
            eSlider.style.width = "78%";

            target.innerText = "";
            target.appendChild(eSlider);

            var set_spinner = function set_spinner(e) {
                var frame = e.value;
                _this3.setFrame(frame);
            };

            eSlider.addEventListener("input", set_spinner.bind(this, eSlider));
        }
    }, {
        key: "setTimelineDatetimeRange",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.initDatetime - date of animation start
         * @param {String} jsonIn.endDatetime - date of animation end
         */
        value: function setTimelineDatetimeRange(jsonIn) {
            this._initTimestamp = Graph.datetimeToTimestamp(jsonIn.initDatetime);
            this._endTimestamp = Graph.datetimeToTimestamp(jsonIn.endDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineTimestampRangeStart",


        /**
         * @returns {int}
         */
        value: function getTimelineTimestampRangeStart() {
            return this._initTimestamp;
        }
    }, {
        key: "setTimelineDatetimeRangeStart",


        /**
         * @param {String} initDatetime - date of animation start
         */
        value: function setTimelineDatetimeRangeStart(initDatetime) {
            this._initTimestamp = Graph.datetimeToTimestamp(initDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineTimestampRangeEnd",


        /**
         * @returns {int}
         */
        value: function getTimelineTimestampRangeEnd() {
            return this._endTimestamp;
        }
    }, {
        key: "setTimelineDatetimeRangeEnd",


        /**
         * @param {String} endDatetime - date of animation end
         */
        value: function setTimelineDatetimeRangeEnd(endDatetime) {
            this._endTimestamp = Graph.datetimeToTimestamp(endDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineRangeDates",


        /**
         * @returns {Object}
         */
        value: function getTimelineRangeDates() {
            return { "initDate": this.timestampToDate(this._initTimestamp),
                "endDate": this.timestampToDate(this._endTimestamp) };
        }
    }, {
        key: "getTimelineFramesLength",


        /**
         * @returns {int}
         */
        value: function getTimelineFramesLength() {
            return this._animationFrames;
        }
    }, {
        key: "setTimelineFramesLength",


        /**
         * @param {int} length - frames length
         */
        value: function setTimelineFramesLength(length) {
            this._animationFrames = length;

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "setTimelineTimestamp",


        /**
         * @param {int} ts
         */
        value: function setTimelineTimestamp(ts) {
            this._currentFrame = Math.round((ts - this._initTimestamp) / this._timeFrameIncrement);
        }
    }, {
        key: "setFrame",


        /**
         * @param {int} frame
         */
        value: function setFrame(frame) {
            this._currentFrame = frame;
        }
    }, {
        key: "getFrame",


        /**
         * @returns {int}
         */
        value: function getFrame(frame) {
            return this._currentFrame;
        }
    }, {
        key: "playTimeline",


        /**
         * @param {bool} [loop=false]
         */
        value: function playTimeline(loop) {
            this._playAnimation = true;
            if (loop !== undefined) this._loop = loop;
        }
    }, {
        key: "pauseTimeline",
        value: function pauseTimeline() {
            this._playAnimation = false;
        }
    }, {
        key: "onAnimationStep",


        /**
         * @param {Function} fn
         */
        value: function onAnimationStep(fn) {
            this._onAnimationStep = fn;
        }
    }, {
        key: "onAnimationEnd",


        /**
         * @param {Function} fn
         */
        value: function onAnimationEnd(fn) {
            this._onAnimationEnd = fn;
        }
    }, {
        key: "getNodesCount",


        /**
         * @returns {int}
         */
        value: function getNodesCount() {
            return Object.keys(this._nodesByName).length;
        }
    }, {
        key: "getLinksCount",


        /**
         * @returns {int}
         */
        value: function getLinksCount() {
            return Object.keys(this._links).length;
        }
    }, {
        key: "getNodeByName",


        /**
         * @param {String} name
         * @returns {Node}
         */
        value: function getNodeByName(name) {
            return this._nodesByName[name];
        }
    }, {
        key: "getNodeById",


        /**
         * @param {int} id
         * @returns {Node}
         */
        value: function getNodeById(id) {
            return this._nodesById[id];
        }
    }, {
        key: "selectNode",


        /**
         * @param {int} nodeId
         */
        value: function selectNode(nodeId) {
            this.selectedId = nodeId;
            this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
        }
    }, {
        key: "getSelectedId",


        /**
         * @returns {number}
         */
        value: function getSelectedId() {
            return this.selectedId;
        }
    }, {
        key: "enableHover",
        value: function enableHover() {
            this._enableHover = true;
            this.readPixel = true;
            this.comp_renderer_nodes.gpufG.enableGraphic(1);
        }
    }, {
        key: "enableAutoLink",
        value: function enableAutoLink() {
            this._enableAutoLink = true;
        }
    }, {
        key: "disableAutoLink",
        value: function disableAutoLink() {
            this._enableAutoLink = false;
        }
    }, {
        key: "only2d",


        /**
         *  @param {boolean} mode2d
         */
        value: function only2d(mode2d) {
            this._only2d = mode2d;
        }
    }, {
        key: "setFontsImage",


        /**
         * @param {String} url
         */
        value: function setFontsImage(url) {
            var _this4 = this;

            if (this._enableFont === true) {
                var image = new Image();
                image.onload = function () {
                    _this4.comp_renderer_nodesText.setArg("fontsImg", function () {
                        return image;
                    });
                };
                image.src = url;
            }
        }
    }, {
        key: "setNodeMesh",


        /**
         * @param {Mesh} mesh
         */
        value: function setNodeMesh(mesh) {
            this.mesh_nodes = mesh;
        }
    }, {
        key: "exportFile",
        value: function exportFile() {
            var data = "[";
            var sep = "";
            for (var key in this._nodesByName) {
                data += sep + JSON.stringify(this._nodesByName[key]);
                sep = ",";
                console.log(this._nodesByName[key]);
            }

            data += "]|[";
            sep = "";
            for (var _key in this._links) {
                data += sep + JSON.stringify(this._links[_key]);
                sep = ",";
                console.log(this._links[_key]);
            }

            data += "]";

            console.log(data);
        }
    }, {
        key: "importFile",
        value: function importFile(data) {
            var expl = data.split("|");
            var nodes = JSON.parse(expl[0]);
            var links = JSON.parse(expl[1]);

            for (var key in nodes) {
                var node = this.addNode({
                    "name": nodes[key].name,
                    "data": nodes[key].name,
                    "label": nodes[key].label,
                    "position": nodes[key].pos,
                    "color": Math.floor(n % 2) === 0.0 ? "../_RESOURCES/lena_128x128.jpg" : "../_RESOURCES/cartman08.jpg",
                    "layoutNodeArgumentData": {
                        // dir
                        "ndirect": [0.0, 0.0, 0.0, 1.0],
                        // pp
                        "particlePolarity": 0.0,
                        // destination
                        "dest": [0.0, 0.0, 0.0, 0.0],
                        // lifeDistance
                        "initPos": nodes[key].pos, "initDir": [0.0, 0.0, 0.0, 0.0],
                        // nodeColor
                        "nodeColor": [Math.random(), Math.random(), Math.random(), 1.0],
                        // lock
                        "nodeLock": 0.0 },
                    "onmouseup": function onmouseup(nodeData) {} });
            }

            for (var _key2 in links) {
                var A = links[_key2].origin_nodeName;
                var B = links[_key2].target_nodeName;

                this.addLink({ "origin": A,
                    "target": B,
                    "directed": true });
            }
        }
    }, {
        key: "loadRBFromFile",


        /**
         * @param {String} fileurl
         * @param {Function} [onload=undefined]
         * @param {bool} [generateBornAndDieDates=false]
         * @param {bool} [randomLinkWeights=false]
         */
        value: function loadRBFromFile(fileurl, onload, generateBornAndDieDates, randomLinkWeights) {
            var _this5 = this;

            var req = new XMLHttpRequest();
            req.open("GET", fileurl, true);
            req.addEventListener("load", function (evt) {
                console.log("RB file Loaded");
                _this5.loadRBFromStr({ "data": evt.target.responseText,
                    "generateBornAndDieDates": generateBornAndDieDates,
                    "randomLinkWeights": randomLinkWeights });

                if (onload !== undefined && onload !== null) onload();
            });

            req.addEventListener("error", function (evt) {
                console.log(evt);
            });

            req.send(null);
        }
    }, {
        key: "loadRBFromStr",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.data
         * @param {bool} [jsonIn.generateBornAndDieDates=false] -
         * @param {bool} [jsonIn.randomLinkWeights=false] -
         */
        value: function loadRBFromStr(jsonIn) {
            var _sourceText = jsonIn.data;
            var lines = _sourceText.split("\r\n");
            if (lines.length === 1) lines = _sourceText.split("\n");

            //if(lines[0].match(/OBJ/gim) == null) {alert('Not OBJ file');	return;}
            var line0 = lines[0].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var title = line0[0] !== undefined && line0[0] !== null ? line0[0] : null; // Title
            var key = line0[1] !== undefined && line0[1] !== null ? line0[1] : null; // Key
            console.log(line0);

            var line1 = lines[1].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var tLines = line1[0] !== undefined && line1[0] !== null ? parseInt(line1[0]) : null; // Total number of lines excluding header (TOTCRD)
            var tLinesPointers = line1[1] !== undefined && line1[1] !== null ? parseInt(line1[1]) : null; // Number of lines for pointers (PTRCRD)
            var tLinesRowIndices = line1[2] !== undefined && line1[2] !== null ? parseInt(line1[2]) : null; // Number of lines for row (or letiable) indices (INDCRD)
            var tLinesValues = line1[3] !== undefined && line1[3] !== null ? parseInt(line1[3]) : null; // Number of lines for numerical values (VALCRD)
            var tLinesRH = line1[4] !== undefined && line1[4] !== null ? parseInt(line1[4]) : null; // Number of lines for right-hand sides (RHSCRD)
            console.log(line1);

            var line2 = lines[2].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var matType = line2[0] !== undefined && line2[0] !== null ? line2[0] : null; // Matrix type (see below) (MXTYPE)
            var rowCount = line2[1] !== undefined && line2[1] !== null ? parseInt(line2[1]) : null; // Number of rows (or variables) (NROW)
            var colCount = line2[2] !== undefined && line2[2] !== null ? parseInt(line2[2]) : null; // Number of columns (or elements) (NCOL)
            var rowIndCount = line2[3] !== undefined && line2[3] !== null ? parseInt(line2[3]) : null; // Number of row (or variable) indices (NNZERO)		(equal to number of entries for assembled matrices)
            var matEntCount = line2[4] !== undefined && line2[4] !== null ? parseInt(line2[4]) : null; // Number of elemental matrix entries (NELTVL)		(zero in the case of assembled matrices)
            console.log(line2);

            var line3 = lines[3].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var pointerFormat = line3[0] !== undefined && line3[0] !== null ? line3[0] : null; // Format for pointers (PTRFMT)
            var rowIndFormat = line3[1] !== undefined && line3[1] !== null ? line3[1] : null; // Format for row (or variable) indices (INDFMT)
            var valuesFormat = line3[2] !== undefined && line3[2] !== null ? line3[2] : null; // Format for numerical values of coefficient matrix (VALFMT)
            var RHFormat = line3[3] !== undefined && line3[3] !== null ? line3[3] : null; // Format for numerical values of right-hand sides (RHSFMT)
            console.log(line3);

            var offs = 1000 / 2;
            for (var _n2 = 0; _n2 < rowCount; _n2++) {
                var pos = [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];

                var bd = jsonIn.generateBornAndDieDates !== undefined && jsonIn.generateBornAndDieDates !== null && jsonIn.generateBornAndDieDates === true ? { "bornDate": "RANDOM", "dieDate": "RANDOM" } : { "bornDate": 1.0, "dieDate": 0.0 };

                var node = this.addNode({
                    "name": _n2.toString(),
                    "data": _n2.toString(),
                    "label": _n2.toString(),
                    "position": pos,
                    "color": this._enableNeuronalNetwork === false ? "../_RESOURCES/UV.jpg" : "../_RESOURCES/white.jpg",
                    "bornDate": bd.bornDate,
                    "dieDate": bd.dieDate,
                    "layoutNodeArgumentData": {
                        // dir
                        "ndirect": [0.0, 0.0, 0.0, 1.0],
                        // pp
                        "particlePolarity": 0.0,
                        // destination
                        "dest": [0.0, 0.0, 0.0, 0.0],
                        // lifeDistance
                        "initPos": pos, "initDir": [0.0, 0.0, 0.0, 0.0],
                        // nodeColor
                        "nodeColor": [1.0, 1.0, 1.0, 1.0],
                        // lock
                        "nodeLock": 0.0 },
                    "onmouseup": function onmouseup(nodeData) {} });
            }

            var startValues = 4;
            var str = "";
            for (var _n3 = startValues; _n3 < startValues + tLinesPointers; _n3++) {
                str += lines[_n3];
            }
            //console.log(str);
            var pointers = str.replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            console.log(pointers);

            str = "";
            for (var _n4 = startValues + tLinesPointers; _n4 < startValues + tLinesPointers + tLinesRowIndices; _n4++) {
                str += lines[_n4];
            }
            //console.log(str);
            var rowIndices = str.replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            console.log(rowIndices);

            var yy = 0;
            for (var _n5 = 0, fn = pointers.length; _n5 < fn; _n5++) {
                var pointer = parseInt(pointers[_n5]) - 1;
                var nextPointer = parseInt(pointers[_n5 + 1]) - 1;

                for (var nb = 0, fnb = nextPointer - pointer; nb < fnb; nb++) {
                    var xx = parseInt(rowIndices[pointer + nb]) - 1;

                    var _bd = jsonIn.generateBornAndDieDates !== undefined && jsonIn.generateBornAndDieDates !== null && jsonIn.generateBornAndDieDates === true ? { "bornDate": "RANDOM", "dieDate": "RANDOM" } : { "bornDate": 1.0, "dieDate": 0.0 };
                    var w = jsonIn.randomLinkWeights !== undefined && jsonIn.randomLinkWeights !== null && jsonIn.randomLinkWeights === true ? "RANDOM" : null;

                    this.addLink({ "origin": xx.toString(),
                        "target": yy.toString(),
                        "directed": true,
                        "bornDate": _bd.bornDate,
                        "dieDate": _bd.dieDate,
                        "weight": w });
                }

                yy++;
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            var removeBuffers = function removeBuffers(comp) {
                var args = comp.gpufG.getAllArgs();
                for (var key in args) {
                    if (args[key] instanceof WebCLGLBuffer === true && key !== "RGB") args[key].remove();
                }
            };
            removeBuffers(this.comp_renderer_nodes);
            for (var na = 0; na < this.linksObj.length; na++) {
                removeBuffers(this.linksObj[na].componentRenderer);
            }for (var _na = 0; _na < this.arrowsObj.length; _na++) {
                removeBuffers(this.arrowsObj[_na].componentRenderer);
            }if (this._enableFont === true) removeBuffers(this.comp_renderer_nodesText);

            this._project.getActiveStage().removeNode(this.nodes);
            for (var _na2 = 0; _na2 < this.linksObj.length; _na2++) {
                this._project.getActiveStage().removeNode(this.linksObj[_na2].node);
            }for (var _na3 = 0; _na3 < this.arrowsObj.length; _na3++) {
                this._project.getActiveStage().removeNode(this.arrowsObj[_na3].node);
            }this._project.getActiveStage().removeNode(this.nodesText);
        }
    }, {
        key: "applyLayout",


        // ██████╗ ██████╗ ██╗   ██╗███████╗ ██████╗ ██████╗
        //██╔════╝ ██╔══██╗██║   ██║██╔════╝██╔═══██╗██╔══██╗
        //██║  ███╗██████╔╝██║   ██║█████╗  ██║   ██║██████╔╝
        //██║   ██║██╔═══╝ ██║   ██║██╔══╝  ██║   ██║██╔══██╗
        //╚██████╔╝██║     ╚██████╔╝██║     ╚██████╔╝██║  ██║
        // ╚═════╝ ╚═╝      ╚═════╝ ╚═╝      ╚═════╝ ╚═╝  ╚═╝
        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argsDirection - example "float4* argA, float* argB, mat4 argC, float4 argD, float argE"
         * @param {String} jsonIn.codeDirection
         * @param {String} jsonIn.argsObject - example "float4* argA, float* argB, mat4 argC, float4 argD, float argE"
         * @param {String} jsonIn.codeObject
         */
        value: function applyLayout(jsonIn) {
            this.layout = jsonIn;
            // Create custom user arrays args
            var createCustomArgsArrays = function createCustomArgsArrays(obj, arr) {
                for (var _n6 = 0, fn = arr.length; _n6 < fn; _n6++) {
                    obj[arr[_n6].trim().split(" ")[1]] = { "arg": arr[_n6].trim(),
                        "nodes_array_value": [],
                        "links_array_value": [],
                        "arrows_array_value": [],
                        "nodestext_array_value": [] };
                }
                return obj;
            };

            this.layout.argsDirection = this.layout.argsDirection !== undefined && this.layout.argsDirection !== null ? this.layout.argsDirection.split(",") : null;
            this.layout.argsObject = this.layout.argsObject !== undefined && this.layout.argsObject !== null ? this.layout.argsObject.split(",") : null;

            this._customArgs = {};
            if (this.layout.argsDirection != null) this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsDirection);

            if (this.layout.argsObject != null) this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsObject);
        }
    }, {
        key: "createWebGLBuffers",
        value: function createWebGLBuffers() {
            var _this6 = this;

            var varDef_VFPNode = {
                'float4* posXYZW': function float4PosXYZW() {
                    return null;
                },
                "float4* dataB": function float4DataB() {
                    return null;
                }, // in nodes (SHARED with LINKS, ARROWS & NODESTEXT)
                "float4* dataF": function float4DataF() {
                    return null;
                }, // in nodes
                "float4* dataG": function float4DataG() {
                    return null;
                }, // in nodes
                "float4* dataH": function float4DataH() {
                    return null;
                }, // in nodes
                "float4*attr data": function float4AttrData() {
                    return null;
                }, // in nodes, nodesText, links & arrows
                "float4*attr dataC": function float4AttrDataC() {
                    return null;
                }, // in links & arrows
                'float4*attr nodeVertexPos': function float4AttrNodeVertexPos() {
                    return null;
                },
                'float4*attr nodeVertexNormal': function float4AttrNodeVertexNormal() {
                    return null;
                },
                'float4*attr nodeVertexTexture': function float4AttrNodeVertexTexture() {
                    return null;
                },
                'float*attr letterId': function floatAttrLetterId() {
                    return null;
                },
                'float*attr nodeImgId': function floatAttrNodeImgId() {
                    return null;
                },
                'indices': function indices() {
                    return null;
                },
                "float4* adjacencyMatrix": function float4AdjacencyMatrix() {
                    return null;
                },
                "float4* adjacencyMatrixB": function float4AdjacencyMatrixB() {
                    return null;
                },
                "float4* adjacencyMatrixC": function float4AdjacencyMatrixC() {
                    return null;
                },
                "float widthAdjMatrix": function floatWidthAdjMatrix() {
                    return null;
                },
                'float nodesCount': function floatNodesCount() {
                    return null;
                },
                "float currentTimestamp": function floatCurrentTimestamp() {
                    return null;
                },
                'mat4 PMatrix': function mat4PMatrix() {
                    return null;
                },
                'mat4 cameraWMatrix': function mat4CameraWMatrix() {
                    return null;
                },
                'mat4 nodeWMatrix': function mat4NodeWMatrix() {
                    return null;
                },
                'float isNode': function floatIsNode() {
                    return null;
                },
                'float isLink': function floatIsLink() {
                    return null;
                },
                'float isArrow': function floatIsArrow() {
                    return null;
                },
                'float isNodeText': function floatIsNodeText() {
                    return null;
                },
                'float bufferNodesWidth': function floatBufferNodesWidth() {
                    return null;
                },
                'float bufferLinksWidth': function floatBufferLinksWidth() {
                    return null;
                },
                'float bufferArrowsWidth': function floatBufferArrowsWidth() {
                    return null;
                },
                'float bufferTextsWidth': function floatBufferTextsWidth() {
                    return null;
                },
                'float idToDrag': function floatIdToDrag() {
                    return null;
                },
                'float idToHover': function floatIdToHover() {
                    return null;
                },
                "float enableForceLayout": function floatEnableForceLayout() {
                    return null;
                },
                'float enableForceLayoutCollision': function floatEnableForceLayoutCollision() {
                    return null;
                },
                'float enableNeuronalNetwork': function floatEnableNeuronalNetwork() {
                    return null;
                },
                'float afferentNodesCount': function floatAfferentNodesCount() {
                    return null;
                },
                'float efferentNodesCount': function floatEfferentNodesCount() {
                    return null;
                },
                'float efferentStart': function floatEfferentStart() {
                    return null;
                },
                'float currentTrainLayer': function floatCurrentTrainLayer() {
                    return null;
                },
                'float multiplyOutput': function floatMultiplyOutput() {
                    return null;
                },
                'float only2d': function floatOnly2d() {
                    return null;
                },
                'float nodeImgColumns': function floatNodeImgColumns() {
                    return null;
                },
                'float fontImgColumns': function floatFontImgColumns() {
                    return null;
                },
                'float4* fontsImg': function float4FontsImg() {
                    return null;
                },
                'float4* nodesImg': function float4NodesImg() {
                    return null;
                },
                'float4* nodesImgCrosshair': function float4NodesImgCrosshair() {
                    return null;
                }
            };
            var aC = this.afferentNodesCount === 0 ? 1 : this.afferentNodesCount;
            var eC = this.efferentNodesCount === 0 ? 1 : this.efferentNodesCount;
            varDef_VFPNode['float afferentNodesA[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesA[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesB[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesB[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesC[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesC[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesD[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesD[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesE[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesE[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesF[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesF[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesG[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesG[' + eC + ']'] = function () {
                return null;
            };

            if (this.layout.argsDirection !== undefined && this.layout.argsDirection !== null) {
                for (var _n7 = 0; _n7 < this.layout.argsDirection.length; _n7++) {
                    varDef_VFPNode[this.layout.argsDirection[_n7]] = function () {
                        return null;
                    };
                }
            }

            if (this.layout.argsObject !== undefined && this.layout.argsObject !== null) {
                for (var _n8 = 0; _n8 < this.layout.argsObject.length; _n8++) {
                    varDef_VFPNode[this.layout.argsObject[_n8]] = function () {
                        return null;
                    };
                }
            }

            var varDef_NodesKernel = {
                'float4* dir': function float4Dir() {
                    return null;
                },
                'float nodesCount': function floatNodesCount() {
                    return null;
                },
                'float enableDrag': function floatEnableDrag() {
                    return null;
                },
                'float initialPosX': function floatInitialPosX() {
                    return null;
                },
                'float initialPosY': function floatInitialPosY() {
                    return null;
                },
                'float initialPosZ': function floatInitialPosZ() {
                    return null;
                },
                'float MouseDragTranslationX': function floatMouseDragTranslationX() {
                    return null;
                },
                'float MouseDragTranslationY': function floatMouseDragTranslationY() {
                    return null;
                },
                'float MouseDragTranslationZ': function floatMouseDragTranslationZ() {
                    return null;
                } };

            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          LINKS
            ///////////////////////////////////////////////////////////////////////////////////////////
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setGPUFor(this.linksObj[na].componentRenderer.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "LINKS_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 1,
                    "depthTest": true,
                    "blend": false,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.ONE,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.linksObj[na].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          ARROWS
            ///////////////////////////////////////////////////////////////////////////////////////////
            for (var _na4 = 0; _na4 < this.arrowsObj.length; _na4++) {
                this.arrowsObj[_na4].componentRenderer.setGPUFor(this.arrowsObj[_na4].componentRenderer.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "ARROWS_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 4,
                    "depthTest": true,
                    "blend": true,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.arrowsObj[_na4].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          NODES
            ///////////////////////////////////////////////////////////////////////////////////////////
            // NODES= nodeId, acums, bornDate, dieDate // LINKS & ARROWS= nodeId origin, nodeId target, currentLineVertex, repeatId
            // bornDate, dieDate, 0.0, 0.0 (NODES share TO LINKS & ARROWS)

            var nodesVarDef = Object.create(varDef_VFPNode);
            for (var key in varDef_NodesKernel) {
                nodesVarDef[key] = varDef_NodesKernel[key];
            }this.comp_renderer_nodes.setGPUFor(this.comp_renderer_nodes.gl, nodesVarDef, { "type": "KERNEL",
                "name": "NODES_KERNEL_DIR",
                "viewSource": false,
                "config": _KERNEL_DIR.KERNEL_DIR.getSrc(this.layout.codeDirection, this._geometryLength, this.currentNodeId - this.efferentNodesCount, this.efferentNodesCount, this._enableNeuronalNetwork),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": false,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ONE }, { "type": "KERNEL",
                "name": "NODES_KERNEL_ADJMATRIX_UPDATE",
                "viewSource": false,
                "config": _KERNEL_ADJMATRIX_UPDATE.KERNEL_ADJMATRIX_UPDATE.getSrc(this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": false,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ONE }, { "type": "GRAPHIC",
                "name": "NODES_VFP_NODE",
                "viewSource": false,
                "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": true,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA }, { "type": "GRAPHIC",
                "name": "NODES_VFP_NODEPICKDRAG",
                "viewSource": false,
                "config": _VFP_NODEPICKDRAG.VFP_NODEPICKDRAG.getSrc(this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": true,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ZERO });
            var comp_screenEffects = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU);
            this.comp_renderer_nodes.getComponentBufferArg("RGB", comp_screenEffects);

            // KERNEL_DIR
            this.comp_renderer_nodes.gpufG.onPreProcessKernel(0, function () {
                var currentTimestamp = _this6._initTimestamp + _this6._currentFrame * _this6._timeFrameIncrement;
                _this6.comp_renderer_nodes.setArg("currentTimestamp", function (ts) {
                    return ts;
                }.bind(_this6, currentTimestamp));
                for (var _na5 = 0; _na5 < _this6.linksObj.length; _na5++) {
                    _this6.linksObj[_na5].componentRenderer.setArg("currentTimestamp", function (ts) {
                        return ts;
                    }.bind(_this6, currentTimestamp));
                }for (var _na6 = 0; _na6 < _this6.arrowsObj.length; _na6++) {
                    _this6.arrowsObj[_na6].componentRenderer.setArg("currentTimestamp", function (ts) {
                        return ts;
                    }.bind(_this6, currentTimestamp));
                }if (_this6._playAnimation === true) {
                    _this6._currentFrame++;
                    if (_this6._onAnimationStep !== undefined && _this6._onAnimationStep !== null) _this6._onAnimationStep(_this6._currentFrame);

                    if (_this6._currentFrame === _this6._animationFrames) {
                        _this6._currentFrame = 0;
                        if (_this6._loop === false) {
                            _this6.pauseTimeline();
                            if (_this6._onAnimationEnd !== undefined && _this6._onAnimationEnd !== null) _this6._onAnimationEnd();
                        }
                    }
                    //console.log(currentTimestamp+"  "+this._currentFrame);
                }

                _this6.comp_renderer_nodes.setArg("enableNeuronalNetwork", function () {
                    return _this6._enableNeuronalNetwork;
                });
                for (var _na7 = 0; _na7 < _this6.linksObj.length; _na7++) {
                    _this6.linksObj[_na7].componentRenderer.setArg("enableNeuronalNetwork", function () {
                        return _this6._enableNeuronalNetwork;
                    });
                }for (var _na8 = 0; _na8 < _this6.arrowsObj.length; _na8++) {
                    _this6.arrowsObj[_na8].componentRenderer.setArg("enableNeuronalNetwork", function () {
                        return _this6._enableNeuronalNetwork;
                    });
                }_this6.comp_renderer_nodes.setArg("only2d", function () {
                    return _this6._only2d === true ? 1.0 : 0.0;
                });
            });
            this.comp_renderer_nodes.gpufG.onPostProcessKernel(0, function () {});

            // KERNEL_ADJMATRIX_UPDATE
            this.comp_renderer_nodes.gpufG.onPreProcessKernel(1, function () {});
            this.comp_renderer_nodes.gpufG.onPostProcessKernel(1, function () {});
            this.comp_renderer_nodes.gpufG.disableKernel(1);

            // VFP_NODE
            this.comp_renderer_nodes.gpufG.onPreProcessGraphic(0, function () {});
            this.comp_renderer_nodes.gpufG.onPostProcessGraphic(0, function () {});

            // VFP_NODEPICKDRAG
            this.comp_renderer_nodes.gpufG.onPreProcessGraphic(1, function () {
                //this.comp_renderer_nodes.gl.clear(this.comp_renderer_nodes.gl.COLOR_BUFFER_BIT | this.comp_renderer_nodes.gl.DEPTH_BUFFER_BIT);
            });
            this.comp_renderer_nodes.gpufG.onPostProcessGraphic(1, function () {
                _this6.procSelectedOrHover();
            });

            this.comp_renderer_nodes.gpufG.disableGraphic(1);

            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          NODESTEXT
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setGPUFor(this.comp_renderer_nodesText.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "NODESTEXT_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 4,
                    "depthTest": true,
                    "blend": true,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.comp_renderer_nodesText.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }

            this.enableHov(-1);

            this.updateNodes();
            this.updateLinks();
        }
    }, {
        key: "mouseDown",
        value: function mouseDown() {
            if (this._enableHover === false) {
                this.readPixel = true;

                this.comp_renderer_nodes.gpufG.enableGraphic(1);
            }
        }
    }, {
        key: "mouseUp",
        value: function mouseUp() {
            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
            }for (var _na9 = 0; _na9 < this.arrowsObj.length; _na9++) {
                this.arrowsObj[_na9].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
            }if (this._enableFont === true) this.comp_renderer_nodesText.setArg("enableDrag", function () {
                return 0;
            });

            if (this.selectedId === -1) {
                this.comp_renderer_nodes.setArg("idToDrag", function () {
                    return -1;
                });
                for (var _na10 = 0; _na10 < this.linksObj.length; _na10++) {
                    this.linksObj[_na10].componentRenderer.setArg("idToDrag", function () {
                        return -1;
                    });
                }for (var _na11 = 0; _na11 < this.arrowsObj.length; _na11++) {
                    this.arrowsObj[_na11].componentRenderer.setArg("idToDrag", function () {
                        return -1;
                    });
                }if (this._enableFont === true) this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return -1;
                });
            }

            if (this._enableHover === true) {
                this.readPixel = true;

                this.comp_renderer_nodes.gpufG.enableGraphic(1);
            }
        }
    }, {
        key: "procSelectedOrHover",
        value: function procSelectedOrHover() {
            if (this._enableHover === false) {
                if (this.readPixel === true) {
                    this.readPixel = false;

                    this.readPix();

                    this.comp_renderer_nodes.gpufG.disableGraphic(1);
                }
            } else {
                var comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.readPixel = false;
                }

                this.readPix();

                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.comp_renderer_nodes.gpufG.disableGraphic(1);
                }
            }
        }
    }, {
        key: "readPix",
        value: function readPix() {
            var arrayPick = new Uint8Array(4);
            var mousePos = this._sce.getEvents().getMousePosition();
            this._gl.readPixels(mousePos.x, this._sce.getCanvas().height - mousePos.y, 1, 1, this._gl.RGBA, this._gl.UNSIGNED_BYTE, arrayPick);

            var unpackValue = this._utils.unpack([arrayPick[0] / 255, arrayPick[1] / 255, arrayPick[2] / 255, arrayPick[3] / 255]); // value from 0.0 to 1.0
            this.selectedId = Math.round(unpackValue * 1000000.0) - 1.0;
            //console.log("hoverId: "+this.selectedId);
            if (this.selectedId !== -1 && this.selectedId < this.currentNodeId) {
                var node = this._nodesById[this.selectedId];
                if (node !== undefined && node !== null && node.onmousedown !== undefined && node.onmousedown !== null) node.onmousedown(node);

                if (node !== undefined && node !== null && this._onClickNode !== undefined && this._onClickNode !== null) this._onClickNode(node);

                var arr4Uint8_XYZW = this.comp_renderer_nodes.gpufG.readArg("posXYZW");
                var x = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4];
                var y = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4 + 1];
                var z = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4 + 2];
                this._initialPosDrag = $V3([x, y, z]);

                this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
            }
        }
    }, {
        key: "makeDrag",


        /**
         * @param {MouseEvent} [evt]
         * @param {StormV3} dir
         */
        value: function makeDrag(evt, dir) {
            var comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);

            if (this._enableHover === false) {
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    if (this.selectedId === -1) this.disableDrag();else {
                        this.enableDrag(this.selectedId, dir);
                        console.log("selectedId: " + this.selectedId);
                    }
                }
            } else {
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.enableHov(-1);

                    if (this.selectedId === -1) this.disableDrag();else {
                        this.enableDrag(this.selectedId, dir);
                        console.log("selectedId: " + this.selectedId);
                    }
                } else {
                    this.enableHov(this.selectedId);
                }
            }
        }
    }, {
        key: "enableHov",


        /**
         * @param {int} selectedId
         */
        value: function enableHov(selectedId) {
            this.comp_renderer_nodes.setArg("idToHover", function () {
                return selectedId;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("idToHover", function () {
                    return selectedId;
                });
            }for (var _na12 = 0; _na12 < this.arrowsObj.length; _na12++) {
                this.arrowsObj[_na12].componentRenderer.setArg("idToHover", function () {
                    return selectedId;
                });
            }if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("idToHover", function () {
                    return selectedId;
                });
            }
        }
    }, {
        key: "enableDrag",


        /**
         * @param {int} selectedId
         * @param {StormV3} dir
         */
        value: function enableDrag(selectedId, dir) {
            var _this7 = this;

            var comp_projection = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION);
            var finalPos = this._initialPosDrag.add(dir.x(comp_projection.getFov() * 2.0 / this._sce.getCanvas().width));

            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 1;
            });
            this.comp_renderer_nodes.setArg("idToDrag", function () {
                return selectedId;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationX", function () {
                return finalPos.e[0];
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationY", function () {
                return finalPos.e[1];
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationZ", function () {
                return finalPos.e[2];
            });
            this.comp_renderer_nodes.setArg("initialPosX", function () {
                return _this7._initialPosDrag.e[0];
            });
            this.comp_renderer_nodes.setArg("initialPosY", function () {
                return _this7._initialPosDrag.e[1];
            });
            this.comp_renderer_nodes.setArg("initialPosZ", function () {
                return _this7._initialPosDrag.e[2];
            });

            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 1;
                });
                this.linksObj[na].componentRenderer.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }

            for (var _na13 = 0; _na13 < this.arrowsObj.length; _na13++) {
                this.arrowsObj[_na13].componentRenderer.setArg("enableDrag", function () {
                    return 1;
                });
                this.arrowsObj[_na13].componentRenderer.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }

            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("enableDrag", function () {
                    return 1;
                });
                this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.comp_renderer_nodesText.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.comp_renderer_nodesText.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.comp_renderer_nodesText.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }
        }
    }, {
        key: "disableDrag",


        /**
         * disableDrag
         */
        value: function disableDrag() {
            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("idToDrag", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationX", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationY", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationZ", function () {
                return 0;
            });

            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("idToDrag", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }

            for (var _na14 = 0; _na14 < this.arrowsObj.length; _na14++) {
                this.arrowsObj[_na14].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("idToDrag", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }

            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("enableDrag", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }
        }
    }, {
        key: "enableNeuronalNetwork",
        value: function enableNeuronalNetwork() {
            this._enableNeuronalNetwork = true;

            this.disableAutoLink();

            // APPLY THIS LAYOUT
            this.applyLayout({
                // DIRECTION
                "argsDirection":
                // destination
                "float4* dest,float* enableDestination",
                "codeDirection":
                // destination
                "if(enableDestination[x] == 1.0) {\n                    vec3 destinationPos = dest[x].xyz;\n                    vec3 dirDestination = normalize(destinationPos-currentPos);\n                    float distan = abs(distance(currentPos,destinationPos));\n                    float dirDestWeight = sqrt(distan);\n                    currentDir = (currentDir+(dirDestination*dirDestWeight))*dirDestWeight*0.1;\n                }",

                // OBJECT
                "argsObject":
                // nodeColor
                "float4*attr nodeColor",
                "codeObject":
                // nodeColor
                //'if(isNode == 1.0) nodeVertexColor = nodeColor[x];'+
                //'if(isLink == 1.0 && currentLineVertex == 1.0) nodeVertexColor = vec4(0.0, 1.0, 0.0, 1.0);'+ // this is isTarget for arrows

                //'float degr = (currentLineVertex/vertexCount)/2.0;'+
                //'if(isLink == 1.0) nodeVertexColor = vec4(0.3, 0.2, 0.2, 1.0);'+ // this is isTarget for arrows
                'if(isArrow == 1.0 && currentLineVertex == 1.0) nodeVertexColor = vec4(0.3, 0.2, 0.2, 1.0);' + // this is isTarget for arrows
                'if(isArrow == 1.0 && currentLineVertex == 0.0) nodeVertexColor = vec4(1.0, 0.0, 0.0, 0.0);' // this is isTarget for arrows

            });
        }
    }, {
        key: "disableNeuronalNetwork",
        value: function disableNeuronalNetwork() {
            this._enableNeuronalNetwork = false;
        }
    }, {
        key: "addNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addNeuron(neuronName, destination) {
            var offs = 1000;
            var pos = [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];
            var dest = destination !== undefined && destination !== null ? destination : [0.0, 0.0, 0.0, 1.0];
            var enableDest = destination !== undefined && destination !== null ? 1.0 : 0.0;

            this.addNode({
                "name": neuronName,
                "data": neuronName,
                "label": neuronName.toString(),
                "position": pos,
                "color": "../_RESOURCES/white.jpg",
                "layoutNodeArgumentData": {
                    "nodeColor": [1.0, 1.0, 1.0, 1.0],
                    "enableDestination": enableDest,
                    "dest": dest
                },
                "onmouseup": function onmouseup(nodeData) {} });
        }
    }, {
        key: "addAfferentNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addAfferentNeuron(neuronName, destination) {
            this.afferentNeuron.push(neuronName);
            this.addNeuron(neuronName, destination);
        }
    }, {
        key: "addEfferentNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addEfferentNeuron(neuronName, destination) {
            this.efferentNeuron.push(neuronName);
            this.addNeuron(neuronName, destination);
        }
    }, {
        key: "createNeuronLayer",
        value: function createNeuronLayer(numX, numY, pos, nodSep) {
            var arr = [];
            for (var x = 0; x < numX; x++) {
                for (var y = 0; y < numY; y++) {
                    var position = [pos[0] + (x - numX / 2) * nodSep, pos[1], pos[2] + (y - numY / 2) * nodSep, pos[3]];

                    this.addNeuron(this.currHiddenNeuron.toString(), position);
                    arr.push(this.currHiddenNeuron);
                    this.currHiddenNeuron++;
                }
            }

            return arr;
        }
    }, {
        key: "createXYNeuronsFromImage",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuron
         * @param {Array<number>} jsonIn.position
         * @param {int} jsonIn.w
         * @param {int} jsonIn.h
         */
        value: function createXYNeuronsFromImage(jsonIn) {
            var arr = [];
            for (var x = 0; x < jsonIn.w; x++) {
                for (var y = 0; y < jsonIn.h; y++) {
                    var position = [jsonIn.position[0] + (y - jsonIn.w / 2) * this.nodSep, jsonIn.position[1], jsonIn.position[2] + (x - jsonIn.h / 2) * this.nodSep, jsonIn.position[3]];

                    this.addNeuron(jsonIn.neuron + x + "_" + y, position);
                    arr.push(jsonIn.neuron + x + "_" + y);
                }
            }

            return arr;
        }
    }, {
        key: "createConvXYNeuronsFromXYNeurons",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} jsonIn.position
         * @param {int} jsonIn.w
         * @param {int} jsonIn.h
         * @param {String} jsonIn.idOrigin
         * @param {String} jsonIn.idTarget
         * @param {int} jsonIn.activationFunc
         * @param {Array<number>} jsonIn.convMatrix
         */
        value: function createConvXYNeuronsFromXYNeurons(jsonIn) {
            var arr = [];
            for (var x = 0; x < jsonIn.w - 2; x++) {
                for (var y = 0; y < jsonIn.h - 2; y++) {
                    var position = [jsonIn.position[0] + (y - jsonIn.w / 2) * this.nodSep, jsonIn.position[1], jsonIn.position[2] + (x - jsonIn.h / 2) * this.nodSep, jsonIn.position[3]];

                    this.addNeuron(jsonIn.idTarget + x + "_" + y, position);
                    arr.push(jsonIn.idTarget + x + "_" + y);

                    var idConvM = 0;
                    for (var xa = x; xa < x + 3; xa++) {
                        for (var ya = y; ya < y + 3; ya++) {
                            this.addSinapsis({ "neuronNameA": jsonIn.idOrigin + xa + "_" + ya,
                                "neuronNameB": jsonIn.idTarget + x + "_" + y,
                                "activationFunc": jsonIn.activationFunc,
                                "multiplier": jsonIn.convMatrix[idConvM],
                                "layerNum": 0 }); //TODO layerNum
                            idConvM++;
                        }
                    }
                }
            }

            return arr;
        }
    }, {
        key: "addSinapsis",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuronNameA
         * @param {String} jsonIn.neuronNameB
         * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
         * @param {number} [jsonIn.weight]
         * @param {number} [jsonIn.multiplier=1.0]
         * @param {int} jsonIn.layerNum
         */
        value: function addSinapsis(jsonIn) {
            var _this8 = this;

            var gaussRandom = function gaussRandom() {
                if (_this8.return_v === true) {
                    _this8.return_v = false;
                    return _this8.v_val;
                }
                var u = 2 * Math.random() - 1;
                var v = 2 * Math.random() - 1;
                var r = u * u + v * v;
                if (r === 0 || r > 1) return gaussRandom();
                var c = Math.sqrt(-2 * Math.log(r) / r);
                _this8.v_val = v * c; // cache this
                _this8.return_v = true;
                return u * c;
            };
            var randn = function randn(mu, std) {
                return mu + gaussRandom() * std;
            };

            var scale = Math.sqrt(1.0 / 50);

            var _activationFunc = jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null ? jsonIn.activationFunc : 1.0;
            var _weight = jsonIn.weight !== undefined && jsonIn.weight !== null ? jsonIn.weight : randn(0.0, scale);
            var _linkMultiplier = jsonIn.multiplier !== undefined && jsonIn.multiplier !== null ? jsonIn.multiplier : 1.0;

            this.addLink({
                "origin": jsonIn.neuronNameA,
                "target": jsonIn.neuronNameB,
                "directed": true,
                "showArrow": false,
                "activationFunc": _activationFunc,
                "weight": _weight,
                "linkMultiplier": _linkMultiplier,
                "layerNum": jsonIn.layerNum });
        }
    }, {
        key: "connectNeuronWithNeuronLayer",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuron
         * @param {Array<int>} jsonIn.neuronLayer
         * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
         * @param {number|null} [jsonIn.weight]
         * @param {number} [jsonIn.multiplier=1.0]
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronWithNeuronLayer(jsonIn) {
            for (var _n9 = 0; _n9 < jsonIn.neuronLayer.length; _n9++) {
                this.addSinapsis({ "neuronNameA": jsonIn.neuron.toString(),
                    "neuronNameB": jsonIn.neuronLayer[_n9].toString(),
                    "activationFunc": jsonIn.activationFunc,
                    "weight": jsonIn.weight,
                    "multiplier": jsonIn.multiplier,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "connectNeuronLayerWithNeuron",


        /**
         * @param {Object} jsonIn
         * @param {Array<int>} jsonIn.neuronLayer
         * @param {String} jsonIn.neuron
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronLayerWithNeuron(jsonIn) {
            for (var _n10 = 0; _n10 < jsonIn.neuronLayer.length; _n10++) {
                this.addSinapsis({ "neuronNameA": jsonIn.neuronLayer[_n10].toString(),
                    "neuronNameB": jsonIn.neuron,
                    "activationFunc": 1.0,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "connectNeuronLayerWithNeuronLayer",


        /**
         * @param {Object} jsonIn
         * @param {Array<int>} jsonIn.neuronLayerOrigin
         * @param {Array<int>} jsonIn.neuronLayerTarget
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronLayerWithNeuronLayer(jsonIn) {
            for (var _n11 = 0; _n11 < jsonIn.neuronLayerOrigin.length; _n11++) {
                var neuronOrigin = jsonIn.neuronLayerOrigin[_n11];
                this.connectNeuronWithNeuronLayer({ "neuron": neuronOrigin.toString(),
                    "neuronLayer": jsonIn.neuronLayerTarget,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "forward",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} jsonIn.state
         * @param {Function} jsonIn.onAction
         */
        value: function forward(jsonIn) {
            var _this9 = this;

            this.onAction = jsonIn.onAction;

            var state = jsonIn.state.slice(0);
            var length = jsonIn.state.length;
            for (var _n12 = length; _n12 < this.afferentNodesCount; _n12++) {
                state[_n12] = 0.0;
            }var lett = ["A", "B", "C", "D", "E", "F", "G"];
            var currLett = 0;

            var _loop = function _loop(i, j) {
                _this9.comp_renderer_nodes.setArg("afferentNodes" + lett[currLett++], function () {
                    return state.slice(i, i + _this9.afferentNodesCount);
                });
            };

            for (var i = 0, j = state.length; i < j; i += this.afferentNodesCount) {
                _loop(i, j);
            }for (var _n13 = 0; _n13 < this.layerCount; _n13++) {
                this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);
            }this._sce.getLoadedProject().getActiveStage().tick();

            if (this.onAction !== null) {
                var loc = [["dataB", 2], ["dataF", 0], ["dataF", 2], ["dataG", 0], ["dataG", 2], ["dataH", 0], ["dataH", 2]];
                var o = [[]];
                var currO = 0;
                for (var _n14 = 0; _n14 < this.efferentNodesCount * this.batch_size; _n14++) {
                    if (o[currO].length === this.efferentNodesCount) {
                        o.push([]);
                        currO++;
                    }

                    var u = this.getNeuronOutput(this.efferentNeuron[o[currO].length], loc[currO]);
                    if (isNaN(u[2]) === true) debugger;
                    o[currO].push({ "output": u[loc[currO][1]] });
                }
                this.onAction(o);
            }
        }
    }, {
        key: "train",


        /**
         * @param {Object} jsonIn
         * @param {Object} jsonIn.arrReward
         * @param {Function} jsonIn.onTrained
         */
        value: function train(jsonIn) {
            var _this10 = this;

            this.onTrained = jsonIn.onTrained;

            var reward = jsonIn.arrReward.slice(0);
            var length = jsonIn.arrReward.length;
            for (var _n15 = length; _n15 < this.efferentNodesCount * this.batch_size; _n15++) {
                reward[_n15] = 0.0;
            }var lett = ["A", "B", "C", "D", "E", "F", "G"];
            var currLett = 0;

            var _loop2 = function _loop2(i, j) {
                _this10.comp_renderer_nodes.setArg("efferentNodes" + lett[currLett++], function () {
                    return reward.slice(i, i + _this10.efferentNodesCount);
                });
            };

            for (var i = 0, j = reward.length; i < j; i += this.efferentNodesCount) {
                _loop2(i, j);
            }for (var _n16 = 0; _n16 < this.layerCount - 1; _n16++) {
                this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);
            } //this.comp_renderer_nodes.gpufG.disableKernel(0);
            this.comp_renderer_nodes.gpufG.enableKernel(1);
            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return 10;
            });
            this._sce.getLoadedProject().getActiveStage().tick();
            //this.comp_renderer_nodes.tick();
            //this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[1], true, true);
            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return -3;
            });
            this.comp_renderer_nodes.gpufG.disableKernel(1);
            //this.comp_renderer_nodes.gpufG.enableKernel(0);

            if (this.onTrained !== null) {
                var o = [];
                for (var _n17 = 0; _n17 < this.efferentNodesCount; _n17++) {
                    /*let u = this.getNeuronOutput(this.efferentNeuron[n]);
                    if(isNaN(u[2]) === true || isNaN(u[3]) === true)
                        debugger;
                    o.push({"output": u[2], "error": u[3]});*/
                }
                this.onTrained(o);
            }
        }
    }, {
        key: "getNeuronOutput",
        value: function getNeuronOutput(neuronName, loc) {
            var arr4Uint8_XYZW = this.comp_renderer_nodes.gpufG.readArg(loc[0]);

            var n = this._nodesByName[neuronName].itemStart * 4;
            return [arr4Uint8_XYZW[n], arr4Uint8_XYZW[n + 1], arr4Uint8_XYZW[n + 2], arr4Uint8_XYZW[n + 3]];
        }
    }, {
        key: "setLayoutArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argName
         * @param {number|Array<number>} jsonIn.value [number, number, number, number]
         */
        value: function setLayoutArgumentData(jsonIn) {
            this._customArgs[jsonIn.argName]["nodes_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["links_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["arrows_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["nodestext_array_value"] = jsonIn.value;
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return jsonIn.value;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return jsonIn.value;
                });
            }for (var _na15 = 0; _na15 < this.arrowsObj.length; _na15++) {
                this.arrowsObj[_na15].componentRenderer.setArg(jsonIn.argName, function () {
                    return jsonIn.value;
                });
            }if (this._enableFont === true) this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                return jsonIn.value;
            });
        }
    }, {
        key: "getLayoutNodeArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.nodeName
         * @param {String} jsonIn.argName
         * @returns {number|Array<number>}
         */
        value: function getLayoutNodeArgumentData(jsonIn) {
            var node = this._nodesByName[jsonIn.nodeName];
            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            for (var _n18 = 0; _n18 < this.arrayNodeData.length / 4; _n18++) {
                if (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[_n18 * 4] === node.nodeId) {
                    var ca = this._customArgs[jsonIn.argName]["nodes_array_value"];
                    if (type === "float") {
                        var id = _n18;
                        if (ca[id] !== undefined && ca[id] !== null) return ca[id];
                    } else {
                        var _id = _n18 * 4;
                        if (ca[_id] !== undefined && ca[_id] !== null) return [ca[_id], ca[_id + 1], ca[_id + 2], ca[_id + 3]];
                    }
                }
            }
        }
    }, {
        key: "setLayoutNodeArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} [jsonIn.nodeName=undefined] - If undefined then value is setted in all nodes
         * @param {String} jsonIn.argName
         * @param {number|Array<number>} jsonIn.value [number, number, number, number]
         * @param {boolean} jsonIn.update
         */
        value: function setLayoutNodeArgumentData(jsonIn) {
            var _this11 = this;

            var node = this._nodesByName[jsonIn.nodeName];
            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            /**
             * @param {String} type - "float" | "float4"
             * @param {String} argName -
             * @param {String} targetArray - "nodes_array_value" | "links_array_value" | "arrows_array_value" | "nodestext_array_value"
             * @param {int} n
             * @param {number} value
             */
            var setVal = function setVal(type, argName, targetArray, n, value) {
                if (type === "float") {
                    _this11._customArgs[argName][targetArray][n] = value;
                } else {
                    var id = n * 4;
                    _this11._customArgs[argName][targetArray][id] = value[0];
                    _this11._customArgs[argName][targetArray][id + 1] = value[1];
                    _this11._customArgs[argName][targetArray][id + 2] = value[2];
                    _this11._customArgs[argName][targetArray][id + 3] = value[3];
                }
            };

            // nodes id
            for (var _n19 = 0; _n19 < this.arrayNodeData.length / 4; _n19++) {
                if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[_n19 * 4] === node.nodeId) setVal(type, jsonIn.argName, "nodes_array_value", _n19, jsonIn.value);else {
                    var id = type === "float" ? _n19 : _n19 * 4;
                    if (this._customArgs[jsonIn.argName]["nodes_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["nodes_array_value"][id] === null && jsonIn.update === false) {
                        if (type === "float") setVal(type, jsonIn.argName, "nodes_array_value", _n19, 0.0);else setVal(type, jsonIn.argName, "nodes_array_value", _n19, [0.0, 0.0, 0.0, 0.0]);
                    }
                }
            }
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return _this11._customArgs[jsonIn.argName].nodes_array_value;
            });

            // link id
            for (var na = 0; na < this.linksObj.length; na++) {
                for (var _n20 = 0; _n20 < this.linksObj[na].arrayLinkData.length / 4; _n20++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.linksObj[na].arrayLinkData[_n20 * 4] === node.nodeId) setVal(type, jsonIn.argName, "links_array_value", _n20, jsonIn.value);else {
                        var _id2 = type === "float" ? _n20 : _n20 * 4;
                        if (this._customArgs[jsonIn.argName]["links_array_value"][_id2] === undefined && this._customArgs[jsonIn.argName]["links_array_value"][_id2] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "links_array_value", _n20, 0.0);else setVal(type, jsonIn.argName, "links_array_value", _n20, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].links_array_value;
                });
            }

            // arrow id
            for (var _na16 = 0; _na16 < this.arrowsObj.length; _na16++) {
                for (var _n21 = 0; _n21 < this.arrowsObj[_na16].arrayArrowData.length / 4; _n21++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrowsObj[_na16].arrayArrowData[_n21 * 4] === node.nodeId) setVal(type, jsonIn.argName, "arrows_array_value", _n21, jsonIn.value);else {
                        var _id3 = type === "float" ? _n21 : _n21 * 4;
                        if (this._customArgs[jsonIn.argName]["arrows_array_value"][_id3] === undefined && this._customArgs[jsonIn.argName]["arrows_array_value"][_id3] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "arrows_array_value", _n21, 0.0);else setVal(type, jsonIn.argName, "arrows_array_value", _n21, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.arrowsObj[_na16].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].arrows_array_value;
                });
            }

            if (this._enableFont === true) {
                // nodeText id
                for (var _n22 = 0; _n22 < this.arrayNodeTextData.length / 4; _n22++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeTextData[_n22 * 4] === node.nodeId) setVal(type, jsonIn.argName, "nodestext_array_value", _n22, jsonIn.value);else {
                        var _id4 = type === "float" ? _n22 : _n22 * 4;
                        if (this._customArgs[jsonIn.argName]["nodestext_array_value"][_id4] === undefined && this._customArgs[jsonIn.argName]["nodestext_array_value"][_id4] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "nodestext_array_value", _n22, 0.0);else setVal(type, jsonIn.argName, "nodestext_array_value", _n22, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].nodestext_array_value;
                });
            }
        }
    }, {
        key: "setLayoutNodeArgumentArrayData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argName
         * @param {Array<number>} jsonIn.value [number] or [number, number, number, number]
         */
        value: function setLayoutNodeArgumentArrayData(jsonIn) {
            var _this12 = this;

            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            // nodes
            var currentId = -1;
            var x = 0,
                y = 0,
                z = 0,
                w = 0;
            this._customArgs[jsonIn.argName].nodes_array_value = [];
            for (var _n23 = 0; _n23 < this.arrayNodeData.length / 4; _n23++) {
                if (currentId !== this.arrayNodeData[_n23 * 4]) {
                    currentId = this.arrayNodeData[_n23 * 4];

                    if (type === "float") {
                        x = jsonIn.value[currentId];
                        this._customArgs[jsonIn.argName].nodes_array_value.push(x);
                    } else {
                        x = jsonIn.value[currentId * 4];
                        y = jsonIn.value[currentId * 4 + 1];
                        z = jsonIn.value[currentId * 4 + 2];
                        w = jsonIn.value[currentId * 4 + 3];
                        this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
                    }
                } else {
                    if (type === "float") this._customArgs[jsonIn.argName].nodes_array_value.push(x);else this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
                }
            }
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return _this12._customArgs[jsonIn.argName].nodes_array_value;
            });

            // links
            this._customArgs[jsonIn.argName].links_array_value = [];
            for (var na = 0; na < this.linksObj.length; na++) {
                for (var _n24 = 0; _n24 < this.linksObj[na].arrayLinkNodeName.length; _n24++) {
                    var currentLinkNodeName = this.linksObj[na].arrayLinkNodeName[_n24];
                    var nodeNameItemStart = this._nodesByName[currentLinkNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].links_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart]);
                    } else {
                        this._customArgs[jsonIn.argName].links_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 3]);
                    }
                }
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].links_array_value;
                });
            }

            // arrows
            this._customArgs[jsonIn.argName].arrows_array_value = [];
            for (var _na17 = 0; _na17 < this.arrowsObj.length; _na17++) {
                for (var _n25 = 0; _n25 < this.arrowsObj[_na17].arrayArrowNodeName.length; _n25++) {
                    var currentArrowNodeName = this.arrowsObj[_na17].arrayArrowNodeName[_n25];
                    var _nodeNameItemStart = this._nodesByName[currentArrowNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart]);
                    } else {
                        this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 3]);
                    }
                }
                this.arrowsObj[_na17].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].arrows_array_value;
                });
            }

            // nodestext
            if (this._enableFont === true) {
                this._customArgs[jsonIn.argName].nodestext_array_value = [];
                for (var _n26 = 0; _n26 < this.arrayNodeTextNodeName.length; _n26++) {
                    var currentNodeTextNodeName = this.arrayNodeTextNodeName[_n26];
                    var _nodeNameItemStart2 = this._nodesByName[currentNodeTextNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].nodestext_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2]);
                    } else {
                        this._customArgs[jsonIn.argName].nodestext_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 3]);
                    }
                }
                this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].nodestext_array_value;
                });
            }
        }
    }, {
        key: "addNode",


        // █████╗ ██████╗ ██████╗     ███╗   ██╗ ██████╗ ██████╗ ███████╗
        //██╔══██╗██╔══██╗██╔══██╗    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝
        //███████║██║  ██║██║  ██║    ██╔██╗ ██║██║   ██║██║  ██║█████╗
        //██╔══██║██║  ██║██║  ██║    ██║╚██╗██║██║   ██║██║  ██║██╔══╝
        //██║  ██║██████╔╝██████╔╝    ██║ ╚████║╚██████╔╝██████╔╝███████╗
        //╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝
        /**
        * @param {Object} jsonIn
        * @param {String} jsonIn.name - Name of node
           * @param {String} [jsonIn.label=undefined] - Label to show
        * @param {String} [jsonIn.data=""] - Custom data associated to this node
        * @param {Array<number>} [jsonIn.position=new Array(Math.Random(), Math.Random(), Math.Random(), 1.0)] - Position of node
        * @param {String} [jsonIn.color=undefined] - URL of image
           * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
           * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
        * @param {Object} [jsonIn.layoutNodeArgumentData=undefined] - Data for the custom layout
        * @param {Function} [jsonIn.onmousedown=undefined] - Event when mousedown
        * @param {Function} [jsonIn.onmouseup=undefined] - Event when mouseup
        * @returns {String|boolean} - Name of node
         */
        value: function addNode(jsonIn) {
            if (this._nodesByName.hasOwnProperty(jsonIn.name) === false) {
                var node = this.createNode(jsonIn);
                this._nodesByName[jsonIn.name] = node;
                this._nodesById[node.nodeId] = node;

                if (node.label !== undefined && node.label !== null && this._enableFont === true) this.createNodeText(node);

                console.log("%cnode " + Object.keys(this._nodesByName).length + " (" + jsonIn.name + ")", "color:green");

                return jsonIn.name;
            } else {
                console.log("node " + jsonIn.name + " already exists");
                return false;
            }
        }
    }, {
        key: "createNode",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} [jsonIn.position=[Math.Random(), Math.Random(), Math.Random(), 1.0]] - Position of node
         * @param {Object} [jsonIn.layoutNodeArgumentData=undefined]
         * @param {String} [jsonIn.color]
         * @param {int} [jsonIn.nodeId]
         * @param {int} [jsonIn.itemStart]
         * @returns {Object}
         */
        value: function createNode(jsonIn) {
            var nAIS = this.nodeArrayItemStart;

            var offs = 100.0;
            var pos = jsonIn.position !== undefined && jsonIn.position !== null ? jsonIn.position : [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];

            var color = jsonIn.color;

            var nodeImgId = -1;
            if (color !== undefined && color !== null && color.constructor === String) {
                // color is string URL
                if (this.objNodeImages.hasOwnProperty(color) === false) {
                    var locationIdx = Object.keys(this.objNodeImages).length;
                    this.objNodeImages[color] = locationIdx;

                    this.addNodesImage(color, locationIdx);
                }
                nodeImgId = this.objNodeImages[color];
            }
            for (var _n27 = 0; _n27 < this.mesh_nodes.vertexArray.length / 4; _n27++) {
                var idxVertex = _n27 * 4;

                var ts = this.getBornDieTS(jsonIn.bornDate, jsonIn.dieDate);
                this.arrayNodeData.push(this.currentNodeId, 0.0, ts.bornDate, ts.dieDate);
                this.arrayNodeDataB.push(ts.bornDate, ts.dieDate, 0.0, 0.0);
                this.arrayNodeDataF.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodeDataG.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodeDataH.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodePosXYZW.push(pos[0], pos[1], pos[2], pos[3]);
                this.arrayNodeDir.push(0, 0, 0, 1.0);
                this.arrayNodeVertexPos.push(this.mesh_nodes.vertexArray[idxVertex], this.mesh_nodes.vertexArray[idxVertex + 1], this.mesh_nodes.vertexArray[idxVertex + 2], 1.0);
                this.arrayNodeVertexNormal.push(this.mesh_nodes.normalArray[idxVertex], this.mesh_nodes.normalArray[idxVertex + 1], this.mesh_nodes.normalArray[idxVertex + 2], 1.0);
                this.arrayNodeVertexTexture.push(this.mesh_nodes.textureArray[idxVertex], this.mesh_nodes.textureArray[idxVertex + 1], this.mesh_nodes.textureArray[idxVertex + 2], 1.0);

                this.arrayNodeImgId.push(nodeImgId);

                if (jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                    for (var argNameKey in this._customArgs) {
                        var expl = this._customArgs[argNameKey].arg.split("*");
                        if (expl.length > 0) {
                            // argument is type buffer
                            if (jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                                if (expl[0] === "float") this._customArgs[argNameKey].nodes_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].nodes_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey][0], jsonIn.layoutNodeArgumentData[argNameKey][1], jsonIn.layoutNodeArgumentData[argNameKey][2], jsonIn.layoutNodeArgumentData[argNameKey][3]);
                            }
                        }
                    }
                }

                this.nodeArrayItemStart++;
            }

            var maxNodeIndexId = 0;
            for (var _n28 = 0; _n28 < this.mesh_nodes.indexArray.length; _n28++) {
                var idxIndex = _n28;

                this.arrayNodeIndices.push(this.startIndexId + this.mesh_nodes.indexArray[idxIndex]);

                if (this.mesh_nodes.indexArray[idxIndex] > maxNodeIndexId) maxNodeIndexId = this.mesh_nodes.indexArray[idxIndex];
            }
            this.startIndexId += maxNodeIndexId + 1;

            jsonIn.nodeId = this.currentNodeId++;
            jsonIn.itemStart = nAIS; // nodeArrayItemStart
            return jsonIn;
        }
    }, {
        key: "createNodeText",
        value: function createNodeText(jsonIn) {
            var getLetterId = function getLetterId(letter) {
                var obj = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6,
                    "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13,
                    "Ñ": 14, "O": 15, "P": 16, "Q": 17, "R": 18, "S": 19, "T": 20,
                    "U": 21, "V": 22, "W": 23, "X": 24, "Y": 25, "Z": 26, " ": 27,
                    "0": 28, "1": 29, "2": 30, "3": 31, "4": 32, "5": 33, "6": 34,
                    "7": 35, "8": 36, "9": 37
                };
                return obj[letter];
            };

            for (var i = 0; i < this.nodesTextPlanes; i++) {
                var letterId = null;
                if (jsonIn.label !== undefined && jsonIn.label !== null && jsonIn.label[i] !== undefined && jsonIn.label[i] !== null) letterId = getLetterId(jsonIn.label[i].toUpperCase());
                if (letterId === null) letterId = getLetterId(" ");

                for (var _n29 = 0; _n29 < this.mesh_nodesText.vertexArray.length / 4; _n29++) {
                    var idxVertex = _n29 * 4;

                    this.arrayNodeTextData.push(jsonIn.nodeId, 0.0, 0.0, 0.0);
                    this.arrayNodeTextPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                    this.arrayNodeTextVertexPos.push(this.mesh_nodesText.vertexArray[idxVertex] + i * 5, this.mesh_nodesText.vertexArray[idxVertex + 1], this.mesh_nodesText.vertexArray[idxVertex + 2], 1.0);
                    this.arrayNodeTextVertexNormal.push(this.mesh_nodesText.normalArray[idxVertex], this.mesh_nodesText.normalArray[idxVertex + 1], this.mesh_nodesText.normalArray[idxVertex + 2], 1.0);
                    this.arrayNodeTextVertexTexture.push(this.mesh_nodesText.textureArray[idxVertex], this.mesh_nodesText.textureArray[idxVertex + 1], this.mesh_nodesText.textureArray[idxVertex + 2], 1.0);

                    this.arrayNodeTextNodeName.push(jsonIn.name);

                    this.arrayNodeText_itemStart.push(jsonIn.itemStart);

                    this.arrayNodeTextLetterId.push(letterId);

                    if (jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                        for (var argNameKey in this._customArgs) {
                            var expl = this._customArgs[argNameKey].arg.split("*");
                            if (expl.length > 0) {
                                // argument is type buffer
                                if (jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                                    if (expl[0] === "float") this._customArgs[argNameKey].nodestext_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].nodestext_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey][0], jsonIn.layoutNodeArgumentData[argNameKey][1], jsonIn.layoutNodeArgumentData[argNameKey][2], jsonIn.layoutNodeArgumentData[argNameKey][3]);
                                }
                            }
                        }
                    }

                    this.nodeTextArrayItemStart++;
                }
            }
            var maxNodeIndexId = 0;
            for (var _i = 0; _i < this.nodesTextPlanes; _i++) {
                for (var _n30 = 0; _n30 < this.mesh_nodesText.indexArray.length; _n30++) {
                    var idxIndex = _n30;

                    var b = _i * 4; // 4 = indices length of quad (0, 1, 2, 0, 2, 3)
                    var ii = this.mesh_nodesText.indexArray[idxIndex] + b;

                    this.arrayNodeTextIndices.push(this.startIndexId_nodestext + ii);

                    if (ii > maxNodeIndexId) maxNodeIndexId = ii;
                }
            }
            this.startIndexId_nodestext += maxNodeIndexId + 1;

            this.currentNodeTextId++; // augment node id
        }
    }, {
        key: "addNodesImage",


        /**
         * @param {String} url
         * @param {int} locationIdx
         */
        value: function addNodesImage(url, locationIdx) {
            this._stackNodesImg.push({
                "url": url,
                "locationIdx": locationIdx });
        }
    }, {
        key: "generateNodesImage",
        value: function generateNodesImage() {
            var _this13 = this;

            if (this.nodesImgMaskLoaded === false) {
                this.nodesImgMask = new Image();
                this.nodesImgMask.onload = function () {
                    _this13.nodesImgMaskLoaded = true;
                    _this13.generateNodesImage();
                };
                this.nodesImgMask.src = this._sce.sceDirectory + "/Prefabs/Graph/nodesImgMask.png";
            } else if (this.nodesImgCrosshairLoaded === false) {
                this.nodesImgCrosshair = new Image();
                this.nodesImgCrosshair.onload = function () {
                    _this13.nodesImgCrosshairLoaded = true;
                    _this13.generateNodesImage();
                };
                this.nodesImgCrosshair.src = this._sce.sceDirectory + "/Prefabs/Graph/nodesImgCrosshair.png";
            } else {
                new _ProccessImg.ProccessImg({
                    "stackNodesImg": this._stackNodesImg,
                    "NODE_IMG_WIDTH": this.NODE_IMG_WIDTH,
                    "NODE_IMG_COLUMNS": this.NODE_IMG_COLUMNS,
                    "nodesImgMask": this.nodesImgMask,
                    "nodesImgCrosshair": this.nodesImgCrosshair,
                    "onend": function onend(jsonIn) {
                        _this13.comp_renderer_nodes.setArg("nodesImg", function () {
                            return jsonIn.nodesImg;
                        });
                        _this13.comp_renderer_nodes.setArg("nodesImgCrosshair", function () {
                            return jsonIn.nodesImgCrosshair;
                        });
                    } });
            }
        }
    }, {
        key: "addLink",


        // █████╗ ██████╗ ██████╗     ██╗     ██╗███╗   ██╗██╗  ██╗
        //██╔══██╗██╔══██╗██╔══██╗    ██║     ██║████╗  ██║██║ ██╔╝
        //███████║██║  ██║██║  ██║    ██║     ██║██╔██╗ ██║█████╔╝
        //██╔══██║██║  ██║██║  ██║    ██║     ██║██║╚██╗██║██╔═██╗
        //██║  ██║██████╔╝██████╔╝    ███████╗██║██║ ╚████║██║  ██╗
        //╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.origin - NodeName Origin for this link
         * @param {String} jsonIn.target - NodeName Target for this link
         * @param {boolean} [jsonIn.directed=false] - Default false=bidir
         * @param {number} [jsonIn.activationFunc=1.0] 1.0=linkWeight*data; 0.0=multiplier*data
         * @param {number|String} [jsonIn.weight=1.0] - Float weight or "RANDOM"
         * @param {number} [jsonIn.linkMultiplier=1.0]
         * @param {number} [jsonIn.layerNum]
         * @param {boolean} [jsonIn.showArrow]
         * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         *
         * @param {String} [jsonIn.origin_nodeName] - NodeName Origin for this link
         * @param {String} [jsonIn.target_nodeName] - NodeName Target for this link
         * @param {int} [jsonIn.origin_nodeId]
         * @param {int} [jsonIn.target_nodeId]
         * @param {int} [jsonIn.origin_itemStart]
         * @param {int} [jsonIn.target_itemStart]
         * @param {Array<>} [jsonIn.origin_layoutNodeArgumentData]
         * @param {Array<>} [jsonIn.target_layoutNodeArgumentData]
         * @param {int} [jsonIn.repeatId]
         */
        value: function addLink(jsonIn) {
            var pass = true;

            if (this._nodesByName[jsonIn.origin] === undefined && this._nodesByName[jsonIn.origin] === null) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target + ". Node " + jsonIn.origin + " not exists", "color:red");
                pass = false;
            }

            if (this._nodesByName[jsonIn.target] === undefined && this._nodesByName[jsonIn.target] === null) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target + ". Node " + jsonIn.target + " not exists", "color:red");
                pass = false;
            }

            if (jsonIn.origin === jsonIn.target && this._enableAutoLink === false) {
                console.log("%cDiscarting autolink " + jsonIn.origin + "->" + jsonIn.target, "color:orange");
                pass = false;
            }

            if (pass === true) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target, "color:green");

                jsonIn.origin_nodeName = jsonIn.origin.toString();
                jsonIn.target_nodeName = jsonIn.target.toString();
                jsonIn.origin_nodeId = this._nodesByName[jsonIn.origin].nodeId;
                jsonIn.target_nodeId = this._nodesByName[jsonIn.target].nodeId;
                jsonIn.origin_itemStart = this._nodesByName[jsonIn.origin].itemStart;
                jsonIn.target_itemStart = this._nodesByName[jsonIn.target].itemStart;
                jsonIn.origin_layoutNodeArgumentData = this._nodesByName[jsonIn.origin].layoutNodeArgumentData;
                jsonIn.target_layoutNodeArgumentData = this._nodesByName[jsonIn.target].layoutNodeArgumentData;

                var ts = this.getBornDieTS(jsonIn.bornDate, jsonIn.dieDate);
                jsonIn.bornDate = ts.bornDate;
                jsonIn.dieDate = ts.dieDate;

                jsonIn.activationFunc = jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null ? jsonIn.activationFunc : 1.0;
                jsonIn.weight = jsonIn.weight !== undefined && jsonIn.weight !== null && jsonIn.weight.constructor === String ? Math.random() : jsonIn.weight || 1.0;
                jsonIn.linkMultiplier = jsonIn.linkMultiplier !== undefined && jsonIn.linkMultiplier !== null ? jsonIn.linkMultiplier : 1.0;

                var repeatId = 1;
                while (true) {
                    var exists = this._links.hasOwnProperty(jsonIn.origin + "->" + jsonIn.target + "_" + repeatId) || this._links.hasOwnProperty(jsonIn.target + "->" + jsonIn.origin + "_" + repeatId);
                    if (exists === true) {
                        repeatId++;
                    } else break;
                }
                jsonIn.repeatId = repeatId;

                jsonIn = this.createLink(jsonIn);

                if (jsonIn.directed !== undefined && jsonIn.directed !== null && jsonIn.directed === true) {
                    if (jsonIn.showArrow !== undefined && jsonIn.showArrow !== null && jsonIn.showArrow === false) {} else this.createArrow(jsonIn);
                }

                // ADD LINK TO ARRAY LINKS
                this._links[jsonIn.origin + "->" + jsonIn.target + "_" + repeatId] = jsonIn;
                //console.log("link "+jsonIn.origin+"->"+jsonIn.target);


                // UPDATE arrayNodeData
                for (var _n31 = 0; _n31 < this.arrayNodeData.length / 4; _n31++) {
                    var id = _n31 * 4;
                    if (this.arrayNodeData[id] === this._nodesByName[jsonIn.origin].nodeId) {
                        this.arrayNodeData[id + 1] = this.arrayNodeData[id + 1] + 1.0;
                    }
                    if (this.arrayNodeData[id] === this._nodesByName[jsonIn.target].nodeId) {
                        this.arrayNodeData[id + 1] = this.arrayNodeData[id + 1] + 1.0;
                    }
                }
            }
        }
    }, {
        key: "createLink",


        /**
         * Create new link for the graph
         * @param {Object} jsonIn
         * @param {String} jsonIn.origin_nodeName
         * @param {String} jsonIn.target_nodeName
         * @param {int} jsonIn.origin_nodeId
         * @param {int} jsonIn.target_nodeId
         * @param {int} jsonIn.origin_itemStart
         * @param {int} jsonIn.target_itemStart
         * @param {Array<>} jsonIn.origin_layoutNodeArgumentData
         * @param {Array<>} jsonIn.target_layoutNodeArgumentData
         * @param {int} [jsonIn.linkId]
         * @param {boolean} [jsonIn.directed=false]
         * @param {number} [jsonIn.weight=1.0] - Float weight or "RANDOM"
         * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @returns {Object}
         */
        value: function createLink(jsonIn) {
            if (this.currentLinkId % 60000 === 0) this.createLinksObjItem();

            for (var _n32 = 0; _n32 < this.lineVertexCount * 2; _n32++) {
                this.linksObj[this.currentLinksObjItem].arrayLinkData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, Math.ceil(_n32 / 2), jsonIn.repeatId);
                this.linksObj[this.currentLinksObjItem].arrayLinkDataC.push(jsonIn.bornDate, jsonIn.dieDate, jsonIn.weight, 0.0);

                if (Math.ceil(_n32 / 2) !== this.lineVertexCount - 1) {
                    this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.origin_nodeName);
                } else {
                    this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.target_nodeName);
                }
                this.linksObj[this.currentLinksObjItem].arrayLinkPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                this.linksObj[this.currentLinksObjItem].arrayLinkVertexPos.push(0.0, 0.0, 0.0, 1.0);

                if (jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                    for (var argNameKey in this._customArgs) {
                        var expl = this._customArgs[argNameKey].arg.split("*");
                        if (expl.length > 0) {
                            // argument is type buffer
                            if (jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                                if (expl[0] === "float") this._customArgs[argNameKey].links_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].links_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey][0], jsonIn.origin_layoutNodeArgumentData[argNameKey][1], jsonIn.origin_layoutNodeArgumentData[argNameKey][2], jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                            }
                        }
                    }
                }
            }

            for (var _n33 = 0; _n33 < this.lineVertexCount * 2; _n33++) {
                this.linksObj[this.currentLinksObjItem].arrayLinkIndices.push(this.linksObj[this.currentLinksObjItem].startIndexId_link++);
            }this.currentLinkId += 2; // augment link id

            jsonIn.linkId = this.currentLinkId - 2;
            return jsonIn;
        }
    }, {
        key: "createArrow",


        /**
         * Create new arrow for the graph
         * @param {Object} jsonIn
         * @param {int} jsonIn.origin_nodeName
         * @param {int} jsonIn.target_nodeName
         * @param {int} jsonIn.origin_nodeId
         * @param {int} jsonIn.target_nodeId
         * @param {int} jsonIn.origin_itemStart
         * @param {int} jsonIn.target_itemStart
         * @param {int} jsonIn.origin_layoutNodeArgumentData
         * @param {int} jsonIn.target_layoutNodeArgumentData
         * @param {bool} [jsonIn.directed=false]
         * @param {Mesh} [jsonIn.node] - Node with the mesh for the node
         * @returns {int}
         */
        value: function createArrow(jsonIn) {
            if (this.currentArrowId % 20000 === 0) this.createArrowsObjItem();

            if (jsonIn !== undefined && jsonIn !== null && jsonIn.node !== undefined && jsonIn.node !== null) this.mesh_arrows = jsonIn.node;

            var oppositeId = 0;

            for (var o = 0; o < 2; o++) {
                for (var _n34 = 0; _n34 < this.mesh_arrows.vertexArray.length / 4; _n34++) {
                    var idxVertex = _n34 * 4;
                    if (o === 0) oppositeId = this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart;

                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexPos.push(this.mesh_arrows.vertexArray[idxVertex], this.mesh_arrows.vertexArray[idxVertex + 1], this.mesh_arrows.vertexArray[idxVertex + 2], 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexNormal.push(this.mesh_arrows.normalArray[idxVertex], this.mesh_arrows.normalArray[idxVertex + 1], this.mesh_arrows.normalArray[idxVertex + 2], 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexTexture.push(this.mesh_arrows.textureArray[idxVertex], this.mesh_arrows.textureArray[idxVertex + 1], this.mesh_arrows.textureArray[idxVertex + 2], 1.0);
                    if (o === 0) {
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, 0.0, jsonIn.repeatId);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowDataC.push(jsonIn.bornDate, jsonIn.dieDate, 0.0, 0.0);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.origin_nodeName);
                        if (jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                            for (var argNameKey in this._customArgs) {
                                var expl = this._customArgs[argNameKey].arg.split("*");
                                if (expl.length > 0) {
                                    // argument is type buffer
                                    if (jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                                        if (expl[0] === "float") this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey][0], jsonIn.origin_layoutNodeArgumentData[argNameKey][1], jsonIn.origin_layoutNodeArgumentData[argNameKey][2], jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                                    }
                                }
                            }
                        }
                    } else {
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.target_nodeId, jsonIn.origin_nodeId, 1.0, jsonIn.repeatId);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowDataC.push(jsonIn.bornDate, jsonIn.dieDate, 0.0, 0.0);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.target_nodeName);
                        if (jsonIn.target_layoutNodeArgumentData !== undefined && jsonIn.target_layoutNodeArgumentData !== null) {
                            for (var _argNameKey in this._customArgs) {
                                var _expl = this._customArgs[_argNameKey].arg.split("*");
                                if (_expl.length > 0) {
                                    // argument is type buffer
                                    if (jsonIn.target_layoutNodeArgumentData.hasOwnProperty(_argNameKey) === true && jsonIn.target_layoutNodeArgumentData[_argNameKey] !== undefined && jsonIn.target_layoutNodeArgumentData[_argNameKey] !== null) {
                                        if (_expl[0] === "float") this._customArgs[_argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[_argNameKey]);else if (_expl[0] === "float4") this._customArgs[_argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[_argNameKey][0], jsonIn.target_layoutNodeArgumentData[_argNameKey][1], jsonIn.target_layoutNodeArgumentData[_argNameKey][2], jsonIn.target_layoutNodeArgumentData[_argNameKey][3]);
                                    }
                                }
                            }
                        }
                    }

                    this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart++;
                }

                var maxArrowIndexId = 0;
                for (var _n35 = 0; _n35 < this.mesh_arrows.indexArray.length; _n35++) {
                    var idxIndex = _n35;

                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowIndices.push(this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow + this.mesh_arrows.indexArray[idxIndex]);

                    if (this.mesh_arrows.indexArray[idxIndex] > maxArrowIndexId) {
                        maxArrowIndexId = this.mesh_arrows.indexArray[idxIndex];
                    }
                }
                this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow += maxArrowIndexId + 1;

                this.currentArrowId++; // augment arrow id
            }
        }
    }, {
        key: "updateNodes",


        //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ███╗   ██╗ ██████╗ ██████╗ ███████╗███████╗
        //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔════╝
        //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██╔██╗ ██║██║   ██║██║  ██║█████╗  ███████╗
        //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║╚██╗██║██║   ██║██║  ██║██╔══╝  ╚════██║
        //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ██║ ╚████║╚██████╔╝██████╔╝███████╗███████║
        // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
        value: function updateNodes() {
            var _this14 = this;

            console.log(this.currentNodeId + " nodes");

            this._ADJ_MATRIX_WIDTH = this._MAX_ADJ_MATRIX_WIDTH;

            this.comp_renderer_nodes.setArg("adjacencyMatrix", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);
            }for (var _na18 = 0; _na18 < this.arrowsObj.length; _na18++) {
                this.arrowsObj[_na18].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("adjacencyMatrixB", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var _na19 = 0; _na19 < this.linksObj.length; _na19++) {
                this.linksObj[_na19].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);
            }for (var _na20 = 0; _na20 < this.arrowsObj.length; _na20++) {
                this.arrowsObj[_na20].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("adjacencyMatrixC", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var _na21 = 0; _na21 < this.linksObj.length; _na21++) {
                this.linksObj[_na21].componentRenderer.getComponentBufferArg("adjacencyMatrixC", this.comp_renderer_nodes);
            }for (var _na22 = 0; _na22 < this.arrowsObj.length; _na22++) {
                this.arrowsObj[_na22].componentRenderer.getComponentBufferArg("adjacencyMatrixC", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("widthAdjMatrix", function () {
                return _this14._ADJ_MATRIX_WIDTH;
            });
            for (var _na23 = 0; _na23 < this.linksObj.length; _na23++) {
                this.linksObj[_na23].componentRenderer.setArg("widthAdjMatrix", function () {
                    return _this14._ADJ_MATRIX_WIDTH;
                });
            }for (var _na24 = 0; _na24 < this.arrowsObj.length; _na24++) {
                this.arrowsObj[_na24].componentRenderer.setArg("widthAdjMatrix", function () {
                    return _this14._ADJ_MATRIX_WIDTH;
                });
            }this.comp_renderer_nodes.setArg("data", function () {
                return _this14.arrayNodeData;
            });
            this.comp_renderer_nodes.setArg("dataB", function () {
                return _this14.arrayNodeDataB;
            });
            this.comp_renderer_nodes.setArg("dataF", function () {
                return _this14.arrayNodeDataF;
            });
            this.comp_renderer_nodes.setArg("dataG", function () {
                return _this14.arrayNodeDataG;
            });
            this.comp_renderer_nodes.setArg("dataH", function () {
                return _this14.arrayNodeDataH;
            });

            if (this.comp_renderer_nodes.getBuffers()["posXYZW"] !== undefined && this.comp_renderer_nodes.getBuffers()["posXYZW"] !== null) this.arrayNodePosXYZW = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("posXYZW"));
            this.comp_renderer_nodes.setArg("posXYZW", function () {
                return _this14.arrayNodePosXYZW;
            });

            this.comp_renderer_nodes.setArg("nodeVertexPos", function () {
                return _this14.arrayNodeVertexPos;
            });
            this.comp_renderer_nodes.setArg("nodeVertexNormal", function () {
                return _this14.arrayNodeVertexNormal;
            });
            this.comp_renderer_nodes.setArg("nodeVertexTexture", function () {
                return _this14.arrayNodeVertexTexture;
            });

            this.comp_renderer_nodes.setArg("nodesCount", function () {
                return _this14.currentNodeId;
            });
            this._MAX_ADJ_MATRIX_WIDTH = this.currentNodeId;
            this.comp_renderer_nodes.setArg("nodeImgColumns", function () {
                return _this14.NODE_IMG_COLUMNS;
            });
            this.comp_renderer_nodes.setArg("nodeImgId", function () {
                return _this14.arrayNodeImgId;
            });
            this.comp_renderer_nodes.setArg("indices", function () {
                return _this14.arrayNodeIndices;
            });

            if (this.comp_renderer_nodes.getBuffers()["dir"] !== undefined && this.comp_renderer_nodes.getBuffers()["dir"] !== null) this.arrayNodeDir = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("dir"));
            this.comp_renderer_nodes.setArg("dir", function () {
                return _this14.arrayNodeDir;
            });

            this.comp_renderer_nodes.setArg("PMatrix", function () {
                return _this14._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("PMatrix", true);
            this.comp_renderer_nodes.setArg("cameraWMatrix", function () {
                return _this14._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("cameraWMatrix", true);
            this.comp_renderer_nodes.setArg("nodeWMatrix", function () {
                return _this14.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("nodeWMatrix", true);

            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return _this14.currentTrainLayer;
            });
            this.comp_renderer_nodes.setArg("afferentNodesCount", function () {
                return _this14.afferentNodesCount;
            });
            this.comp_renderer_nodes.setArg("efferentNodesCount", function () {
                return _this14.efferentNodesCount;
            });
            this.comp_renderer_nodes.setArg("efferentStart", function () {
                return _this14.currentNodeId - _this14.efferentNodesCount;
            });

            this.comp_renderer_nodes.setArg("afferentNodesA", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesA", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesB", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesB", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesC", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesC", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesD", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesD", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesE", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesE", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesF", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesF", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesG", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesG", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("isNode", function () {
                return 1;
            });
            this.comp_renderer_nodes.setArg("bufferNodesWidth", function () {
                return _this14.comp_renderer_nodes.getBuffers()["posXYZW"].W;
            });

            var _loop3 = function _loop3(argNameKey) {
                var expl = _this14._customArgs[argNameKey].arg.split("*");
                if (expl.length > 0) {
                    // argument is type buffer
                    _this14.comp_renderer_nodes.setArg(argNameKey, function () {
                        return _this14._customArgs[argNameKey].nodes_array_value;
                    });
                }
            };

            for (var argNameKey in this._customArgs) {
                _loop3(argNameKey);
            }

            this.generateNodesImage();
            if (this._enableFont === true) this.updateNodesText();
        }
    }, {
        key: "updateNodesText",
        value: function updateNodesText() {
            var _this15 = this;

            this.comp_renderer_nodesText.setArg("data", function () {
                return _this15.arrayNodeTextData;
            });
            this.comp_renderer_nodesText.getComponentBufferArg("posXYZW", this.comp_renderer_nodes);

            this.comp_renderer_nodesText.setArg("nodeVertexPos", function () {
                return _this15.arrayNodeTextVertexPos;
            });
            this.comp_renderer_nodesText.setArg("nodeVertexNormal", function () {
                return _this15.arrayNodeTextVertexNormal;
            });
            this.comp_renderer_nodesText.setArg("nodeVertexTexture", function () {
                return _this15.arrayNodeTextVertexTexture;
            });

            this.comp_renderer_nodesText.setArg("fontImgColumns", function () {
                return _this15.FONT_IMG_COLUMNS;
            });
            this.comp_renderer_nodesText.setArg("letterId", function () {
                return _this15.arrayNodeTextLetterId;
            });
            this.comp_renderer_nodesText.setArg("indices", function () {
                return _this15.arrayNodeTextIndices;
            });

            this.comp_renderer_nodesText.setArg("PMatrix", function () {
                return _this15._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("PMatrix", true);
            this.comp_renderer_nodesText.setArg("cameraWMatrix", function () {
                return _this15._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("cameraWMatrix", true);
            this.comp_renderer_nodesText.setArg("nodeWMatrix", function () {
                return _this15.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("nodeWMatrix", true);

            this.comp_renderer_nodesText.setArg("isNodeText", function () {
                return 1;
            });
            this.comp_renderer_nodesText.setArg("bufferNodesWidth", function () {
                return _this15.comp_renderer_nodes.getBuffers()["posXYZW"].W;
            });
            this.comp_renderer_nodesText.setArg("bufferTextsWidth", function () {
                return _this15.comp_renderer_nodesText.getBuffers()["data"].W;
            });

            var _loop4 = function _loop4(argNameKey) {
                var expl = _this15._customArgs[argNameKey].arg.split("*");
                if (expl.length > 0) // argument is type buffer
                    _this15.comp_renderer_nodesText.setArg(argNameKey, function () {
                        return _this15._customArgs[argNameKey].nodestext_array_value;
                    });
            };

            for (var argNameKey in this._customArgs) {
                _loop4(argNameKey);
            }
        }
    }, {
        key: "updateLinks",


        //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ██╗     ██╗███╗   ██╗██╗  ██╗███████╗
        //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██║     ██║████╗  ██║██║ ██╔╝██╔════╝
        //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██║     ██║██╔██╗ ██║█████╔╝ ███████╗
        //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║     ██║██║╚██╗██║██╔═██╗ ╚════██║
        //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ███████╗██║██║ ╚████║██║  ██╗███████║
        // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
        value: function updateLinks() {
            var _this16 = this;

            console.log(Object.keys(this._links).length + " links");

            this.comp_renderer_nodes.setArg("data", function () {
                return _this16.arrayNodeData;
            });
            //this.comp_renderer_nodes.setArg("dataB", () => {return this.arrayNodeDataB;});

            var _loop5 = function _loop5(na) {
                _this16.linksObj[na].componentRenderer.setArg("data", function () {
                    return _this16.linksObj[na].arrayLinkData;
                });
                _this16.linksObj[na].componentRenderer.setArg("dataC", function () {
                    return _this16.linksObj[na].arrayLinkDataC;
                });
                _this16.linksObj[na].componentRenderer.getComponentBufferArg("dataB", _this16.comp_renderer_nodes);
                _this16.linksObj[na].componentRenderer.getComponentBufferArg("posXYZW", _this16.comp_renderer_nodes);
                _this16.linksObj[na].componentRenderer.setArg("nodeVertexPos", function () {
                    return _this16.linksObj[na].arrayLinkVertexPos;
                });
                _this16.linksObj[na].componentRenderer.setArg("indices", function () {
                    return _this16.linksObj[na].arrayLinkIndices;
                });

                _this16.linksObj[na].componentRenderer.setArg("nodesCount", function () {
                    return _this16.currentNodeId;
                });
                _this16.linksObj[na].componentRenderer.setArg("PMatrix", function () {
                    return _this16._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
                _this16.linksObj[na].componentRenderer.setArg("cameraWMatrix", function () {
                    return _this16._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
                _this16.linksObj[na].componentRenderer.setArg("nodeWMatrix", function () {
                    return _this16.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

                _this16.linksObj[na].componentRenderer.setArg("isLink", function () {
                    return 1;
                });
                _this16.linksObj[na].componentRenderer.setArg("bufferNodesWidth", function () {
                    return _this16.comp_renderer_nodes.getBuffers()["posXYZW"].W;
                });
                _this16.linksObj[na].componentRenderer.setArg("bufferLinksWidth", function () {
                    return _this16.linksObj[na].componentRenderer.getBuffers()["data"].W;
                });

                var _loop6 = function _loop6(argNameKey) {
                    var expl = _this16._customArgs[argNameKey].arg.split("*");
                    if (expl.length > 0) {
                        // argument is type buffer
                        _this16.linksObj[na].componentRenderer.setArg(argNameKey, function () {
                            return _this16._customArgs[argNameKey].links_array_value;
                        });
                    }
                };

                for (var argNameKey in _this16._customArgs) {
                    _loop6(argNameKey);
                }
            };

            for (var na = 0; na < this.linksObj.length; na++) {
                _loop5(na);
            }

            this.updateArrows();

            if (Object.keys(this._links).length > 0) this.updateAdjMat();
        }
    }, {
        key: "updateArrows",
        value: function updateArrows() {
            var _this17 = this;

            var _loop7 = function _loop7(na) {
                _this17.arrowsObj[na].componentRenderer.setArg("data", function () {
                    return _this17.arrowsObj[na].arrayArrowData;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("dataC", function () {
                    return _this17.arrowsObj[na].arrayArrowDataC;
                });
                _this17.arrowsObj[na].componentRenderer.getComponentBufferArg("dataB", _this17.comp_renderer_nodes);
                _this17.arrowsObj[na].componentRenderer.getComponentBufferArg("posXYZW", _this17.comp_renderer_nodes);

                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexPos", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexPos;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexNormal", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexNormal;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexTexture", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexTexture;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("indices", function () {
                    return _this17.arrowsObj[na].arrayArrowIndices;
                });

                _this17.arrowsObj[na].componentRenderer.setArg("PMatrix", function () {
                    return _this17._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
                _this17.arrowsObj[na].componentRenderer.setArg("cameraWMatrix", function () {
                    return _this17._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
                _this17.arrowsObj[na].componentRenderer.setArg("nodeWMatrix", function () {
                    return _this17.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

                _this17.arrowsObj[na].componentRenderer.setArg("nodesCount", function () {
                    return _this17.currentNodeId;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("isArrow", function () {
                    return 1.0;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("bufferNodesWidth", function () {
                    return _this17.comp_renderer_nodes.getBuffers()["posXYZW"].W;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("bufferArrowsWidth", function () {
                    return _this17.arrowsObj[na].componentRenderer.getBuffers()["data"].W;
                });

                var _loop8 = function _loop8(argNameKey) {
                    var expl = _this17._customArgs[argNameKey].arg.split("*");
                    if (expl.length > 0) {
                        // argument is type buffer
                        _this17.arrowsObj[na].componentRenderer.setArg(argNameKey, function () {
                            return _this17._customArgs[argNameKey].arrows_array_value;
                        });
                    }
                };

                for (var argNameKey in _this17._customArgs) {
                    _loop8(argNameKey);
                }
            };

            for (var na = 0; na < this.arrowsObj.length; na++) {
                _loop7(na);
            }
        }
    }, {
        key: "updateAdjMat",
        value: function updateAdjMat() {
            var _this18 = this;

            var setAdjMat = function setAdjMat(columnAsParent, pixel, nodeId, nodeIdInv, bornDate, dieDate, weight, linkMultiplier, activationFunc, layerNum) {
                var idx = pixel * 4;

                _this18.arrAdjMatrix[idx] = bornDate;
                _this18.arrAdjMatrix[idx + 1] = dieDate;
                _this18.arrAdjMatrix[idx + 2] = columnAsParent === true ? _this18.disabVal : weight;
                _this18.arrAdjMatrix[idx + 3] = columnAsParent === true ? 1.0 : 0.5; // columnAsParent=1.0;

                _this18.arrAdjMatrixB[idx] = linkMultiplier;
                _this18.arrAdjMatrixB[idx + 1] = activationFunc;
                _this18.arrAdjMatrixB[idx + 2] = nodeId;
                _this18.arrAdjMatrixB[idx + 3] = nodeIdInv;

                _this18.arrAdjMatrixC[idx] = 0.0; // error
                _this18.arrAdjMatrixC[idx + 1] = layerNum;
                _this18.arrAdjMatrixC[idx + 2] = 0.0;
                _this18.arrAdjMatrixC[idx + 3] = 0.0;
            };

            this.arrAdjMatrix = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            this.arrAdjMatrixB = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            this.arrAdjMatrixC = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            for (var key in this._links) {
                var childNodeId = this._links[key].origin_nodeId;
                var parentNodeId = this._links[key].target_nodeId;

                var pixelParent = parentNodeId * this._ADJ_MATRIX_WIDTH + childNodeId;
                var pixelChild = childNodeId * this._ADJ_MATRIX_WIDTH + parentNodeId;
                setAdjMat(true, pixelParent, parentNodeId, childNodeId, this._links[key].bornDate, this._links[key].dieDate, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, -99); // (columns=child;rows=parent)
                setAdjMat(false, pixelChild, childNodeId, parentNodeId, this._links[key].bornDate, this._links[key].dieDate, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, this._links[key].layerNum); // (columns=parent;rows=child)
            }

            this.comp_renderer_nodes.setArg("adjacencyMatrix", function () {
                return _this18.arrAdjMatrix;
            });
            this.comp_renderer_nodes.setArg("adjacencyMatrixB", function () {
                return _this18.arrAdjMatrixB;
            });
            this.comp_renderer_nodes.setArg("adjacencyMatrixC", function () {
                return _this18.arrAdjMatrixC;
            });

            /*
            this.adjacencyMatrixToImage(this.arrAdjMatrix, this._ADJ_MATRIX_WIDTH, (img) => {
                document.body.appendChild(img);
                img.style.border = "1px solid red";
            }); */
        }
    }, {
        key: "adjacencyMatrixToImage",


        /**
         * adjacencyMatrixToImage
         * @param {Float32Array} adjMat
         * @param {int} width
         * @param {Function} onload
         */
        value: function adjacencyMatrixToImage(adjMat, width, onload) {
            var _this19 = this;

            var toArrF = function toArrF(arr) {
                var arrO = new Uint8Array(arr.length * 4);
                for (var _n36 = 0; _n36 < arr.length; _n36++) {
                    var idO = _n36 * 4;
                    arrO[idO] = arr[_n36] * 255;
                    arrO[idO + 1] = arr[_n36] * 255;
                    arrO[idO + 2] = arr[_n36] * 255;
                    arrO[idO + 3] = 255;
                }

                return arrO;
            };

            var toImage = function toImage(arrO, w, h) {
                var canvas = Utils.getCanvasFromUint8Array(arrO, w, h);
                _this19._utils.getImageFromCanvas(canvas, function (im) {
                    onload(im);
                });
            };

            var arrF = toArrF(adjMat);
            toImage(arrF, width, width);
        }
    }, {
        key: "enableForceLayout",
        value: function enableForceLayout() {
            this.comp_renderer_nodes.setArg("enableForceLayout", function () {
                return 1.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableForceLayout", function () {
                    return 1.0;
                });
            }this._enabledForceLayout = true;
        }
    }, {
        key: "disableForceLayout",
        value: function disableForceLayout() {
            this.comp_renderer_nodes.setArg("enableForceLayout", function () {
                return 0.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableForceLayout", function () {
                    return 0.0;
                });
            }this._enabledForceLayout = false;
        }
    }, {
        key: "enableForceLayoutCollision",
        value: function enableForceLayoutCollision() {
            this.comp_renderer_nodes.setArg("enableForceLayoutCollision", function () {
                return 1.0;
            });
        }
    }, {
        key: "disableForceLayoutCollision",
        value: function disableForceLayoutCollision() {
            this.comp_renderer_nodes.setArg("enableForceLayoutCollision", function () {
                return 0.0;
            });
        }
    }, {
        key: "enableShowOutputWeighted",
        value: function enableShowOutputWeighted() {
            this.comp_renderer_nodes.setArg("multiplyOutput", function () {
                return 1.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("multiplyOutput", function () {
                    return 1.0;
                });
            }for (var _na25 = 0; _na25 < this.arrowsObj.length; _na25++) {
                this.arrowsObj[_na25].componentRenderer.setArg("multiplyOutput", function () {
                    return 1.0;
                });
            }
        }
    }, {
        key: "disableShowOutputWeighted",
        value: function disableShowOutputWeighted() {
            this.comp_renderer_nodes.setArg("multiplyOutput", function () {
                return 0.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("multiplyOutput", function () {
                    return 0.0;
                });
            }for (var _na26 = 0; _na26 < this.arrowsObj.length; _na26++) {
                this.arrowsObj[_na26].componentRenderer.setArg("multiplyOutput", function () {
                    return 0.0;
                });
            }
        }
    }], [{
        key: "datetimeToTimestamp",


        /**
         * datetimeToTimestamp
         * @example
         * let ts = datetimeToTimestamp("24-Nov-2009 17:57:35")
         * */
        value: function datetimeToTimestamp(dt) {
            return Date.parse(dt);
        }
    }, {
        key: "timestampToDate",
        value: function timestampToDate(ts) {
            var d = new Date(ts);
            d = d.toISOString().split("T")[0].split("-");

            return d[2] + "/" + d[1] + "/" + d[0];
        }
    }]);

    return Graph;
}();

global.Graph = Graph;
module.exports.Graph = Graph;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./KERNEL_ADJMATRIX_UPDATE.class":3,"./KERNEL_DIR.class":4,"./ProccessImg.class":5,"./VFP_NODE.class":6,"./VFP_NODEPICKDRAG.class":7,"scejs":1}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KERNEL_DIR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphUtil = require("./graphUtil");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KERNEL_DIR = exports.KERNEL_DIR = function () {
    function KERNEL_DIR() {
        _classCallCheck(this, KERNEL_DIR);
    }

    _createClass(KERNEL_DIR, null, [{
        key: "getSrc",
        value: function getSrc(customCode, geometryLength, efferentStart, efferentNodesCount, _enableNeuronalNetwork) {
            var outputArr = null;
            var returnStr = null;
            if (_enableNeuronalNetwork === true) {
                outputArr = ["dir", "posXYZW", "dataB", "dataF", "dataG", "dataH"];
                returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0), currentDataB, currentDataF, currentDataG, currentDataH];';
            } else {
                outputArr = ["dir", "posXYZW"];
                returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0)];';
            }

            return ["x", outputArr,
            // head
            _graphUtil.GraphUtils.adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount),

            // source
            "float nodeId = data[x].x;\n                    float numOfConnections = data[x].y;\n                    vec2 xGeometry = get_global_id(nodeId, uBufferWidth, " + geometryLength.toFixed(1) + ");\n\n\n                    vec3 currentPos = posXYZW[xGeometry].xyz;\n\n                    float bornDate = dataB[xGeometry].x;\n                    float dieDate = dataB[xGeometry].y;\n\n                    vec3 currentDir = dir[xGeometry].xyz;\n\n\n                    vec4 currentDataB = dataB[xGeometry];\n                    vec4 currentDataF = dataF[xGeometry];\n                    vec4 currentDataG = dataG[xGeometry];\n                    vec4 currentDataH = dataH[xGeometry];\n\n                    currentDir = vec3(0.0, 0.0, 0.0);\n\n                    if(enableForceLayout == 1.0) {\n                        idAdjMatrixResponse adjM = idAdjMatrix_ForceLayout(nodeId, currentPos, currentDir, numOfConnections, currentTimestamp, bornDate, dieDate, enableNeuronalNetwork);\n                        currentDir = (adjM.collisionExists == 1.0) ? adjM.force : currentDir+(adjM.force*1.0);\n\n                        if(enableNeuronalNetwork == 1.0 && currentTrainLayer == -3.0) {\n                            currentDataB = vec4(currentDataB.x, currentDataB.y, adjM.netFOutputA, adjM.netErrorWeightA);\n                            currentDataF = vec4(adjM.netFOutputB, adjM.netErrorWeightB, adjM.netFOutputC, adjM.netErrorWeightC);\n                            currentDataG = vec4(adjM.netFOutputD, adjM.netErrorWeightD, adjM.netFOutputE, adjM.netErrorWeightE);\n                            currentDataH = vec4(adjM.netFOutputF, adjM.netErrorWeightF, adjM.netFOutputG, adjM.netErrorWeightG);\n                        }\n                    }\n\n                    " + (customCode !== undefined ? customCode : '') + "\n\n                    if(enableDrag == 1.0) {\n                        if(nodeId == idToDrag) {\n                            currentPos = vec3(MouseDragTranslationX, MouseDragTranslationY, MouseDragTranslationZ);\n                        }\n                    }\n\n                    currentPos += currentDir;\n                    if(only2d == 1.0) {\n                        currentPos.y = 0.0;\n                    }\n\n                    " + returnStr];
        }
    }]);

    return KERNEL_DIR;
}();

global.KERNEL_DIR = KERNEL_DIR;
module.exports.KERNEL_DIR = KERNEL_DIR;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./graphUtil":10}],5:[function(require,module,exports){
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
},{"scejs":1}],6:[function(require,module,exports){
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
},{"./graphUtil":10,"scejs":1}],7:[function(require,module,exports){
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
},{"scejs":1}],8:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GBrainRL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gbrain = require("./gbrain");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ConvNetJS Reinforcement Learning Module (https://github.com/karpathy/convnetjs)
 */
/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.num_inputs
 * @param {int} jsonIn.num_actions
 * @param {int} jsonIn.temporal_window
 * @param {int} jsonIn.experience_size
 * @param {number} jsonIn.gamma
 * @param {number} jsonIn.epsilon_min
 * @param {number} jsonIn.epsilon_test_time
 * @param {int} jsonIn.start_learn_threshold
 * @param {int} jsonIn.gpu_batch_repeats
 * @param {Array<Object>} jsonIn.layer_defs
 */

var GBrainRL = exports.GBrainRL = function () {
    function GBrainRL(jsonIn) {
        _classCallCheck(this, GBrainRL);

        this.gbrain = null;

        this.num_inputs = jsonIn.num_inputs;
        this.num_actions = jsonIn.num_actions;
        this.temporal_window = jsonIn.temporal_window;
        this.experience_size = jsonIn.experience_size;
        this.gamma = jsonIn.gamma;
        this.epsilon_min = jsonIn.epsilon_min;
        this.epsilon_test_time = jsonIn.epsilon_test_time;
        this.start_learn_threshold = jsonIn.start_learn_threshold;

        this.net_inputs = this.num_inputs * this.temporal_window + this.num_actions * this.temporal_window + this.num_inputs;
        this.window_size = Math.max(this.temporal_window, 2);

        this.state_window = new Array(this.window_size);
        this.action_window = new Array(this.window_size);
        this.reward_window = new Array(this.window_size);
        this.net_window = new Array(this.window_size);

        this.experience = [];

        this.onLearned = null;

        this.age = 0;
        this.epsilon = 1.0;
        this.avcost = 0.0;

        this.latest_reward = 0;
        this.last_input_array = null;
        this.forward_passes = 0;
        this.learning = true;

        this.sweep = 0;
        this.sweepMax = 200;
        this.sweepDir = 0;

        this.learning_steps_total = 60000;
        this.learning_steps_burnin = 300;

        this.arrInputs = [];
        this.arrTargets = [];

        this.gbrain = new _gbrain.GBrain({ "target": jsonIn.target,
            "dimensions": jsonIn.dimensions });
        this.gbrain.makeLayers(jsonIn.layer_defs);

        this.lastTotalError = 0;
        this.currentBatchRepeat = jsonIn.gpu_batch_repeats;
    }

    _createClass(GBrainRL, [{
        key: "getNetInput",
        value: function getNetInput(xt) {
            // return s = (x,a,x,a,x,a,xt) state vector.
            // It's a concatenation of last window_size (x,a) pairs and current state x
            var w = [];
            w = w.concat(xt); // start with current state
            // and now go backwards and append states and actions from history temporal_window times
            var n = this.window_size;
            for (var k = 0; k < this.temporal_window; k++) {
                // state
                w = w.concat(this.state_window[n - 1 - k]);
                // action, encoded as 1-of-k indicator vector. We scale it up a bit because
                // we dont want weight regularization to undervalue this information, as it only exists once
                var action1ofk = new Array(this.num_actions);
                for (var q = 0; q < this.num_actions; q++) {
                    action1ofk[q] = 0.0;
                }action1ofk[this.action_window[n - 1 - k]] = 1.0 * this.num_inputs;
                w = w.concat(action1ofk);
            }
            return w;
        }
    }, {
        key: "random_action",
        value: function random_action() {
            return Math.floor(Math.random() * this.num_actions);
        }
    }, {
        key: "policy",
        value: function policy(s, onP) {
            // compute the value of doing any action in this state
            // and return the argmax action and its value
            this.gbrain.forward(s, function (data) {
                var maxacts = [];
                for (var n = 0; n < data.length; n++) {
                    var maxk = 0;
                    var maxval = data[n][0].output;

                    for (var nb = 1; nb < data[n].length; nb++) {
                        if (data[n][nb].output > maxval) {
                            maxk = nb;
                            maxval = data[n][nb].output;
                        }
                    }
                    maxacts.push({ "action": maxk, "value": maxval });
                }

                onP(maxacts);
            });
        }
    }, {
        key: "pushWindow",
        value: function pushWindow(input_array, net_input, action) {
            // remember the state and action we took for backward pass
            this.state_window.shift();
            this.state_window.push(input_array);

            this.net_window.shift();
            this.net_window.push(net_input);

            this.action_window.shift();
            this.action_window.push(action);
        }
    }, {
        key: "forward",
        value: function forward(input_array, onAction) {
            var _this = this;

            this.forward_passes++;
            this.last_input_array = input_array;

            var action = null;
            var net_input = null;
            if (this.forward_passes > this.temporal_window) {
                // we have enough to actually do something reasonable
                net_input = this.getNetInput(input_array);
                if (this.learning === true) {
                    var otr = Math.min(1, Math.max(0, this.latest_reward));
                    var rewardMultiplier = otr > 0 ? 1.0 - otr : otr * -1;
                    rewardMultiplier = Math.min(1, Math.max(0, rewardMultiplier)) * 2;
                    rewardMultiplier = Math.min(1, Math.max(0.1, rewardMultiplier));

                    if (this.sweep >= this.sweepMax) this.sweepDir = -1;else if (this.sweep <= 0) this.sweepDir = 1;

                    this.sweep += this.sweepDir;
                    var sweepMultiplier = this.sweep / this.sweepMax;
                    //this.epsilon = Math.max(this.epsilon_min, rewardMultiplier*sweepMultiplier);


                    this.epsilon = Math.min(1.0, Math.max(this.epsilon_min, 1.0 - (this.age - this.learning_steps_burnin) / (this.learning_steps_total - this.learning_steps_burnin)));
                } else this.epsilon = this.epsilon_test_time;

                var rf = Math.random();
                if (rf < this.epsilon) {
                    // choose a random action with epsilon probability
                    action = this.random_action();
                    this.pushWindow(input_array, net_input, action);
                    onAction(action);
                } else {
                    // otherwise use our policy to make decision
                    this.policy(net_input, function (maxact) {
                        _this.pushWindow(input_array, net_input, maxact[0].action);
                        onAction(maxact[0].action);
                    });
                }
            } else {
                // pathological case that happens first few iterations
                // before we accumulate window_size inputs
                net_input = [];
                action = this.random_action();
                this.pushWindow(input_array, net_input, action);
                onAction(action);
            }
        }
    }, {
        key: "train",
        value: function train() {
            var _this2 = this;

            this.gbrain.forward(this.arrInputs, function (data) {
                _this2.gbrain.train(_this2.arrTargets, function (data) {
                    _this2.arrInputs = [];
                    _this2.arrTargets = [];

                    //this.avcost = this.avcost/this.gbrain.batch_size;
                    //this.average_loss_window.add(this.avcost); TODO

                    if (_this2.currentBatchRepeat === 9) _this2.onLearned();else {
                        _this2.currentBatchRepeat++;
                        _this2.bb();
                    }
                });
            });
        }
    }, {
        key: "bb",
        value: function bb() {
            var _this3 = this;

            var bEntries = [];
            var state1_entries = [];
            for (var n = 0; n < this.gbrain.batch_size; n++) {
                var e = this.experience[Math.floor(Math.random() * this.experience.length)];
                bEntries.push(e);
                for (var nb = 0; nb < e.state1.length; nb++) {
                    state1_entries.push(e.state1[nb]);
                }
            }
            this.policy(state1_entries, function (maxact) {
                var state0_entries = [];

                for (var _n = 0; _n < _this3.gbrain.batch_size; _n++) {
                    var r = bEntries[_n].reward0 + _this3.gamma * maxact[_n].value;
                    var ystruct = { dim: bEntries[_n].action0, val: r };

                    for (var _nb = 0; _nb < bEntries[_n].state0.length; _nb++) {
                        state0_entries.push(bEntries[_n].state0[_nb]);
                    }_this3.arrTargets.push(ystruct);
                }
                _this3.arrInputs = state0_entries;

                _this3.avcost = 0.0;
                _this3.train();
            });
        }
    }, {
        key: "backward",
        value: function backward(reward, _onLearned) {
            this.latest_reward = reward;
            this.onLearned = _onLearned;
            //this.average_reward_window.add(reward); TODO
            this.reward_window.shift();
            this.reward_window.push(reward);

            if (this.learning === false) this.onLearned();else {
                this.age++;

                // it is time t+1 and we have to store (s_t, a_t, r_t, s_{t+1}) as new experience
                // (given that an appropriate number of state measurements already exist, of course)
                if (this.forward_passes > this.temporal_window + 1) {
                    var n = this.window_size;
                    var e = { "state0": this.net_window[n - 2],
                        "action0": this.action_window[n - 2],
                        "reward0": this.reward_window[n - 2],
                        "state1": this.net_window[n - 1] };
                    if (this.experience.length < this.experience_size) this.experience.push(e);else {
                        var _e = Math.floor(Math.random() * this.experience.length);
                        this.experience[_e] = _e;
                    }
                }

                if (this.experience.length > this.start_learn_threshold) {
                    this.currentBatchRepeat = 0;
                    this.bb();
                } else this.onLearned();
            }
        }
    }]);

    return GBrainRL;
}();

global.GBrainRL = GBrainRL;
module.exports.GBrainRL = GBrainRL;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./gbrain":9}],9:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GBrain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _Graph = require("./Graph.class");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.batch_size
 */
var GBrain = exports.GBrain = function () {
    function GBrain(jsonIn) {
        _classCallCheck(this, GBrain);

        this.project = null;
        this.graph = null;

        this.inputCount = 0;
        this.outputCount = 0;
        this.neuronLayers = [];
        this.batch_size = 7;

        this.ini(jsonIn);
    }

    /**
     * @param {Object} jsonIn
     * @param {HTMLElement} jsonIn.target
     * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
     * @param {boolean} [jsonIn.enableUI=false]
     * @param {WebGLRenderingContext} [jsonIn.gl=undefined]
     */


    _createClass(GBrain, [{
        key: "ini",
        value: function ini(jsonIn) {
            var sce = new SCE();
            sce.initialize(jsonIn);

            this.project = new Project();
            sce.loadProject(this.project);

            var stage = new Stage();
            this.project.addStage(stage);
            this.project.setActiveStage(stage);

            // CAMERA
            var simpleCamera = new SimpleCamera(sce);
            simpleCamera.setView(Constants.VIEW_TYPES.TOP);
            simpleCamera.setVelocity(1.0);
            sce.setDimensions(jsonIn.dimensions.width, jsonIn.dimensions.height);

            // GRID
            //let grid = new Grid(sce);
            //grid.generate(100.0, 1.0);

            this.graph = new _Graph.Graph(sce, { "enableFonts": true });
            this.graph.enableNeuronalNetwork();
            this.graph.layerCount = 0;
            this.graph.batch_size = this.batch_size;

            var mesh_point = new Mesh().loadPoint();
            //this.graph.setNodeMesh(mesh_point);


            this.graph.setFontsImage(sce.sceDirectory + "/Prefabs/Graph/fonts.png");
        }
    }, {
        key: "makeLayers",


        /**
         * @param {Array<Object>} layer_defs
         */
        value: function makeLayers(layer_defs) {
            var _this = this;

            var offsetX = -30;
            var lType = { "input": function input(l) {
                    var offsetZ = -10.0 * (l.depth / 2);
                    for (var n = 0; n < l.depth; n++) {
                        _this.graph.afferentNodesCount++;
                        _this.graph.addAfferentNeuron("input" + _this.inputCount, [offsetX, 0.0, offsetZ, 1.0]); // afferent neuron (sensor)
                        _this.inputCount++;
                        offsetZ += 10.0;
                    }

                    _this.graph.layerCount++;
                    offsetX += 30.0;
                },
                "fc": function fc(l) {
                    var neuronLayer = _this.graph.createNeuronLayer(1, l.num_neurons, [offsetX, 0.0, 0.0, 1.0], 5.0); // numX, numY, visible position
                    _this.neuronLayers.push(neuronLayer);

                    if (_this.graph.layerCount === 1) {
                        for (var n = 0; n < _this.inputCount; n++) {
                            _this.graph.connectNeuronWithNeuronLayer({ "neuron": "input" + n,
                                "neuronLayer": _this.neuronLayers[_this.neuronLayers.length - 1],
                                "activationFunc": 0,
                                "weight": null,
                                "multiplier": 1,
                                "layerNum": _this.graph.layerCount - 1 });
                        }
                    } else _this.graph.connectNeuronLayerWithNeuronLayer({ "neuronLayerOrigin": _this.neuronLayers[_this.neuronLayers.length - 2],
                        "neuronLayerTarget": _this.neuronLayers[_this.neuronLayers.length - 1],
                        "layerNum": _this.graph.layerCount - 1 }); // TODO l.activation

                    _this.graph.layerCount++;
                    offsetX += 30.0;
                },
                "regression": function regression(l) {
                    var offsetZ = -30.0 * (l.num_neurons / 2);
                    for (var n = 0; n < l.num_neurons; n++) {
                        _this.graph.efferentNodesCount++;
                        _this.graph.addEfferentNeuron("output" + _this.outputCount, [offsetX, 0.0, offsetZ, 1.0]); // efferent neuron (actuator)
                        _this.graph.connectNeuronLayerWithNeuron({ "neuronLayer": _this.neuronLayers[_this.neuronLayers.length - 1],
                            "neuron": "output" + _this.outputCount,
                            "layerNum": _this.graph.layerCount - 1 });

                        _this.outputCount++;
                        offsetZ += 30.0;
                    }
                    _this.graph.layerCount++;
                } };
            for (var n = 0; n < layer_defs.length; n++) {
                var l = layer_defs[n];
                lType[l.type](l);
            }

            this.graph.createWebGLBuffers();
            this.graph.enableForceLayout();
        }
    }, {
        key: "forward",


        /**
         * @param {Array<number>} state
         * @param {Function} onAction
         */
        value: function forward(state, _onAction) {
            this.graph.forward({ "state": state,
                "onAction": function onAction(data) {
                    _onAction(data);
                } });
        }
    }, {
        key: "train",


        /**
         * @param {Object} reward {dim: actionId for the reward , val: number}
         * @param {Function} onTrain
         */
        value: function train(reward, onTrain) {
            var arrReward = [];
            for (var n = 0; n < reward.length; n++) {
                for (var nb = 0; nb < this.outputCount / this.batch_size; nb++) {
                    if (nb === reward[n].dim) arrReward.push(reward[n].val);else arrReward.push(0.0);
                }
            }

            this.graph.train({ "arrReward": arrReward,
                "onTrained": function onTrained(data) {
                    onTrain(data);
                } });
        }
    }, {
        key: "enableShowOutputWeighted",
        value: function enableShowOutputWeighted() {
            this.graph.enableShowOutputWeighted();
        }
    }, {
        key: "disableShowOutputWeighted",
        value: function disableShowOutputWeighted() {
            this.graph.disableShowOutputWeighted();
        }
    }, {
        key: "tick",
        value: function tick() {
            this.project.getActiveStage().tick();
        }
    }]);

    return GBrain;
}();

global.GBrain = GBrain;
module.exports.GBrain = GBrain;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Graph.class":2,"scejs":1}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
"use strict";

var _gbrain = require("./gbrain");

var _gbrainRl = require("./gbrain-rl");

var _Graph = require("./Graph.class");

var _graphUtil = require("./graphUtil");

var _KERNEL_ADJMATRIX_UPDATE = require("./KERNEL_ADJMATRIX_UPDATE.class");

var _KERNEL_DIR = require("./KERNEL_DIR.class");

var _ProccessImg = require("./ProccessImg.class");

var _VFP_NODE = require("./VFP_NODE.class");

var _VFP_NODEPICKDRAG = require("./VFP_NODEPICKDRAG.class");

Object.defineProperty(exports, "__esModule", { value: true });

var exp = { "GBrain": "./gbrain",
    "GBrainRL": "./gbrain-rl",
    "Graph": "./Graph.class",
    "GraphUtils": "./graphUtil",
    "KERNEL_ADJMATRIX_UPDATE": "./KERNEL_ADJMATRIX_UPDATE.class.js",
    "KERNEL_DIR": "./KERNEL_DIR.class.js",
    "ProccessImg": "./ProccessImg.class.js",
    "VFP_NODE": "./VFP_NODE.class.js",
    "VFP_NODEPICKDRAG": "./VFP_NODEPICKDRAG.class.js"
};

for (var key in exp) {
    exports[key] = require(exp[key]);
}
},{"./Graph.class":2,"./KERNEL_ADJMATRIX_UPDATE.class":3,"./KERNEL_DIR.class":4,"./ProccessImg.class":5,"./VFP_NODE.class":6,"./VFP_NODEPICKDRAG.class":7,"./gbrain":9,"./gbrain-rl":8,"./graphUtil":10}]},{},[11]);
