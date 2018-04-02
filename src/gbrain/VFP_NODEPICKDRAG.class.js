import "scejs";

export class VFP_NODEPICKDRAG {
    constructor() {

    }

    static getSrc(geometryLength) {
        return [[undefined],
       	    // vertex head
       		'varying vec4 vColor;\n'+
			//'uniform sampler2D posXYZW;\n'+
       		Utils.packGLSLFunctionString()+
       		'mat4 rotationMatrix(vec3 axis, float angle) {'+
	   			'axis = normalize(axis);'+
	   			'float s = sin(angle);'+
	   			'float c = cos(angle);'+
	   			'float oc = 1.0 - c;'+

	   			'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,'+
	   			'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,'+
	   			'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,'+
	   			'0.0,                                0.0,                                0.0,                                1.0);'+
	   		'}',

       		// vertex source
            'vec2 xGeometry = get_global_id(data[].x, uBufferWidth, '+geometryLength.toFixed(1)+');'+

            'vec4 nodePosition = posXYZW[xGeometry];\n'+
            'float bornDate = dataB[xGeometry].x;'+
            'float dieDate = dataB[xGeometry].y;'+


            'mat4 nodepos = nodeWMatrix;'+

            'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);'+
            'nodepos = nodepos*mm;'+

            'nodepos[3][0] = nodePosition.x;'+
            'nodepos[3][1] = nodePosition.y;'+
            'nodepos[3][2] = nodePosition.z;'+

            'vColor = vec4(1.0, 1.0, 1.0, 1.0);'+
            'int mak = 0;'+
            'if(dieDate != 0.0) {'+
                'if(currentTimestamp > bornDate && currentTimestamp < dieDate) '+
                    'mak = 1;'+
            '} else '+
                'mak = 1;'+

            'if(mak == 1) {'+
                'vColor = pack((data[].x+1.0)/1000000.0);'+
            '}'+

            'if(vColor.x == 1.0 && vColor.y == 1.0 && vColor.z == 1.0 && vColor.w == 1.0) '+
                'nodepos[3][0] = 10000.0;'+


            'gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPos[];\n'+
            'gl_PointSize = 10.0;\n',

       		// fragment head
       		'varying vec4 vColor;\n',

       		// fragment source
            //'vec2 x = get_global_id();'+ // no needed

            'return [vColor];\n'
        ];
	};
}
global.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
module.exports.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;