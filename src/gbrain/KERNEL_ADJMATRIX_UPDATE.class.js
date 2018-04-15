export class KERNEL_ADJMATRIX_UPDATE {
    constructor() {

    }

    static getSrc(geometryLength) {
        return ["x", ["adjacencyMatrix"],
            // head
            "",

            // source
            `vec4 adjMat = adjacencyMatrix[x]; 
            vec4 adjMatB = adjacencyMatrixB[x];

            float linkLayerNum = adjMat.x;
            float linkWeight = adjMat.z;
            float linkTypeParent = adjMat.w;
            
            if(linkTypeParent == 0.5 && linkLayerNum > 0.0) {
                float id = adjMatB.z;
                float idInv = adjMatB.w;
            
                vec2 xGeometryCurrentChild = get_global_id(id, bufferNodesWidth, `+geometryLength.toFixed(1)+`);
                vec2 xGeometryParent = get_global_id(idInv, bufferNodesWidth, `+geometryLength.toFixed(1)+`);

                float childGOutputA = dataB[xGeometryCurrentChild].z;
                float parentGOutputA = dataB[xGeometryParent].z;
                float parentGErrorA = dataB[xGeometryParent].w;
                
                float childGOutputB = dataF[xGeometryCurrentChild].x;
                float parentGOutputB = dataF[xGeometryParent].x;
                float parentGErrorB = dataF[xGeometryParent].y;
                
                float childGOutputC = dataF[xGeometryCurrentChild].z;
                float parentGOutputC = dataF[xGeometryParent].z;
                float parentGErrorC = dataF[xGeometryParent].w;
                
                float childGOutputD = dataG[xGeometryCurrentChild].x;
                float parentGOutputD = dataG[xGeometryParent].x;
                float parentGErrorD = dataG[xGeometryParent].y;
                
                float childGOutputE = dataG[xGeometryCurrentChild].z;
                float parentGOutputE = dataG[xGeometryParent].z;
                float parentGErrorE = dataG[xGeometryParent].w;
                
                float childGOutputF = dataH[xGeometryCurrentChild].x;
                float parentGOutputF = dataH[xGeometryParent].x;
                float parentGErrorF = dataH[xGeometryParent].y;
                
                float childGOutputG = dataH[xGeometryCurrentChild].z;
                float parentGOutputG = dataH[xGeometryParent].z;
                float parentGErrorG = dataH[xGeometryParent].w;
            
                float lr = learningRate;
                float l2_decay = 0.01;
                float gpu_batch_size = 7.0;
                float br = gpu_batch_repeats;
                
                ${/* parentGErrorA += linkWeight*l2_decay;
                parentGErrorB += linkWeight*l2_decay;
                parentGErrorC += linkWeight*l2_decay;
                parentGErrorD += linkWeight*l2_decay;
                parentGErrorE += linkWeight*l2_decay;
                parentGErrorF += linkWeight*l2_decay;
                parentGErrorG += linkWeight*l2_decay;*/''}
                
                linkWeight += -lr*(parentGErrorA/(gpu_batch_size*br))*childGOutputA;
                linkWeight += -lr*(parentGErrorB/(gpu_batch_size*br))*childGOutputB;
                linkWeight += -lr*(parentGErrorC/(gpu_batch_size*br))*childGOutputC;
                linkWeight += -lr*(parentGErrorD/(gpu_batch_size*br))*childGOutputD;
                linkWeight += -lr*(parentGErrorE/(gpu_batch_size*br))*childGOutputE;
                linkWeight += -lr*(parentGErrorF/(gpu_batch_size*br))*childGOutputF;
                linkWeight += -lr*(parentGErrorG/(gpu_batch_size*br))*childGOutputG;
            }
            
            return [vec4(linkLayerNum, 0.0, linkWeight, linkTypeParent)];
            `];
    };
}
global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;