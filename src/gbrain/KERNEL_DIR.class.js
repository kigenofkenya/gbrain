export class KERNEL_DIR {
    constructor() {

    }

    static getSrc(customCode, geometryLength, afferentNodesCount, efferentStart, efferentNodesCount) {
        let outputArr = ["dir", "posXYZW", "dataB", "dataF", "dataG", "dataH"];
        let returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0), currentDataB, currentDataF, currentDataG, currentDataH];';

        return ["x", outputArr,
            // head
            "",

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
            
            float netChildInputSumF = 0.0;
            float foutputF = 0.0;
            float netParentErrorWeightF = 0.0;
            
            float netChildInputSumG = 0.0;
            float foutputG = 0.0;
            float netParentErrorWeightG = 0.0;
            

            if(nodeId < nodesCount && currentTrainLayer == -3.0) {
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
                        float currentWeight = pixAdjMatACurrent.z;
                        float currentIsParent = pixAdjMatACurrent.w;
            
                        ${/* pixAdjMatAOpposite */''}
                        float oppositeWeight = pixAdjMatAOpposite.z;
                        float oppositeIsParent = pixAdjMatAOpposite.w;
            
            
                        ${/* pixAdjMatBCurrent */''}
                        float currentLinkMultiplier = pixAdjMatBCurrent.x;
                        float currentActivationFn = pixAdjMatBCurrent.y;
            
                        ${/* pixAdjMatBOpposite */''}
                        float oppositeLinkMultiplier = pixAdjMatBOpposite.x;
                        float oppositeActivationFn = pixAdjMatBOpposite.y;
            
            
                        ${/* dataB Current */''}
                        ${/* float currentBiasNode = dataB[xGeomCurrent].x; */''}
                        ${/* float currentNetOutput = dataB[xGeomCurrent].z; */''}
                        ${/* float currentNetError = dataB[xGeomCurrent].w; */''}
            
                        ${/* dataB Opposite */''}
                        float oppositeBiasNode = dataB[xGeomOpposite].x;
                        float oppositeNetOutputA = dataB[xGeomOpposite].z;
                        float oppositeNetErrorA = dataB[xGeomOpposite].w;
            
                        float oppositeNetOutputB = dataF[xGeomOpposite].x;
                        float oppositeNetErrorB = dataF[xGeomOpposite].y;
                    
                        float oppositeNetOutputC = dataF[xGeomOpposite].z;
                        float oppositeNetErrorC = dataF[xGeomOpposite].w;
                    
                        float oppositeNetOutputD = dataG[xGeomOpposite].x;
                        float oppositeNetErrorD = dataG[xGeomOpposite].y;
                    
                        float oppositeNetOutputE = dataG[xGeomOpposite].z;
                        float oppositeNetErrorE = dataG[xGeomOpposite].w;
                    
                        float oppositeNetOutputF = dataH[xGeomOpposite].x;
                        float oppositeNetErrorF = dataH[xGeomOpposite].y;
                    
                        float oppositeNetOutputG = dataH[xGeomOpposite].z;
                        float oppositeNetErrorG = dataH[xGeomOpposite].w;
            
            
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
            
                        float mm = 30.0;
                        float m1 = 400000.0/mm;
                        float m2 = 48.0/mm;
                        if(currentIsParent == 1.0) {
                            if(oppositeBiasNode == 0.0) {
                                netChildInputSumA += oppositeNetOutputA*oppositeWeight;
                                netChildInputSumB += oppositeNetOutputB*oppositeWeight;
                                netChildInputSumC += oppositeNetOutputC*oppositeWeight;
                                netChildInputSumD += oppositeNetOutputD*oppositeWeight;
                                netChildInputSumE += oppositeNetOutputE*oppositeWeight;
                                netChildInputSumF += oppositeNetOutputF*oppositeWeight;
                                netChildInputSumG += oppositeNetOutputG*oppositeWeight;
                            } else {
                                netChildInputSumA += oppositeWeight;
                                netChildInputSumB += oppositeWeight;
                                netChildInputSumC += oppositeWeight;
                                netChildInputSumD += oppositeWeight;
                                netChildInputSumE += oppositeWeight;
                                netChildInputSumF += oppositeWeight;
                                netChildInputSumG += oppositeWeight;
                            }
                            atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));
                            repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));
                            acumAtraction += 1.0;
                        } else if(currentIsParent == 0.5) {
                            if(oppositeBiasNode == 0.0) {
                                netParentErrorWeightA += oppositeNetErrorA*currentWeight;
                                netParentErrorWeightB += oppositeNetErrorB*currentWeight;
                                netParentErrorWeightC += oppositeNetErrorC*currentWeight;
                                netParentErrorWeightD += oppositeNetErrorD*currentWeight;
                                netParentErrorWeightE += oppositeNetErrorE*currentWeight;
                                netParentErrorWeightF += oppositeNetErrorF*currentWeight;
                                netParentErrorWeightG += oppositeNetErrorG*currentWeight;
                            } else {
                                netParentErrorWeightA += oppositeNetErrorA;
                                netParentErrorWeightB += oppositeNetErrorB;
                                netParentErrorWeightC += oppositeNetErrorC;
                                netParentErrorWeightD += oppositeNetErrorD;
                                netParentErrorWeightE += oppositeNetErrorE;
                                netParentErrorWeightF += oppositeNetErrorF;
                                netParentErrorWeightG += oppositeNetErrorG;
                            }
                            atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);
                            repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);
                            acumAtraction += 1.0;
                        }
            
                        repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));
                        acumAtraction += 1.0;
                    }
                }
                force += (atraction/acumAtraction);
                force += (repulsion/acumAtraction);
                currentDir += force;
                
                
                float currentBiasNode = dataB[xGeomCurrent].x;
                
                ${KERNEL_DIR.efferentNodesStr(afferentNodesCount, efferentStart, efferentNodesCount)}
                
                currentDataB = vec4(currentDataB.x, currentDataB.y, foutputA, netParentErrorWeightA);
                currentDataF = vec4(foutputB, netParentErrorWeightB, foutputC, netParentErrorWeightC);
                currentDataG = vec4(foutputD, netParentErrorWeightD, foutputE, netParentErrorWeightE);
                currentDataH = vec4(foutputF, netParentErrorWeightF, foutputG, netParentErrorWeightG);
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
                        foutputF = afferentNodesF[int(n)];
                        foutputG = afferentNodesG[int(n)];
                        break;
                    }
                }
            } else {
                if(currentBiasNode == 0.0) {                                     
                    foutputA = max(0.0, netChildInputSumA); ${/* SIGM= sigm(netChildInputSumA)-0.5 ; TANH=tanh(netChildInputSumA) ; RELU=max(0.0, netChildInputSumA) */''}
                    foutputB = max(0.0, netChildInputSumB);
                    foutputC = max(0.0, netChildInputSumC);
                    foutputD = max(0.0, netChildInputSumD);
                    foutputE = max(0.0, netChildInputSumE);
                    foutputF = max(0.0, netChildInputSumF);
                    foutputG = max(0.0, netChildInputSumG);
                } else {
                    foutputA = 1.0;
                    foutputB = 1.0;
                    foutputC = 1.0;
                    foutputD = 1.0;
                    foutputE = 1.0;
                    foutputF = 1.0;
                    foutputG = 1.0;
                }
            }`;

        /////////////////////////////////////////////////
        // ERROR
        /////////////////////////////////////////////////
        for(let n=(efferentStart); n < (efferentStart+efferentNodesCount); n++) {
            let cond = (n===efferentStart) ? "if" : "else if" ;
            str += `
            ${cond}(nodeId == `+n.toFixed(1)+`) {
                netParentErrorWeightA = (efferentNodesA[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumA-efferentNodesA[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightB = (efferentNodesB[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumB-efferentNodesB[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightC = (efferentNodesC[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumC-efferentNodesC[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightD = (efferentNodesD[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumD-efferentNodesD[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightE = (efferentNodesE[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumE-efferentNodesE[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightF = (efferentNodesF[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumF-efferentNodesF[`+Math.round(n-efferentStart)+`] : 0.0;
                netParentErrorWeightG = (efferentNodesG[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumG-efferentNodesG[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossA = 0.5*netParentErrorWeightA*netParentErrorWeightA; */''}
                ${/* netLossB = 0.5*netParentErrorWeightB*netParentErrorWeightB; */''}
                ${/* netLossC = 0.5*netParentErrorWeightC*netParentErrorWeightC; */''}
                ${/* netLossD = 0.5*netParentErrorWeightD*netParentErrorWeightD; */''}
                ${/* netLossE = 0.5*netParentErrorWeightE*netParentErrorWeightE; */''}
                ${/* netLossF = 0.5*netParentErrorWeightF*netParentErrorWeightF; */''}
                ${/* netLossG = 0.5*netParentErrorWeightG*netParentErrorWeightG; */''}
            }`;
        }
        str += `
        else {
            if(currentBiasNode == 0.0) {
                if(foutputA <= 0.0) {
                    netParentErrorWeightA = 0.0;
                }
                if(foutputB <= 0.0) {
                    netParentErrorWeightB = 0.0;
                }
                if(foutputC <= 0.0) {
                    netParentErrorWeightC = 0.0;
                }
                if(foutputD <= 0.0) {
                    netParentErrorWeightD = 0.0;
                }
                if(foutputE <= 0.0) {
                    netParentErrorWeightE = 0.0;
                }
                if(foutputF <= 0.0) {
                    netParentErrorWeightF = 0.0;
                }
                if(foutputG <= 0.0) {
                    netParentErrorWeightG = 0.0;
                }
            }
        }`;

        return str;
    };

    static adjMatrix_ForceLayout_GLSLFunctionString() {
        return `
        float tanh(float val) {
            float tmp = exp(val);
            float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
            return tanH;
        }
        float sigm(float val) {
            return (1.0 / (1.0 + exp(-val)));
        }`;
    };
}
global.KERNEL_DIR = KERNEL_DIR;
module.exports.KERNEL_DIR = KERNEL_DIR;