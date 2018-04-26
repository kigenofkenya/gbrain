import "scejs";
import {Graph} from "./Graph.class";
/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.gpu_batch_repeats
 */
export class GBrain {
    constructor(jsonIn) {
        this.project = null;
        this.graph = null;

        this.batch_size = 5;

        this.ini(jsonIn);
    }

    /**
     * @param {Object} jsonIn
     * @param {HTMLElement} jsonIn.target
     * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
     * @param {int} jsonIn.gpu_batch_repeats
     * @param {number} jsonIn.learning_rate
     * @param {WebGLRenderingContext} [jsonIn.gl=undefined]
     */
    ini(jsonIn) {
        this.sce = new SCE();
        this.sce.initialize(jsonIn);

        this.project = new Project();
        this.sce.loadProject(this.project);

        let stage = new Stage();
        this.project.addStage(stage);
        this.project.setActiveStage(stage);

        // CAMERA
        let simpleCamera = new SimpleCamera(this.sce);
        simpleCamera.setView(Constants.VIEW_TYPES.TOP);
        simpleCamera.setVelocity(1.0);
        this.sce.setDimensions(jsonIn.dimensions.width, jsonIn.dimensions.height);

        // GRID
        //let grid = new Grid(this.sce);
        //grid.generate(100.0, 1.0);

        this.graph = new Graph(this.sce,{"enableFonts":true});
        this.graph.enableNeuronalNetwork();
        this.graph.layerCount = 0;
        this.inputCount = 0;
        this.outputCount = 0;
        this.neuronLayers = [];
        this.graph.batch_size = this.batch_size;
        this.graph.gpu_batch_repeats = jsonIn.gpu_batch_repeats;
        this.initialLearningRate = jsonIn.learning_rate;
        this.currentLearningRate = jsonIn.learning_rate;

        let mesh_point = new Mesh().loadPoint();
        //this.graph.setNodeMesh(mesh_point);
    };

