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
                
                float derivA = (childGOutputA < 0.0) ? 0.01 : 1.0;
                float derivB = (childGOutputB < 0.0) ? 0.01 : 1.0;
                float derivC = (childGOutputC < 0.0) ? 0.01 : 1.0;
                float derivD = (childGOutputD < 0.0) ? 0.01 : 1.0;
                float derivE = (childGOutputE < 0.0) ? 0.01 : 1.0;
                float derivF = (childGOutputF < 0.0) ? 0.01 : 1.0;
                float derivG = (childGOutputG < 0.0) ? 0.01 : 1.0;
                
                if(linkLayerNum == layerCount-1.0) {
                    derivA = 1.0;
                    derivB = 1.0;
                    derivC = 1.0;
                    derivD = 1.0;
                    derivE = 1.0;
                    derivF = 1.0;
                    derivG = 1.0;
                }
                
                float bsm = 0.0;
                bsm = (childGOutputA != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputB != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputC != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputD != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputE != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputF != 0.0) ? bsm+1. : bsm;
                bsm = (childGOutputG != 0.0) ? bsm+1. : bsm;
                
                linkWeight += (-lr*parentGErrorA*derivA)/(bsm*br);
                if(parentGErrorB != 0.0) {linkWeight += (-lr*parentGErrorB*derivB)/(bsm*br);}
                if(parentGErrorC != 0.0) {linkWeight += (-lr*parentGErrorC*derivC)/(bsm*br);}
                if(parentGErrorD != 0.0) {linkWeight += (-lr*parentGErrorD*derivD)/(bsm*br);}
                if(parentGErrorE != 0.0) {linkWeight += (-lr*parentGErrorE*derivE)/(bsm*br);}
                if(parentGErrorF != 0.0) {linkWeight += (-lr*parentGErrorF*derivF)/(bsm*br);}
                if(parentGErrorG != 0.0) {linkWeight += (-lr*parentGErrorG*derivG)/(bsm*br);}
            }
            
            return [vec4(linkLayerNum, 0.0, linkWeight, linkTypeParent)];
            `];
    };
}
global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;