export class KERNEL_ADJMATRIX_UPDATE {
    constructor() {

    }

    static getSrc(geometryLength) {
        return ["x", ["adjacencyMatrix", "adjacencyMatrixB"],
            // head
            "",

            // source
            `vec4 adjMat = adjacencyMatrix[x]; 
            vec4 adjMatB = adjacencyMatrixB[x];

            float linkLayerNum = adjMat.x;
            float weightQuadSum = adjMat.y;
            float linkWeight = adjMat.z;
            float linkTypeParent = adjMat.w;
            
            float weightAbsSum = adjMatB.x;
            
            if(linkTypeParent == 0.5 && linkLayerNum >= 0.0) {
                float id = adjMatB.z;
                float idInv = adjMatB.w;
            
                vec2 xGeometryCurrentChild = get_global_id(id, bufferNodesWidth, `+geometryLength.toFixed(1)+`);
                vec2 xGeometryParent = get_global_id(idInv, bufferNodesWidth, `+geometryLength.toFixed(1)+`);

                float childGDeltaA = dataB[xGeometryCurrentChild].y;
                float childGOutputA = dataB[xGeometryCurrentChild].z;
                float parentGOutputA = dataB[xGeometryParent].z;
                float parentGInputsumA = dataB[xGeometryParent].w;
                float parentGOutputDerivA = 1.0;
                
                float childGDeltaB = dataF[xGeometryCurrentChild].x;
                float childGOutputB = dataF[xGeometryCurrentChild].y;
                float parentGOutputB = dataF[xGeometryParent].y;
                float parentGInputsumB = dataF[xGeometryParent].z;
                float parentGOutputDerivB = 1.0;
                
                float childGDeltaC = dataF[xGeometryCurrentChild].w;
                float childGOutputC = dataG[xGeometryCurrentChild].x;
                float parentGOutputC = dataG[xGeometryParent].x;
                float parentGInputsumC = dataG[xGeometryParent].y;
                float parentGOutputDerivC = 1.0;
                
                float childGDeltaD = dataG[xGeometryCurrentChild].z;
                float childGOutputD = dataG[xGeometryCurrentChild].w;
                float parentGOutputD = dataG[xGeometryParent].w;
                float parentGInputsumD = dataH[xGeometryParent].x;
                float parentGOutputDerivD = 1.0;
                
                float childGDeltaE = dataH[xGeometryCurrentChild].y;
                float childGOutputE = dataH[xGeometryCurrentChild].z;
                float parentGOutputE = dataH[xGeometryParent].z;
                float parentGInputsumE = dataH[xGeometryParent].w;
                float parentGOutputDerivE = 1.0;
            
                float lr = learningRate;
                float l1_decay = 0.0;
                float l2_decay = 0.01;
                float gpu_batch_size =5.0;
                float br = gpu_batch_repeats;
                
                if(linkLayerNum < layerCount-2.0) { 
                    parentGOutputDerivA = (parentGInputsumA <= 0.0) ? 0.01 : 1.0;                    
                    parentGOutputDerivB = (parentGInputsumB <= 0.0) ? 0.01 : 1.0;
                    parentGOutputDerivC = (parentGInputsumC <= 0.0) ? 0.01 : 1.0;
                    parentGOutputDerivD = (parentGInputsumD <= 0.0) ? 0.01 : 1.0;
                    parentGOutputDerivE = (parentGInputsumE <= 0.0) ? 0.01 : 1.0;
                }
                
                if(weightQuadSum != 0.0) {
                    linkWeight = linkWeight-lr* (((childGDeltaA*parentGOutputDerivA*childGOutputA)/(gpu_batch_size*br)) + (l2_decay*weightQuadSum) + (l1_decay*weightAbsSum));
                    linkWeight = linkWeight-lr* (((childGDeltaB*parentGOutputDerivB*childGOutputB)/(gpu_batch_size*br)) + (l2_decay*weightQuadSum) + (l1_decay*weightAbsSum));
                    linkWeight = linkWeight-lr* (((childGDeltaC*parentGOutputDerivC*childGOutputC)/(gpu_batch_size*br)) + (l2_decay*weightQuadSum) + (l1_decay*weightAbsSum));
                    linkWeight = linkWeight-lr* (((childGDeltaD*parentGOutputDerivD*childGOutputD)/(gpu_batch_size*br)) + (l2_decay*weightQuadSum) + (l1_decay*weightAbsSum));
                    linkWeight = linkWeight-lr* (((childGDeltaE*parentGOutputDerivE*childGOutputE)/(gpu_batch_size*br)) + (l2_decay*weightQuadSum) + (l1_decay*weightAbsSum));
                    weightQuadSum = 0.0;
                    weightAbsSum = 0.0;
                } else {
                    weightQuadSum += linkWeight*linkWeight;
                    weightAbsSum += abs(linkWeight);
                }
            }
            
            return [vec4(linkLayerNum, weightQuadSum, linkWeight, linkTypeParent), vec4(weightAbsSum, adjMatB.y, adjMatB.z, adjMatB.w)];
            `];
    };
}
global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;