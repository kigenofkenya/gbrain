import {GraphUtils} from "./graphUtil";

export class KERNEL_DIR {
    constructor() {

    }

    static getSrc(customCode, geometryLength, efferentStart, efferentNodesCount, _enableNeuronalNetwork) {
        let outputArr = null;
        let returnStr = null;
        if(_enableNeuronalNetwork === true) {
            outputArr = ["dir", "posXYZW", "dataB", "dataF", "dataG", "dataH"];
            returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0), currentDataB, currentDataF, currentDataG, currentDataH];';
        } else {
            outputArr = ["dir", "posXYZW"];
            returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0)];';
        }

        return ["x", outputArr,
                    // head
                    GraphUtils.adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount),

                    // source
                    `float nodeId = data[x].x;
                    float numOfConnections = data[x].y;
                    vec2 xGeometry = get_global_id(nodeId, uBufferWidth, ${geometryLength.toFixed(1)});


                    vec3 currentPos = posXYZW[xGeometry].xyz;

                    float bornDate = dataB[xGeometry].x;
                    float dieDate = dataB[xGeometry].y;

                    vec3 currentDir = dir[xGeometry].xyz;


                    vec4 currentDataB = dataB[xGeometry];
                    vec4 currentDataF = dataF[xGeometry];
                    vec4 currentDataG = dataG[xGeometry];
                    vec4 currentDataH = dataH[xGeometry];

                    currentDir = vec3(0.0, 0.0, 0.0);

                    if(enableForceLayout == 1.0) {
                        idAdjMatrixResponse adjM = idAdjMatrix_ForceLayout(nodeId, currentPos, currentDir, numOfConnections, currentTimestamp, bornDate, dieDate, enableNeuronalNetwork);
                        currentDir = (adjM.collisionExists == 1.0) ? adjM.force : currentDir+(adjM.force*1.0);

                        if(enableNeuronalNetwork == 1.0 && currentTrainLayer == -3.0) {
                            currentDataB = vec4(currentDataB.x, currentDataB.y, adjM.netFOutputA, adjM.netErrorWeightA);
                            currentDataF = vec4(adjM.netFOutputB, adjM.netErrorWeightB, adjM.netFOutputC, adjM.netErrorWeightC);
                            currentDataG = vec4(adjM.netFOutputD, adjM.netErrorWeightD, adjM.netFOutputE, adjM.netErrorWeightE);
                            currentDataH = vec4(adjM.netFOutputF, adjM.netErrorWeightF, adjM.netFOutputG, adjM.netErrorWeightG);
                        }
                    }

                    ${((customCode !== undefined) ? customCode : '')}

                    if(enableDrag == 1.0) {
                        if(nodeId == idToDrag) {
                            currentPos = vec3(MouseDragTranslationX, MouseDragTranslationY, MouseDragTranslationZ);
                        }
                    }

                    currentPos += currentDir;
                    if(only2d == 1.0) {
                        currentPos.y = 0.0;
                    }

                    ${returnStr}`];
    };
}
global.KERNEL_DIR = KERNEL_DIR;
module.exports.KERNEL_DIR = KERNEL_DIR;