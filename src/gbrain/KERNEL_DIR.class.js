export class KERNEL_DIR {
    constructor() {

    }

    static getSrc(customCode, geometryLength, afferentNodesCount, efferentStart, efferentNodesCount) {
        let outputArr = ["dir", "posXYZW", "dataB", "dataF", "dataG", "dataH"];
        let returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0), currentDataB, currentDataF, currentDataG, currentDataH];';

        return ["x", outputArr,
            // head
            `float tanh(float val) {
                float tmp = exp(val);
                float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
                return tanH;
            }
            float sigm(float val) {
                return (1.0 / (1.0 + exp(-val)));
            }`,

            // source
            `float nodeId = data[x].x;
            vec2 xGeometry = get_global_id(nodeId, uBufferWidth, ${geometryLength.toFixed(1)});


            vec3 currentPos = posXYZW[xGeometry].xyz;
            vec3 currentDir = dir[xGeometry].xyz;


            vec4 currentDataB = dataB[xGeometry];
            vec4 currentDataF = dataF[xGeometry];
            vec4 currentDataG = dataG[xGeometry];
            vec4 currentDataH = dataH[xGeometry];

            currentDir = vec3(0.0, 0.0, 0.0);

            
            vec3 atraction = vec3(0.0, 0.0, 0.0);
            float acumAtraction = 1.0;
            vec3 repulsion = vec3(0.0, 0.0, 0.0);

            vec3 force = vec3(0.0, 0.0, 0.0);


            float netChildInputSumA = 0.0;
            float foutputA = 0.0;
            float netParentErrorWeightA = 0.0;
            
            float netChildInputSumB = 0.0;
            float foutputB = 0.0;
            float netParentErrorWeightB = 0.0;
            
            float netChildInputSumC = 0.0;
            float foutputC = 0.0;
            float netParentErrorWeightC = 0.0;
            
            float netChildInputSumD = 0.0;
            float foutputD = 0.0;
            float netParentErrorWeightD = 0.0;
            
            float netChildInputSumE = 0.0;
            float foutputE = 0.0;
            float netParentErrorWeightE = 0.0;
            

            if(nodeId < nodesCount && enableTrain == 0.0) {
                float currentActivationFn = 0.0;
                vec2 xGeomCurrent = get_global_id(nodeId, uBufferWidth, ${geometryLength.toFixed(1)});
                for(int n=0; n < 4096; n++) {
                    if(float(n) >= nodesCount) {break;}
                    if(float(n) != nodeId) {
                        vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, ${geometryLength.toFixed(1)});


                        vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);
                        vec2 xAdjMatOpposite = get_global_id(vec2(nodeId, float(n)), widthAdjMatrix);

                        vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];
                        vec4 pixAdjMatAOpposite = adjacencyMatrix[xAdjMatOpposite];

                        vec4 pixAdjMatBCurrent = adjacencyMatrixB[xAdjMatCurrent];
                        vec4 pixAdjMatBOpposite = adjacencyMatrixB[xAdjMatOpposite];


                                                                    
                        ${/* pixAdjMatACurrent */''}
                        float currentLayerNum = pixAdjMatACurrent.x;
                        float currentWeight = pixAdjMatACurrent.z;
                        float currentIsParent = pixAdjMatACurrent.w;
            
                        ${/* pixAdjMatAOpposite */''}
                        float oppositeLayerNum = pixAdjMatAOpposite.x;
                        float oppositeWeight = pixAdjMatAOpposite.z;
                        float oppositeIsParent = pixAdjMatAOpposite.w;
            
            
                        ${/* pixAdjMatBCurrent */''}
                        float currentLinkMultiplier = pixAdjMatBCurrent.x;
                        float currentActivationFn = pixAdjMatBCurrent.y;
            
                        ${/* pixAdjMatBOpposite */''}
                        float oppositeLinkMultiplier = pixAdjMatBOpposite.x;
                        float oppositeActivationFn = pixAdjMatBOpposite.y;
            
            
            
                        ${/* dataB Current */''}
                        float currentBiasNode = dataB[xGeomCurrent].x;
                        ${/* float currentNetOutputA = dataB[xGeomCurrent].z;
                        float currentNetOutputB = dataF[xGeomCurrent].y;
                        float currentNetOutputC = dataG[xGeomCurrent].x;
                        float currentNetOutputD = dataG[xGeomCurrent].w;
                        float currentNetOutputE = dataH[xGeomCurrent].z; */''}
            
                        ${/* dataB Opposite */''}
                        float oppositeBiasNode = dataB[xGeomOpposite].x;
                        
                        float oppositeNetErrorA = dataB[xGeomOpposite].y;
                        float oppositeNetOutputA = dataB[xGeomOpposite].z;
                        float oppositeInputsumA = dataB[xGeomOpposite].w;
                        
                        float oppositeNetErrorB = dataF[xGeomOpposite].x;
                        float oppositeNetOutputB = dataF[xGeomOpposite].y;
                        float oppositeInputsumB = dataF[xGeomOpposite].z;
                    
                        float oppositeNetErrorC = dataF[xGeomOpposite].w;
                        float oppositeNetOutputC = dataG[xGeomOpposite].x;
                        float oppositeInputsumC = dataG[xGeomOpposite].y;
                    
                        float oppositeNetErrorD = dataG[xGeomOpposite].z;
                        float oppositeNetOutputD = dataG[xGeomOpposite].w;
                        float oppositeInputsumD = dataH[xGeomOpposite].x;
                    
                        float oppositeNetErrorE = dataH[xGeomOpposite].y;
                        float oppositeNetOutputE = dataH[xGeomOpposite].z;
                        float oppositeInputsumE = dataH[xGeomOpposite].w;
            
            
                        ${/* pos & dir Current */''}
                        ${/* vec3 currentPos = posXYZW[xGeomCurrent].xyz; */''}
                        ${/* vec3 currentDir = dir[xGeomCurrent].xyz; */''}
            
                        ${/* pos & dir Opposite */''}
                        vec3 oppositePos = posXYZW[xGeomOpposite].xyz;
                        vec3 oppositeDir = dir[xGeomOpposite].xyz;
            
                        ${/* dir / dist to opposite */''}
                        vec3 dirToOpposite = (oppositePos-currentPos);
                        vec3 dirToOppositeN = normalize(dirToOpposite);
            
                        float dist = distance(oppositePos, currentPos); ${/* near=0.0 ; far=1.0 */''}
                        float distN = max(0.0,dist)/100000.0;
            
                        float mm = 200.0;
                        float m1 = 400000.0/mm;
                        float m2 = 48.0/mm;
                        if(currentIsParent == 1.0) {
                            netChildInputSumA += oppositeNetOutputA*oppositeWeight;
                            netChildInputSumB += oppositeNetOutputB*oppositeWeight;
                            netChildInputSumC += oppositeNetOutputC*oppositeWeight;
                            netChildInputSumD += oppositeNetOutputD*oppositeWeight;
                            netChildInputSumE += oppositeNetOutputE*oppositeWeight;
                            
                            atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));
                            repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));
                            acumAtraction += 1.0;
                        } else if(currentIsParent == 0.5) {
                            float parentGOutputDerivA = 1.0;                    
                            float parentGOutputDerivB = 1.0;
                            float parentGOutputDerivC = 1.0;
                            float parentGOutputDerivD = 1.0;
                            float parentGOutputDerivE = 1.0;
                            if(currentLayerNum < layerCount-1.0) { 
                                parentGOutputDerivA = (oppositeInputsumA <= 0.0) ? 0.01 : 1.0;                    
                                parentGOutputDerivB = (oppositeInputsumB <= 0.0) ? 0.01 : 1.0;
                                parentGOutputDerivC = (oppositeInputsumC <= 0.0) ? 0.01 : 1.0;
                                parentGOutputDerivD = (oppositeInputsumD <= 0.0) ? 0.01 : 1.0;
                                parentGOutputDerivE = (oppositeInputsumE <= 0.0) ? 0.01 : 1.0;
                            }
                            
                            if(currentBiasNode == 0.0) {
                                netParentErrorWeightA += oppositeNetErrorA*parentGOutputDerivA*currentWeight;
                                netParentErrorWeightB += oppositeNetErrorB*parentGOutputDerivB*currentWeight;
                                netParentErrorWeightC += oppositeNetErrorC*parentGOutputDerivC*currentWeight;
                                netParentErrorWeightD += oppositeNetErrorD*parentGOutputDerivD*currentWeight;
                                netParentErrorWeightE += oppositeNetErrorE*parentGOutputDerivE*currentWeight;
                            } else {
                                netParentErrorWeightA += oppositeNetErrorA*parentGOutputDerivA;
                                netParentErrorWeightB += oppositeNetErrorB*parentGOutputDerivB;
                                netParentErrorWeightC += oppositeNetErrorC*parentGOutputDerivC;
                                netParentErrorWeightD += oppositeNetErrorD*parentGOutputDerivD;
                                netParentErrorWeightE += oppositeNetErrorE*parentGOutputDerivE;
                            }
                            atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);
                            repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);
                            acumAtraction += 1.0;
                        }
            
                        repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));
                        acumAtraction += 1.0;
                    }
                }
                
                float vndm = (viewNeuronDynamics == 1.0) ? netChildInputSumA : 1.0;
                force += (atraction/acumAtraction)*abs(vndm);
                force += (repulsion/acumAtraction)*abs(vndm);
                currentDir += force;
                
                
                float currentBiasNode = dataB[xGeomCurrent].x;
                
                ${KERNEL_DIR.efferentNodesStr(afferentNodesCount, efferentStart, efferentNodesCount)}
                
                currentDataB = vec4(currentDataB.x, netParentErrorWeightA, foutputA, netChildInputSumA);
                currentDataF = vec4(netParentErrorWeightB, foutputB, netChildInputSumB, netParentErrorWeightC);
                currentDataG = vec4(foutputC, netChildInputSumC, netParentErrorWeightD, foutputD);
                currentDataH = vec4(netChildInputSumD, netParentErrorWeightE, foutputE, netChildInputSumE);
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

    static efferentNodesStr(afferentNodesCount, efferentStart, efferentNodesCount) {
        /////////////////////////////////////////////////
        // OUTPUT
        /////////////////////////////////////////////////
        let str = `
            if(nodeId < afferentNodesCount) {
                for(float n=0.0; n < 1024.0; n+=1.0) {
                    if(n >= afferentNodesCount) {
                        break;
                    }
                    if(nodeId == n) {
                        foutputA = afferentNodesA[int(n)];
                        foutputB = afferentNodesB[int(n)];
                        foutputC = afferentNodesC[int(n)];
                        foutputD = afferentNodesD[int(n)];
                        foutputE = afferentNodesE[int(n)];
                        break;
                    }
                }
            } else {
                if(currentBiasNode == 0.0) {                                     
                    foutputA = (netChildInputSumA <= 0.0) ? 0.01*netChildInputSumA : netChildInputSumA; ${/* SIGM= sigm(netChildInputSumA)-0.5 ; TANH=tanh(netChildInputSumA) ; RELU=max(0.0, netChildInputSumA) */''}
                    foutputB = (netChildInputSumB <= 0.0) ? 0.01*netChildInputSumB : netChildInputSumB;
                    foutputC = (netChildInputSumC <= 0.0) ? 0.01*netChildInputSumC : netChildInputSumC;
                    foutputD = (netChildInputSumD <= 0.0) ? 0.01*netChildInputSumD : netChildInputSumD;
                    foutputE = (netChildInputSumE <= 0.0) ? 0.01*netChildInputSumE : netChildInputSumE;
                } else {
                    foutputA = 1.0;
                    foutputB = 1.0;
                    foutputC = 1.0;
                    foutputD = 1.0;
                    foutputE = 1.0;
                }
            }`;

        /////////////////////////////////////////////////
        // ERROR
        /////////////////////////////////////////////////
        for(let n=(efferentStart); n < (efferentStart+efferentNodesCount); n++) {
            let cond = (n===efferentStart) ? "if" : "else if" ;
            str += `
            ${cond}(nodeId == `+n.toFixed(1)+`) {
                foutputA = netChildInputSumA; ${/* SIGM= sigm(netChildInputSumA)-0.5 ; TANH=tanh(netChildInputSumA) ; RELU=max(0.0, netChildInputSumA) */''} 
                foutputB = netChildInputSumB;
                foutputC = netChildInputSumC;
                foutputD = netChildInputSumD;
                foutputE = netChildInputSumE;
                    
                netParentErrorWeightA = efferentNodesA[`+Math.round(n-efferentStart)+`];
                netParentErrorWeightB = efferentNodesB[`+Math.round(n-efferentStart)+`];
                netParentErrorWeightC = efferentNodesC[`+Math.round(n-efferentStart)+`];
                netParentErrorWeightD = efferentNodesD[`+Math.round(n-efferentStart)+`];
                netParentErrorWeightE = efferentNodesE[`+Math.round(n-efferentStart)+`];
            }`;
        }
        return str;
    };
}
global.KERNEL_DIR = KERNEL_DIR;
module.exports.KERNEL_DIR = KERNEL_DIR;