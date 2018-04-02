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
        `vec3 sphericalColl(vec3 currentDir, vec3 currentDirB, vec3 dirToBN) {
            vec3 currentDirN = normalize(currentDir);
            float pPoint = abs(dot(currentDirN, dirToBN));
            vec3 reflectV = reflect(currentDirN*-1.0, dirToBN);

            vec3 currentDirBN = normalize(currentDirB);
            float pPointB = abs(dot(currentDirBN, dirToBN));

            vec3 repulsionForce = (reflectV*-1.0)* (((1.0-pPoint)*length(currentDir))+((pPointB)*length(currentDirB)));

            return (repulsionForce.x > 0.0 && repulsionForce.y > 0.0 && repulsionForce.z > 0.0) ? repulsionForce : dirToBN*-0.1;
        }

        struct CalculationResponse {
            vec3 atraction;
            float acumAtraction;
            vec3 repulsion;
            float collisionExists;
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

        // pixAdjMatA (bornDate, dieDate, weight (parent:-2;child:w), isParent (1.0:parent;0.0:child))
        // pixAdjMatA (linkMultiplier, activationFunction)
        `CalculationResponse calculate(float nodeId,
                                        vec4 pixAdjMatACurrent, vec4 pixAdjMatAOpposite,
                                        vec4 pixAdjMatBCurrent, vec4 pixAdjMatBOpposite,
                                        vec2 xGeomCurrent, vec2 xGeomOpposite,
                                        vec3 currentPos, vec3 currentDir,
                                        vec3 atraction, float acumAtraction, vec3 repulsion,
                                        float enableNeuronalNetwork,
                                        float netChildInputSumA, float netParentErrorWeightA,
                                        float netChildInputSumB, float netParentErrorWeightB,
                                        float netChildInputSumC, float netParentErrorWeightC,
                                        float netChildInputSumD, float netParentErrorWeightD,
                                        float netChildInputSumE, float netParentErrorWeightE,
                                        float netChildInputSumF, float netParentErrorWeightF,
                                        float netChildInputSumG, float netParentErrorWeightG) {`+
            // pixAdjMatACurrent
            `float currentBornDate = pixAdjMatACurrent.x;
            float currentDieDate = pixAdjMatACurrent.y;
            float currentWeight = pixAdjMatACurrent.z;
            float currentIsParent = pixAdjMatACurrent.w;`+

            // pixAdjMatAOpposite
            `float oppositeBornDate = pixAdjMatAOpposite.x;
            float oppositeDieDate = pixAdjMatAOpposite.y;
            float oppositeWeight = pixAdjMatAOpposite.z;
            float oppositeIsParent = pixAdjMatAOpposite.w;`+


            // pixAdjMatBCurrent
            `float currentLinkMultiplier = pixAdjMatBCurrent.x;
            float currentActivationFn = pixAdjMatBCurrent.y;`+

            // pixAdjMatBOpposite
            `float oppositeLinkMultiplier = pixAdjMatBOpposite.x;
            float oppositeActivationFn = pixAdjMatBOpposite.y;`+


            // dataB Current
            //'float currentBornDate = dataB[xGeomCurrent].x;'+
            //'float currentDieDate = dataB[xGeomCurrent].y;'+
            //'float currentNetOutput = dataB[xGeomCurrent].z;'+
            //'float currentNetError = dataB[xGeomCurrent].w;'+

            // dataB Opposite
            //'float oppositeBornDate = dataB[xGeomOpposite].x;'+
            //'float oppositeDieDate = dataB[xGeomOpposite].y;'+
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


            'float p = 1.0;'+
            'if(currentDieDate != 0.0 && (currentTimestamp < currentBornDate || currentTimestamp > currentDieDate)) '+
                'p = 0.0;'+
            'if(oppositeDieDate != 0.0 && (currentTimestamp < oppositeBornDate || currentTimestamp > oppositeDieDate)) '+
                'p = 0.0;'+

            'if(p == 1.0) {'+
                'float m1 = (enableNeuronalNetwork == 1.0) ? 0.0 : 400000.0;'+
                'float m2 = (enableNeuronalNetwork == 1.0) ? 0.0 : 48.0;'+
                'if(currentIsParent == 1.0) {'+
                    //'if(enableNeuronalNetwork == 1.0) '+
                        'netChildInputSumA += oppositeNetOutputA*oppositeWeight;'+
                        'netChildInputSumB += oppositeNetOutputB*oppositeWeight;'+
                        'netChildInputSumC += oppositeNetOutputC*oppositeWeight;'+
                        'netChildInputSumD += oppositeNetOutputD*oppositeWeight;'+
                        'netChildInputSumE += oppositeNetOutputE*oppositeWeight;'+
                        'netChildInputSumF += oppositeNetOutputF*oppositeWeight;'+
                        'netChildInputSumG += oppositeNetOutputG*oppositeWeight;'+
                    //'else {'+
                        'atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));\n'+
                        'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));\n'+
                        'acumAtraction += 1.0;\n'+
                    //'}'+
                '} else if(currentIsParent == 0.5) {'+
                    //'if(enableNeuronalNetwork == 1.0) '+
                        'netParentErrorWeightA += oppositeNetErrorA*currentWeight;'+
                        'netParentErrorWeightB += oppositeNetErrorB*currentWeight;'+
                        'netParentErrorWeightC += oppositeNetErrorC*currentWeight;'+
                        'netParentErrorWeightD += oppositeNetErrorD*currentWeight;'+
                        'netParentErrorWeightE += oppositeNetErrorE*currentWeight;'+
                        'netParentErrorWeightF += oppositeNetErrorF*currentWeight;'+
                        'netParentErrorWeightG += oppositeNetErrorG*currentWeight;'+
                    //'else {'+
                        'atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);\n'+
                        'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);\n'+
                        'acumAtraction += 1.0;\n'+
                    //'}'+
                '}'+

                //'if(enableNeuronalNetwork == 0.0) {'+
                    'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));\n'+
                    'acumAtraction += 1.0;\n'+
                //'}'+
            '}'+


            `float collisionExists = 0.0;
            if(enableForceLayoutCollision == 1.0 && dist < 4.0) {
                collisionExists = 1.0;
                atraction = sphericalColl(currentDir, oppositeDir, dirToOppositeN);
            }

            return CalculationResponse(atraction, acumAtraction, repulsion, collisionExists,
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
            float collisionExists;
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
        idAdjMatrixResponse idAdjMatrix_ForceLayout(float nodeId, vec3 currentPos, vec3 currentDir, float numOfConnections, float currentTimestamp, float bornDate, float dieDate, float enableNeuronalNetwork) {
            vec3 atraction = vec3(0.0, 0.0, 0.0);
            float acumAtraction = 1.0;
            vec3 repulsion = vec3(0.0, 0.0, 0.0);

            float collisionExists = 0.0;
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
                                                                    enableNeuronalNetwork,
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


                        if(calcResponse.collisionExists == 1.0) {
                            collisionExists = 1.0;
                            force = calcResponse.atraction;
                            break;
                        }

                        if(dieDate != 0.0) {
                            if(currentTimestamp < bornDate || currentTimestamp > dieDate) {
                                force = vec3(0.0, 0.0, 0.0);
                                break;
                            }
                        }
                    }
                }

                if(collisionExists == 0.0) {
                    force += (atraction/acumAtraction)*1.0;
                    force += (repulsion/acumAtraction)*1.0;
                }

                if(enableNeuronalNetwork == 1.0) {
                    ${GraphUtils.efferentNodesStr(efferentStart, efferentNodesCount)}
                }
            }

            return idAdjMatrixResponse(vec3(force), collisionExists,
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

    static adjMatrix_Autolink_GLSLFunctionString(geometryLength) {
        return ''+
        'float GetAngle(vec3 A, vec3 B) {'+ // from -180.0 to 180.0
            'vec3 cr = cross(A, B);'+
            'float d = dot(A, B);'+

            'if(cr.y < 0.0) {'+
                'if(d > 0.0) {'+
                    'd =        (1.0-d)*90.0;'+
                '} else {'+
                    'd = 90.0+  (abs(d)*90.0);'+
                '}'+
            '} else {'+
                'if(d > 0.0) {'+
                    'd = 270.0+ (d*90.0);'+
                '} else {'+
                    'd = 180.0+ ((1.0-abs(d))*90.0);'+
                '}'+
            '}'+

            'return d;'+
        '}'+
        'vec4 idAdjMatrix_Autolink(float nodeId, vec3 currentPos) {\n'+
            // INIT VARS
            'vec2 totalIDrelation = vec2(0.0, 0.0);'+
            'float totalAngleRelations = 0.0;'+
            // END INIT VARS

            'if(nodeId < nodesCount) {\n'+

                'for(int n=0; n < 4096; n++) {\n'+
                    'if(float(n) >= nodesCount) break;\n'+
                    'if(float(n) != nodeId) {'+
                        'vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);'+
                        'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n'+

                        // RELATION FOUND
                        'if(pixAdjMatACurrent.x > 0.0) {'+
                            'vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, '+geometryLength.toFixed(1)+');\n'+
                            'vec3 currentPosB = posXYZW[xGeomOpposite].xyz;\n'+
                            'vec3 dirToBN = normalize(currentPosB-currentPos);\n'+

                            'vec2 IDrelation = vec2(0.0, 0.0);'+
                            'float angleRelations = 360.0;'+

                            'if(nodeId < nodesCount) {\n'+

                                'for(int nB=0; nB < 4096; nB++) {\n'+
                                    'if(float(nB) >= nodesCount) break;\n'+
                                    'if(float(nB) != float(n) && float(nB) != nodeId) {'+
                                        'vec2 xAdjMatCurrentB = get_global_id(vec2(float(nB), nodeId), widthAdjMatrix);'+
                                        'vec4 pixAdjMatACurrent_B = adjacencyMatrix[xAdjMatCurrentB];\n'+

                                        'if(pixAdjMatACurrent_B.x > 0.0) {'+
                                            'vec2 xGeom_oppoB = get_global_id(float(nB), uBufferWidth, '+geometryLength.toFixed(1)+');\n'+
                                            'vec3 currentPosBB = posXYZW[xGeom_oppoB].xyz;\n'+
                                            'vec3 dirToBBN = normalize(currentPosBB-currentPos);\n'+

                                            'float angle = GetAngle(dirToBN,dirToBBN);'+

                                            'if(angle > 0.0 && angle < angleRelations) {'+
                                                'IDrelation = xGeom_oppoB;'+
                                                'angleRelations = angle;'+
                                            '}'+
                                        '}'+
                                    '}'+
                                '}'+

                            '}'+

                            'if(angleRelations < 360.0 && angleRelations > totalAngleRelations) {'+
                                 'totalIDrelation = IDrelation;'+
                                 'totalAngleRelations = angleRelations;'+
                            '}'+
                        '}'+
                        // END RELATION FOUND

                    '}'+
                '}'+
                // SUMMATION
                // END SUMMATION

            '}'+

            'return vec4(totalIDrelation, totalAngleRelations, 0.0);'+
        '}';
    };
}
global.GraphUtils = GraphUtils;
module.exports.GraphUtils = GraphUtils;