import "scejs";
import {KERNEL_DIR} from "./KERNEL_DIR.class";
import {KERNEL_ADJMATRIX_UPDATE} from "./KERNEL_ADJMATRIX_UPDATE.class";
import {VFP_NODE} from "./VFP_NODE.class";
import {VFP_NODEPICKDRAG} from "./VFP_NODEPICKDRAG.class";
import {ProccessImg} from "./ProccessImg.class";
import {Resources} from "./resources";

/**
* @class
 * @param {SCE} sce
 * @param {Object} jsonIn
 * @param {boolean} jsonIn.enableFonts
 * @param {String} [jsonIn.nodeDrawMode="plane"] - "plane" or "point"
*/
export class Graph {
    constructor(sce, jsonIn) {
        this._sce = sce;
        this._project = this._sce.getLoadedProject();
        this._gl = this._project.getActiveStage().getWebGLContext();
        this._utils = new Utils();

        this.NODE_IMG_COLUMNS = 8.0;
        this.NODE_IMG_WIDTH = 2048;

        this._enableFont = (jsonIn && jsonIn.enableFonts === true);
        this._enableHover = false;
        this._enabledForceLayout = false;
        this._MAX_ADJ_MATRIX_WIDTH = 2048;

        this._playAnimation = false;
        this._loop = false;
        this._animationFrames = 500;

        this._geometryLength = (jsonIn === undefined || (jsonIn && jsonIn.nodeDrawMode === undefined) || (jsonIn && jsonIn.nodeDrawMode === "plane")) ? 4 : 1;
        this.circleSegments = 12;
        this.nodesTextPlanes = 12;

        this.lineVertexCount = 1;

        this.layer_defs = null;
        this.batch_size = null;
        this.layerCount = 0;
        this.gpu_batch_repeats = null;
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


        this.arrAdjMatrix = null; // null, null, linkWeight, columnAsParent
        this.arrAdjMatrixB = null;

        this.enableTrain = 0;
        this._ADJ_MATRIX_WIDTH = null;

        this.readPixel = false;
        this.selectedId = -1;
        this._initialPosDrag = null;

        this._onClickNode = null;

        // meshes
        this.mesh_nodes = (this._geometryLength === 1) ? new Mesh().loadPoint() : new Mesh().loadQuad(4.0, 4.0);
        this.mesh_arrows = new Mesh().loadTriangle({"scale": 1.75, "side": 0.3});
        this.mesh_nodesText = new Mesh().loadQuad(4.0, 4.0);

        // nodes image
        this.objNodeImages = {};


        this._stackNodesImg = [];
        this.nodesImgMask = null;
        this.nodesImgMaskLoaded = false;
        this.nodesImgCrosshair = null;
        this.nodesImgCrosshairLoaded = false;

        this.FONT_IMG_COLUMNS = 7.0;


        // Nodes
        // Data: nodeId, acums, null, null
        // DataB: biasNode, null, netFOutputA, netErrorWeightA (SHARED with LINKS, ARROWS & NODESTEXT)

        // Links
        // Data: nodeId origin, nodeId target, currentLineVertex, repeatId

        // nodes
        this.arrayNodeData = [];
        this.arrayNodeDataB = [];
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
        let comp_mouseEvents = new ComponentMouseEvents();
        this.nodes.addComponent(comp_mouseEvents);
        comp_mouseEvents.onmousedown((evt) => {
            this.selectedId = -1;
            this.mouseDown();
        });
        comp_mouseEvents.onmouseup((evt) => {
            if(this.selectedId !== -1) {
                let n = this._nodesById[this.selectedId];
                if(n !== undefined && n !== null && n.onmouseup !== undefined && n.onmouseup !== null)
                    n.onmouseup(n, evt);
            }
            this.mouseUp();
        });
        comp_mouseEvents.onmousemove((evt, dir) => {
            this.makeDrag(evt, dir);
        });
        comp_mouseEvents.onmousewheel((evt) => {
        });

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
        if(this._enableFont === true) {
            this.nodesText = new Node();
            this.nodesText.setName("graph_nodesText");
            this._project.getActiveStage().addNode(this.nodesText);

            // ComponentTransform
            this.nodesText.addComponent(new ComponentTransform());

            // Component_GPU
            this.comp_renderer_nodesText = new Component_GPU();
            this.nodesText.addComponent(this.comp_renderer_nodesText);

            let image = new Image();
            image.onload = () => {
                this.comp_renderer_nodesText.setArg("fontsImg", () => {return image;});
            };
            image.src = Resources.fonts();
        }
    }

    createLinksObjItem() {
        this.currentLinksObjItem++;

        this.linksObj.push({
            "node": new Node(),
            "componentTransform": new ComponentTransform(),
            "componentRenderer": new Component_GPU(),
            "arrayLinkData": [],
            "arrayLinkNodeName": [],
            "arrayLinkPosXYZW": [],
            "arrayLinkVertexPos": [],
            "startIndexId_link": 0,
            "arrayLinkIndices": []});

        this.linksObj[this.currentLinksObjItem].node.setName("graph_links"+this.currentLinksObjItem);
        this._project.getActiveStage().addNode(this.linksObj[this.currentLinksObjItem].node);

        this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentTransform);

