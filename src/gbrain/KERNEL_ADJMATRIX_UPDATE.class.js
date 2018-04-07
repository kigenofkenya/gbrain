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
                float parentGErrorA = dataB[xGeometryParent].w;
                
                float childGOutputB = dataF[xGeometryCurrentChild].x;
                float parentGErrorB = dataF[xGeometryParent].y;
                
                float childGOutputC = dataF[xGeometryCurrentChild].z;
                float parentGErrorC = dataF[xGeometryParent].w;
                
                float childGOutputD = dataG[xGeometryCurrentChild].x;
                float parentGErrorD = dataG[xGeometryParent].y;
                
                float childGOutputE = dataG[xGeometryCurrentChild].z;
                float parentGErrorE = dataG[xGeometryParent].w;
                
                float childGOutputF = dataH[xGeometryCurrentChild].x;
                float parentGErrorF = dataH[xGeometryParent].y;
                
                float childGOutputG = dataH[xGeometryCurrentChild].z;
                float parentGErrorG = dataH[xGeometryParent].w;
            
                float lr = learningRate;
                float l2_decay = 0.01;
                float gpu_batch_size = 7.0;
                float br = gpu_batch_repeats;
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputA*parentGErrorA))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputB*parentGErrorB))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputC*parentGErrorC))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputD*parentGErrorD))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputE*parentGErrorE))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputF*parentGErrorF))/(gpu_batch_size*br));
                linkWeight += -lr*(((l2_decay*linkWeight)+(childGOutputG*parentGErrorG))/(gpu_batch_size*br));
            }
            
            return [vec4(linkLayerNum, 0.0, linkWeight, linkTypeParent)];
            `];
    };
}
global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;