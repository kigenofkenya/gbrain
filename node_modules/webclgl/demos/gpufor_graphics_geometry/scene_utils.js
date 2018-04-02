var loadBox = function() {
	var d = new Float32Array([0.6,0.6,0.6]);
	var vertexArray = [-1.0*d[0], -1.0*d[1],  1.0*d[2],// Front face
						 1.0*d[0], -1.0*d[1],  1.0*d[2],
						 1.0*d[0],  1.0*d[1],  1.0*d[2],
						-1.0*d[0],  1.0*d[1],  1.0*d[2],
						// Back face
						-1.0*d[0], -1.0*d[1], -1.0*d[2],
						-1.0*d[0],  1.0*d[1], -1.0*d[2],
						 1.0*d[0],  1.0*d[1], -1.0*d[2],
						 1.0*d[0], -1.0*d[1], -1.0*d[2],
						// Top face
						-1.0*d[0],  1.0*d[1], -1.0*d[2],
						-1.0*d[0],  1.0*d[1],  1.0*d[2],
						 1.0*d[0],  1.0*d[1],  1.0*d[2],
						 1.0*d[0],  1.0*d[1], -1.0*d[2],
						// Bottom face
						-1.0*d[0], -1.0*d[1], -1.0*d[2],
						 1.0*d[0], -1.0*d[1], -1.0*d[2],
						 1.0*d[0], -1.0*d[1],  1.0*d[2],
						-1.0*d[0], -1.0*d[1],  1.0*d[2],
						// Right face
						 1.0*d[0], -1.0*d[1], -1.0*d[2],
						 1.0*d[0],  1.0*d[1], -1.0*d[2],
						 1.0*d[0],  1.0*d[1],  1.0*d[2],
						 1.0*d[0], -1.0*d[1],  1.0*d[2],
						// Left face
						-1.0*d[0], -1.0*d[1], -1.0*d[2],
						-1.0*d[0], -1.0*d[1],  1.0*d[2],
						-1.0*d[0],  1.0*d[1],  1.0*d[2],
						-1.0*d[0],  1.0*d[1], -1.0*d[2]];
	var indexArray = [0, 1, 2,      0, 2, 3,    // Front face
					   4, 5, 6,      4, 6, 7,    // Back face
					   8, 9, 10,     8, 10, 11,  // Top face
					   12, 13, 14,   12, 14, 15, // Bottom face
					   16, 17, 18,   16, 18, 19, // Right face
					   20, 21, 22,   20, 22, 23];  // Left face
	
	return {"vertices": vertexArray, "indices": indexArray};
};

var getProyection = function() {
	return perspectiveProjection(45, 512 / 512, 0.1, 400.0);
}; 
var perspectiveProjection = function(fovy, aspect, znear, zfar) { 
	var top = Math.tan(fovy * Math.PI / 360) * znear;
	var bottom = -top;
	var left = aspect * bottom;
	var right = aspect * top;
	
	var X = 2*znear/(right-left);
	var Y = 2*znear/(top-bottom);
	var A = (right+left)/(right-left);
	var B = (top+bottom)/(top-bottom);
	var C = -(zfar+znear)/(zfar-znear);
	var D = -2*zfar*znear/(zfar-znear);

	return new Float32Array([ X, 0, A, 0,
							 0, Y, B, 0,
							 0, 0, C, D,
							 0, 0, -1, 0]);
};
var transpose = function(m) {
	return new Float32Array([	m[0], m[4], m[8], m[12],
								m[1], m[5], m[9], m[13],
								m[2], m[6], m[10], m[14],
								m[3], m[7], m[11], m[15]	]);
};
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(callback){
				window.setTimeout(callback, 1000 / 60);
			};
})();
