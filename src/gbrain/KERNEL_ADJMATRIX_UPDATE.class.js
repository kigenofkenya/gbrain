export class KERNEL_ADJMATRIX_UPDATE {
    constructor() {

    }

    static getSrc(geometryLength) {
        return ["x", ["adjacencyMatrix", "adjacencyMatrixB", "adjacencyMatrixC", "adjacencyMatrixD"],
            // head
            "",

            // source
            `vec4 adjMat = adjacencyMatrix[x]; 
            vec4 adjMatB = adjacencyMatrixB[x];
            vec4 adjMatC = adjacencyMatrixC[x];
            vec4 adjMatD = adjacencyMatrixD[x];

            float linkLayerNum = adjMat.x;
            float weightQuadSum = adjMat.y;
            float linkWeight = adjMat.z;
            float linkTypeParent = adjMat.w;
            
            float weightAbsSum = adjMatB.x;
            float costA = adjMatB.y;
            float costB = adjMatC.x;
            float costC = adjMatC.y;
            float costD = adjMatC.z;
            float costE = adjMatC.w;
            float costF = adjMatD.x;
            float costG = adjMatD.y;
            
            if(currentTrainLayer == -10.0) { 
                costA = 0.0;
                costB = 0.0;
                costC = 0.0;
                costD = 0.0;
                costE = 0.0;
                costF = 0.0;
                costG = 0.0;
            } else if(linkTypeParent == 0.5 && linkLayerNum >= 0.0) {
                float id = adjMatB.z;
                float idInv = adjMatB.w;
            
                vec2 xGeometryCurrentChild = get_global_id(id, bufferNodesWidth, `+geometryLength.toFixed(1)+`);
                vec2 xGeometryParent = get_global_id(idInv, bufferNodesWidth, `+geometryLength.toFixed(1)+`);


                float childBiasNode = dataB[xGeometryCurrentChild].x;
                
                float childGOutputA = dataB[xGeometryCurrentChild].z;
                float childGOutputB = dataF[xGeometryCurrentChild].x;
                float childGOutputC = dataF[xGeometryCurrentChild].z;
                float childGOutputD = dataG[xGeometryCurrentChild].x;
                float childGOutputE = dataG[xGeometryCurrentChild].z;
                float childGOutputF = dataH[xGeometryCurrentChild].x;
                float childGOutputG = dataH[xGeometryCurrentChild].z;
                
                
                float parentGOutputA = dataB[xGeometryParent].z;
                float parentGOutputB = dataF[xGeometryParent].x;
                float parentGOutputC = dataF[xGeometryParent].z;
                float parentGOutputD = dataG[xGeometryParent].x;
                float parentGOutputE = dataG[xGeometryParent].z;
                float parentGOutputF = dataH[xGeometryParent].x;
                float parentGOutputG = dataH[xGeometryParent].z;
                
                float parentGDeltaA = dataB[xGeometryParent].y;
                float parentGDeltaB = dataB[xGeometryParent].w;
                float parentGDeltaC = dataF[xGeometryParent].y;
                float parentGDeltaD = dataF[xGeometryParent].w;
                float parentGDeltaE = dataG[xGeometryParent].y;
                float parentGDeltaF = dataG[xGeometryParent].w;
                float parentGDeltaG = dataH[xGeometryParent].y;
                
                
                
                float lr = learningRate;
                float l1_decay = 0.0;
                float l2_decay = 0.01;
                float gpu_batch_size = 7.0;     
                
                if(currentTrainLayer == linkLayerNum) {
                    float parentGOutputDerivA = (parentGOutputA <= 0.0) ? 0.01 : 1.0;                    
                    float parentGOutputDerivB = (parentGOutputB <= 0.0) ? 0.01 : 1.0;
                    float parentGOutputDerivC = (parentGOutputC <= 0.0) ? 0.01 : 1.0;
                    float parentGOutputDerivD = (parentGOutputD <= 0.0) ? 0.01 : 1.0;
                    float parentGOutputDerivE = (parentGOutputE <= 0.0) ? 0.01 : 1.0;
                    float parentGOutputDerivF = (parentGOutputF <= 0.0) ? 0.01 : 1.0;
                    float parentGOutputDerivG = (parentGOutputG <= 0.0) ? 0.01 : 1.0;
                    
                    float dA = parentGDeltaA*parentGOutputDerivA;
                    float dB = parentGDeltaB*parentGOutputDerivB;
                    float dC = parentGDeltaC*parentGOutputDerivC;
                    float dD = parentGDeltaD*parentGOutputDerivD;
                    float dE = parentGDeltaE*parentGOutputDerivE;
                    float dF = parentGDeltaF*parentGOutputDerivF;
                    float dG = parentGDeltaG*parentGOutputDerivG;
                    
                    float wT = 0.0;
                    wT += dA*childGOutputA;
                    wT += dB*childGOutputB;
                    wT += dC*childGOutputC;
                    wT += dD*childGOutputD;
                    wT += dE*childGOutputE;
                    wT += dF*childGOutputF;
                    wT += dG*childGOutputG;
                    wT /= (gpu_batch_size*batch_repeats);
                    
                    if(childBiasNode == 0.0) {
                        costA = dA*linkWeight;
                        costB = dB*linkWeight;
                        costC = dC*linkWeight;
                        costD = dD*linkWeight;
                        costE = dE*linkWeight;
                        costF = dF*linkWeight;
                        costG = dG*linkWeight;
                    } else {
                        costA = dA;
                        costB = dB;
                        costC = dC;
                        costD = dD;
                        costE = dE;
                        costF = dF;
                        costG = dG;
                    }
                    
                    linkWeight += -lr*wT;
                }
            }
            
            return [vec4(linkLayerNum, weightQuadSum, linkWeight, linkTypeParent), vec4(weightAbsSum, costA, adjMatB.z, adjMatB.w), vec4(costB, costC, costD, costE), vec4(costF, costG, 0.0, 0.0)];
            `];
    };
}
global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;