    /**
     * @param {Array<Object>} layer_defs
     */
    makeLayers(layer_defs) {
        this.graph.layer_defs = layer_defs;

        let offsetX = -30;
        let lType = {   "input": (l) => {
                            let offsetZ = -5.0*(l.depth/2);
                            for(let n=0; n < l.depth; n++) {
                                this.graph.addAfferentNeuron("input"+this.inputCount, [offsetX, 0.0, offsetZ, 1.0]); // afferent neuron (input)
                                this.inputCount++;
                                offsetZ += 5.0;
                            }

                            let nextHasBias = (this.graph.layer_defs[this.graph.layerCount+1].activation === "relu") ? 1.0 : 0.0;
                            if(nextHasBias === 1.0) {
                                offsetZ += 25.0;
                                this.graph.addNeuron("bias0", [offsetX, -10.0, offsetZ, 1.0], nextHasBias); // bias neuron
                                this.graph.layer_defs[this.graph.layerCount].hasBias = 1.0;
                            }
                            this.graph.layerCount++;
                            offsetX += 30.0;
                        },
                        "fc": (l) => {
                            let hasBias = (this.graph.layer_defs[this.graph.layerCount].activation === "relu") ? 1.0 : 0.0;
                            this.graph.layer_defs[this.graph.layerCount-1].hasBias = hasBias;

                            let nextHasBias = (this.graph.layer_defs[this.graph.layerCount+1].activation === "relu") ? 1.0 : 0.0;
                            //this.graph.layer_defs[this.graph.layerCount+1].hasBias = nextHasBias;

                            let neuronLayer = this.graph.createNeuronLayer(1, l.num_neurons, [offsetX, 0.0, 0.0, 1.0], 5.0, nextHasBias); // numX, numY, visible position
                            this.neuronLayers.push(neuronLayer);

                            if(this.graph.layerCount === 1) {
                                let we = l.weights;
                                for(let n=0; n < this.inputCount; n++) {
                                    this.graph.connectNeuronWithNeuronLayer({   "neuron": "input"+n,
                                                                                "neuronLayer": this.neuronLayers[this.neuronLayers.length-1],
                                                                                "activationFunc": 0,
                                                                                "weight": ((l.weights !== undefined && l.weights !== null) ? we.slice(0, l.num_neurons) : null),
                                                                                "layer_neurons_count": this.inputCount,
                                                                                "multiplier": 1,
                                                                                "layerNum": this.graph.layerCount-1,
                                                                                "hasBias": nextHasBias});
                                    if(l.weights !== undefined && l.weights !== null)
                                        we = we.slice(l.num_neurons);
                                }
                                this.graph.connectNeuronWithNeuronLayer({   "neuron": "bias0",
                                                                            "neuronLayer": this.neuronLayers[this.neuronLayers.length-1],
                                                                            "activationFunc": 0,
                                                                            "weight": ((l.weights !== undefined && l.weights !== null) ? we : null),
                                                                            "layer_neurons_count": this.inputCount,
                                                                            "multiplier": 1,
                                                                            "layerNum": this.graph.layerCount-1,
                                                                            "hasBias": nextHasBias});
                            } else
                                this.graph.connectNeuronLayerWithNeuronLayer({  "neuronLayerOrigin": this.neuronLayers[this.neuronLayers.length-2],
                                                                                "neuronLayerTarget": this.neuronLayers[this.neuronLayers.length-1],
                                                                                "weights": ((l.weights !== undefined && l.weights !== null) ? l.weights : null),
                                                                                "layer_neurons_count": this.neuronLayers[this.neuronLayers.length-2].length,
                                                                                "layerNum": this.graph.layerCount-1,
                                                                                "hasBias": nextHasBias}); // TODO l.activation

                            this.graph.layerCount++;
                            offsetX += 30.0;
                        },
                        "regression": (l) => {
                            let offsetZ = -30.0*(l.num_neurons/2);
                            let we = l.weights;
                            let newWe = [];
                            if(l.weights !== undefined && l.weights !== null) {
                                for(let n=0; n < l.num_neurons; n++) {
                                    for(let nb=0; nb < l.weights.length; nb=nb+l.num_neurons)
                                        newWe.push(l.weights[nb+n]);
                                }
                            }
                            for(let n=0; n < l.num_neurons; n++) {
                                this.graph.addEfferentNeuron("output"+this.outputCount, [offsetX, 0.0, offsetZ, 1.0]); // efferent neuron (output)
                                this.graph.connectNeuronLayerWithNeuron({   "neuronLayer": this.neuronLayers[this.neuronLayers.length-1],
                                                                            "neuron": "output"+this.outputCount,
                                                                            "weight": ((l.weights !== undefined && l.weights !== null) ? newWe.slice(0, this.neuronLayers[this.neuronLayers.length-1].length) : null),
                                                                            "layer_neurons_count": this.neuronLayers[this.neuronLayers.length-1].length,
                                                                            "layerNum": this.graph.layerCount-1});
                                if(l.weights !== undefined && l.weights !== null)
                                    newWe = newWe.slice(this.neuronLayers[this.neuronLayers.length-1].length);

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

        this.graph.setLearningRate(this.currentLearningRate);
    };

    fromJson(jsonIn) {
        let layer_defs = [];
        for(let n=0; n < jsonIn.layers.length; n++) {
            if(jsonIn.layers[n].layer_type === "input") {


            } else if(jsonIn.layers[n].layer_type === "fc") {
                jsonIn.layers[n].weights = [];
                for(let key in jsonIn.layers[n].filters[0].w) {
                    for(let nb=0; nb < jsonIn.layers[n].filters.length; nb++) {
                        jsonIn.layers[n].weights.push(jsonIn.layers[n].filters[nb].w[key]);
                    }
                }
                if(n > 0) {
                    for(let key in jsonIn.layers[n].biases.w)
                        jsonIn.layers[n].weights.push(jsonIn.layers[n].biases.w[key]);
                }
            } else if(jsonIn.layers[n].layer_type === "regression") {
                jsonIn.layers[n].weights = [];
                for(let key in jsonIn.layers[n].filters[0].w) {
                    for(let nb=0; nb < jsonIn.layers[n].filters.length; nb++) {
                        jsonIn.layers[n].weights.push(jsonIn.layers[n].filters[nb].w[key]);
                    }
                }
            }
        }
        for(let n=0; n < jsonIn.layers.length; n++) {
            if(jsonIn.layers[n].layer_type === "input")
                layer_defs.push({"type": "input", "depth": jsonIn.layers[n].out_depth});
            else if(jsonIn.layers[n].layer_type === "fc")
                layer_defs.push({"type": "fc", "num_neurons": jsonIn.layers[n].out_depth, "activation": "relu", "weights": jsonIn.layers[n].weights});
            else if(jsonIn.layers[n].layer_type === "regression")
                layer_defs.push({"type": "regression", "num_neurons": jsonIn.layers[n].out_depth, "weights": jsonIn.layers[n].weights});
        }

        this.sce.target.innerHTML = "";
        this.ini({  "target": this.sce.target,
                    "dimensions": this.sce.dimensions,
                    "gpu_batch_repeats": this.graph.gpu_batch_repeats,
                    "learning_rate": this.currentLearningRate});
        this.makeLayers(layer_defs);
    };

    toJson() {
        this.graph.toJson();
    };

    /**
     * @param {Array<number>} state
     * @param {Function} onAction
     * @param {boolean} [readOutput]
     */
    forward(state, onAction, readOutput) {
        this.graph.forward({"state": state,
                            "readOutput": readOutput,
                            "onAction": (maxacts) => {
                                onAction(maxacts);
                            }});
    };

    /**
     * @param {Array<Object>} reward [{dim: actionId for the reward , val: number}]
     * @param {Function} onTrain
     */
    train(reward, onTrain) {
        this.graph.train({  "reward": reward,
                            "onTrained": (loss) => {
                                onTrain(loss);
                            }});
    };

    setLearningRate(v) {
        this.currentLearningRate = v;
        this.graph.setLearningRate(v);
    };

    enableShowOutputWeighted() {
        this.graph.enableShowOutputWeighted();
    };

    disableShowOutputWeighted() {
        this.graph.disableShowOutputWeighted();
    };

    enableShowWeightDynamics() {
        this.graph.enableShowWeightDynamics();
    };

    disableShowWeightDynamics() {
        this.graph.disableShowWeightDynamics();
    };

    tick() {
        this.project.getActiveStage().tick();
    };
}
global.GBrain = GBrain;
module.exports.GBrain = GBrain;