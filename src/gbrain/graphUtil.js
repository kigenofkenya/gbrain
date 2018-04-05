export class GraphUtils {
    constructor() {

    }

    static adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount) {
        return ''+
        `struct CalculationResponse {
            vec3 atraction;
            float acumAtraction;
            vec3 repulsion;
            
            float netChildInputSumA;
            float netParentErrorWeightA;
            float netChildInputSumBiasA;
            float netParentErrorBiasA;
            
            float netChildInputSumB;
            float netParentErrorWeightB;
            float netChildInputSumBiasB;
            float netParentErrorBiasB;
            
            float netChildInputSumC;
            float netParentErrorWeightC;
            float netChildInputSumBiasC;
            float netParentErrorBiasC;
            
            float netChildInputSumD;
            float netParentErrorWeightD;
            float netChildInputSumBiasD;
            float netParentErrorBiasD;
            
            float netChildInputSumE;
            float netParentErrorWeightE;
            float netChildInputSumBiasE;
            float netParentErrorBiasE;
            
            float netChildInputSumF;
            float netParentErrorWeightF;
            float netChildInputSumBiasF;
            float netParentErrorBiasF;
            
            float netChildInputSumG;
            float netParentErrorWeightG;
            float netChildInputSumBiasG;
            float netParentErrorBiasG;
        };`+

        `CalculationResponse calculate(float nodeId,
                                        vec4 pixAdjMatACurrent, vec4 pixAdjMatAOpposite,
                                        vec4 pixAdjMatBCurrent, vec4 pixAdjMatBOpposite,
                                        vec2 xGeomCurrent, vec2 xGeomOpposite,
                                        vec3 currentPos, vec3 currentDir,
                                        vec3 atraction, float acumAtraction, vec3 repulsion,
                                        float netChildInputSumA, float netParentErrorWeightA,float netChildInputSumBiasA, float netParentErrorBiasA,
                                        float netChildInputSumB, float netParentErrorWeightB,float netChildInputSumBiasB, float netParentErrorBiasB,
                                        float netChildInputSumC, float netParentErrorWeightC,float netChildInputSumBiasC, float netParentErrorBiasC,
                                        float netChildInputSumD, float netParentErrorWeightD,float netChildInputSumBiasD, float netParentErrorBiasD,
                                        float netChildInputSumE, float netParentErrorWeightE,float netChildInputSumBiasE, float netParentErrorBiasE,
                                        float netChildInputSumF, float netParentErrorWeightF,float netChildInputSumBiasF, float netParentErrorBiasF,
                                        float netChildInputSumG, float netParentErrorWeightG,float netChildInputSumBiasG, float netParentErrorBiasG) {`+
            // pixAdjMatACurrent
            `float currentWeight = pixAdjMatACurrent.z;
            float currentIsParent = pixAdjMatACurrent.w;`+

            // pixAdjMatAOpposite
            `float oppositeWeight = pixAdjMatAOpposite.z;
            float oppositeIsParent = pixAdjMatAOpposite.w;`+


            // pixAdjMatBCurrent
            `float currentLinkMultiplier = pixAdjMatBCurrent.x;
            float currentActivationFn = pixAdjMatBCurrent.y;`+

            // pixAdjMatBOpposite
            `float oppositeLinkMultiplier = pixAdjMatBOpposite.x;
            float oppositeActivationFn = pixAdjMatBOpposite.y;`+


            // dataB Current
            //'float currentBiasNode = dataB[xGeomCurrent].x;'+
            //'float currentNetOutput = dataB[xGeomCurrent].z;'+
            //'float currentNetError = dataB[xGeomCurrent].w;'+

            // dataB Opposite
            `float oppositeBiasNode = dataB[xGeomOpposite].x;
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
            float oppositeNetErrorG = dataH[xGeomOpposite].w;`+


            // pos & dir Current
            //'vec3 currentPos = posXYZW[xGeomCurrent].xyz;\n'+
            //'vec3 currentDir = dir[xGeomCurrent].xyz;\n'+

            // pos & dir Opposite
            `vec3 oppositePos = posXYZW[xGeomOpposite].xyz;
            vec3 oppositeDir = dir[xGeomOpposite].xyz;`+

            // dir / dist to opposite
            'vec3 dirToOpposite = (oppositePos-currentPos);\n'+
            'vec3 dirToOppositeN = normalize(dirToOpposite);\n'+

            'float dist = distance(oppositePos, currentPos);\n'+ // near=0.0 ; far=1.0
            'float distN = max(0.0,dist)/100000.0;'+

            'float mm = 30.0;'+
            'float m1 = 400000.0/mm;'+
            'float m2 = 48.0/mm;'+
            'if(currentIsParent == 1.0) {'+
                'netChildInputSumA += oppositeNetOutputA*oppositeWeight;'+
                'netChildInputSumB += oppositeNetOutputB*oppositeWeight;'+
                'netChildInputSumC += oppositeNetOutputC*oppositeWeight;'+
                'netChildInputSumD += oppositeNetOutputD*oppositeWeight;'+
                'netChildInputSumE += oppositeNetOutputE*oppositeWeight;'+
                'netChildInputSumF += oppositeNetOutputF*oppositeWeight;'+
                'netChildInputSumG += oppositeNetOutputG*oppositeWeight;'+

                'netChildInputSumBiasA += oppositeWeight;'+
                'netChildInputSumBiasB += oppositeWeight;'+
                'netChildInputSumBiasC += oppositeWeight;'+
                'netChildInputSumBiasD += oppositeWeight;'+
                'netChildInputSumBiasE += oppositeWeight;'+
                'netChildInputSumBiasF += oppositeWeight;'+
                'netChildInputSumBiasG += oppositeWeight;'+

                'atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));\n'+
                'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));\n'+
                'acumAtraction += 1.0;\n'+
            '} else if(currentIsParent == 0.5) {'+
                'netParentErrorWeightA += oppositeNetErrorA*currentWeight;'+
                'netParentErrorWeightB += oppositeNetErrorB*currentWeight;'+
                'netParentErrorWeightC += oppositeNetErrorC*currentWeight;'+
                'netParentErrorWeightD += oppositeNetErrorD*currentWeight;'+
                'netParentErrorWeightE += oppositeNetErrorE*currentWeight;'+
                'netParentErrorWeightF += oppositeNetErrorF*currentWeight;'+
                'netParentErrorWeightG += oppositeNetErrorG*currentWeight;'+

                'netParentErrorBiasA += oppositeNetErrorA;'+
                'netParentErrorBiasB += oppositeNetErrorB;'+
                'netParentErrorBiasC += oppositeNetErrorC;'+
                'netParentErrorBiasD += oppositeNetErrorD;'+
                'netParentErrorBiasE += oppositeNetErrorE;'+
                'netParentErrorBiasF += oppositeNetErrorF;'+
                'netParentErrorBiasG += oppositeNetErrorG;'+

                'atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);\n'+
                'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);\n'+
                'acumAtraction += 1.0;\n'+
            '}'+

            'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));\n'+
            'acumAtraction += 1.0;\n'+


            `return CalculationResponse(atraction, acumAtraction, repulsion,
                                        netChildInputSumA, netParentErrorWeightA, netChildInputSumBiasA, netParentErrorBiasA,
                                        netChildInputSumB, netParentErrorWeightB, netChildInputSumBiasB, netParentErrorBiasB,
                                        netChildInputSumC, netParentErrorWeightC, netChildInputSumBiasC, netParentErrorBiasC,
                                        netChildInputSumD, netParentErrorWeightD, netChildInputSumBiasD, netParentErrorBiasD,
                                        netChildInputSumE, netParentErrorWeightE, netChildInputSumBiasE, netParentErrorBiasE,
                                        netChildInputSumF, netParentErrorWeightF, netChildInputSumBiasF, netParentErrorBiasF,
                                        netChildInputSumG, netParentErrorWeightG, netChildInputSumBiasG, netParentErrorBiasG);
        }
        struct idAdjMatrixResponse {
            vec3 force;
            float netFOutputA;
            float netErrorWeightA;
            float netFOutputB;
            float netErrorWeightB;
            float netFOutputC;
            float netErrorWeightC;
            float netFOutputD;
            float netErrorWeightD;
            float netFOutputE;
            float netErrorWeightE;
            float netFOutputF;
            float netErrorWeightF;
            float netFOutputG;
            float netErrorWeightG;
        };
        float tanh(float val) {
            float tmp = exp(val);
            float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
            return tanH;
        }
        float sigm(float val) {
            return (1.0 / (1.0 + exp(-val)));
        }
        idAdjMatrixResponse idAdjMatrix_ForceLayout(float nodeId, vec3 currentPos, vec3 currentDir, float numOfConnections) {
            vec3 atraction = vec3(0.0, 0.0, 0.0);
            float acumAtraction = 1.0;
            vec3 repulsion = vec3(0.0, 0.0, 0.0);

            vec3 force = vec3(0.0, 0.0, 0.0);


            float netChildInputSumA = 0.0;
            float foutputA = 0.0;
            float netParentErrorWeightA = 0.0;
            float netChildInputSumBiasA = 0.0;
            float netParentErrorBiasA = 0.0;
            
            float netChildInputSumB = 0.0;
            float foutputB = 0.0;
            float netParentErrorWeightB = 0.0;
            float netChildInputSumBiasB = 0.0;
            float netParentErrorBiasB = 0.0;
            
            float netChildInputSumC = 0.0;
            float foutputC = 0.0;
            float netParentErrorWeightC = 0.0;
            float netChildInputSumBiasC = 0.0;
            float netParentErrorBiasC = 0.0;
            
            float netChildInputSumD = 0.0;
            float foutputD = 0.0;
            float netParentErrorWeightD = 0.0;
            float netChildInputSumBiasD = 0.0;
            float netParentErrorBiasD = 0.0;
            
            float netChildInputSumE = 0.0;
            float foutputE = 0.0;
            float netParentErrorWeightE = 0.0;
            float netChildInputSumBiasE = 0.0;
            float netParentErrorBiasE = 0.0;
            
            float netChildInputSumF = 0.0;
            float foutputF = 0.0;
            float netParentErrorWeightF = 0.0;
            float netChildInputSumBiasF = 0.0;
            float netParentErrorBiasF = 0.0;
            
            float netChildInputSumG = 0.0;
            float foutputG = 0.0;
            float netParentErrorWeightG = 0.0;
            float netChildInputSumBiasG = 0.0;
            float netParentErrorBiasG = 0.0;
            

            if(nodeId < nodesCount) {
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


                        CalculationResponse calcResponse = calculate(nodeId,
                                                                    pixAdjMatACurrent, pixAdjMatAOpposite,
                                                                    pixAdjMatBCurrent, pixAdjMatBOpposite,
                                                                    xGeomCurrent, xGeomOpposite,
                                                                    currentPos, currentDir,
                                                                    atraction, acumAtraction, repulsion,
                                                                    netChildInputSumA, netParentErrorWeightA, netChildInputSumBiasA, netParentErrorBiasA,
                                                                    netChildInputSumB, netParentErrorWeightB, netChildInputSumBiasB, netParentErrorBiasB,
                                                                    netChildInputSumC, netParentErrorWeightC, netChildInputSumBiasC, netParentErrorBiasC,
                                                                    netChildInputSumD, netParentErrorWeightD, netChildInputSumBiasD, netParentErrorBiasD,
                                                                    netChildInputSumE, netParentErrorWeightE, netChildInputSumBiasE, netParentErrorBiasE,
                                                                    netChildInputSumF, netParentErrorWeightF, netChildInputSumBiasF, netParentErrorBiasF,
                                                                    netChildInputSumG, netParentErrorWeightG, netChildInputSumBiasG, netParentErrorBiasG);
                        atraction = calcResponse.atraction;
                        acumAtraction = calcResponse.acumAtraction;
                        repulsion = calcResponse.repulsion;
                        
                        netChildInputSumA = calcResponse.netChildInputSumA;
                        netParentErrorWeightA = calcResponse.netParentErrorWeightA;
                        netChildInputSumBiasA = calcResponse.netChildInputSumBiasA;
                        netParentErrorBiasA = calcResponse.netParentErrorBiasA;
                        
                        netChildInputSumB = calcResponse.netChildInputSumB;
                        netParentErrorWeightB = calcResponse.netParentErrorWeightB;
                        netChildInputSumBiasB = calcResponse.netChildInputSumBiasB;
                        netParentErrorBiasB = calcResponse.netParentErrorBiasB;
                        
                        netChildInputSumC = calcResponse.netChildInputSumC;
                        netParentErrorWeightC = calcResponse.netParentErrorWeightC;
                        netChildInputSumBiasC = calcResponse.netChildInputSumBiasC;
                        netParentErrorBiasC = calcResponse.netParentErrorBiasC;
                        
                        netChildInputSumD = calcResponse.netChildInputSumD;
                        netParentErrorWeightD = calcResponse.netParentErrorWeightD;
                        netChildInputSumBiasD = calcResponse.netChildInputSumBiasD;
                        netParentErrorBiasD = calcResponse.netParentErrorBiasD;
                        
                        netChildInputSumE = calcResponse.netChildInputSumE;
                        netParentErrorWeightE = calcResponse.netParentErrorWeightE;
                        netChildInputSumBiasE = calcResponse.netChildInputSumBiasE;
                        netParentErrorBiasE = calcResponse.netParentErrorBiasE;
                        
                        netChildInputSumF = calcResponse.netChildInputSumF;
                        netParentErrorWeightF = calcResponse.netParentErrorWeightF;
                        netChildInputSumBiasF = calcResponse.netChildInputSumBiasF;
                        netParentErrorBiasF = calcResponse.netParentErrorBiasF;
                        
                        netChildInputSumG = calcResponse.netChildInputSumG;
                        netParentErrorWeightG = calcResponse.netParentErrorWeightG;
                        netChildInputSumBiasG = calcResponse.netChildInputSumBiasG;
                        netParentErrorBiasG = calcResponse.netParentErrorBiasG;
                    }
                }
                force += (atraction/acumAtraction);
                force += (repulsion/acumAtraction);
                
                float currentBiasNode = dataB[xGeomCurrent].x;
                
                ${GraphUtils.efferentNodesStr(efferentStart, efferentNodesCount)}
            }

            return idAdjMatrixResponse(vec3(force),
                                        foutputA, netParentErrorWeightA,
                                        foutputB, netParentErrorWeightB,
                                        foutputC, netParentErrorWeightC,
                                        foutputD, netParentErrorWeightD,
                                        foutputE, netParentErrorWeightE,
                                        foutputF, netParentErrorWeightF,
                                        foutputG, netParentErrorWeightG);
        }`;
    };

    static efferentNodesStr(efferentStart, efferentNodesCount) {
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
                    foutputA = netChildInputSumA;
                    foutputB = netChildInputSumB;
                    foutputC = netChildInputSumC;
                    foutputD = netChildInputSumD;
                    foutputE = netChildInputSumE;
                    foutputF = netChildInputSumF;
                    foutputG = netChildInputSumG;
                }
            }`;

        /////////////////////////////////////////////////
        // ERROR
        /////////////////////////////////////////////////
        str += `
        if(nodeId == `+efferentStart.toFixed(1)+`) {
            netParentErrorWeightA = (efferentNodesA[0] != 0.0) ? netChildInputSumA-efferentNodesA[0] : 0.0;
            netParentErrorWeightB = (efferentNodesB[0] != 0.0) ? netChildInputSumB-efferentNodesB[0] : 0.0;
            netParentErrorWeightC = (efferentNodesC[0] != 0.0) ? netChildInputSumC-efferentNodesC[0] : 0.0;
            netParentErrorWeightD = (efferentNodesD[0] != 0.0) ? netChildInputSumD-efferentNodesD[0] : 0.0;
            netParentErrorWeightE = (efferentNodesE[0] != 0.0) ? netChildInputSumE-efferentNodesE[0] : 0.0;
            netParentErrorWeightF = (efferentNodesF[0] != 0.0) ? netChildInputSumF-efferentNodesF[0] : 0.0;
            netParentErrorWeightG = (efferentNodesG[0] != 0.0) ? netChildInputSumG-efferentNodesG[0] : 0.0;
            ${/* netLossA = 0.5*netParentErrorWeightA*netParentErrorWeightA; */''}
            ${/* netLossB = 0.5*netParentErrorWeightB*netParentErrorWeightB; */''}
            ${/* netLossC = 0.5*netParentErrorWeightC*netParentErrorWeightC; */''}
            ${/* netLossD = 0.5*netParentErrorWeightD*netParentErrorWeightD; */''}
            ${/* netLossE = 0.5*netParentErrorWeightE*netParentErrorWeightE; */''}
            ${/* netLossF = 0.5*netParentErrorWeightF*netParentErrorWeightF; */''}
            ${/* netLossG = 0.5*netParentErrorWeightG*netParentErrorWeightG; */''}
        }`;
        for(let n=(efferentStart+1); n < (efferentStart+efferentNodesCount); n++)
            str += `
            else if(nodeId == `+n.toFixed(1)+`) {
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
            } else {
                netParentErrorWeightA = netParentErrorBiasA;
                netParentErrorWeightB = netParentErrorBiasB;
                netParentErrorWeightC = netParentErrorBiasC;
                netParentErrorWeightD = netParentErrorBiasD;
                netParentErrorWeightE = netParentErrorBiasE;
                netParentErrorWeightF = netParentErrorBiasF;
                netParentErrorWeightG = netParentErrorBiasG;
            }
        }`;

        return str;
    };
}
global.GraphUtils = GraphUtils;
module.exports.GraphUtils = GraphUtils;