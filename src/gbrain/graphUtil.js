export class GraphUtils {
    constructor() {

    }

    static nodesDrawMode(geometryLength) {
        if(geometryLength === 1)
            return "vec4(color.rgb, 1.0)";
        else
            return "vec4(tex.rgb*color.rgb, tex.a)";
    };

    static adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount) {
        return ''+
        `struct CalculationResponse {
            vec3 atraction;
            float acumAtraction;
            vec3 repulsion;
            float netChildInputSumA;
            float netParentErrorWeightA;
            float netChildInputSumB;
            float netParentErrorWeightB;
            float netChildInputSumC;
            float netParentErrorWeightC;
            float netChildInputSumD;
            float netParentErrorWeightD;
            float netChildInputSumE;
            float netParentErrorWeightE;
            float netChildInputSumF;
            float netParentErrorWeightF;
            float netChildInputSumG;
            float netParentErrorWeightG;
        };`+

        `CalculationResponse calculate(float nodeId,
                                        vec4 pixAdjMatACurrent, vec4 pixAdjMatAOpposite,
                                        vec4 pixAdjMatBCurrent, vec4 pixAdjMatBOpposite,
                                        vec2 xGeomCurrent, vec2 xGeomOpposite,
                                        vec3 currentPos, vec3 currentDir,
                                        vec3 atraction, float acumAtraction, vec3 repulsion,
                                        float netChildInputSumA, float netParentErrorWeightA,
                                        float netChildInputSumB, float netParentErrorWeightB,
                                        float netChildInputSumC, float netParentErrorWeightC,
                                        float netChildInputSumD, float netParentErrorWeightD,
                                        float netChildInputSumE, float netParentErrorWeightE,
                                        float netChildInputSumF, float netParentErrorWeightF,
                                        float netChildInputSumG, float netParentErrorWeightG) {`+
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
            //'float oppositeBiasNode = dataB[xGeomOpposite].x;'+
            `float oppositeNetOutputA = dataB[xGeomOpposite].z;
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

            'float m1 = 0.0;'+ // 400000.0
            'float m2 = 0.0;'+ // 48.0
            'if(currentIsParent == 1.0) {'+
                'netChildInputSumA += oppositeNetOutputA*oppositeWeight;'+
                'netChildInputSumB += oppositeNetOutputB*oppositeWeight;'+
                'netChildInputSumC += oppositeNetOutputC*oppositeWeight;'+
                'netChildInputSumD += oppositeNetOutputD*oppositeWeight;'+
                'netChildInputSumE += oppositeNetOutputE*oppositeWeight;'+
                'netChildInputSumF += oppositeNetOutputF*oppositeWeight;'+
                'netChildInputSumG += oppositeNetOutputG*oppositeWeight;'+

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

                'atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);\n'+
                'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);\n'+
                'acumAtraction += 1.0;\n'+
            '}'+

            'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));\n'+
            'acumAtraction += 1.0;\n'+


            `return CalculationResponse(atraction, acumAtraction, repulsion,
                                        netChildInputSumA, netParentErrorWeightA,
                                        netChildInputSumB, netParentErrorWeightB,
                                        netChildInputSumC, netParentErrorWeightC,
                                        netChildInputSumD, netParentErrorWeightD,
                                        netChildInputSumE, netParentErrorWeightE,
                                        netChildInputSumF, netParentErrorWeightF,
                                        netChildInputSumG, netParentErrorWeightG);
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
                                                                    netChildInputSumA, netParentErrorWeightA,
                                                                    netChildInputSumB, netParentErrorWeightB,
                                                                    netChildInputSumC, netParentErrorWeightC,
                                                                    netChildInputSumD, netParentErrorWeightD,
                                                                    netChildInputSumE, netParentErrorWeightE,
                                                                    netChildInputSumF, netParentErrorWeightF,
                                                                    netChildInputSumG, netParentErrorWeightG);
                        atraction = calcResponse.atraction;
                        acumAtraction = calcResponse.acumAtraction;
                        repulsion = calcResponse.repulsion;
                        
                        netChildInputSumA = calcResponse.netChildInputSumA;
                        netParentErrorWeightA = calcResponse.netParentErrorWeightA;
                        
                        netChildInputSumB = calcResponse.netChildInputSumB;
                        netParentErrorWeightB = calcResponse.netParentErrorWeightB;
                        
                        netChildInputSumC = calcResponse.netChildInputSumC;
                        netParentErrorWeightC = calcResponse.netParentErrorWeightC;
                        
                        netChildInputSumD = calcResponse.netChildInputSumD;
                        netParentErrorWeightD = calcResponse.netParentErrorWeightD;
                        
                        netChildInputSumE = calcResponse.netChildInputSumE;
                        netParentErrorWeightE = calcResponse.netParentErrorWeightE;
                        
                        netChildInputSumF = calcResponse.netChildInputSumF;
                        netParentErrorWeightF = calcResponse.netParentErrorWeightF;
                        
                        netChildInputSumG = calcResponse.netChildInputSumG;
                        netParentErrorWeightG = calcResponse.netParentErrorWeightG;
                    }
                }
                force += (atraction/acumAtraction);
                force += (repulsion/acumAtraction);
                
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
                foutputA = max(0.0, netChildInputSumA); ${/* SIGM= sigm(netChildInputSumA)-0.5 ; TANH=tanh(netChildInputSumA) ; RELU=max(0.0, netChildInputSumA) */''}
                foutputB = max(0.0, netChildInputSumB);
                foutputC = max(0.0, netChildInputSumC);
                foutputD = max(0.0, netChildInputSumD);
                foutputE = max(0.0, netChildInputSumE);
                foutputF = max(0.0, netChildInputSumF);
                foutputG = max(0.0, netChildInputSumG);
            }`;


        str += `
        if(nodeId == `+efferentStart.toFixed(1)+`) {
            netParentErrorWeightA = (efferentNodesA[0] != 0.0) ? netChildInputSumA-efferentNodesA[0] : 0.0;
            ${/* netLossA = 0.5*netParentErrorWeightA*netParentErrorWeightA; */''}
            netParentErrorWeightB = (efferentNodesB[0] != 0.0) ? netChildInputSumB-efferentNodesB[0] : 0.0;
            ${/* netLossB = 0.5*netParentErrorWeightB*netParentErrorWeightB; */''}
            netParentErrorWeightC = (efferentNodesC[0] != 0.0) ? netChildInputSumC-efferentNodesC[0] : 0.0;
            ${/* netLossC = 0.5*netParentErrorWeightC*netParentErrorWeightC; */''}
            netParentErrorWeightD = (efferentNodesD[0] != 0.0) ? netChildInputSumD-efferentNodesD[0] : 0.0;
            ${/* netLossD = 0.5*netParentErrorWeightD*netParentErrorWeightD; */''}
            netParentErrorWeightE = (efferentNodesE[0] != 0.0) ? netChildInputSumE-efferentNodesE[0] : 0.0;
            ${/* netLossE = 0.5*netParentErrorWeightE*netParentErrorWeightE; */''}
            netParentErrorWeightF = (efferentNodesF[0] != 0.0) ? netChildInputSumF-efferentNodesF[0] : 0.0;
            ${/* netLossF = 0.5*netParentErrorWeightF*netParentErrorWeightF; */''}
            netParentErrorWeightG = (efferentNodesG[0] != 0.0) ? netChildInputSumG-efferentNodesG[0] : 0.0;
            ${/* netLossG = 0.5*netParentErrorWeightG*netParentErrorWeightG; */''}
        }`;
        for(let n=(efferentStart+1); n < (efferentStart+efferentNodesCount); n++)
            str += `
            else if(nodeId == `+n.toFixed(1)+`) {
                netParentErrorWeightA = (efferentNodesA[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumA-efferentNodesA[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossA = 0.5*netParentErrorWeightA*netParentErrorWeightA; */''}
                netParentErrorWeightB = (efferentNodesB[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumB-efferentNodesB[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossB = 0.5*netParentErrorWeightB*netParentErrorWeightB; */''}
                netParentErrorWeightC = (efferentNodesC[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumC-efferentNodesC[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossC = 0.5*netParentErrorWeightC*netParentErrorWeightC; */''}
                netParentErrorWeightD = (efferentNodesD[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumD-efferentNodesD[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossD = 0.5*netParentErrorWeightD*netParentErrorWeightD; */''}
                netParentErrorWeightE = (efferentNodesE[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumE-efferentNodesE[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossE = 0.5*netParentErrorWeightE*netParentErrorWeightE; */''}
                netParentErrorWeightF = (efferentNodesF[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumF-efferentNodesF[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossF = 0.5*netParentErrorWeightF*netParentErrorWeightF; */''}
                netParentErrorWeightG = (efferentNodesG[`+Math.round(n-efferentStart)+`] != 0.0) ? netChildInputSumG-efferentNodesG[`+Math.round(n-efferentStart)+`] : 0.0;
                ${/* netLossG = 0.5*netParentErrorWeightG*netParentErrorWeightG; */''}
            }`;

        str += `
        else {
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
        }`;

        return str;
    };
}
global.GraphUtils = GraphUtils;
module.exports.GraphUtils = GraphUtils;