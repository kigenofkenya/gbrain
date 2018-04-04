import "scejs";
import {GraphUtils} from "./graphUtil";

export class VFP_NODE {
    constructor() {

    }

	static getSrc(customCode, geometryLength) {
        return [["RGB"],

            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████║█████╗  ███████║██║  ██║
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ██╔══██║██╔══╝  ██╔══██║██║  ██║
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ██║  ██║███████╗██║  ██║██████╔╝
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
       		'varying vec4 vVertexColor;\n'+
            'varying vec4 vVertexColorNetError;\n'+
            'varying vec4 vUV;\n'+
       		'varying vec2 vVertexUV;\n'+
       		'varying float vUseTex;\n'+
       		'varying vec4 vWNMatrix;\n'+
            'varying float vNodeId;\n'+
            'varying float vNodeIdOpposite;\n'+
       		'varying float vDist;\n'+
            'varying float vVisibility;\n'+
       		'varying float vIsSelected;\n'+
            'varying float vIsHover;\n'+
       		'varying float vUseCrosshair;\n'+
       		'varying float vIstarget;\n'+
       		
       		'vec2 get2Dfrom1D(float idx, float columns) {'+
       			'float n = idx/columns;'+
       			'float row = float(int(n));'+
       			'float col = fract(n)*columns;'+

       			'float ts = 1.0/columns;'+
       			'return vec2(ts*col, ts*row);'+
       		'}'+
       		 'mat4 lookAt(vec3 eye, vec3 center, vec3 up) {'+
       		     'vec3 zaxis = normalize(center - eye);'+
       		     'vec3 xaxis = normalize(cross(up, zaxis));'+
       		     'vec3 yaxis = cross(zaxis, xaxis);'+

       		     'mat4 matrix;'+
       		     //Column Major
       		     'matrix[0][0] = xaxis.x;'+
       		     'matrix[1][0] = yaxis.x;'+
       		     'matrix[2][0] = zaxis.x;'+
       		     'matrix[3][0] = 0.0;'+

       		     'matrix[0][1] = xaxis.y;'+
       		     'matrix[1][1] = yaxis.y;'+
       		     'matrix[2][1] = zaxis.y;'+
       		     'matrix[3][1] = 0.0;'+

       		     'matrix[0][2] = xaxis.z;'+
       		     'matrix[1][2] = yaxis.z;'+
       		     'matrix[2][2] = zaxis.z;'+
       		     'matrix[3][2] = 0.0;'+

       		     'matrix[0][3] = -dot(xaxis, eye);'+
       		     'matrix[1][3] = -dot(yaxis, eye);'+
       		     'matrix[2][3] = -dot(zaxis, eye);'+
       		     'matrix[3][3] = 1.0;'+

       		     'return matrix;'+
       		 '}'+
       		 'mat4 transpose(mat4 m) {'+
       			  'return mat4(  m[0][0], m[1][0], m[2][0], m[3][0],'+
       			                'm[0][1], m[1][1], m[2][1], m[3][1],'+
       			  				'm[0][2], m[1][2], m[2][2], m[3][2],'+
       			  				'm[0][3], m[1][3], m[2][3], m[3][3]);'+
       		'}'+
       		'mat4 rotationMatrix(vec3 axis, float angle) {'+
       			'axis = normalize(axis);'+
       			'float s = sin(angle);'+
       			'float c = cos(angle);'+
       			'float oc = 1.0 - c;'+

       			'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,'+
       			'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,'+
       			'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,'+
       			'0.0,                                0.0,                                0.0,                                1.0);'+
       		'}'+

            GraphUtils.adjMatrix_Autolink_GLSLFunctionString(geometryLength)+

            Utils.degToRadGLSLFunctionString()+
            Utils.radToDegGLSLFunctionString()+
            Utils.cartesianToSphericalGLSLFunctionString()+
            Utils.sphericalToCartesianGLSLFunctionString()+
            Utils.getVectorGLSLFunctionString()+
            'vec3 getVV(vec3 crB, float acum) {'+
                'vec3 ob = cartesianToSpherical(crB);'+
                'float angleLat = ob.y;'+
                'float angleLng = ob.z;'+

                'float desvLat = 0.0;'+ // (vecNoise.x*180.0)-90.0
                'float desvLng = 10.0;'+ // (vecNoise.x*180.0)-90.0
                    //'angleLat += (degrees*desvLat);'+
                'angleLng += (acum*desvLng);'+

                'return sphericalToCartesian(vec3(1.0, angleLat, angleLng));'+
            '}'+
            'float getOddEven(float repeatId) {'+
                'return (ceil(fract(repeatId/2.0)) == 0.0) ? 1.0*floor(repeatId/2.0) : -1.0*floor(repeatId/2.0);'+
            '}'+
            'vec3 getFirstDispl(float nodeId, vec4 currentPosition, float repeatId) {'+
                'float repeatDistribution = -0.1;'+
                // first check output edges of own node and return the node (textCoord for get posXYZW) with max available angle to the right
                'vec4 adjMatrix = idAdjMatrix_Autolink(nodeId, currentPosition.xyz);'+
                'vec3 initialVec = normalize(posXYZW[adjMatrix.xy].xyz-currentPosition.xyz)*vec3(1.0, -1.0, 1.0);'+
                'float totalAngleRelations = adjMatrix.z;'+
                // then first sum half of available angle received
                'initialVec = getVV(initialVec, (totalAngleRelations/2.0)*repeatDistribution);'+
                // and now left or right (oddEven)
                'return getVV(initialVec, getOddEven(repeatId)*totalAngleRelations*0.01);'+
            '}'+
            'float checkLinkArrowVisibility(float currentTimestamp, float bornDate, float dieDate, float bornDateOpposite, float dieDateOpposite, float linkBornDate, float linkDieDate) {'+
                'float visible =1.0;'+
                'if(dieDate != 0.0) {'+
                    'if((currentTimestamp < bornDate || currentTimestamp > dieDate) || (currentTimestamp < bornDateOpposite || currentTimestamp > dieDateOpposite)) {'+
                        'visible = 0.0;'+
                    '} else {'+
                        // now check link
                        'if(linkDieDate != 0.0) {'+
                            'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {'+
                                'visible = 0.0;'+
                            '}'+
                        '}'+
                    '}'+
                '} else {'+
                    // now check link
                    'if(linkDieDate != 0.0) {'+
                        'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {'+
                            'visible = 0.0;'+
                        '}'+
                    '}'+
                '}'+
                'return visible;'+
            '}',



            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            // Nodes
            // Data: nodeId, acums, bornDate, dieDate
            // DataB: bornDate, dieDate, netFOutputA, netErrorWeightA (SHARED with LINKS, ARROWS & NODESTEXT)

            // Links
            // Data: nodeId origin, nodeId target, currentLineVertex, repeatId
            // DataC: linkBornDate, linkDieDate, linkWeight, 0
            `
            mat4 nodepos = nodeWMatrix;
            
            vec4 nodeVertexPosition = nodeVertexPos[];
            vec4 nodeVertexTex = nodeVertexTexture[];
            
            float nodeId = data[].x;            
            vec2 xGeometryNode = get_global_id(nodeId, bufferNodesWidth, `+geometryLength.toFixed(1)+`); ${/* bufferWidth6, geometryLength */''}

            vec4 currentPosition = posXYZW[xGeometryNode];
            vec3 oppositePosition = vec3(0.0, 0.0, 0.0);
            

            float currentLineVertex = data[].z; ${/* this is isTarget for arrows */''}
            float vertexCount = 1.0;
                
            vec4 nodeVertexColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 nodeVertexColorNetError = vec4(1.0, 1.0, 1.0, 1.0);
            vVertexUV = vec2(-1.0, -1.0);

            if(isNode == 1.0) {
                float bornDate = dataB[xGeometryNode].x;
                float dieDate = dataB[xGeometryNode].y;
                float foutput = dataB[xGeometryNode].z;
                float error = dataB[xGeometryNode].w;
            
                vVisibility = 1.0;
                currentPosition += vec4(0.0, 0.1, 0.0, 1.0);

                mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);
                nodepos = nodepos*mm;
                float nodeImgId = nodeImgId[];

                if(nodeImgId != -1.0) {
                    vUseTex = 1.0;
                    vVertexUV = get2Dfrom1D(nodeImgId, nodeImgColumns)+vec2(nodeVertexTexture.x/nodeImgColumns,nodeVertexTexture.y/nodeImgColumns);
                }

                if(dieDate != 0.0 && (currentTimestamp < bornDate || currentTimestamp > dieDate)) {
                    vVisibility = 0.0;
                }

                if(enableNeuronalNetwork == 1.0) {
                    nodeVertexColor = vec4(0.0, 0.0, 0.0, 1.0);
                    if(foutput > 0.0) {
                        nodeVertexColor = vec4(abs(foutput), abs(foutput), abs(foutput), 1.0);
                    } else if(foutput < 0.0) {
                        nodeVertexColor = vec4(abs(foutput), 0.0, 0.0, 1.0);
                    }

                    if(error > 0.0) {
                        nodeVertexColorNetError = vec4(abs(error), 0.0, 0.0, 1.0);
                    } else if(error < 0.0) {
                        nodeVertexColorNetError = vec4(0.0, abs(error), 0.0, 1.0);
                    } else {
                        nodeVertexColorNetError = vec4(0.0,0.0,0.0, 0.0);
                    }
                }

                vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;
                vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;
            }
            if(isLink == 1.0) {        
                float nodeIdOpposite = data[].y;
                 
                float linkBornDate = dataC[].x;
                float linkDieDate = dataC[].y;
                
                vec2 xGeometryNode_opposite = get_global_id(nodeIdOpposite, bufferNodesWidth, `+geometryLength.toFixed(1)+`);
                vec3 oppositePosition = posXYZW[xGeometryNode_opposite].xyz;
                
                ${VFP_NODE.linkStr()}        
                
                vec2 xGeometryLinks = get_global_id(nodeId, bufferLinksWidth, 2.0); ${/* bufferWidth, geometryLength */''}
                vec2 xGeometryLinks_opposite = get_global_id(nodeIdOpposite, bufferLinksWidth, 2.0);
                
                float bornDateOpposite = dataB[xGeometryNode_opposite].x;
                float dieDateOpposite = dataB[xGeometryNode_opposite].y;
            
            
                if(xGeometryLinks != xGeometryLinks_opposite) {
                    currentPosition += vec4(dirN*(lineIncrements*currentLineVertex), 1.0); ${/* displacing from center to first point */''}

                    if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {${/* displacing from first point to cross direction (repeatId) */''}
                        currentPosition += vec4(cr*currentLineVertexSQRT*getOddEven(repeatId)*4.0, 1.0);
                    }
                } else { ${/* is Autolink */''}
                    float currentLineVertexMM = abs( currentLineVertex-(vertexCount/2.0) );
                    currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;

                    ${/* displacing from center to first point */''}
                    vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);
                    currentPosition += vec4(initialVec*(5.0*currentLineVertexMM), 1.0);

                    ${/* displacing from first point to cross direction (repeatId) */''}
                    if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {
                        float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;

                        vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);

                        float hhSCount = (vertexCount/2.0)/2.0;
                        float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));
                        currentPosition += vec4((crB*sig)*currentLineVertexMMB*1.0, 1.0);
                    }
                }

                vVisibility = checkLinkArrowVisibility(currentTimestamp, linkBornDate, linkDieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);
                vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;
                vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;
                
                vNodeIdOpposite = nodeIdOpposite;
            }
            if(isArrow == 1.0) {
                float nodeIdOpposite = data[].y;
                
                float linkBornDate = dataC[].x;
                float linkDieDate = dataC[].y;
                
                vec2 xGeometryNode_opposite = get_global_id(nodeIdOpposite, bufferNodesWidth, `+geometryLength.toFixed(1)+`);
                vec3 oppositePosition = posXYZW[xGeometryNode_opposite].xyz;
                
                ${VFP_NODE.linkStr()}
        
                vec2 xGeometryArrows = get_global_id(nodeId, bufferArrowsWidth, 3.0); ${/* bufferWidth, geometryLength */''}
                vec2 xGeometryArrows_opposite = get_global_id(nodeIdOpposite, bufferArrowsWidth, 3.0);
            
                float bornDateOpposite = dataB[xGeometryNode_opposite].x;
                float dieDateOpposite = dataB[xGeometryNode_opposite].y;
                
            
                vec3 currentPositionTMP;
                if(xGeometryArrows != xGeometryArrows_opposite) {
                    ${/* displacing from center to first point */''}
                    float currentLineVertexU = vertexCount-1.0;
                    currentPositionTMP = oppositePosition+((dirN*-1.0)*(lineIncrements*currentLineVertexU));

                    ${/* displacing from first point to cross direction (repeatId) */''}
                    currentPositionTMP -= cr*(currentLineVertexSQRT*getOddEven(repeatId)*4.0);
                } else { ${/* is Autolink */''}
                    float currentLineVertexU = vertexCount-1.0;
                    float currentLineVertexMM = abs( currentLineVertexU-(vertexCount/2.0) );
                    currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;

                    
                    ${/* displacing from center to first point */''}
                    vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);
                    currentPositionTMP = oppositePosition+(initialVec*(5.0*currentLineVertexMM));

                    
                    ${/* displacing from first point to cross direction (repeatId) */''}
                    if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {
                        float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;

                        vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);

                        float hhSCount = (vertexCount/2.0)/2.0;
                        float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));

                        currentPositionTMP += (crB*sig)*currentLineVertexMMB*1.0;
                        
                        ${/* currentPositionTMP -= vec4((crB*sig)*(currentLineVertexSQRT*(repeatId+1.0)*4.0), 1.0); */''}
                    }
                }

                mat4 pp = lookAt(currentPositionTMP, vec3(currentPosition.x, currentPosition.y, currentPosition.z), vec3(0.0, 1.0, 0.0));
                pp = transpose(pp);
                nodepos[0][0] = pp[0][0];
                nodepos[0][1] = pp[1][0];
                nodepos[0][2] = pp[2][0];

                nodepos[1][0] = pp[0][1];
                nodepos[1][1] = pp[1][1];
                nodepos[1][2] = pp[2][1];

                nodepos[2][0] = pp[0][2];
                nodepos[2][1] = pp[1][2];
                nodepos[2][2] = pp[2][2];

                ${/* displace from center to node border */''}
                dir = currentPositionTMP-vec3(currentPosition.x, currentPosition.y, currentPosition.z);
                currentPosition += vec4(normalize(dir),1.0)*2.0;

                vVisibility = checkLinkArrowVisibility(currentTimestamp, linkBornDate, linkDieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);
                vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;
                vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;
                
                vNodeIdOpposite = nodeIdOpposite;
            }
            if(isNodeText == 1.0) {            
                float letId = letterId[];
                mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);
                nodepos = nodepos*mm;

                vVertexUV = get2Dfrom1D(letId, fontImgColumns)+vec2(nodeVertexTexture.x/fontImgColumns,nodeVertexTexture.y/fontImgColumns);
                nodeVertexPosition = vec4(nodeVertexPosition.x*0.1, nodeVertexPosition.y*0.1, nodeVertexPosition.z*0.1, 1.0);
                currentPosition.z += 2.5;

                vVisibility = 1.0;
                vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;
                vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;
                
                vIstarget = (currentLineVertex == 1.0) ? 1.0 : 0.0;
            }
            nodepos[3][0] = currentPosition.x;
            nodepos[3][1] = currentPosition.y;
            nodepos[3][2] = currentPosition.z;

            mat4 nodeposG = nodeWMatrix;
            vWNMatrix = nodeposG * nodeVertexNormal[];

            vUseCrosshair = 0.0;
            

            ${customCode}
            
            vDist = max(0.3, 1.0-(distance(currentPosition.xyz, oppositePosition)*0.01)); ${/* dist/acum */''}
            vVertexColor = nodeVertexColor;
            vVertexColorNetError = nodeVertexColorNetError;
            vUV = nodeVertexTexture;
            vNodeId = nodeId;


            gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPosition;`,


            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████║█████╗  ███████║██║  ██║
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ██╔══██║██╔══╝  ██╔══██║██║  ██║
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ██║  ██║███████╗██║  ██║██████╔╝
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
       		`varying vec4 vVertexColor;
            varying vec4 vVertexColorNetError;
            varying vec4 vUV;
       		varying vec2 vVertexUV;
       		varying float vUseTex;
       		varying vec4 vWNMatrix;
            varying float vNodeId;
            varying float vNodeIdOpposite;
       		varying float vDist;
            varying float vVisibility;
       		varying float vIsSelected;
            varying float vIsHover;
       		varying float vUseCrosshair;
       		varying float vIstarget;`,

            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            'vec4 color = vVertexColor;\n'+
            'vec4 colorB = vVertexColorNetError;\n'+
            'vec4 colorOrange = vec4(255.0/255.0, 131.0/255.0, 0.0/255.0, 1.0);'+
            'vec4 colorOrangeDark = vec4(255.0/255.0, 80.0/255.0, 0.0/255.0, 1.0);'+
            'vec4 colorPurple = vec4(132.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);'+

            'vec4 fcolor = vec4(0.0, 0.0, 0.0, 1.0);'+
            'if(isNode == 1.0) {'+
                'if(vUseTex == 1.0) {'+
                    'vec4 tex;'+
                    'if(vUseCrosshair == 1.0) {'+
                        'tex = nodesImgCrosshair[vVertexUV.xy];'+
                    '} else if(vIsSelected == 1.0) {'+
                        'color = colorOrangeDark;'+
                        'tex = nodesImgCrosshair[vVertexUV.xy];'+
                    '} else if(vIsHover == 1.0) {'+
                        'color = colorPurple;'+
                        'tex = nodesImg[vVertexUV.xy];'+
                    '} else {'+
                        'tex = nodesImg[vVertexUV.xy];'+
                    '}'+
                    'color = '+GraphUtils.nodesDrawMode(geometryLength)+';\n'+
                '}'+
                'if(color.a < 0.1) discard;'+

                'fcolor = color;\n'+
                'if(enableNeuronalNetwork == 1.0) {'+
                    // half up: ouput; half down: error
                    'if(vUV.y > (0.7)) '+
                        'fcolor = colorB;\n'+ // 0.75-(colorB.w*1.0)   'fcolor = (vUV.y < (0.5)) ? color : ((colorB.w == 0.0)?color:colorB);\n'+
                '}'+
            '} else if(isLink == 1.0) {'+
                'if(vIsSelected == 1.0) '+
                    'color = colorOrange;'+
                'else if(vIsHover == 1.0) '+
                    'color = colorPurple;'+

                'if(enableNeuronalNetwork == 1.0) {'+
                    // weight color
                    'vec2 xAdjMatCurrent = get_global_id(vec2(vNodeIdOpposite, vNodeId), widthAdjMatrix);'+
                    'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n'+
                    'vec4 pixAdjMatCCurrent = adjacencyMatrixC[xAdjMatCurrent];\n'+

                    // x weight
                    'if(pixAdjMatACurrent.z > 0.0) '+
                        'fcolor = vec4(0.0, pixAdjMatACurrent.z, 0.0, 1.0);\n'+
                    'else '+
                        'fcolor = vec4(abs(pixAdjMatACurrent.z), 0.0, 0.0, 1.0);\n'+

                    /*'if(pixAdjMatCCurrent.x > 0.0) '+
                        'fcolor *= vec4(0.0, abs(pixAdjMatCCurrent.x), 0.0, 1.0);'+
                    'else if(pixAdjMatCCurrent.x < 0.0) '+
                        'fcolor *= vec4(abs(pixAdjMatCCurrent.x), 0.0, 0.0, 1.0);'+
                    'else '+
                        'fcolor *= vec4(0.0,0.0,0.0, 0.0);'+*/

                    // x output
                    'if(multiplyOutput == 1.0) '+
                        'fcolor *= vec4(color.xyz, 1.0);\n'+
                '} else '+
                    'fcolor = vec4(color.xyz, 1.0);\n'+
            '} else if(isArrow == 1.0) {'+
                'if(vIstarget == 1.0) {'+
                    'if(vIsSelected == 1.0) {'+
                        'color = vec4(colorOrange.rgb*vDist, 1.0);\n'+
                    '} else if(vIsHover == 1.0) {'+
                        'color = vec4(colorPurple.rgb*vDist, 1.0);\n'+
                    '}'+
                '} else {'+
                    'color = vec4(1.0, 0.0, 0.0, 0.0);'+
                '}'+
                'fcolor = color;\n'+
            '} else if(isNodeText == 1.0) {'+
                'fcolor = fontsImg[vVertexUV.xy];\n'+
            '}'+

            'if(vVisibility == 0.0) '+
                 'discard;'+

            'return [fcolor];'
        ];
	};

	static linkStr() {
	    return `
	    vec3 dir = oppositePosition-vec3(currentPosition.x, currentPosition.y, currentPosition.z);
        float dist = length(dir);
        float lineIncrements = dist/vertexCount;
        vec3 dirN = normalize(dir);

        float repeatId = data[].w;
        vec3 cr = cross(dirN, vec3(0.0, 1.0, 0.0));
        float currentLineVertexSQRT = abs( currentLineVertex-(vertexCount/2.0) )/(vertexCount/2.0);
        currentLineVertexSQRT = sqrt(1.0-currentLineVertexSQRT);`;
    }
}
global.VFP_NODE = VFP_NODE;
module.exports.VFP_NODE = VFP_NODE;