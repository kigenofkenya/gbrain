import "scejs";
import {Graph} from "./Graph.class";

/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.batch_size
 */
export class GBrain {
    constructor(jsonIn) {
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
    ini(jsonIn) {
        let sce = new SCE();
        sce.initialize(jsonIn);

        this.project = new Project();
        sce.loadProject(this.project);

        let stage = new Stage();
        this.project.addStage(stage);
        this.project.setActiveStage(stage);

        // CAMERA
        let simpleCamera = new SimpleCamera(sce);
        simpleCamera.setView(Constants.VIEW_TYPES.TOP);
        simpleCamera.setVelocity(1.0);
        sce.setDimensions(jsonIn.dimensions.width, jsonIn.dimensions.height);

        // GRID
        //let grid = new Grid(sce);
        //grid.generate(100.0, 1.0);

        this.graph = new Graph(sce,{"enableFonts":true});
        this.graph.enableNeuronalNetwork();
        this.graph.layerCount = 0;
        this.graph.batch_size = this.batch_size;

        let mesh_point = new Mesh().loadPoint();
        //this.graph.setNodeMesh(mesh_point);


        this.graph.setFontsImage(sce.sceDirectory+"/Prefabs/Graph/fonts.png");
    };

    /**
     * @param {Array<Object>} layer_defs
     */
    makeLayers(layer_defs) {
        let offsetX = -30;
        let lType = {   "input": (l) => {
                            let offsetZ = -10.0*(l.depth/2);
                            for(let n=0; n < l.depth; n++) {
                                this.graph.afferentNodesCount++;
                                this.graph.addAfferentNeuron("input"+this.inputCount, [offsetX, 0.0, offsetZ, 1.0]); // afferent neuron (sensor)
                                this.inputCount++;
                                offsetZ += 10.0;
                            }

                            this.graph.layerCount++;
                            offsetX += 30.0;
                        },
                        "fc": (l) => {
                            let neuronLayer = this.graph.createNeuronLayer(1, l.num_neurons, [offsetX, 0.0, 0.0, 1.0], 5.0); // numX, numY, visible position
                            this.neuronLayers.push(neuronLayer);

                            if(this.graph.layerCount === 1) {
                                for(let n=0; n < this.inputCount; n++) {
                                    this.graph.connectNeuronWithNeuronLayer({   "neuron": "input"+n,
                                                                                "neuronLayer": this.neuronLayers[this.neuronLayers.length-1],
                                                                                "activationFunc": 0,
                                                                                "weight": null,
                                                                                "multiplier": 1,
                                                                                "layerNum": this.graph.layerCount-1});
                                }
                            } else
                                this.graph.connectNeuronLayerWithNeuronLayer({  "neuronLayerOrigin": this.neuronLayers[this.neuronLayers.length-2],
                                                                                "neuronLayerTarget": this.neuronLayers[this.neuronLayers.length-1],
                                                                                "layerNum": this.graph.layerCount-1}); // TODO l.activation

                            this.graph.layerCount++;
                            offsetX += 30.0;
                        },
                        "regression": (l) => {
                            let offsetZ = -30.0*(l.num_neurons/2);
                            for(let n=0; n < l.num_neurons; n++) {
                                this.graph.efferentNodesCount++;
                                this.graph.addEfferentNeuron("output"+this.outputCount, [offsetX, 0.0, offsetZ, 1.0]); // efferent neuron (actuator)
                                this.graph.connectNeuronLayerWithNeuron({   "neuronLayer": this.neuronLayers[this.neuronLayers.length-1],
                                                                            "neuron": "output"+this.outputCount,
                                                                            "layerNum": this.graph.layerCount-1});

                                this.outputCount++;
                                offsetZ += 30.0;
                            }
                            this.graph.layerCount++;
                        }};
        for(let n=0; n < layer_defs.length; n++) {
            let l = layer_defs[n];
            lType[l.type](l);
        }

        this.graph.createWebGLBuffers();
        this.graph.enableForceLayout();
    };

    /**
     * @param {Array<number>} state
     * @param {Function} onAction
     */
    forward(state, onAction) {
        this.graph.forward({"state": state,
                            "onAction": (data) => {
                                onAction(data);
                            }});
    };

    /**
     * @param {Object} reward {dim: actionId for the reward , val: number}
     * @param {Function} onTrain
     */
    train(reward, onTrain) {
        let arrReward = [];
        for(let n=0; n < reward.length; n++) {
            for(let nb=0; nb < (this.outputCount/this.batch_size); nb++) {
                if(nb === reward[n].dim)
                    arrReward.push(reward[n].val);
                else
                    arrReward.push(0.0);
            }
        }

        this.graph.train({  "arrReward": arrReward,
                            "onTrained": (data) => {
                                onTrain(data);
                            }});
    };

    enableShowOutputWeighted() {
        this.graph.enableShowOutputWeighted();
    };

    disableShowOutputWeighted() {
        this.graph.disableShowOutputWeighted();
    };

    tick() {
        this.project.getActiveStage().tick();
    };
}
global.GBrain = GBrain;
module.exports.GBrain = GBrain;