        this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentRenderer);
    };

    createArrowsObjItem() {
        this.currentArrowsObjItem++;

        this.arrowsObj.push({
            "node": new Node(),
            "componentTransform": new ComponentTransform(),
            "componentRenderer": new Component_GPU(),
            "arrayArrowData": [],
            "arrayArrowNodeName": [],
            "arrayArrowPosXYZW": [],
            "arrayArrowVertexPos": [],
            "arrayArrowVertexNormal": [],
            "arrayArrowVertexTexture": [],
            "startIndexId_arrow": 0,
            "arrayArrowIndices": [],
            "arrowArrayItemStart": 0});

        this.arrowsObj[this.currentArrowsObjItem].node.setName("graph_arrows"+this.currentArrowsObjItem);
        this._project.getActiveStage().addNode(this.arrowsObj[this.currentArrowsObjItem].node);

        this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentTransform);

        this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentRenderer);
    };

    /**
     * @param {Function} fn
     */
    onClickNode(fn) {
        this._onClickNode = fn;
    };

    /**
     * @returns {int}
     */
    getNodesCount() {
        return Object.keys(this._nodesByName).length;
    };

    /**
     * @returns {int}
     */
    getLinksCount() {
        return Object.keys(this._links).length;
    };

	/**
	 * @param {String} name
	 * @returns {Node}
	 */
	getNodeByName(name) {
		return this._nodesByName[name];
	};

	/**
	 * @param {int} id
	 * @returns {Node}
	 */
	getNodeById(id) {
		return this._nodesById[id];
	};

	/**
	 * @param {int} nodeId
	 */
	selectNode(nodeId) {
        this.selectedId = nodeId;
        this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
	};

	/**
	 * @returns {number}
	 */
	getSelectedId() {
		return this.selectedId;
	};

    enableHover() {
        this._enableHover = true;
        this.readPixel = true;
        this.comp_renderer_nodes.gpufG.enableGraphic(1);
    };

    /**
     *  @param {boolean} mode2d
     */
    only2d(mode2d) {
        this._only2d = mode2d;
    };

    /**
     * @param {Mesh} mesh
     */
    setNodeMesh(mesh) {
        this.mesh_nodes = mesh;
    };


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
    applyLayout(jsonIn) {
        this.layout = jsonIn;
        // Create custom user arrays args
        let createCustomArgsArrays = (obj, arr) => {
            for(let n=0, fn = arr.length; n < fn; n++) {
                obj[arr[n].trim().split(" ")[1]] = {"arg": arr[n].trim(),
                                                    "nodes_array_value": [],
                                                    "links_array_value": [],
                                                    "arrows_array_value": [],
                                                    "nodestext_array_value": []};
            }
            return obj;
        };

        this.layout.argsDirection = (this.layout.argsDirection !== undefined && this.layout.argsDirection !== null) ? this.layout.argsDirection.split(",") : null;
        this.layout.argsObject = (this.layout.argsObject !== undefined && this.layout.argsObject !== null) ? this.layout.argsObject.split(",") : null;

        this._customArgs = {};
        if(this.layout.argsDirection != null)
            this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsDirection);

        if(this.layout.argsObject != null)
            this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsObject);
    };
    createWebGLBuffers() {
        let varDef_VFPNode = {
            'float4* posXYZW': () => {return null;},
            "float4* dataB": () => {return null;}, // in nodes (SHARED with LINKS, ARROWS & NODESTEXT)
            "float4* dataF": () => {return null;}, // in nodes
            "float4* dataG": () => {return null;}, // in nodes
            "float4* dataH": () => {return null;}, // in nodes
            "float4*attr data": () => {return null;}, // in nodes, nodesText, links & arrows
            'float4*attr nodeVertexPos': () => {return null;},
            'float4*attr nodeVertexNormal': () => {return null;},
            'float4*attr nodeVertexTexture': () => {return null;},
            'float*attr letterId': () => {return null;},
            'float*attr nodeImgId': () => {return null;},
            'indices': () => {return null;},
            "float4* adjacencyMatrix": () => {return null;},
            "float4* adjacencyMatrixB": () => {return null;},
            "float widthAdjMatrix": () => {return null;},
            'float nodesCount': () => {return null;},
            'mat4 PMatrix': () => {return null;},
            'mat4 cameraWMatrix': () => {return null;},
            'mat4 nodeWMatrix': () => {return null;},
            'float isNode': () => {return null;},
            'float isLink': () => {return null;},
            'float isArrow': () => {return null;},
            'float isNodeText': () => {return null;},
            'float bufferNodesWidth': () => {return null;},
            'float bufferLinksWidth': () => {return null;},
            'float bufferArrowsWidth': () => {return null;},
            'float bufferTextsWidth': () => {return null;},
            'float idToDrag': () => {return null;},
            'float idToHover': () => {return null;},
            "float enableForceLayout": () => {return null;},
            'float layerCount': () => {return null;},
            "float learningRate": () => {return null;},
            "float gpu_batch_repeats": () => {return null;},
            'float afferentNodesCount': () => {return null;},
            'float efferentNodesCount': () => {return null;},
            'float efferentStart': () => {return null;},
            'float enableTrain': () => {return null;},
            'float multiplyOutput': () => {return null;},
            'float viewNeuronDynamics': () => {return null;},
            'float only2d': () => {return null;},
            'float nodeImgColumns': () => {return null;},
            'float fontImgColumns': () => {return null;},
            'float4* fontsImg': () => {return null;},
            'float4* nodesImg': () => {return null;},
            'float4* nodesImgCrosshair': () => {return null;}
            };
        let aC = (this.afferentNodesCount === 0) ? 1: this.afferentNodesCount;
        let eC = (this.efferentNodesCount === 0) ? 1: this.efferentNodesCount;
        varDef_VFPNode['float afferentNodesA['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesA['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesB['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesB['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesC['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesC['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesD['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesD['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesE['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesE['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesF['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesF['+eC+']'] = () => {return null;};
        varDef_VFPNode['float afferentNodesG['+aC+']'] = () => {return null;};
        varDef_VFPNode['float efferentNodesG['+eC+']'] = () => {return null;};

        if(this.layout.argsDirection !== undefined && this.layout.argsDirection !== null) {
            for(let n=0; n < this.layout.argsDirection.length; n++)
                varDef_VFPNode[this.layout.argsDirection[n]] = () => {return null;};
        }

        if(this.layout.argsObject !== undefined && this.layout.argsObject !== null) {
            for(let n=0; n < this.layout.argsObject.length; n++)
                varDef_VFPNode[this.layout.argsObject[n]] = () => {return null;};
        }

        let varDef_NodesKernel = {
            'float4* dir': () => {return null;},
            'float nodesCount': () => {return null;},
            'float enableDrag': () => {return null;},
            'float initialPosX': () => {return null;},
            'float initialPosY': () => {return null;},
            'float initialPosZ': () => {return null;},
            'float MouseDragTranslationX': () => {return null;},
            'float MouseDragTranslationY': () => {return null;},
            'float MouseDragTranslationZ': () => {return null;}};



        ///////////////////////////////////////////////////////////////////////////////////////////
        //                          LINKS
        ///////////////////////////////////////////////////////////////////////////////////////////
        for(let na=0; na < this.linksObj.length; na++) {
            this.linksObj[na].componentRenderer.setGPUFor(  this.linksObj[na].componentRenderer.gl,
                                            Object.create(varDef_VFPNode),
                                            {"type": "GRAPHIC",
                                            "name": "LINKS_VFP_NODE",
                                            "viewSource": false,
                                            "config": VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                                            "drawMode": 1,
                                            "depthTest": true,
                                            "blend": false,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.ONE,
                                            "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA});
            this.linksObj[na].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
        }
        ///////////////////////////////////////////////////////////////////////////////////////////
        //                          ARROWS
        ///////////////////////////////////////////////////////////////////////////////////////////
        for(let na=0; na < this.arrowsObj.length; na++) {
            this.arrowsObj[na].componentRenderer.setGPUFor( this.arrowsObj[na].componentRenderer.gl,
                                            Object.create(varDef_VFPNode),
                                            {"type": "GRAPHIC",
                                            "name": "ARROWS_VFP_NODE",
                                            "viewSource": false,
                                            "config": VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                                            "drawMode": 4,
                                            "depthTest": true,
                                            "blend": true,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                                            "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA});
            this.arrowsObj[na].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
        }
        ///////////////////////////////////////////////////////////////////////////////////////////
        //                          NODES
        ///////////////////////////////////////////////////////////////////////////////////////////
        let nodesVarDef = Object.create(varDef_VFPNode);
        for (let key in varDef_NodesKernel)
            nodesVarDef[key] = varDef_NodesKernel[key];

        this.comp_renderer_nodes.setGPUFor( this.comp_renderer_nodes.gl,
                                            nodesVarDef,
                                            {"type": "KERNEL",
                                            "name": "NODES_KERNEL_DIR",
                                            "viewSource": false,
                                            "config": KERNEL_DIR.getSrc(this.layout.codeDirection, this._geometryLength, this.afferentNodesCount, (this.currentNodeId-this.efferentNodesCount), this.efferentNodesCount),
                                            "drawMode": ((this._geometryLength === 1) ? 0 : 4),
                                            "depthTest": true,
                                            "blend": false,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.ONE,
                                            "blendDstMode": Constants.BLENDING_MODES.ONE},
                                            {"type": "KERNEL",
                                            "name": "NODES_KERNEL_ADJMATRIX_UPDATE",
                                            "viewSource": false,
                                            "config": KERNEL_ADJMATRIX_UPDATE.getSrc(this._geometryLength),
                                            "drawMode": ((this._geometryLength === 1) ? 0 : 4),
                                            "depthTest": true,
                                            "blend": false,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.ONE,
                                            "blendDstMode": Constants.BLENDING_MODES.ONE},
                                            {"type": "GRAPHIC",
                                            "name": "NODES_VFP_NODE",
                                            "viewSource": false,
                                            "config": VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                                            "drawMode": ((this._geometryLength === 1) ? 0 : 4),
                                            "depthTest": true,
                                            "blend": true,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                                            "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA},
                                            {"type": "GRAPHIC",
                                            "name": "NODES_VFP_NODEPICKDRAG",
                                            "viewSource": false,
                                            "config": VFP_NODEPICKDRAG.getSrc(this._geometryLength),
                                            "drawMode": ((this._geometryLength === 1) ? 0 : 4),
                                            "depthTest": true,
                                            "blend": true,
                                            "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                            "blendSrcMode": Constants.BLENDING_MODES.ONE,
                                            "blendDstMode": Constants.BLENDING_MODES.ZERO});
        let comp_screenEffects = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU);
        this.comp_renderer_nodes.getComponentBufferArg("RGB", comp_screenEffects);

        // KERNEL_DIR
        this.comp_renderer_nodes.gpufG.onPreProcessKernel(0, () => {
            this.comp_renderer_nodes.setArg("only2d", () => {return ((this._only2d===true)?1.0:0.0);});
        });

        // KERNEL_ADJMATRIX_UPDATE
        this.comp_renderer_nodes.gpufG.disableKernel(1);

        // VFP_NODEPICKDRAG
        this.comp_renderer_nodes.gpufG.onPostProcessGraphic(1, () => {
            this.procSelectedOrHover();
        });
        this.comp_renderer_nodes.gpufG.disableGraphic(1);



        ///////////////////////////////////////////////////////////////////////////////////////////
        //                          NODESTEXT
        ///////////////////////////////////////////////////////////////////////////////////////////
        if(this._enableFont === true) {
            this.comp_renderer_nodesText.setGPUFor( this.comp_renderer_nodesText.gl,
                                                    Object.create(varDef_VFPNode),
                                                    {"type": "GRAPHIC",
                                                    "name": "NODESTEXT_VFP_NODE",
                                                    "viewSource": false,
                                                    "config": VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                                                    "drawMode": 4,
                                                    "depthTest": true,
                                                    "blend": true,
                                                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                                                    "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                                                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA});
            this.comp_renderer_nodesText.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
        }

        this.enableHov(-1);

        this.updateNodes();
        this.updateLinks();
    };

    mouseDown() {
        if(this._enableHover === false) {
            this.readPixel = true;

            this.comp_renderer_nodes.gpufG.enableGraphic(1);
        }
    };

    mouseUp() {
        this.comp_renderer_nodes.setArg("enableDrag", () => {return 0;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("enableDrag", () => {return 0;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg("enableDrag", () => {return 0;});
        if(this._enableFont === true)
            this.comp_renderer_nodesText.setArg("enableDrag", () => {return 0;});

        if(this.selectedId === -1) {
            this.comp_renderer_nodes.setArg("idToDrag", () => {return -1;});
            for(let na=0; na < this.linksObj.length; na++)
                this.linksObj[na].componentRenderer.setArg("idToDrag", () => {return -1;});
            for(let na=0; na < this.arrowsObj.length; na++)
                this.arrowsObj[na].componentRenderer.setArg("idToDrag", () => {return -1;});
            if(this._enableFont === true)
                this.comp_renderer_nodesText.setArg("idToDrag", () => {return -1;});
        }

        if(this._enableHover === true) {
            this.readPixel = true;

            this.comp_renderer_nodes.gpufG.enableGraphic(1);
        }
    };

    procSelectedOrHover() {
        if(this._enableHover === false) {
            if(this.readPixel === true) {
                this.readPixel = false;

                this.readPix();

                this.comp_renderer_nodes.gpufG.disableGraphic(1);
            }
        } else {
            let comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);
            if(comp_controller_trans_target.isLeftBtnActive() === true) {
                this.readPixel = false;
            }

            this.readPix();

            if(comp_controller_trans_target.isLeftBtnActive() === true) {
                this.comp_renderer_nodes.gpufG.disableGraphic(1);
            }
        }
    };

    readPix() {
        let arrayPick = new Uint8Array(4);
        let mousePos = this._sce.getEvents().getMousePosition();
        this._gl.readPixels(mousePos.x, (this._sce.getCanvas().height-(mousePos.y)), 1, 1, this._gl.RGBA, this._gl.UNSIGNED_BYTE, arrayPick);

        let unpackValue = this._utils.unpack([arrayPick[0]/255, arrayPick[1]/255, arrayPick[2]/255, arrayPick[3]/255]); // value from 0.0 to 1.0
        this.selectedId = Math.round(unpackValue*1000000.0)-1.0;
        //console.log("hoverId: "+this.selectedId);
        if(this.selectedId !== -1 && this.selectedId < this.currentNodeId) {
            let node = this._nodesById[this.selectedId];
            if(node !== undefined && node !== null && node.onmousedown !== undefined && node.onmousedown !== null)
                node.onmousedown(node);

            if(node !== undefined && node !== null && this._onClickNode !== undefined && this._onClickNode !== null)
                this._onClickNode(node);


            let arr4Uint8_XYZW = this.comp_renderer_nodes.gpufG.readArg("posXYZW");
            let x = arr4Uint8_XYZW[(this._nodesById[this.selectedId].itemStart*4)];
            let y = arr4Uint8_XYZW[(this._nodesById[this.selectedId].itemStart*4)+1];
            let z = arr4Uint8_XYZW[(this._nodesById[this.selectedId].itemStart*4)+2];
            this._initialPosDrag = $V3([x,y,z]);

            this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
        }
    };

    /**
     * @param {MouseEvent} [evt]
     * @param {StormV3} dir
     */
    makeDrag(evt, dir) {
        let comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);

        if(this._enableHover === false) {
            if(comp_controller_trans_target.isLeftBtnActive() === true) {
                if(this.selectedId === -1)
                    this.disableDrag();
                else {
                    this.enableDrag(this.selectedId, dir);
                    console.log("selectedId: "+this.selectedId);
                }
            }
        } else {
            if(comp_controller_trans_target.isLeftBtnActive() === true) {
                this.enableHov(-1);

                if(this.selectedId === -1)
                    this.disableDrag();
                else {
                    this.enableDrag(this.selectedId, dir);
                    console.log("selectedId: "+this.selectedId);
                }
            } else {
                this.enableHov(this.selectedId);
            }
        }
    };

    /**
     * @param {int} selectedId
     */
    enableHov(selectedId) {
        this.comp_renderer_nodes.setArg("idToHover", () => {return selectedId;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("idToHover", () => {return selectedId;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg("idToHover", () => {return selectedId;});
        if(this._enableFont === true) {
            this.comp_renderer_nodesText.setArg("idToHover", () => {return selectedId;});
        }
    };

    /**
     * @param {int} selectedId
     * @param {StormV3} dir
     */
    enableDrag(selectedId, dir) {
        let comp_projection = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION);
        let finalPos = this._initialPosDrag.add(dir.x((comp_projection.getFov()*2.0)/this._sce.getCanvas().width));

        this.comp_renderer_nodes.setArg("enableDrag", () => {return 1;});
        this.comp_renderer_nodes.setArg("idToDrag", () => {return selectedId;});
        this.comp_renderer_nodes.setArg("MouseDragTranslationX", () => {return finalPos.e[0];});
        this.comp_renderer_nodes.setArg("MouseDragTranslationY", () => {return finalPos.e[1];});
        this.comp_renderer_nodes.setArg("MouseDragTranslationZ", () => {return finalPos.e[2];});
        this.comp_renderer_nodes.setArg("initialPosX", () => {return this._initialPosDrag.e[0];});
        this.comp_renderer_nodes.setArg("initialPosY", () => {return this._initialPosDrag.e[1];});
        this.comp_renderer_nodes.setArg("initialPosZ", () => {return this._initialPosDrag.e[2];});

        for(let na=0; na < this.linksObj.length; na++) {
            this.linksObj[na].componentRenderer.setArg("enableDrag", () => {return 1;});
            this.linksObj[na].componentRenderer.setArg("idToDrag", () => {return selectedId;});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", () => {return finalPos.e[0];});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", () => {return finalPos.e[1];});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", () => {return finalPos.e[2];});
            this.linksObj[na].componentRenderer.setArg("initialPosX", () => {return this._initialPosDrag.e[0];});
            this.linksObj[na].componentRenderer.setArg("initialPosY", () => {return this._initialPosDrag.e[1];});
            this.linksObj[na].componentRenderer.setArg("initialPosZ", () => {return this._initialPosDrag.e[2];});
        }

        for(let na=0; na < this.arrowsObj.length; na++) {
            this.arrowsObj[na].componentRenderer.setArg("enableDrag", () => {return 1;});
            this.arrowsObj[na].componentRenderer.setArg("idToDrag", () => {return selectedId;});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationX", () => {return finalPos.e[0];});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationY", () => {return finalPos.e[1];});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationZ", () => {return finalPos.e[2];});
            this.arrowsObj[na].componentRenderer.setArg("initialPosX", () => {return this._initialPosDrag.e[0];});
            this.arrowsObj[na].componentRenderer.setArg("initialPosY", () => {return this._initialPosDrag.e[1];});
            this.arrowsObj[na].componentRenderer.setArg("initialPosZ", () => {return this._initialPosDrag.e[2];});
        }

        if(this._enableFont === true) {
            this.comp_renderer_nodesText.setArg("enableDrag", () => {return 1;});
            this.comp_renderer_nodesText.setArg("idToDrag", () => {return selectedId;});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationX", () => {return finalPos.e[0];});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationY", () => {return finalPos.e[1];});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", () => {return finalPos.e[2];});
            this.comp_renderer_nodesText.setArg("initialPosX", () => {return this._initialPosDrag.e[0];});
            this.comp_renderer_nodesText.setArg("initialPosY", () => {return this._initialPosDrag.e[1];});
            this.comp_renderer_nodesText.setArg("initialPosZ", () => {return this._initialPosDrag.e[2];});
        }
    };

    /**
     * disableDrag
     */
    disableDrag() {
        this.comp_renderer_nodes.setArg("enableDrag", () => {return 0;});
        this.comp_renderer_nodes.setArg("idToDrag", () => {return 0;});
        this.comp_renderer_nodes.setArg("MouseDragTranslationX", () => {return 0;});
        this.comp_renderer_nodes.setArg("MouseDragTranslationY", () => {return 0;});
        this.comp_renderer_nodes.setArg("MouseDragTranslationZ", () => {return 0;});

        for(let na=0; na < this.linksObj.length; na++) {
            this.linksObj[na].componentRenderer.setArg("enableDrag", () => {return 0;});
            this.linksObj[na].componentRenderer.setArg("idToDrag", () => {return 0;});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", () => {return 0;});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", () => {return 0;});
            this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", () => {return 0;});
        }

        for(let na=0; na < this.arrowsObj.length; na++) {
            this.arrowsObj[na].componentRenderer.setArg("enableDrag", () => {return 0;});
            this.arrowsObj[na].componentRenderer.setArg("idToDrag", () => {return 0;});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationX", () => {return 0;});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationY", () => {return 0;});
            this.arrowsObj[na].componentRenderer.setArg("MouseDragTranslationZ", () => {return 0;});
        }

        if(this._enableFont === true) {
            this.comp_renderer_nodesText.setArg("enableDrag", () => {return 0;});
            this.comp_renderer_nodesText.setArg("idToDrag", () => {return 0;});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationX", () => {return 0;});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationY", () => {return 0;});
            this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", () => {return 0;});
        }
    };





    enableNeuronalNetwork() {
        this.applyLayout({
            // DIRECTION
            "argsDirection":
                // destination
                "float4* dest,float* enableDestination",
            "codeDirection":
                // destination
                `if(enableDestination[x] == 1.0) {
                    vec3 destinationPos = dest[x].xyz;
                    vec3 dirDestination = normalize(destinationPos-currentPos);
                    float distan = abs(distance(currentPos,destinationPos));
                    float dirDestWeight = sqrt(distan);
                    currentDir = (currentDir+(dirDestination*dirDestWeight))*dirDestWeight*0.1;
                }`,

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
                'if(isArrow == 1.0 && currentLineVertex == 1.0) nodeVertexColor = vec4(0.3, 0.2, 0.2, 1.0);'+ // this is isTarget for arrows
                'if(isArrow == 1.0 && currentLineVertex == 0.0) nodeVertexColor = vec4(1.0, 0.0, 0.0, 0.0);' // this is isTarget for arrows

        });
    };

    /**
     * @param {String} neuronName
     * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
     * @param {int} [biasNeuron]
     */
    addNeuron(neuronName, destination, biasNeuron) {
        let offs = 1000;
        let pos = [-(offs/2)+(Math.random()*offs), -(offs/2)+(Math.random()*offs), -(offs/2)+(Math.random()*offs), 1.0];
        let dest = (destination !== undefined && destination !== null) ? destination : [0.0, 0.0, 0.0, 1.0];
        let enableDest = (destination !== undefined && destination !== null) ? 1.0 : 0.0;

        this.addNode({
            "name": neuronName,
            "data": neuronName,
            "label": neuronName.toString(),
            "position": pos,
            "color": Resources.imgWhite(),
            "layoutNodeArgumentData": {
                "nodeColor": [1.0, 1.0, 1.0, 1.0],
                "enableDestination": enableDest,
                "dest": dest
            },
            "onmouseup": (nodeData) => {

            },
            "biasNeuron": ((biasNeuron !== undefined && biasNeuron !== null) ? biasNeuron : 0.0) });
    };

    /**
     * @param {String} neuronName
     * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
     */
    addAfferentNeuron(neuronName, destination) {
        this.afferentNodesCount++;
        this.afferentNeuron.push(neuronName);
        this.addNeuron(neuronName, destination);
    };

    /**
     * @param {String} neuronName
     * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
     */
    addEfferentNeuron(neuronName, destination) {
        this.efferentNodesCount++;
        this.efferentNeuron.push(neuronName);
        this.addNeuron(neuronName, destination);
    };

    /**
     * @param {int} numX
     * @param {int} numY
     * @param {Array<number>} pos
     * @param {number} nodSep
     * @param {int} [hasBias]
     */
    createNeuronLayer(numX, numY, pos, nodSep, hasBias) {
        let arr = [];
        for(let x=0; x < numX; x++) {
            for(let y=0; y < numY; y++) {
                let position = [pos[0]+((x-(numX/2))*nodSep), pos[1], pos[2]+((y-(numY/2))*nodSep), pos[3]];

                this.addNeuron(this.currHiddenNeuron.toString(), position);
                arr.push(this.currHiddenNeuron);
                this.currHiddenNeuron++;
            }
        }

        // bias neuron
        if(hasBias === 1.0) {
            let position = [pos[0], pos[1]-10.0, pos[2]+(((numY+3)-(numY/2))*nodSep), pos[3]];
            this.addNeuron(this.currHiddenNeuron.toString(), position, hasBias);
            arr.push(this.currHiddenNeuron);
            this.currHiddenNeuron++;
        }

        return arr;
    };

    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.neuron
     * @param {Array<number>} jsonIn.position
     * @param {int} jsonIn.w
     * @param {int} jsonIn.h
     */
    createXYNeuronsFromImage(jsonIn) {
        let arr = [];
        for(let x=0; x < jsonIn.w; x++) {
            for(let y=0; y < jsonIn.h; y++) {
                let position = [jsonIn.position[0]+((y-(jsonIn.w/2))*this.nodSep), jsonIn.position[1], jsonIn.position[2]+((x-(jsonIn.h/2))*this.nodSep), jsonIn.position[3]];

                this.addNeuron(jsonIn.neuron+x+"_"+y, position);
                arr.push(jsonIn.neuron+x+"_"+y);
            }
        }

        return arr;
    };

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
    createConvXYNeuronsFromXYNeurons(jsonIn) {
        let arr = [];
        for(let x=0; x < jsonIn.w-2; x++) {
            for(let y=0; y < jsonIn.h-2; y++) {
                let position = [jsonIn.position[0]+((y-(jsonIn.w/2))*this.nodSep), jsonIn.position[1], jsonIn.position[2]+((x-(jsonIn.h/2))*this.nodSep), jsonIn.position[3]];

                this.addNeuron(jsonIn.idTarget+x+"_"+y, position);
                arr.push(jsonIn.idTarget+x+"_"+y);

                let idConvM = 0;
                for(let xa=x; xa < x+3; xa++) {
                    for(let ya=y; ya < y+3; ya++) {
                        this.addSinapsis({  "neuronNameA": jsonIn.idOrigin+xa+"_"+ya,
                                            "neuronNameB": jsonIn.idTarget+x+"_"+y,
                                            "activationFunc": jsonIn.activationFunc,
                                            "multiplier": jsonIn.convMatrix[idConvM],
                                            "layerNum": 0}); //TODO layerNum
                        idConvM++;
                    }
                }
            }
        }

        return arr;
    };


    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.neuronNameA
     * @param {String} jsonIn.neuronNameB
     * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
     * @param {number} [jsonIn.weight]
     * @param {int} [jsonIn.layer_neurons_count]
     * @param {number} [jsonIn.multiplier=1.0]
     * @param {int} jsonIn.layerNum
     */
    addSinapsis(jsonIn) {
        let gaussRandom = () => {
            if(this.return_v === true) {
                this.return_v = false;
                return this.v_val;
            }
            let u = 2*Math.random()-1;
            let v = 2*Math.random()-1;
            let r = u*u + v*v;
            if(r === 0 || r > 1) return gaussRandom();
            let c = Math.sqrt(-2*Math.log(r)/r);
            this.v_val = v*c; // cache this
            this.return_v = true;
            return u*c;
        };
        let randn = (mu, std) => { return mu+gaussRandom()*std; };
        let scale = (jsonIn.layer_neurons_count !== undefined && jsonIn.layer_neurons_count !== null) ? Math.sqrt(2.0/(jsonIn.layer_neurons_count+1)) : Math.sqrt(1.0/(50));

        let _activationFunc = (jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null) ? jsonIn.activationFunc : 1.0;
        let _weight = (jsonIn.weight !== undefined && jsonIn.weight !== null) ? jsonIn.weight : randn(0.0, scale);
        let _linkMultiplier = (jsonIn.multiplier !== undefined && jsonIn.multiplier !== null) ? jsonIn.multiplier : 1.0;

        this.addLink({
        	"origin": jsonIn.neuronNameA,
            "target": jsonIn.neuronNameB,
            "directed": true,
            "showArrow": false,
            "activationFunc": _activationFunc,
            "weight": ((_weight === null && this._nodesByName[jsonIn.neuronNameA].biasNeuron === 1.0) ? 0.1 : _weight),
            "linkMultiplier": _linkMultiplier,
            "layerNum": jsonIn.layerNum});
    };

    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.neuron
     * @param {Array<int>} jsonIn.neuronLayer
     * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
     * @param {number|null|Array<number>} [jsonIn.weight]
     * @param {int} [jsonIn.layer_neurons_count]
     * @param {number} [jsonIn.multiplier=1.0]
     * @param {int} jsonIn.layerNum
     * @param {int} jsonIn.hasBias
     */
    connectNeuronWithNeuronLayer(jsonIn) {
        for(let n=0; n < ((jsonIn.hasBias === 1.0) ? jsonIn.neuronLayer.length-1 : jsonIn.neuronLayer.length); n++)
            this.addSinapsis({  "neuronNameA": jsonIn.neuron.toString(),
                                "neuronNameB": jsonIn.neuronLayer[n].toString(),
                                "activationFunc": jsonIn.activationFunc,
                                "weight": ((jsonIn.weight !== undefined && jsonIn.weight !== null && jsonIn.weight.constructor === Array) ? jsonIn.weight[n] : jsonIn.weight),
                                "layer_neurons_count": jsonIn.layer_neurons_count,
                                "multiplier": jsonIn.multiplier,
                                "layerNum": jsonIn.layerNum});
    };

    /**
     * @param {Object} jsonIn
     * @param {Array<int>} jsonIn.neuronLayer
     * @param {number|null|Array<number>} [jsonIn.weight]
     * @param {int} [jsonIn.layer_neurons_count]
     * @param {String} jsonIn.neuron
     * @param {int} jsonIn.layerNum
     */
    connectNeuronLayerWithNeuron(jsonIn) {
        for(let n=0; n < jsonIn.neuronLayer.length; n++)
            this.addSinapsis({  "neuronNameA": jsonIn.neuronLayer[n].toString(),
                                "neuronNameB": jsonIn.neuron,
                                "activationFunc": 1.0,
                                "weight": ((jsonIn.weight !== undefined && jsonIn.weight !== null && jsonIn.weight.constructor === Array) ? jsonIn.weight[n] : jsonIn.weight),
                                "layer_neurons_count": jsonIn.layer_neurons_count,
                                "layerNum": jsonIn.layerNum});
    };

    /**
     * @param {Object} jsonIn
     * @param {Array<int>} jsonIn.neuronLayerOrigin
     * @param {Array<int>} jsonIn.neuronLayerTarget
     * @param {Array<number>} jsonIn.weights
     * @param {int} [jsonIn.layer_neurons_count]
     * @param {int} jsonIn.layerNum
     * @param {int} jsonIn.hasBias
     */
    connectNeuronLayerWithNeuronLayer(jsonIn) {
        let we = jsonIn.weights;

        for(let n=0; n < jsonIn.neuronLayerOrigin.length; n++) {
            let neuronOrigin = jsonIn.neuronLayerOrigin[n];
            this.connectNeuronWithNeuronLayer({ "neuron": neuronOrigin.toString(),
                                                "neuronLayer": jsonIn.neuronLayerTarget,
                                                "layerNum": jsonIn.layerNum,
                                                "hasBias": jsonIn.hasBias,
                                                "weight": ((jsonIn.weights !== undefined && jsonIn.weights !== null) ? we.slice(0, jsonIn.neuronLayerTarget.length) : null),
                                                "layer_neurons_count": jsonIn.layer_neurons_count});

            if(jsonIn.weights !== undefined && jsonIn.weights !== null)
                we = we.slice(jsonIn.neuronLayerTarget.length);
        }
    };

    toJson() {
        let adjMA = this.comp_renderer_nodes.gpufG.readArg("adjacencyMatrix");

        let outJson = {};
        outJson.layers = [];

        outJson.layers.push({   "out_depth": this.layer_defs[0].depth,
                                "layer_type": "input"});
        let currStartN = this.layer_defs[0].depth+this.layer_defs[0].hasBias;

        for(let n=1; n < this.layer_defs.length; n++) {
            let currHasBias = (this.layer_defs[n].hasBias !== undefined && this.layer_defs[n].hasBias !== null) ? this.layer_defs[n].hasBias : 0.0;
            let currLayerDepthU = (this.layer_defs[n].depth !== undefined && this.layer_defs[n].depth !== null) ? this.layer_defs[n].depth : this.layer_defs[n].num_neurons;
            let currLayerDepth = (this.layer_defs[n].depth !== undefined && this.layer_defs[n].depth !== null) ? (this.layer_defs[n].depth+currHasBias) : (this.layer_defs[n].num_neurons+currHasBias);

            let lastHasBias = (this.layer_defs[n-1].hasBias !== undefined && this.layer_defs[n-1].hasBias !== null) ? this.layer_defs[n-1].hasBias : 0.0;
            let lastLayerDepthU = (this.layer_defs[n-1].depth !== undefined && this.layer_defs[n-1].depth !== null) ? this.layer_defs[n-1].depth : (this.layer_defs[n-1].num_neurons);
            let lastLayerDepth = (this.layer_defs[n-1].depth !== undefined && this.layer_defs[n-1].depth !== null) ? (this.layer_defs[n-1].depth+lastHasBias) : (this.layer_defs[n-1].num_neurons+lastHasBias);

            outJson.layers.push({   "out_depth": this.layer_defs[n].num_neurons,
                                    "layer_type": ((n === this.layer_defs.length-1) ? "regression" : "fc"),
                                    "num_inputs": lastLayerDepthU,
                                    "l1_decay_mul": 0,
                                    "l2_decay_mul": 1,
                                    "filters": []});
            let lastL = outJson.layers[outJson.layers.length-1];

            // filters minus bias
            for(let p=currStartN; p < (currStartN+currLayerDepthU); p++) {
                lastL.filters.push({
                    "depth": lastLayerDepthU,
                    "w": {},
                    "activation": "relu"});

                let c_w = 0;
                for(let c=(currStartN-lastLayerDepth); c < ( (currStartN-lastLayerDepth) +(lastLayerDepthU)); c++) {
                    let pixelChild = this.getPixelChild(p, c)*4;
                    lastL.filters[lastL.filters.length-1].w[c_w] = adjMA[pixelChild+2]; // c+" "+p
                    c_w++;
                }
            }

            // bias
            if(this.layer_defs[n-1].hasBias === 1.0) {
                lastL.biases = {
                    "depth": this.layer_defs[n].num_neurons,
                    "w": {}};
                let c = (currStartN-1.0);
                let c_w = 0;
                for(let p=currStartN; p < (currStartN+currLayerDepthU); p++) {
                    let pixelChild = this.getPixelChild(p, c)*4;
                    lastL.biases.w[c_w] = adjMA[pixelChild+2]; // c+" "+p
                    c_w++;
                }
            }

            currStartN += currLayerDepth;
        }
        console.log(JSON.stringify(outJson));
    };

    /**
     * @param {Object} jsonIn
     * @param {Array<number>} jsonIn.state
     * @param {boolean} [jsonIn.readOutput=true]
     * @param {Function} jsonIn.onAction
     */
    forward(jsonIn) {
        this.onAction = jsonIn.onAction;
        let lett = ["A","B","C","D","E"];


        let state = jsonIn.state.slice(0);
        for(let n=jsonIn.state.length; n < this.afferentNodesCount*this.batch_size; n++)
            state[n] = 0.0;

        for(let n=0; n < this.batch_size; n++) {
            this.comp_renderer_nodes.setArg("afferentNodes"+lett[n], () => {return state.slice(0, this.afferentNodesCount);});
            state = state.slice(this.afferentNodesCount);
        }


        let reward = [];
        for(let n=0; n < this.afferentNodesCount*this.batch_size; n++)
            reward[n] = 0.0;

        for(let n=0; n < this.batch_size; n++) {
            this.comp_renderer_nodes.setArg("efferentNodes"+lett[n], () => {return reward.slice(0, this.efferentNodesCount);});
            reward = reward.slice(this.efferentNodesCount);
        }


        for(let n=0; n < (this.layerCount); n++)
            this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);

        this._sce.getLoadedProject().getActiveStage().tick();

        if(this.onAction !== null) {
            this.maxacts = [];
            //if(jsonIn.readOutput === undefined || jsonIn.readOutput === null || (jsonIn.readOutput !== null && jsonIn.readOutput === true)) {
                let loc = [["dataB",2],
                            ["dataF",1],["dataG",0],
                            ["dataG",3],["dataH",2]];
                let o = [[]];
                let currO = 0;
                for(let n=0; n < this.efferentNodesCount*this.batch_size; n++) {
                    if(o[currO].length ===  this.efferentNodesCount) {
                        o.push([]);
                        currO++;
                    }

                    let u = this.getNeuronOutput(this.efferentNeuron[o[currO].length], loc[currO]);
                    if(isNaN(u[2]) === true)
                        debugger;
                    o[currO].push({"output": u[ loc[currO][1] ]});
                }

                for(let n=0; n < o.length; n++) {
                    let maxk = 0;
                    let maxval = o[n][0].output;

                    let vals = [maxval];
                    let y = [0];
                    let outs = [0];
                    let sm = [0];
                    let ced = [0];
                    let smd = [0];

                    for(let nb=1; nb < o[n].length; nb++) {
                        vals.push(o[n][nb].output);
                        y.push(0);
                        outs.push(0);
                        sm.push(0);
                        ced.push(0);
                        smd.push(0);

                        if(o[n][nb].output > maxval) {
                            maxk = nb;
                            maxval = o[n][nb].output;
                        }
                    }
                    this.maxacts.push({"action": maxk, "value": maxval, "values": vals, "y": y, "o": outs, "sm": sm, "ced": ced, "smd": smd});
                }

                // softmax
                /*for(let n=0; n < this.maxacts.length; n++) {
                    let sm = 0.0;
                    for(let nb=0; nb < this.efferentNodesCount; nb++)
                        sm += Math.exp(this.maxacts[n].values[nb]);

                    for(let nb=0; nb < this.efferentNodesCount; nb++) {
                        this.maxacts[n].sm[nb] = Math.exp(this.maxacts[n].values[nb])/sm;

                        if(nb === this.maxacts[n].action)
                            this.maxacts[n].value = this.maxacts[n].sm[nb];
                    }
                }*/

                this.onAction(this.maxacts);
            //}
        }
    };

    /**
     * @param {Object} jsonIn
     * @param {Object} jsonIn.reward
     * @param {Function} jsonIn.onTrained
     */
    train(jsonIn) {
        this.onTrained = jsonIn.onTrained;
        let lett = ["A","B","C","D","E"];

        // softmax regression
        /*let cost = 0.0;
        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                //let rr = (jsonIn.reward[n].val >= 0) ? Math.exp(1.0) : Math.exp(-1);
                this.maxacts[n].y[nb] = (jsonIn.reward[n] !== undefined && jsonIn.reward[n].dim === nb) ? jsonIn.reward[n].val/10 : 0.0;
            }
        }

        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                // cross-entropy cost
                cost += -1.0*((this.maxacts[n].y[nb]*Math.log(this.maxacts[n].sm[nb])) + ((1.0-this.maxacts[n].y[nb])*Math.log(1.0-this.maxacts[n].sm[nb])));
            }
        }

        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                // cross-entropy derivative (CED)
                this.maxacts[n].ced[nb] = ((this.maxacts[n].y[nb]*(1.0/this.maxacts[n].sm[nb])) + ((1.0-this.maxacts[n].y[nb])*(1.0/(1.0-this.maxacts[n].sm[nb]))));
            }
        }

        for(let n=0; n < this.maxacts.length; n++) {
            let sm = 0.0;
            for(let nb=0; nb < this.efferentNodesCount; nb++)
                sm += Math.exp(this.maxacts[n].values[nb]);
            sm = sm*sm;

            // softmax derivative
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                let sumOpposites = 0.0;
                for(let nc=0; nc < this.efferentNodesCount; nc++) {
                    if(nb !== nc)
                        sumOpposites += Math.exp(this.maxacts[n].values[nc]);
                }
                this.maxacts[n].smd[nb] = (Math.exp(this.maxacts[n].values[nb])*sumOpposites)/sm;
            }
        }

        let dd = [];
        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                let cc = this.maxacts[n].ced[nb]*this.maxacts[n].smd[nb];
                dd.push(cc);
            }
        }*/



        // linear regression
        let cost = 0.0;
        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                this.maxacts[n].y[nb] = (jsonIn.reward[n] !== undefined && jsonIn.reward[n].dim === nb) ? jsonIn.reward[n].val : 0.0;
            }
        }

        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                // output
                this.maxacts[n].o[nb] = (this.maxacts[n].values[nb]-this.maxacts[n].y[nb]);

                // l2 cost
                cost += this.maxacts[n].o[nb]*this.maxacts[n].o[nb];
            }
        }

        let dd = [];
        for(let n=0; n < this.maxacts.length; n++) {
            for(let nb=0; nb < this.efferentNodesCount; nb++) {
                //let cc = (jsonIn.reward[n] !== undefined && jsonIn.reward[n].dim === nb) ? cost*0.5 : 0.0;
                let cc = (jsonIn.reward[n] !== undefined && jsonIn.reward[n].dim === nb) ? this.maxacts[n].o[nb] : 0.0; 
                dd.push(cc);
            }
        }



        // send
        for(let n=0; n < this.batch_size; n++) {
            this.comp_renderer_nodes.setArg("efferentNodes"+lett[n], () => {return dd.slice(0, this.efferentNodesCount);});
            dd = dd.slice(this.efferentNodesCount);
        }


        for(let n=0; n < (this.layerCount); n++)
            this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);


        //this.comp_renderer_nodes.gpufG.disableKernel(0);
        this.comp_renderer_nodes.gpufG.enableKernel(1);
        this.comp_renderer_nodes.setArg("enableTrain", () => {return 1.0;});
        this._sce.getLoadedProject().getActiveStage().tick();
        this._sce.getLoadedProject().getActiveStage().tick();
        //this.comp_renderer_nodes.tick();
        //this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[1], true, true);
        this.comp_renderer_nodes.setArg("enableTrain", () => {return 0.0;});
        this.comp_renderer_nodes.gpufG.disableKernel(1);
        //this.comp_renderer_nodes.gpufG.enableKernel(0);


        if(this.onTrained !== null)
            this.onTrained(0.5*cost);
    };

    getNeuronOutput(neuronName, loc) {
        let o = this.comp_renderer_nodes.gpufG.readArg(loc[0]);

        let n = (this._nodesByName[neuronName].itemStart*4);
        return [o[n], o[n+1], o[n+2], o[n+3]];
    };

    setLearningRate(v) {
        this.comp_renderer_nodes.setArg("learningRate", () => {return v;});
    };

    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.argName
     * @param {number|Array<number>} jsonIn.value [number, number, number, number]
     */
    setLayoutArgumentData(jsonIn) {
        this._customArgs[jsonIn.argName]["nodes_array_value"] = jsonIn.value;
        this._customArgs[jsonIn.argName]["links_array_value"] = jsonIn.value;
        this._customArgs[jsonIn.argName]["arrows_array_value"] = jsonIn.value;
        this._customArgs[jsonIn.argName]["nodestext_array_value"] = jsonIn.value;
        this.comp_renderer_nodes.setArg(jsonIn.argName, () => {return jsonIn.value;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg(jsonIn.argName, () => {return jsonIn.value;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg(jsonIn.argName, () => {return jsonIn.value;});
        if(this._enableFont === true)
            this.comp_renderer_nodesText.setArg(jsonIn.argName, () => {return jsonIn.value;});
    };

    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.nodeName
     * @param {String} jsonIn.argName
     * @returns {number|Array<number>}
     */
    getLayoutNodeArgumentData(jsonIn) {
        let node = this._nodesByName[jsonIn.nodeName];
        let expl = this._customArgs[jsonIn.argName].arg.split("*");
        let type = expl[0]; // float or float4

        for(let n=0; n < (this.arrayNodeData.length/4); n++) {
            if(jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[n*4] === node.nodeId) {
                let ca = this._customArgs[jsonIn.argName]["nodes_array_value"];
                if(type === "float") {
                    let id = n;
                    if(ca[id] !== undefined && ca[id] !== null)
                        return ca[id];
                } else {
                    let id = n*4;
                    if(ca[id] !== undefined && ca[id] !== null)
                        return [ca[id], ca[id+1], ca[id+2], ca[id+3]];
                }
            }
        }
    };

    /**
     * @param {Object} jsonIn
     * @param {String} [jsonIn.nodeName=undefined] - If undefined then value is setted in all nodes
     * @param {String} jsonIn.argName
     * @param {number|Array<number>} jsonIn.value [number, number, number, number]
     * @param {boolean} jsonIn.update
     */
    setLayoutNodeArgumentData(jsonIn) {
        let node = this._nodesByName[jsonIn.nodeName];
        let expl = this._customArgs[jsonIn.argName].arg.split("*");
        let type = expl[0]; // float or float4

        /**
         * @param {String} type - "float" | "float4"
         * @param {String} argName -
         * @param {String} targetArray - "nodes_array_value" | "links_array_value" | "arrows_array_value" | "nodestext_array_value"
         * @param {int} n
         * @param {number} value
         */
        let setVal = (type, argName, targetArray, n, value) => {
            if(type === "float") {
                this._customArgs[argName][targetArray][n] = value;
            } else {
                let id = n*4;
                this._customArgs[argName][targetArray][id] = value[0];
                this._customArgs[argName][targetArray][id+1] = value[1];
                this._customArgs[argName][targetArray][id+2] = value[2];
                this._customArgs[argName][targetArray][id+3] = value[3];
            }
        };

        // nodes id
        for(let n=0; n < (this.arrayNodeData.length/4); n++) {
            if(jsonIn.nodeName === undefined || jsonIn.nodeName === null || (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[n*4] === node.nodeId))
                setVal(type, jsonIn.argName, "nodes_array_value", n, jsonIn.value);
            else {
                let id = (type === "float") ? n : n*4;
                if(this._customArgs[jsonIn.argName]["nodes_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["nodes_array_value"][id] === null && jsonIn.update === false) {
                    if(type === "float")
                        setVal(type, jsonIn.argName, "nodes_array_value", n, 0.0);
                    else
                        setVal(type, jsonIn.argName, "nodes_array_value", n, [0.0,0.0,0.0,0.0]);
                }
            }
        }
        this.comp_renderer_nodes.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].nodes_array_value;});

        // link id
        for(let na=0; na < this.linksObj.length; na++) {
            for(let n=0; n < (this.linksObj[na].arrayLinkData.length/4); n++) {
                if(jsonIn.nodeName === undefined || jsonIn.nodeName === null || (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.linksObj[na].arrayLinkData[n*4] === node.nodeId))
                    setVal(type, jsonIn.argName, "links_array_value", n, jsonIn.value);
                else {
                    let id = (type === "float") ? n : n*4;
                    if(this._customArgs[jsonIn.argName]["links_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["links_array_value"][id] === null && jsonIn.update === false) {
                        if(type === "float")
                            setVal(type, jsonIn.argName, "links_array_value", n, 0.0);
                        else
                            setVal(type, jsonIn.argName, "links_array_value", n, [0.0,0.0,0.0,0.0]);
                    }
                }
            }
            this.linksObj[na].componentRenderer.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].links_array_value;});
        }

        // arrow id
        for(let na=0; na < this.arrowsObj.length; na++) {
            for(let n=0; n < (this.arrowsObj[na].arrayArrowData.length/4); n++) {
                if(jsonIn.nodeName === undefined || jsonIn.nodeName === null || (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrowsObj[na].arrayArrowData[n*4] === node.nodeId))
                    setVal(type, jsonIn.argName, "arrows_array_value", n, jsonIn.value);
                else {
                    let id = (type === "float") ? n : n*4;
                    if(this._customArgs[jsonIn.argName]["arrows_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["arrows_array_value"][id] === null && jsonIn.update === false) {
                        if(type === "float")
                            setVal(type, jsonIn.argName, "arrows_array_value", n, 0.0);
                        else
                            setVal(type, jsonIn.argName, "arrows_array_value", n, [0.0,0.0,0.0,0.0]);
                    }
                }
            }
            this.arrowsObj[na].componentRenderer.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].arrows_array_value;});
        }

        if(this._enableFont === true) {
            // nodeText id
            for(let n=0; n < (this.arrayNodeTextData.length/4); n++) {
                if(jsonIn.nodeName === undefined || jsonIn.nodeName === null || (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeTextData[n*4] === node.nodeId))
                    setVal(type, jsonIn.argName, "nodestext_array_value", n, jsonIn.value);
                else {
                    let id = (type === "float") ? n : n*4;
                    if(this._customArgs[jsonIn.argName]["nodestext_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["nodestext_array_value"][id] === null && jsonIn.update === false) {
                        if(type === "float")
                            setVal(type, jsonIn.argName, "nodestext_array_value", n, 0.0);
                        else
                            setVal(type, jsonIn.argName, "nodestext_array_value", n, [0.0,0.0,0.0,0.0]);
                    }
                }
            }
            this.comp_renderer_nodesText.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].nodestext_array_value;});
        }
    };

    /**
     * @param {Object} jsonIn
     * @param {String} jsonIn.argName
     * @param {Array<number>} jsonIn.value [number] or [number, number, number, number]
     */
    setLayoutNodeArgumentArrayData(jsonIn) {
        let expl = this._customArgs[jsonIn.argName].arg.split("*");
        let type = expl[0]; // float or float4

        // nodes
        let currentId = -1;
        let x = 0, y = 0, z = 0, w = 0;
        this._customArgs[jsonIn.argName].nodes_array_value = [];
        for(let n=0; n < (this.arrayNodeData.length/4); n++) {
            if(currentId !== this.arrayNodeData[n*4]) {
                currentId = this.arrayNodeData[n*4];

                if(type === "float") {
                    x = jsonIn.value[currentId];
                    this._customArgs[jsonIn.argName].nodes_array_value.push(x);
                } else {
                    x = jsonIn.value[(currentId*4)];
                    y = jsonIn.value[(currentId*4)+1];
                    z = jsonIn.value[(currentId*4)+2];
                    w = jsonIn.value[(currentId*4)+3];
                    this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
                }
            } else {
                if(type === "float")
                    this._customArgs[jsonIn.argName].nodes_array_value.push(x);
                else
                    this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
            }
        }
        this.comp_renderer_nodes.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].nodes_array_value;});


        // links
        this._customArgs[jsonIn.argName].links_array_value = [];
        for(let na=0; na < this.linksObj.length; na++) {
            for(let n=0; n < this.linksObj[na].arrayLinkNodeName.length; n++) {
                let currentLinkNodeName = this.linksObj[na].arrayLinkNodeName[n];
                let nodeNameItemStart = this._nodesByName[currentLinkNodeName].itemStart;

                if(type === "float") {
                    this._customArgs[jsonIn.argName].links_array_value.push(	this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart)]);
                } else {
                    this._customArgs[jsonIn.argName].links_array_value.push(	this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+1],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+2],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+3]);
                }
            }
            this.linksObj[na].componentRenderer.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].links_array_value;});
        }

        // arrows
        this._customArgs[jsonIn.argName].arrows_array_value = [];
        for(let na=0; na < this.arrowsObj.length; na++) {
            for(let n=0; n < this.arrowsObj[na].arrayArrowNodeName.length; n++) {
                let currentArrowNodeName = this.arrowsObj[na].arrayArrowNodeName[n];
                let nodeNameItemStart = this._nodesByName[currentArrowNodeName].itemStart;

                if(type === "float") {
                    this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart)]);
                } else {
                    this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+1],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+2],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+3]);
                }
            }
            this.arrowsObj[na].componentRenderer.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].arrows_array_value;});
        }

        // nodestext
        if(this._enableFont === true) {
            this._customArgs[jsonIn.argName].nodestext_array_value = [];
            for(let n=0; n < this.arrayNodeTextNodeName.length; n++) {
                let currentNodeTextNodeName = this.arrayNodeTextNodeName[n];
                let nodeNameItemStart = this._nodesByName[currentNodeTextNodeName].itemStart;

                if(type === "float") {
                    this._customArgs[jsonIn.argName].nodestext_array_value.push(	this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart)]);
                } else {
                    this._customArgs[jsonIn.argName].nodestext_array_value.push( this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+1],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+2],
                        this._customArgs[jsonIn.argName].nodes_array_value[(nodeNameItemStart*4)+3]);
                }
            }
            this.comp_renderer_nodesText.setArg(jsonIn.argName, () => {return this._customArgs[jsonIn.argName].nodestext_array_value;});
        }
    };



























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
	* @param {Object} [jsonIn.layoutNodeArgumentData=undefined] - Data for the custom layout
	* @param {Function} [jsonIn.onmousedown=undefined] - Event when mousedown
	* @param {Function} [jsonIn.onmouseup=undefined] - Event when mouseup
	* @param {int} [jsonIn.biasNeuron]
	* @returns {String|boolean} - Name of node
	 */
	addNode(jsonIn) {
		if(this._nodesByName.hasOwnProperty(jsonIn.name) === false) {
			let node = this.createNode(jsonIn);
            this._nodesByName[jsonIn.name] = node;
            this._nodesById[node.nodeId] = node;

            if(node.label !== undefined && node.label !== null && this._enableFont === true)
                this.createNodeText(node);

			console.log("%cnode "+(Object.keys(this._nodesByName).length)+" ("+jsonIn.name+")", "color:green");

			return jsonIn.name;
		} else {
			console.log("node "+jsonIn.name+" already exists");
			return false;
		}
	};

    /**
     * @param {Object} jsonIn
     * @param {Array<number>} [jsonIn.position=[Math.Random(), Math.Random(), Math.Random(), 1.0]] - Position of node
     * @param {Object} [jsonIn.layoutNodeArgumentData=undefined]
     * @param {String} [jsonIn.color]
     * @param {int} [jsonIn.nodeId]
     * @param {int} [jsonIn.itemStart]
     * @param {int} [jsonIn.biasNeuron]
     * @returns {Object}
     */
    createNode(jsonIn) {
        let nAIS = this.nodeArrayItemStart;

        let offs = 100.0;
        let pos = (jsonIn.position !== undefined && jsonIn.position !== null) ? jsonIn.position : [-(offs/2)+(Math.random()*offs), -(offs/2)+(Math.random()*offs), -(offs/2)+(Math.random()*offs), 1.0];

        let color = jsonIn.color;

        let nodeImgId = -1;
        if(color !== undefined && color !== null && color.constructor===String) { // color is string URL
            if(this.objNodeImages.hasOwnProperty(color) === false) {
                let locationIdx = Object.keys(this.objNodeImages).length;
                this.objNodeImages[color] = locationIdx;

                this.addNodesImage(color, locationIdx);
            }
            nodeImgId = this.objNodeImages[color];
        }
        for(let n=0; n < this.mesh_nodes.vertexArray.length/4; n++) {
            let idxVertex = n*4;

            this.arrayNodeData.push(this.currentNodeId, 0.0, 0.0, 0.0);
            this.arrayNodeDataB.push(jsonIn.biasNeuron, 0.0, 0.0, 0.0);
            this.arrayNodeDataF.push(0.0, 0.0, 0.0, 0.0);
            this.arrayNodeDataG.push(0.0, 0.0, 0.0, 0.0);
            this.arrayNodeDataH.push(0.0, 0.0, 0.0, 0.0);
            this.arrayNodePosXYZW.push(pos[0], pos[1], pos[2], pos[3]);
            this.arrayNodeDir.push(0, 0, 0, 1.0);
            this.arrayNodeVertexPos.push(this.mesh_nodes.vertexArray[idxVertex], this.mesh_nodes.vertexArray[idxVertex+1], this.mesh_nodes.vertexArray[idxVertex+2], 1.0);
            this.arrayNodeVertexNormal.push(this.mesh_nodes.normalArray[idxVertex], this.mesh_nodes.normalArray[idxVertex+1], this.mesh_nodes.normalArray[idxVertex+2], 1.0);
            this.arrayNodeVertexTexture.push(this.mesh_nodes.textureArray[idxVertex], this.mesh_nodes.textureArray[idxVertex+1], this.mesh_nodes.textureArray[idxVertex+2], 1.0);

            this.arrayNodeImgId.push(nodeImgId);

            if(jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                for(let argNameKey in this._customArgs) {
                    let expl = this._customArgs[argNameKey].arg.split("*");
                    if(expl.length > 0) { // argument is type buffer
                        if(jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                            if(expl[0] === "float")
                                this._customArgs[argNameKey].nodes_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);
                            else if(expl[0] === "float4")
                                this._customArgs[argNameKey].nodes_array_value.push(	jsonIn.layoutNodeArgumentData[argNameKey][0],
                                    jsonIn.layoutNodeArgumentData[argNameKey][1],
                                    jsonIn.layoutNodeArgumentData[argNameKey][2],
                                    jsonIn.layoutNodeArgumentData[argNameKey][3]);
                        }
                    }
                }
            }

            this.nodeArrayItemStart++;
        }

        let maxNodeIndexId = 0;
        for(let n=0; n < this.mesh_nodes.indexArray.length; n++) {
            let idxIndex = n;

            this.arrayNodeIndices.push(this.startIndexId+this.mesh_nodes.indexArray[idxIndex]);

            if(this.mesh_nodes.indexArray[idxIndex] > maxNodeIndexId)
                maxNodeIndexId = this.mesh_nodes.indexArray[idxIndex];
        }
        this.startIndexId += (maxNodeIndexId+1);


        jsonIn.nodeId = this.currentNodeId++;
        jsonIn.itemStart = nAIS;// nodeArrayItemStart
        return jsonIn;
    };

    createNodeText(jsonIn) {
        let getLetterId = (letter) => {
            let obj = {	"A":  0, "B":  1, "C":  2, "D":  3, "E":  4, "F":  5, "G":  6,
                "H":  7, "I":  8, "J":  9, "K": 10, "L": 11, "M": 12, "N": 13,
                "#": 14, "O": 15, "P": 16, "Q": 17, "R": 18, "S": 19, "T": 20,
                "U": 21, "V": 22, "W": 23, "X": 24, "Y": 25, "Z": 26, " ": 27,
                "0": 28, "1": 29, "2": 30, "3": 31, "4": 32, "5": 33, "6": 34,
                "7": 35, "8": 36, "9": 37
            };
            return obj[letter];
        };

        for(let i = 0; i < this.nodesTextPlanes; i++) {
            let letterId = null;
            if(jsonIn.label !== undefined && jsonIn.label !== null && jsonIn.label[i] !== undefined && jsonIn.label[i] !== null)
                letterId = getLetterId(jsonIn.label[i].toUpperCase());
            if(letterId === null)
                letterId = getLetterId(" ");

            for(let n=0; n < this.mesh_nodesText.vertexArray.length/4; n++) {
                let idxVertex = n*4;

                this.arrayNodeTextData.push(jsonIn.nodeId, 0.0, 0.0, 0.0);
                this.arrayNodeTextPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                this.arrayNodeTextVertexPos.push(this.mesh_nodesText.vertexArray[idxVertex]+(i*5), this.mesh_nodesText.vertexArray[idxVertex+1], this.mesh_nodesText.vertexArray[idxVertex+2], 1.0);
                this.arrayNodeTextVertexNormal.push(this.mesh_nodesText.normalArray[idxVertex], this.mesh_nodesText.normalArray[idxVertex+1], this.mesh_nodesText.normalArray[idxVertex+2], 1.0);
                this.arrayNodeTextVertexTexture.push(this.mesh_nodesText.textureArray[idxVertex], this.mesh_nodesText.textureArray[idxVertex+1], this.mesh_nodesText.textureArray[idxVertex+2], 1.0);

                this.arrayNodeTextNodeName.push(jsonIn.name);

                this.arrayNodeText_itemStart.push(jsonIn.itemStart);

                this.arrayNodeTextLetterId.push(letterId);

                if(jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                    for(let argNameKey in this._customArgs) {
                        let expl = this._customArgs[argNameKey].arg.split("*");
                        if(expl.length > 0) { // argument is type buffer
                            if(jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                                if(expl[0] === "float")
                                    this._customArgs[argNameKey].nodestext_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);
                                else if(expl[0] === "float4")
                                    this._customArgs[argNameKey].nodestext_array_value.push(	jsonIn.layoutNodeArgumentData[argNameKey][0],
                                        jsonIn.layoutNodeArgumentData[argNameKey][1],
                                        jsonIn.layoutNodeArgumentData[argNameKey][2],
                                        jsonIn.layoutNodeArgumentData[argNameKey][3]);
                            }
                        }
                    }
                }

                this.nodeTextArrayItemStart++;
            }
        }
        let maxNodeIndexId = 0;
        for(let i = 0; i < this.nodesTextPlanes; i++) {
            for(let n=0; n < this.mesh_nodesText.indexArray.length; n++) {
                let idxIndex = n;

                let b = (i*4); // 4 = indices length of quad (0, 1, 2, 0, 2, 3)
                let ii = (this.mesh_nodesText.indexArray[idxIndex]+b);

                this.arrayNodeTextIndices.push(this.startIndexId_nodestext+ii);

                if(ii > maxNodeIndexId)
                    maxNodeIndexId = ii;
            }

        }
        this.startIndexId_nodestext += (maxNodeIndexId+1);

        this.currentNodeTextId++; // augment node id
    };

    /**
     * @param {String} url
     * @param {int} locationIdx
     */
    addNodesImage(url, locationIdx) {
        this._stackNodesImg.push({
            "url": url,
            "locationIdx": locationIdx});
    };

    generateNodesImage() {
        if(this.nodesImgMaskLoaded === false) {
            this.nodesImgMask = new Image();
            this.nodesImgMask.onload = () => {
                this.nodesImgMaskLoaded = true;
                this.generateNodesImage();
            };
            this.nodesImgMask.src = Resources.nodesImgMask();
        } else if(this.nodesImgCrosshairLoaded === false) {
            this.nodesImgCrosshair = new Image();
            this.nodesImgCrosshair.onload = () => {
                this.nodesImgCrosshairLoaded = true;
                this.generateNodesImage();
            };
            this.nodesImgCrosshair.src = Resources.nodesImgCrosshair();
        } else {
            new ProccessImg({
                "stackNodesImg": this._stackNodesImg,
                "NODE_IMG_WIDTH": this.NODE_IMG_WIDTH,
                "NODE_IMG_COLUMNS": this.NODE_IMG_COLUMNS,
                "nodesImgMask": this.nodesImgMask,
                "nodesImgCrosshair": this.nodesImgCrosshair,
                "onend": (jsonIn) => {
                    this.comp_renderer_nodes.setArg("nodesImg", () => {return jsonIn.nodesImg;});
                    this.comp_renderer_nodes.setArg("nodesImgCrosshair", () => {return jsonIn.nodesImgCrosshair;});
                }});
        }
    };

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
    addLink(jsonIn) {
        let pass = true;

        if(this._nodesByName[jsonIn.origin] === undefined && this._nodesByName[jsonIn.origin] === null) {
            console.log("%clink "+jsonIn.origin+"->"+jsonIn.target+". Node "+jsonIn.origin+" not exists", "color:red");
            pass=false;
        }

        if(this._nodesByName[jsonIn.target] === undefined && this._nodesByName[jsonIn.target] === null) {
            console.log("%clink "+jsonIn.origin+"->"+jsonIn.target+". Node "+jsonIn.target+" not exists", "color:red");
            pass=false;
        }

        if(jsonIn.origin === jsonIn.target) {
            console.log("%cDiscarting autolink "+jsonIn.origin+"->"+jsonIn.target, "color:orange");
            pass=false;
        }

        if(pass === true) {
            console.log("%clink "+jsonIn.origin+"->"+jsonIn.target, "color:green");

            jsonIn.origin_nodeName = jsonIn.origin.toString();
            jsonIn.target_nodeName = jsonIn.target.toString();
            jsonIn.origin_nodeId = this._nodesByName[jsonIn.origin].nodeId;
            jsonIn.target_nodeId = this._nodesByName[jsonIn.target].nodeId;
            jsonIn.origin_itemStart = this._nodesByName[jsonIn.origin].itemStart;
            jsonIn.target_itemStart = this._nodesByName[jsonIn.target].itemStart;
            jsonIn.origin_layoutNodeArgumentData = this._nodesByName[jsonIn.origin].layoutNodeArgumentData;
            jsonIn.target_layoutNodeArgumentData = this._nodesByName[jsonIn.target].layoutNodeArgumentData;

            jsonIn.activationFunc = (jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null) ? jsonIn.activationFunc : 1.0;
            jsonIn.weight = (jsonIn.weight !== undefined && jsonIn.weight !== null && jsonIn.weight.constructor===String) ? Math.random() : (jsonIn.weight||1.0);
            jsonIn.linkMultiplier = (jsonIn.linkMultiplier !== undefined && jsonIn.linkMultiplier !== null) ? jsonIn.linkMultiplier : 1.0;

            let repeatId = 1;
            while(true) {
                let exists = this._links.hasOwnProperty(jsonIn.origin+"->"+jsonIn.target+"_"+repeatId) || this._links.hasOwnProperty(jsonIn.target+"->"+jsonIn.origin+"_"+repeatId);
                if(exists === true) {
                    repeatId++;
                } else
                    break;
            }
            jsonIn.repeatId = repeatId;

            jsonIn = this.createLink(jsonIn);

            if(jsonIn.directed !== undefined && jsonIn.directed !== null && jsonIn.directed === true) {
                if(jsonIn.showArrow !== undefined && jsonIn.showArrow !== null && jsonIn.showArrow === false) {
                } else
                    this.createArrow(jsonIn);
            }

            // ADD LINK TO ARRAY LINKS
            this._links[jsonIn.origin+"->"+jsonIn.target+"_"+repeatId] = jsonIn;
        }
    };

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
     * @returns {Object}
     */
    createLink(jsonIn) {
        if(this.currentLinkId % 60000 === 0)
            this.createLinksObjItem();

        for(let n=0; n < this.lineVertexCount*2; n++) {
            this.linksObj[this.currentLinksObjItem].arrayLinkData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, Math.ceil(n/2), jsonIn.repeatId);

            if(Math.ceil(n/2) !== (this.lineVertexCount-1)) {
                this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.origin_nodeName);
            } else {
                this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.target_nodeName);
            }
            this.linksObj[this.currentLinksObjItem].arrayLinkPosXYZW.push(	0.0, 0.0, 0.0, 1.0);
            this.linksObj[this.currentLinksObjItem].arrayLinkVertexPos.push(0.0, 0.0, 0.0, 1.0);

            if(jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                for(let argNameKey in this._customArgs) {
                    let expl = this._customArgs[argNameKey].arg.split("*");
                    if(expl.length > 0) { // argument is type buffer
                        if(jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                            if(expl[0] === "float")
                                this._customArgs[argNameKey].links_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);
                            else if(expl[0] === "float4")
                                this._customArgs[argNameKey].links_array_value.push(	jsonIn.origin_layoutNodeArgumentData[argNameKey][0],
                                    jsonIn.origin_layoutNodeArgumentData[argNameKey][1],
                                    jsonIn.origin_layoutNodeArgumentData[argNameKey][2],
                                    jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                        }
                    }
                }
            }
        }

        for(let n=0; n < this.lineVertexCount*2; n++)
            this.linksObj[this.currentLinksObjItem].arrayLinkIndices.push(	this.linksObj[this.currentLinksObjItem].startIndexId_link++);

        this.currentLinkId += 2; // augment link id

        jsonIn.linkId = this.currentLinkId-2;
        return jsonIn;
    };

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
     * @param {boolean} [jsonIn.directed=false]
     * @param {Mesh} [jsonIn.node] - Node with the mesh for the node
     * @returns {int}
     */
    createArrow(jsonIn) {
        if(this.currentArrowId % 20000 === 0)
            this.createArrowsObjItem();

        if(jsonIn !== undefined && jsonIn !== null && jsonIn.node !== undefined && jsonIn.node !== null)
            this.mesh_arrows = jsonIn.node;

        let oppositeId = 0;

        for(let o=0; o < 2; o++) {
            for(let n=0; n < this.mesh_arrows.vertexArray.length/4; n++) {
                let idxVertex = n*4;
                if(o === 0) oppositeId = this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart;

                this.arrowsObj[this.currentArrowsObjItem].arrayArrowPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexPos.push(this.mesh_arrows.vertexArray[idxVertex], this.mesh_arrows.vertexArray[idxVertex+1], this.mesh_arrows.vertexArray[idxVertex+2], 1.0);
                this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexNormal.push(this.mesh_arrows.normalArray[idxVertex], this.mesh_arrows.normalArray[idxVertex+1], this.mesh_arrows.normalArray[idxVertex+2], 1.0);
                this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexTexture.push(this.mesh_arrows.textureArray[idxVertex], this.mesh_arrows.textureArray[idxVertex+1], this.mesh_arrows.textureArray[idxVertex+2], 1.0);
                if(o === 0) {
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, 0.0, jsonIn.repeatId);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.origin_nodeName);
                    if(jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                        for(let argNameKey in this._customArgs) {
                            let expl = this._customArgs[argNameKey].arg.split("*");
                            if(expl.length > 0) { // argument is type buffer
                                if(jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                                    if(expl[0] === "float")
                                        this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);
                                    else if(expl[0] === "float4")
                                        this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey][0],
                                            jsonIn.origin_layoutNodeArgumentData[argNameKey][1],
                                            jsonIn.origin_layoutNodeArgumentData[argNameKey][2],
                                            jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                                }
                            }
                        }
                    }
                } else {
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.target_nodeId, jsonIn.origin_nodeId, 1.0, jsonIn.repeatId);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.target_nodeName);
                    if(jsonIn.target_layoutNodeArgumentData !== undefined && jsonIn.target_layoutNodeArgumentData !== null) {
                        for(let argNameKey in this._customArgs) {
                            let expl = this._customArgs[argNameKey].arg.split("*");
                            if(expl.length > 0) { // argument is type buffer
                                if(jsonIn.target_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.target_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.target_layoutNodeArgumentData[argNameKey] !== null) {
                                    if(expl[0] === "float")
                                        this._customArgs[argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[argNameKey]);
                                    else if(expl[0] === "float4")
                                        this._customArgs[argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[argNameKey][0],
                                            jsonIn.target_layoutNodeArgumentData[argNameKey][1],
                                            jsonIn.target_layoutNodeArgumentData[argNameKey][2],
                                            jsonIn.target_layoutNodeArgumentData[argNameKey][3]);
                                }
                            }
                        }
                    }
                }

                this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart++;
            }

            let maxArrowIndexId = 0;
            for(let n=0; n < this.mesh_arrows.indexArray.length; n++) {
                let idxIndex = n;

                this.arrowsObj[this.currentArrowsObjItem].arrayArrowIndices.push(this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow+this.mesh_arrows.indexArray[idxIndex]);

                if(this.mesh_arrows.indexArray[idxIndex] > maxArrowIndexId) {
                    maxArrowIndexId = this.mesh_arrows.indexArray[idxIndex];
                }
            }
            this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow += (maxArrowIndexId+1);


            this.currentArrowId++; // augment arrow id
        }
    };











    //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ███╗   ██╗ ██████╗ ██████╗ ███████╗███████╗
    //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔════╝
    //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██╔██╗ ██║██║   ██║██║  ██║█████╗  ███████╗
    //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║╚██╗██║██║   ██║██║  ██║██╔══╝  ╚════██║
    //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ██║ ╚████║╚██████╔╝██████╔╝███████╗███████║
    // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
	updateNodes() {
		console.log((this.currentNodeId)+" nodes");

        this._ADJ_MATRIX_WIDTH = this.currentNodeId;

        this.comp_renderer_nodes.setArg("adjacencyMatrix", () => {return new Float32Array(this._ADJ_MATRIX_WIDTH*this._ADJ_MATRIX_WIDTH*4);});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);

        this.comp_renderer_nodes.setArg("adjacencyMatrixB", () => {return new Float32Array(this._ADJ_MATRIX_WIDTH*this._ADJ_MATRIX_WIDTH*4);});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);

        this.comp_renderer_nodes.setArg("widthAdjMatrix", () => {return this._ADJ_MATRIX_WIDTH;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("widthAdjMatrix", () => {return this._ADJ_MATRIX_WIDTH;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg("widthAdjMatrix", () => {return this._ADJ_MATRIX_WIDTH;});

        this.comp_renderer_nodes.setArg("data", () => {return this.arrayNodeData;});
        this.comp_renderer_nodes.setArg("dataB", () => {return this.arrayNodeDataB;});
        this.comp_renderer_nodes.setArg("dataF", () => {return this.arrayNodeDataF;});
        this.comp_renderer_nodes.setArg("dataG", () => {return this.arrayNodeDataG;});
        this.comp_renderer_nodes.setArg("dataH", () => {return this.arrayNodeDataH;});

		if(this.comp_renderer_nodes.getBuffers()["posXYZW"] !== undefined && this.comp_renderer_nodes.getBuffers()["posXYZW"] !== null)
            this.arrayNodePosXYZW = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("posXYZW"));
        this.comp_renderer_nodes.setArg("posXYZW", () => {return this.arrayNodePosXYZW;});

        this.comp_renderer_nodes.setArg("nodeVertexPos", () => {return this.arrayNodeVertexPos;});
        this.comp_renderer_nodes.setArg("nodeVertexNormal", () => {return this.arrayNodeVertexNormal;});
        this.comp_renderer_nodes.setArg("nodeVertexTexture", () => {return this.arrayNodeVertexTexture;});

        this.comp_renderer_nodes.setArg("nodesCount", () => {return this.currentNodeId;});
        this.comp_renderer_nodes.setArg("nodeImgColumns", () => {return this.NODE_IMG_COLUMNS;});
        this.comp_renderer_nodes.setArg("nodeImgId", () => {return this.arrayNodeImgId;});
        this.comp_renderer_nodes.setArg("indices", () => {return this.arrayNodeIndices;});

        if(this.comp_renderer_nodes.getBuffers()["dir"] !== undefined && this.comp_renderer_nodes.getBuffers()["dir"] !== null)
            this.arrayNodeDir = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("dir"));
        this.comp_renderer_nodes.setArg("dir", () => {return this.arrayNodeDir;});

        this.comp_renderer_nodes.setArg("PMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;});
        this.comp_renderer_nodes.setArgUpdatable("PMatrix", true);
        this.comp_renderer_nodes.setArg("cameraWMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;});
        this.comp_renderer_nodes.setArgUpdatable("cameraWMatrix", true);
        this.comp_renderer_nodes.setArg("nodeWMatrix", () => {return this.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;});
        this.comp_renderer_nodes.setArgUpdatable("nodeWMatrix", true);

        this.comp_renderer_nodes.setArg("layerCount", () => {return this.layerCount;});
        this.comp_renderer_nodes.setArg("learningRate", () => {return 0.01;});
        this.comp_renderer_nodes.setArg("viewNeuronDynamics", () => {return 0.0;});
        this.comp_renderer_nodes.setArg("gpu_batch_repeats", () => {return this.gpu_batch_repeats;});
        this.comp_renderer_nodes.setArg("enableTrain", () => {return this.enableTrain;});
        this.comp_renderer_nodes.setArg("afferentNodesCount", () => {return this.afferentNodesCount;});
        this.comp_renderer_nodes.setArg("efferentNodesCount", () => {return this.efferentNodesCount;});
        this.comp_renderer_nodes.setArg("efferentStart", () => {return this.currentNodeId-this.efferentNodesCount;});

        this.comp_renderer_nodes.setArg("afferentNodesA", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesA", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesB", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesB", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesC", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesC", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesD", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesD", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesE", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesE", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesF", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesF", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("afferentNodesG", () => {return new Float32Array(this.afferentNodesCount);});
        this.comp_renderer_nodes.setArg("efferentNodesG", () => {return new Float32Array(this.efferentNodesCount);});
        this.comp_renderer_nodes.setArg("isNode", () => {return 1;});
        this.comp_renderer_nodes.setArg("bufferNodesWidth", () => {return this.comp_renderer_nodes.getBuffers()["posXYZW"].W;});

        for(let argNameKey in this._customArgs) {
			let expl = this._customArgs[argNameKey].arg.split("*");
			if(expl.length > 0) { // argument is type buffer
                this.comp_renderer_nodes.setArg(argNameKey, () => {return this._customArgs[argNameKey].nodes_array_value;});
			}
		}

        this.generateNodesImage();
		if(this._enableFont === true)
            this.updateNodesText();
	};

    updateNodesText() {
        this.comp_renderer_nodesText.setArg("data", () => {return this.arrayNodeTextData;});
        this.comp_renderer_nodesText.getComponentBufferArg("posXYZW", this.comp_renderer_nodes);

        this.comp_renderer_nodesText.setArg("nodeVertexPos", () => {return this.arrayNodeTextVertexPos;});
        this.comp_renderer_nodesText.setArg("nodeVertexNormal", () => {return this.arrayNodeTextVertexNormal;});
        this.comp_renderer_nodesText.setArg("nodeVertexTexture", () => {return this.arrayNodeTextVertexTexture;});

        this.comp_renderer_nodesText.setArg("fontImgColumns", () => {return this.FONT_IMG_COLUMNS;});
        this.comp_renderer_nodesText.setArg("letterId", () => {return this.arrayNodeTextLetterId;});
        this.comp_renderer_nodesText.setArg("indices", () => {return this.arrayNodeTextIndices;});

        this.comp_renderer_nodesText.setArg("PMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;});
        this.comp_renderer_nodesText.setArgUpdatable("PMatrix", true);
        this.comp_renderer_nodesText.setArg("cameraWMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;});
        this.comp_renderer_nodesText.setArgUpdatable("cameraWMatrix", true);
        this.comp_renderer_nodesText.setArg("nodeWMatrix", () => {return this.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;});
        this.comp_renderer_nodesText.setArgUpdatable("nodeWMatrix", true);

        this.comp_renderer_nodesText.setArg("isNodeText", () => {return 1;});
        this.comp_renderer_nodesText.setArg("bufferNodesWidth", () => {return this.comp_renderer_nodes.getBuffers()["posXYZW"].W;});
        this.comp_renderer_nodesText.setArg("bufferTextsWidth", () => {return this.comp_renderer_nodesText.getBuffers()["data"].W;});

        for(let argNameKey in this._customArgs) {
            let expl = this._customArgs[argNameKey].arg.split("*");
            if(expl.length > 0) // argument is type buffer
                this.comp_renderer_nodesText.setArg(argNameKey, () => {return this._customArgs[argNameKey].nodestext_array_value;});
        }
    };

    //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ██╗     ██╗███╗   ██╗██╗  ██╗███████╗
    //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██║     ██║████╗  ██║██║ ██╔╝██╔════╝
    //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██║     ██║██╔██╗ ██║█████╔╝ ███████╗
    //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║     ██║██║╚██╗██║██╔═██╗ ╚════██║
    //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ███████╗██║██║ ╚████║██║  ██╗███████║
    // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
	updateLinks() {
		console.log(Object.keys(this._links).length+" links");

        for(let na=0; na < this.linksObj.length; na++) {
            this.linksObj[na].componentRenderer.setArg("data", () => {return this.linksObj[na].arrayLinkData;});
            this.linksObj[na].componentRenderer.getComponentBufferArg("dataB", this.comp_renderer_nodes);
            this.linksObj[na].componentRenderer.getComponentBufferArg("posXYZW", this.comp_renderer_nodes);
            this.linksObj[na].componentRenderer.setArg("nodeVertexPos", () => {return this.linksObj[na].arrayLinkVertexPos;});
            this.linksObj[na].componentRenderer.setArg("indices", () => {return this.linksObj[na].arrayLinkIndices;});

            this.linksObj[na].componentRenderer.setArg("nodesCount", () => {return this.currentNodeId;});
            this.linksObj[na].componentRenderer.setArg("PMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;});
            this.linksObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
            this.linksObj[na].componentRenderer.setArg("cameraWMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;});
            this.linksObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
            this.linksObj[na].componentRenderer.setArg("nodeWMatrix", () => {return this.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;});
            this.linksObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

            this.linksObj[na].componentRenderer.setArg("isLink", () => {return 1;});
            this.linksObj[na].componentRenderer.setArg("bufferNodesWidth", () => {return this.comp_renderer_nodes.getBuffers()["posXYZW"].W;});
            this.linksObj[na].componentRenderer.setArg("bufferLinksWidth", () => {return this.linksObj[na].componentRenderer.getBuffers()["data"].W;});

            for(let argNameKey in this._customArgs) {
                let expl = this._customArgs[argNameKey].arg.split("*");
                if(expl.length > 0) { // argument is type buffer
                    this.linksObj[na].componentRenderer.setArg(argNameKey, () => {return this._customArgs[argNameKey].links_array_value;});
                }
            }
        }

        this.updateArrows();

        if(Object.keys(this._links).length > 0)
            this.updateAdjMat();
	};

    updateArrows() {
        for(let na=0; na < this.arrowsObj.length; na++) {
            this.arrowsObj[na].componentRenderer.setArg("data", () => {return this.arrowsObj[na].arrayArrowData;});
            this.arrowsObj[na].componentRenderer.getComponentBufferArg("dataB", this.comp_renderer_nodes);
            this.arrowsObj[na].componentRenderer.getComponentBufferArg("posXYZW", this.comp_renderer_nodes);

            this.arrowsObj[na].componentRenderer.setArg("nodeVertexPos", () => {return this.arrowsObj[na].arrayArrowVertexPos;});
            this.arrowsObj[na].componentRenderer.setArg("nodeVertexNormal", () => {return this.arrowsObj[na].arrayArrowVertexNormal;});
            this.arrowsObj[na].componentRenderer.setArg("nodeVertexTexture", () => {return this.arrowsObj[na].arrayArrowVertexTexture;});
            this.arrowsObj[na].componentRenderer.setArg("indices", () => {return this.arrowsObj[na].arrayArrowIndices;});

            this.arrowsObj[na].componentRenderer.setArg("PMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;});
            this.arrowsObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
            this.arrowsObj[na].componentRenderer.setArg("cameraWMatrix", () => {return this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;});
            this.arrowsObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
            this.arrowsObj[na].componentRenderer.setArg("nodeWMatrix", () => {return this.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;});
            this.arrowsObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

            this.arrowsObj[na].componentRenderer.setArg("nodesCount", () => {return this.currentNodeId;});
            this.arrowsObj[na].componentRenderer.setArg("isArrow", () => {return 1.0;});
            this.arrowsObj[na].componentRenderer.setArg("bufferNodesWidth", () => {return this.comp_renderer_nodes.getBuffers()["posXYZW"].W;});
            this.arrowsObj[na].componentRenderer.setArg("bufferArrowsWidth", () => {return this.arrowsObj[na].componentRenderer.getBuffers()["data"].W;});

            for(let argNameKey in this._customArgs) {
                let expl = this._customArgs[argNameKey].arg.split("*");
                if(expl.length > 0) { // argument is type buffer
                    this.arrowsObj[na].componentRenderer.setArg(argNameKey, () => {return this._customArgs[argNameKey].arrows_array_value;});
                }
            }
        }
    };

    updateAdjMat() {
        let setAdjMat = (columnAsParent, pixel, nodeId, nodeIdInv, weight, linkMultiplier, activationFunc, layerNum) => {
            let idx = pixel*4;

            this.arrAdjMatrix[idx] = layerNum;
            this.arrAdjMatrix[idx+1] = 0.0;
            this.arrAdjMatrix[idx+2] = ((columnAsParent===true)?0.0:weight);
            this.arrAdjMatrix[idx+3] = ((columnAsParent===true)?1.0:0.5); // columnAsParent=1.0;

            this.arrAdjMatrixB[idx] = linkMultiplier; // not used here
            this.arrAdjMatrixB[idx+1] = activationFunc; // not used here
            this.arrAdjMatrixB[idx+2] = nodeId;
            this.arrAdjMatrixB[idx+3] = nodeIdInv;
        };

        this.arrAdjMatrix = new Float32Array(this._ADJ_MATRIX_WIDTH*this._ADJ_MATRIX_WIDTH*4);
        this.arrAdjMatrixB = new Float32Array(this._ADJ_MATRIX_WIDTH*this._ADJ_MATRIX_WIDTH*4);
        for(let key in this._links) {
            let childNodeId = this._links[key].origin_nodeId;
            let parentNodeId = this._links[key].target_nodeId;

            let pixelParent = this.getPixelParent(parentNodeId, childNodeId);
            let pixelChild = this.getPixelChild(parentNodeId, childNodeId);
            setAdjMat(true, pixelParent, parentNodeId, childNodeId, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, -99); // (columns=child;rows=parent)
            setAdjMat(false, pixelChild, childNodeId, parentNodeId, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, this._links[key].layerNum); // (columns=parent;rows=child)
        }

        this.comp_renderer_nodes.setArg("adjacencyMatrix", () => {return this.arrAdjMatrix;});
        this.comp_renderer_nodes.setArg("adjacencyMatrixB", () => {return this.arrAdjMatrixB;});

        /*
        this.adjacencyMatrixToImage(this.arrAdjMatrix, this._ADJ_MATRIX_WIDTH, (img) => {
            document.body.appendChild(img);
            img.style.border = "1px solid red";
        }); */
    };

    getPixelParent(p,c) {
        return (p*this._ADJ_MATRIX_WIDTH)+(c);
    }

    getPixelChild(p,c) {
        return (c*this._ADJ_MATRIX_WIDTH)+(p);
    }

    /**
     * adjacencyMatrixToImage
     * @param {Float32Array} adjMat
     * @param {int} width
     * @param {Function} onload
     */
    adjacencyMatrixToImage(adjMat, width, onload) {
        let toArrF = (arr) => {
            let arrO = new Uint8Array(arr.length*4);
            for(let n=0; n < arr.length; n++) {
                let idO = n*4;
                arrO[idO] = arr[n]*255;
                arrO[idO+1] = arr[n]*255;
                arrO[idO+2] = arr[n]*255;
                arrO[idO+3] = 255;
            }

            return arrO;
        };

        let toImage = (arrO, w, h) => {
            let canvas = Utils.getCanvasFromUint8Array(arrO, w, h);
            this._utils.getImageFromCanvas(canvas, (im) => {
                onload(im);
            });
        };

        let arrF = toArrF(adjMat);
        toImage(arrF, width, width);
    };

    enableForceLayout() {
        this.comp_renderer_nodes.setArg("enableForceLayout", () => {return 1.0;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("enableForceLayout", () => {return 1.0;});
        this._enabledForceLayout = true;
    };

    disableForceLayout() {
        this.comp_renderer_nodes.setArg("enableForceLayout", () => {return 0.0;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("enableForceLayout", () => {return 0.0;});
        this._enabledForceLayout = false;
    };

    enableShowOutputWeighted() {
        this.comp_renderer_nodes.setArg("multiplyOutput", () => {return 1.0;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("multiplyOutput", () => {return 1.0;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg("multiplyOutput", () => {return 1.0;});
    };

    disableShowOutputWeighted() {
        this.comp_renderer_nodes.setArg("multiplyOutput", () => {return 0.0;});
        for(let na=0; na < this.linksObj.length; na++)
            this.linksObj[na].componentRenderer.setArg("multiplyOutput", () => {return 0.0;});
        for(let na=0; na < this.arrowsObj.length; na++)
            this.arrowsObj[na].componentRenderer.setArg("multiplyOutput", () => {return 0.0;});
    };

    enableShowWeightDynamics() {
        this.comp_renderer_nodes.setArg("viewNeuronDynamics", () => {return 1.0;});
    };

    disableShowWeightDynamics() {
        this.comp_renderer_nodes.setArg("viewNeuronDynamics", () => {return 0.0;});
    };
}
global.Graph = Graph;
module.exports.Graph = Graph;