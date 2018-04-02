(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
!function(){function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return o(n||e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}return e}()({1:[function(e,t,n){(function(t){!function(){function t(n,r,o){function i(a,l){if(!r[a]){if(!n[a]){var u="function"==typeof e&&e;if(!l&&u)return u(a,!0);if(s)return s(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var h=r[a]={exports:{}};n[a][0].call(h.exports,function(e){return i(n[a][1][e]||e)},h,h.exports,t,n,r,o)}return r[a].exports}for(var s="function"==typeof e&&e,a=0;a<o.length;a++)i(o[a]);return i}return t}()({1:[function(e,n,r){(function(t){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.WebCLGL=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./WebCLGLBuffer.class"),a=e("./WebCLGLKernel.class"),l=e("./WebCLGLVertexFragmentProgram.class"),u=e("./WebCLGLUtils.class"),c=r.WebCLGL=function(){function e(t){o(this,e),this.utils=new u.WebCLGLUtils,this._gl=null,this.e=null,void 0===t||null===t?(this.e=document.createElement("canvas"),this.e.width=32,this.e.height=32,this._gl=u.WebCLGLUtils.getWebGLContextFromCanvas(this.e,{antialias:!1})):this._gl=t,this._arrExt={OES_texture_float:null,OES_texture_float_linear:null,OES_element_index_uint:null,WEBGL_draw_buffers:null};for(var n in this._arrExt)this._arrExt[n]=this._gl.getExtension(n),null==this._arrExt[n]&&console.error("extension "+n+" not available");this._maxDrawBuffers=null,this._arrExt.hasOwnProperty("WEBGL_draw_buffers")&&null!=this._arrExt.WEBGL_draw_buffers?(this._maxDrawBuffers=this._gl.getParameter(this._arrExt.WEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL),console.log("Max draw buffers: "+this._maxDrawBuffers)):console.log("Max draw buffers: 1");var r=this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER,this._gl.HIGH_FLOAT);this.precision=0!==r.precision?"precision highp float;\n\nprecision highp int;\n\n":"precision lowp float;\n\nprecision lowp int;\n\n",this._currentTextureUnit=0,this._bufferWidth=0;var i=this.utils.loadQuad(void 0,1,1);this.vertexBuffer_QUAD=this._gl.createBuffer(),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.vertexBuffer_QUAD),this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(i.vertexArray),this._gl.STATIC_DRAW),this.indexBuffer_QUAD=this._gl.createBuffer(),this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer_QUAD),this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(i.indexArray),this._gl.STATIC_DRAW),this.arrayCopyTex=[];var s=this.precision+"attribute vec3 aVertexPosition;\nvarying vec2 vCoord;\nvoid main(void) {\ngl_Position = vec4(aVertexPosition, 1.0);\nvCoord = aVertexPosition.xy*0.5+0.5;\n}\n",a=this.precision+"uniform sampler2D sampler_buffer;\nvarying vec2 vCoord;\nvoid main(void) {\ngl_FragColor = texture2D(sampler_buffer, vCoord);}\n";this.shader_readpixels=this._gl.createProgram(),this.utils.createShader(this._gl,"CLGLREADPIXELS",s,a,this.shader_readpixels),this.attr_VertexPos=this._gl.getAttribLocation(this.shader_readpixels,"aVertexPosition"),this.sampler_buffer=this._gl.getUniformLocation(this.shader_readpixels,"sampler_buffer");var l=function(){return void 0!==this._maxDrawBuffers&&null!==this._maxDrawBuffers?"#extension GL_EXT_draw_buffers : require\n":""}.bind(this),c=(function(){for(var e="",t=0,n=this._maxDrawBuffers;t<n;t++)e+="layout(location = "+t+") out vec4 outCol"+t+";\n";return e}.bind(this),function(){for(var e="",t=0,n=this._maxDrawBuffers;t<n;t++)e+="gl_FragData["+t+"] = texture2D(uArrayCT["+t+"], vCoord);\n";return e}.bind(this));s=this.precision+"attribute vec3 aVertexPosition;\nvarying vec2 vCoord;\nvoid main(void) {\ngl_Position = vec4(aVertexPosition, 1.0);\nvCoord = aVertexPosition.xy*0.5+0.5;\n}",a=l()+this.precision+"uniform sampler2D uArrayCT["+this._maxDrawBuffers+"];\nvarying vec2 vCoord;\nvoid main(void) {\n"+c()+"}",this.shader_copyTexture=this._gl.createProgram(),this.utils.createShader(this._gl,"CLGLCOPYTEXTURE",s,a,this.shader_copyTexture),this.attr_copyTexture_pos=this._gl.getAttribLocation(this.shader_copyTexture,"aVertexPosition");for(var h=0,f=this._maxDrawBuffers;h<f;h++)this.arrayCopyTex[h]=this._gl.getUniformLocation(this.shader_copyTexture,"uArrayCT["+h+"]");this.textureDataAux=this._gl.createTexture(),this._gl.bindTexture(this._gl.TEXTURE_2D,this.textureDataAux),this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,2,2,0,this._gl.RGBA,this._gl.FLOAT,new Float32Array([1,0,0,1,0,1,0,1,0,0,1,1,1,1,1,1])),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MAG_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MIN_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_WRAP_S,this._gl.CLAMP_TO_EDGE),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_WRAP_T,this._gl.CLAMP_TO_EDGE),this._gl.bindTexture(this._gl.TEXTURE_2D,null)}return i(e,[{key:"getContext",value:function(){return this._gl}},{key:"getMaxDrawBuffers",value:function(){return this._maxDrawBuffers}},{key:"checkFramebufferStatus",value:function(){var e=this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER),t={};return t[this._gl.FRAMEBUFFER_COMPLETE]=!0,t[this._gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT]="FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete",t[this._gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT]="FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment",t[this._gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS]="FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same",t[this._gl.FRAMEBUFFER_UNSUPPORTED]="FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer",!0===t[e]&&null!==t[e]||(console.log(t[e]),!1)}},{key:"copy",value:function(e,t){if(void 0!==t&&null!==t)if(void 0!==t[0]&&null!==t[0]){this._gl.viewport(0,0,t[0].W,t[0].H),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,t[0].fBuffer);for(var n=[],r=0,o=t.length;r<o;r++)void 0!==t[r]&&null!==t[r]?(this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._arrExt.WEBGL_draw_buffers["COLOR_ATTACHMENT"+r+"_WEBGL"],this._gl.TEXTURE_2D,t[r].textureData,0),n[r]=this._arrExt.WEBGL_draw_buffers["COLOR_ATTACHMENT"+r+"_WEBGL"]):n[r]=this._gl.NONE;if(this._arrExt.WEBGL_draw_buffers.drawBuffersWEBGL(n),!0===this.checkFramebufferStatus()){this._gl.useProgram(this.shader_copyTexture);for(var i=0,s=t.length;i<s;i++)this._gl.activeTexture(this._gl["TEXTURE"+i]),void 0!==t[i]&&null!==t[i]?this._gl.bindTexture(this._gl.TEXTURE_2D,t[i].textureDataTemp):this._gl.bindTexture(this._gl.TEXTURE_2D,this.textureDataAux),this._gl.uniform1i(this.arrayCopyTex[i],i);this.copyNow(t)}}else this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null);else this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null)}},{key:"copyNow",value:function(e){this._gl.enableVertexAttribArray(this.attr_copyTexture_pos),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.vertexBuffer_QUAD),this._gl.vertexAttribPointer(this.attr_copyTexture_pos,3,this._gl.FLOAT,!1,0,0),this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer_QUAD),this._gl.drawElements(this._gl.TRIANGLES,6,this._gl.UNSIGNED_SHORT,0)}},{key:"createBuffer",value:function(e,t,n){return new s.WebCLGLBuffer(this._gl,e,t,n)}},{key:"createKernel",value:function(e,t){return new a.WebCLGLKernel(this._gl,e,t)}},{key:"createVertexFragmentProgram",value:function(e,t,n,r){return new l.WebCLGLVertexFragmentProgram(this._gl,e,t,n,r)}},{key:"fillBuffer",value:function(e,t,n){this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,n),this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._arrExt.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL,this._gl.TEXTURE_2D,e,0);var r=[this._arrExt.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL];this._arrExt.WEBGL_draw_buffers.drawBuffersWEBGL(r),void 0!==t&&null!==t&&this._gl.clearColor(t[0],t[1],t[2],t[3]),this._gl.clear(this._gl.COLOR_BUFFER_BIT)}},{key:"bindAttributeValue",value:function(e,t){void 0!==t&&null!==t?"float4_fromAttr"===e.type?(this._gl.enableVertexAttribArray(e.location[0]),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,t.vertexData0),this._gl.vertexAttribPointer(e.location[0],4,this._gl.FLOAT,!1,0,0)):"float_fromAttr"===e.type&&(this._gl.enableVertexAttribArray(e.location[0]),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,t.vertexData0),this._gl.vertexAttribPointer(e.location[0],1,this._gl.FLOAT,!1,0,0)):this._gl.disableVertexAttribArray(e.location[0])}},{key:"bindSamplerValue",value:function(e,t,n){this._currentTextureUnit<16?this._gl.activeTexture(this._gl["TEXTURE"+this._currentTextureUnit]):this._gl.activeTexture(this._gl.TEXTURE16),void 0!==n&&null!==n?(this._gl.bindTexture(this._gl.TEXTURE_2D,n.textureData),0===this._bufferWidth&&(this._bufferWidth=n.W,this._gl.uniform1f(e,this._bufferWidth))):this._gl.bindTexture(this._gl.TEXTURE_2D,this.textureDataAux),this._gl.uniform1i(t.location[0],this._currentTextureUnit),this._currentTextureUnit++}},{key:"bindUniformValue",value:function(e,t){void 0!==t&&null!==t&&("float"===e.type?t.constructor===Array?this._gl.uniform1fv(e.location[0],t):this._gl.uniform1f(e.location[0],t):"float4"===e.type?this._gl.uniform4f(e.location[0],t[0],t[1],t[2],t[3]):"mat4"===e.type&&this._gl.uniformMatrix4fv(e.location[0],!1,t))}},{key:"bindValue",value:function(e,t,n){switch(t.expectedMode){case"ATTRIBUTE":this.bindAttributeValue(t,n);break;case"SAMPLER":this.bindSamplerValue(e.uBufferWidth,t,n);break;case"UNIFORM":this.bindUniformValue(t,n)}}},{key:"bindFB",value:function(e,t){if(void 0!==e&&null!==e){if(void 0!==e[0]&&null!==e[0]){this._gl.viewport(0,0,e[0].W,e[0].H),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,!0===t?e[0].fBufferTemp:e[0].fBuffer);for(var n=[],r=0,o=e.length;r<o;r++)if(void 0!==e[r]&&null!==e[r]){var i=!0===t?e[r].textureDataTemp:e[r].textureData;this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._arrExt.WEBGL_draw_buffers["COLOR_ATTACHMENT"+r+"_WEBGL"],this._gl.TEXTURE_2D,i,0),n[r]=this._arrExt.WEBGL_draw_buffers["COLOR_ATTACHMENT"+r+"_WEBGL"]}else n[r]=this._gl.NONE;return this._arrExt.WEBGL_draw_buffers.drawBuffersWEBGL(n),this.checkFramebufferStatus()}return this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null),!0}return this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null),!0}},{key:"enqueueNDRangeKernel",value:function(e,t,n,r){if(this._bufferWidth=0,this._gl.useProgram(e.kernel),!0===this.bindFB(t,n)){this._currentTextureUnit=0;for(var o in e.in_values)this.bindValue(e,e.in_values[o],r[o]);this._gl.enableVertexAttribArray(e.attr_VertexPos),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.vertexBuffer_QUAD),this._gl.vertexAttribPointer(e.attr_VertexPos,3,this._gl.FLOAT,!1,0,0),this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer_QUAD),this._gl.drawElements(this._gl.TRIANGLES,6,this._gl.UNSIGNED_SHORT,0)}}},{key:"enqueueVertexFragmentProgram",value:function(e,t,n,r,o,i){this._bufferWidth=0,this._gl.useProgram(e.vertexFragmentProgram);var s=void 0!==n&&null!==n?n:4;if(!0===this.bindFB(r,o)&&void 0!==t&&null!==t){this._currentTextureUnit=0;for(var a in e.in_vertex_values)this.bindValue(e,e.in_vertex_values[a],i[a]);for(var l in e.in_fragment_values)this.bindValue(e,e.in_fragment_values[l],i[l]);"VERTEX_INDEX"===t.mode?(this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,t.vertexData0),this._gl.drawElements(s,t.length,this._gl.UNSIGNED_SHORT,0)):this._gl.drawArrays(s,0,t.length)}}},{key:"readBuffer",value:function(e){void 0!==this.e&&null!==this.e&&(this.e.width=e.W,this.e.height=e.H),this._gl.useProgram(this.shader_readpixels),this._gl.viewport(0,0,e.W,e.H),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,e.fBufferTemp),this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._arrExt.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL,this._gl.TEXTURE_2D,e.textureDataTemp,0);var t=[this._arrExt.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL];if(this._arrExt.WEBGL_draw_buffers.drawBuffersWEBGL(t),this._gl.activeTexture(this._gl.TEXTURE0),this._gl.bindTexture(this._gl.TEXTURE_2D,e.textureData),this._gl.uniform1i(this.sampler_buffer,0),this._gl.enableVertexAttribArray(this.attr_VertexPos),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.vertexBuffer_QUAD),this._gl.vertexAttribPointer(this.attr_VertexPos,3,e._supportFormat,!1,0,0),this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer_QUAD),this._gl.drawElements(this._gl.TRIANGLES,6,this._gl.UNSIGNED_SHORT,0),void 0!==e.outArrayFloat&&null!==e.outArrayFloat||(e.outArrayFloat=new Float32Array(e.W*e.H*4)),this._gl.readPixels(0,0,e.W,e.H,this._gl.RGBA,this._gl.FLOAT,e.outArrayFloat),"FLOAT"===e.type){for(var n=new Float32Array(e.outArrayFloat.length/4),r=0,o=e.outArrayFloat.length/4;r<o;r++)n[r]=e.outArrayFloat[4*r];e.outArrayFloat=n}return e.outArrayFloat}}],[{key:"enqueueReadBuffer_WebGLTexture",value:function(e){return e.textureData}}]),e}();t.WebCLGL=c,n.exports.WebCLGL=c}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./WebCLGLBuffer.class":2,"./WebCLGLKernel.class":4,"./WebCLGLUtils.class":5,"./WebCLGLVertexFragmentProgram.class":6}],2:[function(e,n,r){(function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=r.WebCLGLBuffer=function(){function e(n,r,o,i){t(this,e),this._gl=n,this.type=void 0!==r||null!==r?r:"FLOAT",this._supportFormat=this._gl.FLOAT,this.linear=void 0===o&&null===o||o,this.mode=void 0!==i||null!==i?i:"SAMPLER",this.W=null,this.H=null,this.textureData=null,this.textureDataTemp=null,this.vertexData0=null,this.fBuffer=null,this.renderBuffer=null,this.fBufferTemp=null,this.renderBufferTemp=null,"SAMPLER"===this.mode&&(this.textureData=this._gl.createTexture(),this.textureDataTemp=this._gl.createTexture()),"SAMPLER"!==this.mode&&"ATTRIBUTE"!==this.mode&&"VERTEX_INDEX"!==this.mode||(this.vertexData0=this._gl.createBuffer())}return o(e,[{key:"createFramebufferAndRenderbuffer",value:function(){var e=function(){var e=this._gl.createRenderbuffer();return this._gl.bindRenderbuffer(this._gl.RENDERBUFFER,e),this._gl.renderbufferStorage(this._gl.RENDERBUFFER,this._gl.DEPTH_COMPONENT16,this.W,this.H),this._gl.bindRenderbuffer(this._gl.RENDERBUFFER,null),e}.bind(this);null!=this.fBuffer&&(this._gl.deleteFramebuffer(this.fBuffer),this._gl.deleteFramebuffer(this.fBufferTemp),this._gl.deleteRenderbuffer(this.renderBuffer),this._gl.deleteRenderbuffer(this.renderBufferTemp)),this.fBuffer=this._gl.createFramebuffer(),this.renderBuffer=e(),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this.fBuffer),this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,this._gl.DEPTH_ATTACHMENT,this._gl.RENDERBUFFER,this.renderBuffer),this.fBufferTemp=this._gl.createFramebuffer(),this.renderBufferTemp=e(),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this.fBufferTemp),this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,this._gl.DEPTH_ATTACHMENT,this._gl.RENDERBUFFER,this.renderBufferTemp)}},{key:"writeWebGLTextureBuffer",value:function(e,t){var n=function(e,t){!1===t||void 0===t||null===t?this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL,!1):this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL,!0),this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),this._gl.bindTexture(this._gl.TEXTURE_2D,e)}.bind(this),r=function(e){e instanceof HTMLImageElement?"FLOAT4"===this.type&&this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,this._gl.RGBA,this._supportFormat,e):this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,this.W,this.H,0,this._gl.RGBA,this._supportFormat,e)}.bind(this),o=function(){this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MAG_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MIN_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_WRAP_S,this._gl.CLAMP_TO_EDGE),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_WRAP_T,this._gl.CLAMP_TO_EDGE)}.bind(this);e instanceof WebGLTexture?(this.textureData=e,this.textureDataTemp=e):(n(this.textureData,t),r(e),o(),n(this.textureDataTemp,t),r(e),o()),this._gl.bindTexture(this._gl.TEXTURE_2D,null)}},{key:"writeBuffer",value:function(e,t,n){var r=function(e){if(!(e instanceof HTMLImageElement))if(this.length.constructor===Array?(this.length=this.length[0]*this.length[1],this.W=this.length[0],this.H=this.length[1]):(this.W=Math.ceil(Math.sqrt(this.length)),this.H=this.W),"FLOAT4"===this.type){e=e instanceof Float32Array?e:new Float32Array(e);var t=this.W*this.H*4;if(e.length!==t){for(var n=new Float32Array(t),r=0;r<t;r++)n[r]=null!=e[r]?e[r]:0;e=n}}else if("FLOAT"===this.type){for(var o=this.W*this.H*4,i=new Float32Array(o),s=0,a=this.W*this.H;s<a;s++){var l=4*s;i[l]=null!=e[s]?e[s]:0,i[l+1]=0,i[l+2]=0,i[l+3]=0}e=i}return e}.bind(this);void 0===n||null===n?e instanceof HTMLImageElement?this.length=e.width*e.height:this.length="FLOAT4"===this.type?e.length/4:e.length:this.length=[n[0],n[1]],"SAMPLER"===this.mode&&this.writeWebGLTextureBuffer(r(e),t),"SAMPLER"!==this.mode&&"ATTRIBUTE"!==this.mode||(this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.vertexData0),this._gl.bufferData(this._gl.ARRAY_BUFFER,e instanceof Float32Array?e:new Float32Array(e),this._gl.STATIC_DRAW)),"VERTEX_INDEX"===this.mode&&(this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.vertexData0),this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),this._gl.STATIC_DRAW)),this.createFramebufferAndRenderbuffer()}},{key:"remove",value:function(){"SAMPLER"===this.mode&&(this._gl.deleteTexture(this.textureData),this._gl.deleteTexture(this.textureDataTemp)),"SAMPLER"!==this.mode&&"ATTRIBUTE"!==this.mode&&"VERTEX_INDEX"!==this.mode||this._gl.deleteBuffer(this.vertexData0),this._gl.deleteFramebuffer(this.fBuffer),this._gl.deleteFramebuffer(this.fBufferTemp),this._gl.deleteRenderbuffer(this.renderBuffer),this._gl.deleteRenderbuffer(this.renderBufferTemp)}}]),e}();e.WebCLGLBuffer=i,n.exports.WebCLGLBuffer=i}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(e,n,r){(function(t){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){var e=new u,t=null;return arguments[0]instanceof WebGLRenderingContext?(t=arguments[0],e.setCtx(t),e._webCLGL=new a.WebCLGL(t),e.iniG(arguments),e):arguments[0]instanceof HTMLCanvasElement?(t=l.WebCLGLUtils.getWebGLContextFromCanvas(arguments[0]),e.setCtx(t),e._webCLGL=new a.WebCLGL(t),e.iniG(arguments),e):(t=l.WebCLGLUtils.getWebGLContextFromCanvas(document.createElement("canvas"),{antialias:!1}),e.setCtx(t),e._webCLGL=new a.WebCLGL(t),e.ini(arguments))}Object.defineProperty(r,"__esModule",{value:!0}),r.WebCLGLFor=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();r.gpufor=i;var a=e("./WebCLGL.class"),l=e("./WebCLGLUtils.class"),u=r.WebCLGLFor=function(){function e(t){o(this,e),this.kernels={},this.vertexFragmentPrograms={},this._args={},this._argsValues={},this.calledArgs={},this._webCLGL=null,this._gl=null}return s(e,[{key:"defineOutputTempModes",value:function(e,t){for(var n=[],r=0;r<e.length;r++)n[r]=null!=e[r]&&function(e,t){var n=!1;for(var r in t)if("indices"!==r){var o=r.split(" ");if(o.length>0&&o[1]===e){n=!0;break}}return n}(e[r],t);return n}},{key:"prepareReturnCode",value:function(e,t){var n=[],r=e.match(new RegExp(/return.*$/gm)),o=(r=r[0].replace("return ","")).match(new RegExp(/\[/gm));if(null!=o&&o.length>=1){r=r.split("[")[1].split("]")[0];for(var i="",s=0,a=0;a<r.length;a++)","===r[a]&&0===s?(n.push(i),i=""):i+=r[a],"("===r[a]&&s++,")"===r[a]&&s--;n.push(i)}else n.push(r.replace(/;$/gm,""));for(var l="",u=0;u<t.length;u++){var c=!1;for(var h in this._args)if("indices"!==h){var f=h.split(" ");if(f[1]===t[u]){var d=f[0].match(new RegExp("float4","gm"));l+=null!=d&&d.length>0?"out"+u+"_float4 = "+n[u]+";\n":"out"+u+"_float = "+n[u]+";\n",c=!0;break}}!1===c&&(l+="out"+u+"_float4 = "+n[u]+";\n")}return l}},{key:"addKernel",value:function(e){var t=e.config,n=t[0],r=t[1]instanceof Array?t[1]:[t[1]],o=t[2],i=t[3],s=this._webCLGL.createKernel(),a=[];for(var l in this._args){var u=l.split(" ")[1];if(void 0!==u&&null!==u){var c=(o+i).match(new RegExp(u.replace(/\[\d.*/,""),"gm"));"indices"!==l&&null!=c&&c.length>0&&(s.in_values[u]={},a.push(l.replace("*attr ","* ").replace(/\[\d.*/,"")))}}i="void main("+a.toString()+") {vec2 "+n+" = get_global_id();"+i.replace(/return.*$/gm,this.prepareReturnCode(i,r))+"}",s.name=e.name,s.viewSource=null!=e.viewSource&&e.viewSource,s.setKernelSource(i,o),s.output=r,s.outputTempModes=this.defineOutputTempModes(r,this._args),s.enabled=!0,s.drawMode=null!=e.drawMode?e.drawMode:4,s.depthTest=null==e.depthTest||e.depthTest,s.blend=null!=e.blend&&e.blend,s.blendEquation=null!=e.blendEquation?e.blendEquation:"FUNC_ADD",s.blendSrcMode=null!=e.blendSrcMode?e.blendSrcMode:"SRC_ALPHA",s.blendDstMode=null!=e.blendDstMode?e.blendDstMode:"ONE_MINUS_SRC_ALPHA",this.kernels[Object.keys(this.kernels).length.toString()]=s}},{key:"addGraphic",value:function(e){var t=e.config,n=[null],r=void 0,o=void 0,i=void 0,s=void 0;5===t.length?(n=t[0]instanceof Array?t[0]:[t[0]],r=t[1],o=t[2],i=t[3],s=t[4]):(r=t[0],o=t[1],i=t[2],s=t[3]);var a=this._webCLGL.createVertexFragmentProgram(),l=[],u=[];for(var c in this._args){var h=c.split(" ")[1];if(void 0!==h&&null!==h){var f=(r+o).match(new RegExp(h.replace(/\[\d.*/,""),"gm"));"indices"!==c&&null!=f&&f.length>0&&(a.in_vertex_values[h]={},l.push(c.replace(/\[\d.*/,"")))}}for(var d in this._args){var g=d.split(" ")[1];if(void 0!==g&&null!==g){var _=(i+s).match(new RegExp(g.replace(/\[\d.*/,""),"gm"));"indices"!==d&&null!=_&&_.length>0&&(a.in_fragment_values[g]={},u.push(d.replace(/\[\d.*/,"")))}}o="void main("+l.toString()+") {"+o+"}",s="void main("+u.toString()+") {"+s.replace(/return.*$/gm,this.prepareReturnCode(s,n))+"}",a.name=e.name,a.viewSource=null!=e.viewSource&&e.viewSource,a.setVertexSource(o,r),a.setFragmentSource(s,i),a.output=n,a.outputTempModes=this.defineOutputTempModes(n,this._args),a.enabled=!0,a.drawMode=null!=e.drawMode?e.drawMode:4,a.depthTest=null==e.depthTest||e.depthTest,a.blend=null==e.blend||e.blend,a.blendEquation=null!=e.blendEquation?e.blendEquation:"FUNC_ADD",a.blendSrcMode=null!=e.blendSrcMode?e.blendSrcMode:"SRC_ALPHA",a.blendDstMode=null!=e.blendDstMode?e.blendDstMode:"ONE_MINUS_SRC_ALPHA",this.vertexFragmentPrograms[Object.keys(this.vertexFragmentPrograms).length.toString()]=a}},{key:"checkArg",value:function(e,t,n){var r=[],o=!1,i=!1;for(var s in t)for(var a in t[s].in_values)if(t[s].in_values[a],a===e){r.push(t[s]);break}for(var l in n){for(var u in n[l].in_vertex_values)if(n[l].in_vertex_values[u],u===e){o=!0;break}for(var c in n[l].in_fragment_values)if(n[l].in_fragment_values[c],c===e){i=!0;break}}return{usedInVertex:o,usedInFragment:i,kernelPr:r}}},{key:"fillArg",value:function(e,t){this._webCLGL.fillBuffer(this._argsValues[e].textureData,t,this._argsValues[e].fBuffer),this._webCLGL.fillBuffer(this._argsValues[e].textureDataTemp,t,this._argsValues[e].fBufferTemp)}},{key:"getAllArgs",value:function(){return this._argsValues}},{key:"addArg",value:function(e){this._args[e]=null}},{key:"getGPUForArg",value:function(e,t){!1===this.calledArgs.hasOwnProperty(e)&&(this.calledArgs[e]=[]),-1===this.calledArgs[e].indexOf(t)&&this.calledArgs[e].push(t),!1===t.calledArgs.hasOwnProperty(e)&&(t.calledArgs[e]=[]),-1===t.calledArgs[e].indexOf(this)&&t.calledArgs[e].push(this);for(var n in t._args){var r=n.split(" ")[1];if(r===e){this._args[n]=t._args[n],this._argsValues[r]=t._argsValues[r];break}}}},{key:"setArg",value:function(e,t,n,r){if("indices"===e)this.setIndices(t);else for(var o in this._args){var i=o.split(" ")[1];if(void 0!==i&&i.replace(/\[\d.*/,"")===e){i!==e&&(e=i);var s=!1;if(null!=o.match(/\*/gm)){var a=this.checkArg(e,this.kernels,this.vertexFragmentPrograms),l="SAMPLER";!0===a.usedInVertex&&0===a.kernelPr.length&&!1===a.usedInFragment&&(l="ATTRIBUTE");var u=o.split("*")[0].toUpperCase();void 0!==r&&null!==r&&(u=r),void 0!==t&&null!==t?((!1===this._argsValues.hasOwnProperty(e)||!0===this._argsValues.hasOwnProperty(e)&&null==this._argsValues[e])&&(this._argsValues[e]=this._webCLGL.createBuffer(u,!1,l),this._argsValues[e].argument=e,s=!0),this._argsValues[e].writeBuffer(t,!1,n)):this._argsValues[e]=null}else void 0!==t&&null!==t&&(this._argsValues[e]=t),s=!0;if(!0===s&&!0===this.calledArgs.hasOwnProperty(e))for(var c=0;c<this.calledArgs[e].length;c++)this.calledArgs[e][c]._argsValues[e]=this._argsValues[e];break}}return t}},{key:"readArg",value:function(e){return this._webCLGL.readBuffer(this._argsValues[e])}},{key:"setIndices",value:function(e){this.CLGL_bufferIndices=this._webCLGL.createBuffer("FLOAT",!1,"VERTEX_INDEX"),this.CLGL_bufferIndices.writeBuffer(e)}},{key:"getCtx",value:function(){return this._webCLGL.getContext()}},{key:"setCtx",value:function(e){this._gl=e}},{key:"getWebCLGL",value:function(){return this._webCLGL}},{key:"onPreProcessKernel",value:function(e,t){this.kernels[e].onpre=t}},{key:"onPostProcessKernel",value:function(e,t){this.kernels[e].onpost=t}},{key:"enableKernel",value:function(e){this.kernels["0"|e.toString()].enabled=!0}},{key:"disableKernel",value:function(e){this.kernels["0"|e.toString()].enabled=!1}},{key:"getKernel",value:function(e){for(var t in this.kernels)if(t===e)return this.kernels[t];return null}},{key:"getAllKernels",value:function(){return this.kernels}},{key:"onPreProcessGraphic",value:function(e,t){this.vertexFragmentPrograms[e].onpre=t}},{key:"onPostProcessGraphic",value:function(e,t){this.vertexFragmentPrograms[e].onpost=t}},{key:"enableGraphic",value:function(e){this.vertexFragmentPrograms["0"|e.toString()].enabled=!0}},{key:"disableGraphic",value:function(e){this.vertexFragmentPrograms["0"|e.toString()].enabled=!1}},{key:"getVertexFragmentProgram",value:function(e){for(var t in this.vertexFragmentPrograms)if(t===e)return this.vertexFragmentPrograms[t];return null}},{key:"getAllVertexFragmentProgram",value:function(){return this.vertexFragmentPrograms}},{key:"processKernel",value:function(e,t,n){if(!0===e.enabled){if(void 0!==n&&null!==n&&!0===n&&(this.arrMakeCopy=[]),!0===e.depthTest?this._gl.enable(this._gl.DEPTH_TEST):this._gl.disable(this._gl.DEPTH_TEST),!0===e.blend?this._gl.enable(this._gl.BLEND):this._gl.disable(this._gl.BLEND),this._gl.blendFunc(this._gl[e.blendSrcMode],this._gl[e.blendDstMode]),this._gl.blendEquation(this._gl[e.blendEquation]),void 0!==e.onpre&&null!==e.onpre&&e.onpre(),void 0===t||null===t||!0===t){for(var r=!1,o=0;o<e.output.length;o++)if(null!=e.output[o]&&!0===e.outputTempModes[o]){r=!0;break}!0===r?(this._webCLGL.enqueueNDRangeKernel(e,l.WebCLGLUtils.getOutputBuffers(e,this._argsValues),!0,this._argsValues),this.arrMakeCopy.push(e)):this._webCLGL.enqueueNDRangeKernel(e,l.WebCLGLUtils.getOutputBuffers(e,this._argsValues),!1,this._argsValues)}else this._webCLGL.enqueueNDRangeKernel(e,l.WebCLGLUtils.getOutputBuffers(e,this._argsValues),!1,this._argsValues);void 0!==e.onpost&&null!==e.onpost&&e.onpost(),void 0!==n&&null!==n&&!0===n&&this.processCopies()}}},{key:"processCopies",value:function(e){for(var t=0;t<this.arrMakeCopy.length;t++)this._webCLGL.copy(this.arrMakeCopy[t],l.WebCLGLUtils.getOutputBuffers(this.arrMakeCopy[t],this._argsValues))}},{key:"processKernels",value:function(e){this.arrMakeCopy=[];for(var t in this.kernels)this.processKernel(this.kernels[t],e);this.processCopies()}},{key:"processGraphic",value:function(e){var t=[];for(var n in this.vertexFragmentPrograms){var r=this.vertexFragmentPrograms[n];if(!0===r.enabled){var o=void 0!==e&&null!==e||void 0===this.CLGL_bufferIndices||null===this.CLGL_bufferIndices?this._argsValues[e]:this.CLGL_bufferIndices;if(void 0!==o&&null!==o&&o.length>0){!0===r.depthTest?this._gl.enable(this._gl.DEPTH_TEST):this._gl.disable(this._gl.DEPTH_TEST),!0===r.blend?this._gl.enable(this._gl.BLEND):this._gl.disable(this._gl.BLEND),this._gl.blendFunc(this._gl[r.blendSrcMode],this._gl[r.blendDstMode]),this._gl.blendEquation(this._gl[r.blendEquation]),void 0!==r.onpre&&null!==r.onpre&&r.onpre();for(var i=!1,s=0;s<r.output.length;s++)if(null!=r.output[s]&&!0===r.outputTempModes[s]){i=!0;break}!0===i?(this._webCLGL.enqueueVertexFragmentProgram(r,o,r.drawMode,l.WebCLGLUtils.getOutputBuffers(r,this._argsValues),!0,this._argsValues),t.push(r)):this._webCLGL.enqueueVertexFragmentProgram(r,o,r.drawMode,l.WebCLGLUtils.getOutputBuffers(r,this._argsValues),!1,this._argsValues),void 0!==r.onpost&&null!==r.onpost&&r.onpost()}}}for(var a=0;a<t.length;a++)this._webCLGL.copy(t[a],l.WebCLGLUtils.getOutputBuffers(t[a],this._argsValues))}},{key:"ini",value:function(){var e=arguments[0],t=void 0,n=void 0,r=void 0;e.length>3?(this._args=e[0],t=e[1],n=e[2],r=e[3]):(this._args=e[0],t=e[1],n="FLOAT",r=e[2]);var o=0;for(var i in this._args){var s=this._args[i];this.setArg(i.split(" ")[1],s),0===o&&(s instanceof Array||s instanceof Float32Array||s instanceof Uint8Array||s instanceof HTMLImageElement)&&(o=s.length)}return"FLOAT"===n?this.addArg("float* result"):this.addArg("float4* result"),this.setArg("result",new Float32Array(o),null,n),this.addKernel({type:"KERNEL",name:"SIMPLE_KERNEL",viewSource:!1,config:[t,["result"],"",r]}),this.processKernels(),this._webCLGL.readBuffer(this._argsValues.result)}},{key:"iniG",value:function(){this._webCLGL.getContext().depthFunc(this._webCLGL.getContext().LEQUAL),this._webCLGL.getContext().clearDepth(1);var e=arguments[0];this._args=e[1];for(var t=2;t<e.length;t++)"KERNEL"===e[t].type?this.addKernel(e[t]):"GRAPHIC"===e[t].type&&this.addGraphic(e[t]);for(var n in this._args){var r=this._args[n];"indices"===n?null!==r&&this.setIndices(r):this.setArg(n.split(" ")[1],r)}}}]),e}();t.WebCLGLFor=u,n.exports.WebCLGLFor=u,t.gpufor=i,n.exports.gpufor=i}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./WebCLGL.class":1,"./WebCLGLUtils.class":5}],4:[function(e,n,r){(function(t){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.WebCLGLKernel=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./WebCLGLUtils.class"),a=r.WebCLGLKernel=function(){function e(t,n,r){o(this,e),this._gl=t;var i=this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER,this._gl.HIGH_FLOAT);this._precision=0!==i.precision?"precision highp float;\n\nprecision highp int;\n\n":"precision lowp float;\n\nprecision lowp int;\n\n";var s=this._gl.getExtension("WEBGL_draw_buffers");this._maxDrawBuffers=null,null!=s&&(this._maxDrawBuffers=this._gl.getParameter(s.MAX_DRAW_BUFFERS_WEBGL)),this.name="",this.enabled=!0,this.depthTest=null,this.blend=null,this.blendSrcMode=null,this.blendDstMode=null,this.blendEquation=null,this.onpre=null,this.onpost=null,this.viewSource=!1,this.in_values={},this.output=null,this.outputTempModes=null,this.fBuffer=null,this.fBufferTemp=null,this.fBufferLength=0,this.fBufferCount=0,void 0!==n&&null!==n&&this.setKernelSource(n,r)}return i(e,[{key:"setKernelSource",value:function(e,t){for(var n=function(){var e=this._precision+"attribute vec3 aVertexPosition;\nvarying vec2 global_id;\nvoid main(void) {\ngl_Position = vec4(aVertexPosition, 1.0);\nglobal_id = aVertexPosition.xy*0.5+0.5;\n}\n",t="#extension GL_EXT_draw_buffers : require\n"+this._precision+s.WebCLGLUtils.lines_fragment_attrs(this.in_values)+"varying vec2 global_id;\nuniform float uBufferWidth;vec2 get_global_id() {\nreturn global_id;\n}\n"+s.WebCLGLUtils.get_global_id3_GLSLFunctionString()+s.WebCLGLUtils.get_global_id2_GLSLFunctionString()+this._head+"void main(void) {\n"+s.WebCLGLUtils.lines_drawBuffersInit(8)+this._source+s.WebCLGLUtils.lines_drawBuffersWrite(8)+"}\n";this.kernel=this._gl.createProgram(),(new s.WebCLGLUtils).createShader(this._gl,"WEBCLGL",e,t,this.kernel),this.attr_VertexPos=this._gl.getAttribLocation(this.kernel,"aVertexPosition"),this.uBufferWidth=this._gl.getUniformLocation(this.kernel,"uBufferWidth");for(var n in this.in_values){var r={float4_fromSampler:"SAMPLER",float_fromSampler:"SAMPLER",float:"UNIFORM",float4:"UNIFORM",mat4:"UNIFORM"}[this.in_values[n].type];s.WebCLGLUtils.checkArgNameInitialization(this.in_values,n),this.in_values[n].location=[this._gl.getUniformLocation(this.kernel,n.replace(/\[\d.*/,""))],this.in_values[n].expectedMode=r}return"VERTEX PROGRAM\n"+e+"\n FRAGMENT PROGRAM\n"+t}.bind(this),r=e.split(")")[0].split("(")[1].split(","),o=0,i=r.length;o<i;o++)if(null!==r[o].match(/\*/gm)){var a=r[o].split("*")[1].trim();s.WebCLGLUtils.checkArgNameInitialization(this.in_values,a),null!=r[o].match(/float4/gm)?this.in_values[a].type="float4_fromSampler":null!=r[o].match(/float/gm)&&(this.in_values[a].type="float_fromSampler")}else if(""!==r[o]){var l=r[o].split(" ")[1].trim();for(var u in this.in_values)if(u.replace(/\[\d.*/,"")===l){l=u;break}s.WebCLGLUtils.checkArgNameInitialization(this.in_values,l),null!=r[o].match(/float4/gm)?this.in_values[l].type="float4":null!=r[o].match(/float/gm)?this.in_values[l].type="float":null!=r[o].match(/mat4/gm)&&(this.in_values[l].type="mat4")}this._head=void 0!==t&&null!==t?t:"",this._head=this._head.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._head=s.WebCLGLUtils.parseSource(this._head,this.in_values),this._source=e.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._source=this._source.replace(/^\w* \w*\([\w\s\*,]*\) {/gi,"").replace(/}(\s|\t)*$/gi,""),this._source=s.WebCLGLUtils.parseSource(this._source,this.in_values);var c=n();!0===this.viewSource&&(console.log("%c KERNEL: "+this.name,"font-size: 20px; color: blue"),console.log("%c WEBCLGL --------------------------------","color: gray"),console.log("%c "+t+e,"color: gray"),console.log("%c TRANSLATED WEBGL ------------------------------","color: darkgray"),console.log("%c "+c,"color: darkgray"))}}]),e}();t.WebCLGLKernel=a,n.exports.WebCLGLKernel=a}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./WebCLGLUtils.class":5}],5:[function(e,n,r){(function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=r.WebCLGLUtils=function(){function e(){t(this,e)}return o(e,[{key:"loadQuad",value:function(e,t,n){var r=void 0===t||null===t?.5:t,o=void 0===n||null===n?.5:n;this.vertexArray=[-r,-o,0,r,-o,0,r,o,0,-r,o,0],this.textureArray=[0,0,0,1,0,0,1,1,0,0,1,0],this.indexArray=[0,1,2,0,2,3];var i={};return i.vertexArray=this.vertexArray,i.textureArray=this.textureArray,i.indexArray=this.indexArray,i}},{key:"createShader",value:function(e,t,n,r,o){var i=!1,s=!1,a=function(t,n){console.log(t);for(var r=[],o=t.split("\n"),i=0,s=o.length;i<s;i++)if(null!=o[i].match(/^ERROR/gim)){var a=o[i].split(":"),l=parseInt(a[2]);r.push([l,o[i]])}var u=e.getShaderSource(n).split("\n");u.unshift("");for(var c=0,h=u.length;c<h;c++){for(var f=!1,d="",g=0,_=r.length;g<_;g++)if(c===r[g][0]){f=!0,d=r[g][1];break}!1===f?console.log("%c"+c+" %c"+u[c],"color:black","color:blue"):console.log("%c►►%c"+c+" %c"+u[c]+"\n%c"+d,"color:red","color:black","color:blue","color:red")}}.bind(this),l=e.createShader(e.VERTEX_SHADER);if(e.shaderSource(l,n),e.compileShader(l),e.getShaderParameter(l,e.COMPILE_STATUS))e.attachShader(o,l),i=!0;else{var u=e.getShaderInfoLog(l);console.log("%c"+t+" ERROR (vertex program)","color:red"),void 0!==u&&null!==u&&a(u,l)}var c=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(c,r),e.compileShader(c),e.getShaderParameter(c,e.COMPILE_STATUS))e.attachShader(o,c),s=!0;else{var h=e.getShaderInfoLog(c);console.log("%c"+t+" ERROR (fragment program)","color:red"),void 0!==h&&null!==h&&a(h,c)}if(!0===i&&!0===s){if(e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS))return!0;console.log("Error shader program "+t+":\n ");var f=e.getProgramInfoLog(o);return void 0!==f&&null!==f&&console.log(f),!1}return!1}},{key:"pack",value:function(e){var t=[1/255,1/255,1/255,0],n=e,r=this.fract(255*n),o=this.fract(255*r),i=[n,r,o,this.fract(255*o)],s=[i[1]*t[0],i[2]*t[1],i[3]*t[2],i[3]*t[3]];return[i[0]-s[0],i[1]-s[1],i[2]-s[2],i[3]-s[3]]}},{key:"unpack",value:function(e){var t=[1,1/255,1/65025,1/16581375];return this.dot4(e,t)}}],[{key:"getWebGLContextFromCanvas",value:function(e,t){var n=null;if(null==n)try{n=void 0===t||null===t?e.getContext("webgl"):e.getContext("webgl",t),console.log(null==n?"no webgl":"using webgl")}catch(e){n=null}if(null==n)try{n=void 0===t||null===t?e.getContext("experimental-webgl"):e.getContext("experimental-webgl",t),console.log(null==n?"no experimental-webgl":"using experimental-webgl")}catch(e){n=null}return null==n&&(n=!1),n}},{key:"getUint8ArrayFromHTMLImageElement",value:function(e){var t=document.createElement("canvas");t.width=e.width,t.height=e.height;var n=t.getContext("2d");return n.drawImage(e,0,0),n.getImageData(0,0,e.width,e.height).data}},{key:"dot4",value:function(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}},{key:"fract",value:function(e){return e>0?e-Math.floor(e):e-Math.ceil(e)}},{key:"packGLSLFunctionString",value:function(){return"vec4 pack (float depth) {\nconst vec4 bias = vec4(1.0 / 255.0,\n1.0 / 255.0,\n1.0 / 255.0,\n0.0);\nfloat r = depth;\nfloat g = fract(r * 255.0);\nfloat b = fract(g * 255.0);\nfloat a = fract(b * 255.0);\nvec4 colour = vec4(r, g, b, a);\nreturn colour - (colour.yzww * bias);\n}\n"}},{key:"unpackGLSLFunctionString",value:function(){return"float unpack (vec4 colour) {\nconst vec4 bitShifts = vec4(1.0,\n1.0 / 255.0,\n1.0 / (255.0 * 255.0),\n1.0 / (255.0 * 255.0 * 255.0));\nreturn dot(colour, bitShifts);\n}\n"}},{key:"getOutputBuffers",value:function(e,t){var n=null;if(void 0!==e.output&&null!==e.output)if(n=[],null!=e.output[0])for(var r=0;r<e.output.length;r++)n[r]=t[e.output[r]];else n=null;return n}},{key:"parseSource",value:function(e,t){for(var n in t){var r=new RegExp(n+"\\[(?!\\d).*?\\]","gm"),o=e.match(r);if(null!=o)for(var i=0,s=o.length;i<s;i++){var a=new RegExp("```(s|\t)*gl.*"+o[i]+".*```[^```(s|\t)*gl]","gm");if(null==e.match(a)){var l=o[i].split("[")[0],u=o[i].split("[")[1].split("]")[0];e={float4_fromSampler:e.replace(l+"["+u+"]","texture2D("+l+","+u+")"),float_fromSampler:e.replace(l+"["+u+"]","texture2D("+l+","+u+").x"),float4_fromAttr:e.replace(l+"["+u+"]",l),float_fromAttr:e.replace(l+"["+u+"]",l)}[t[n].type]}}}return e=e.replace(/```(\s|\t)*gl/gi,"").replace(/```/gi,"").replace(/;/gi,";\n").replace(/}/gi,"}\n").replace(/{/gi,"{\n")}},{key:"lines_vertex_attrs",value:function(e){var t="";for(var n in e)t+={float4_fromSampler:"uniform sampler2D "+n+";",float_fromSampler:"uniform sampler2D "+n+";",float4_fromAttr:"attribute vec4 "+n+";",float_fromAttr:"attribute float "+n+";",float:"uniform float "+n+";",float4:"uniform vec4 "+n+";",mat4:"uniform mat4 "+n+";"}[e[n].type]+"\n";return t}},{key:"lines_fragment_attrs",value:function(e){var t="";for(var n in e)t+={float4_fromSampler:"uniform sampler2D "+n+";",float_fromSampler:"uniform sampler2D "+n+";",float:"uniform float "+n+";",float4:"uniform vec4 "+n+";",mat4:"uniform mat4 "+n+";"}[e[n].type]+"\n";return t}},{key:"lines_drawBuffersInit",value:function(e){for(var t="",n=0,r=e;n<r;n++)t+="float out"+n+"_float = -999.99989;\nvec4 out"+n+"_float4;\n";return t}},{key:"lines_drawBuffersWriteInit",value:function(e){for(var t="",n=0,r=e;n<r;n++)t+="layout(location = "+n+") out vec4 outCol"+n+";\n";return t}},{key:"lines_drawBuffersWrite",value:function(e){for(var t="",n=0,r=e;n<r;n++)t+="if(out"+n+"_float != -999.99989) gl_FragData["+n+"] = vec4(out"+n+"_float,0.0,0.0,1.0);\n else gl_FragData["+n+"] = out"+n+"_float4;\n";return t}},{key:"checkArgNameInitialization",value:function(e,t){!1===e.hasOwnProperty(t)&&(e[t]={type:null,expectedMode:null,location:null})}},{key:"get_global_id3_GLSLFunctionString",value:function(){return"vec2 get_global_id(float id, float bufferWidth, float geometryLength) {\nfloat texelSize = 1.0/bufferWidth;float num = (id*geometryLength)/bufferWidth;float column = fract(num)+(texelSize/2.0);float row = (floor(num)/bufferWidth)+(texelSize/2.0);return vec2(column, row);}\n"}},{key:"get_global_id2_GLSLFunctionString",value:function(){return"vec2 get_global_id(vec2 id, float bufferWidth) {\nfloat texelSize = 1.0/bufferWidth;float column = (id.x/bufferWidth)+(texelSize/2.0);float row = (id.y/bufferWidth)+(texelSize/2.0);return vec2(column, row);}\n"}}]),e}();e.WebCLGLUtils=i,n.exports.WebCLGLUtils=i}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],6:[function(e,n,r){(function(t){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.WebCLGLVertexFragmentProgram=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./WebCLGLUtils.class"),a=r.WebCLGLVertexFragmentProgram=function(){function e(t,n,r,i,s){o(this,e),this._gl=t;var a=this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER,this._gl.HIGH_FLOAT);this._precision=0!==a.precision?"precision highp float;\n\nprecision highp int;\n\n":"precision lowp float;\n\nprecision lowp int;\n\n";var l=this._gl.getExtension("WEBGL_draw_buffers");this._maxDrawBuffers=null,null!=l&&(this._maxDrawBuffers=this._gl.getParameter(l.MAX_DRAW_BUFFERS_WEBGL)),this.name="",this.viewSource=!1,this.in_vertex_values={},this.in_fragment_values={},this._vertexP_ready=!1,this._fragmentP_ready=!1,this._vertexHead=null,this._vertexSource=null,this._fragmentHead=null,this._fragmentSource=null,this.output=null,this.outputTempModes=null,this.fBuffer=null,this.fBufferTemp=null,this.drawMode=4,void 0!==n&&null!==n&&this.setVertexSource(n,r),void 0!==i&&null!==i&&this.setFragmentSource(i,s)}return i(e,[{key:"compileVertexFragmentSource",value:function(){var e=this._precision+"uniform float uOffset;\nuniform float uBufferWidth;"+s.WebCLGLUtils.lines_vertex_attrs(this.in_vertex_values)+s.WebCLGLUtils.unpackGLSLFunctionString()+s.WebCLGLUtils.get_global_id3_GLSLFunctionString()+s.WebCLGLUtils.get_global_id2_GLSLFunctionString()+this._vertexHead+"void main(void) {\n"+this._vertexSource+"}\n",t="#extension GL_EXT_draw_buffers : require\n"+this._precision+s.WebCLGLUtils.lines_fragment_attrs(this.in_fragment_values)+s.WebCLGLUtils.get_global_id3_GLSLFunctionString()+s.WebCLGLUtils.get_global_id2_GLSLFunctionString()+this._fragmentHead+"void main(void) {\n"+s.WebCLGLUtils.lines_drawBuffersInit(8)+this._fragmentSource+s.WebCLGLUtils.lines_drawBuffersWrite(8)+"}\n";this.vertexFragmentProgram=this._gl.createProgram(),(new s.WebCLGLUtils).createShader(this._gl,"WEBCLGL VERTEX FRAGMENT PROGRAM",e,t,this.vertexFragmentProgram),this.uOffset=this._gl.getUniformLocation(this.vertexFragmentProgram,"uOffset"),this.uBufferWidth=this._gl.getUniformLocation(this.vertexFragmentProgram,"uBufferWidth");for(var n in this.in_vertex_values){var r={float4_fromSampler:"SAMPLER",float_fromSampler:"SAMPLER",float4_fromAttr:"ATTRIBUTE",float_fromAttr:"ATTRIBUTE",float:"UNIFORM",float4:"UNIFORM",mat4:"UNIFORM"}[this.in_vertex_values[n].type];s.WebCLGLUtils.checkArgNameInitialization(this.in_vertex_values,n);var o="ATTRIBUTE"===r?this._gl.getAttribLocation(this.vertexFragmentProgram,n):this._gl.getUniformLocation(this.vertexFragmentProgram,n.replace(/\[\d.*/,""));this.in_vertex_values[n].location=[o],this.in_vertex_values[n].expectedMode=r}for(var i in this.in_fragment_values){var a={float4_fromSampler:"SAMPLER",float_fromSampler:"SAMPLER",float:"UNIFORM",float4:"UNIFORM",mat4:"UNIFORM"}[this.in_fragment_values[i].type];s.WebCLGLUtils.checkArgNameInitialization(this.in_fragment_values,i),this.in_fragment_values[i].location=[this._gl.getUniformLocation(this.vertexFragmentProgram,i.replace(/\[\d.*/,""))],this.in_fragment_values[i].expectedMode=a}return"VERTEX PROGRAM\n"+e+"\n FRAGMENT PROGRAM\n"+t}},{key:"setVertexSource",value:function(e,t){for(var n=e.split(")")[0].split("(")[1].split(","),r=0,o=n.length;r<o;r++)if(null!==n[r].match(/\*attr/gm)){var i=n[r].split("*attr")[1].trim();s.WebCLGLUtils.checkArgNameInitialization(this.in_vertex_values,i),null!=n[r].match(/float4/gm)?this.in_vertex_values[i].type="float4_fromAttr":null!=n[r].match(/float/gm)&&(this.in_vertex_values[i].type="float_fromAttr")}else if(null!==n[r].match(/\*/gm)){var a=n[r].split("*")[1].trim();s.WebCLGLUtils.checkArgNameInitialization(this.in_vertex_values,a),null!=n[r].match(/float4/gm)?this.in_vertex_values[a].type="float4_fromSampler":null!=n[r].match(/float/gm)&&(this.in_vertex_values[a].type="float_fromSampler")}else if(""!==n[r]){var l=n[r].split(" ")[1].trim();for(var u in this.in_vertex_values)if(u.replace(/\[\d.*/,"")===l){l=u;break}s.WebCLGLUtils.checkArgNameInitialization(this.in_vertex_values,l),null!=n[r].match(/float4/gm)?this.in_vertex_values[l].type="float4":null!=n[r].match(/float/gm)?this.in_vertex_values[l].type="float":null!=n[r].match(/mat4/gm)&&(this.in_vertex_values[l].type="mat4")}if(this._vertexHead=void 0!==t&&null!==t?t:"",this._vertexHead=this._vertexHead.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._vertexHead=s.WebCLGLUtils.parseSource(this._vertexHead,this.in_vertex_values),this._vertexSource=e.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._vertexSource=this._vertexSource.replace(/^\w* \w*\([\w\s\*,]*\) {/gi,"").replace(/}(\s|\t)*$/gi,""),this._vertexSource=s.WebCLGLUtils.parseSource(this._vertexSource,this.in_vertex_values),this._vertexP_ready=!0,!0===this._fragmentP_ready){var c=this.compileVertexFragmentSource();!0===this.viewSource&&(console.log("%c VFP: "+this.name,"font-size: 20px; color: green"),console.log("%c WEBCLGL --------------------------------","color: gray"),console.log("%c "+t+e,"color: gray"),console.log("%c TRANSLATED WEBGL ------------------------------","color: darkgray"),console.log("%c "+c,"color: darkgray"))}}},{key:"setFragmentSource",value:function(e,t){for(var n=e.split(")")[0].split("(")[1].split(","),r=0,o=n.length;r<o;r++)if(null!==n[r].match(/\*/gm)){var i=n[r].split("*")[1].trim();s.WebCLGLUtils.checkArgNameInitialization(this.in_fragment_values,i),null!=n[r].match(/float4/gm)?this.in_fragment_values[i].type="float4_fromSampler":null!=n[r].match(/float/gm)&&(this.in_fragment_values[i].type="float_fromSampler")}else if(""!==n[r]){var a=n[r].split(" ")[1].trim();for(var l in this.in_fragment_values)if(l.replace(/\[\d.*/,"")===a){a=l;break}s.WebCLGLUtils.checkArgNameInitialization(this.in_fragment_values,a),null!=n[r].match(/float4/gm)?this.in_fragment_values[a].type="float4":null!=n[r].match(/float/gm)?this.in_fragment_values[a].type="float":null!=n[r].match(/mat4/gm)&&(this.in_fragment_values[a].type="mat4")}if(this._fragmentHead=void 0!==t&&null!==t?t:"",this._fragmentHead=this._fragmentHead.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._fragmentHead=s.WebCLGLUtils.parseSource(this._fragmentHead,this.in_fragment_values),this._fragmentSource=e.replace(/\r\n/gi,"").replace(/\r/gi,"").replace(/\n/gi,""),this._fragmentSource=this._fragmentSource.replace(/^\w* \w*\([\w\s\*,]*\) {/gi,"").replace(/}(\s|\t)*$/gi,""),this._fragmentSource=s.WebCLGLUtils.parseSource(this._fragmentSource,this.in_fragment_values),this._fragmentP_ready=!0,!0===this._vertexP_ready){var u=this.compileVertexFragmentSource();!0===this.viewSource&&(console.log("%c VFP: ","font-size: 20px; color: green"),console.log("%c WEBCLGL --------------------------------","color: gray"),console.log("%c "+t+e,"color: gray"),console.log("%c TRANSLATED WEBGL ------------------------------","color: darkgray"),console.log("%c "+u,"color: darkgray"))}}}]),e}();t.WebCLGLVertexFragmentProgram=a,n.exports.WebCLGLVertexFragmentProgram=a}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./WebCLGLUtils.class":5}],7:[function(e,n,r){(function(t){"use strict";e("./WebCLGL.class"),e("./WebCLGLBuffer.class"),e("./WebCLGLFor.class"),e("./WebCLGLKernel.class"),e("./WebCLGLUtils.class"),e("./WebCLGLVertexFragmentProgram.class"),n.exports.WebCLGL=t.WebCLGL=WebCLGL,n.exports.WebCLGLBuffer=t.WebCLGLBuffer=WebCLGLBuffer,n.exports.WebCLGLFor=t.WebCLGLFor=WebCLGLFor,n.exports.WebCLGLKernel=t.WebCLGLKernel=WebCLGLKernel,n.exports.WebCLGLUtils=t.WebCLGLUtils=WebCLGLUtils,n.exports.WebCLGLVertexFragmentProgram=t.WebCLGLVertexFragmentProgram=WebCLGLVertexFragmentProgram}).call(this,void 0!==t?t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./WebCLGL.class":1,"./WebCLGLBuffer.class":2,"./WebCLGLFor.class":3,"./WebCLGLKernel.class":4,"./WebCLGLUtils.class":5,"./WebCLGLVertexFragmentProgram.class":6}]},{},[7])}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.ArrayGenerator=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./Utils.class"),a=n.ArrayGenerator=function(){function e(){o(this,e)}return i(e,[{key:"volumeArray",value:function(e){if(this.arrayNodeDestination=[],this.arrayNodeVertexColor=[],this.vo=e,this.vo instanceof StormVoxelizator==!1)return alert("You must select a voxelizator object with albedo fillmode enabled."),!1;if(void 0===this.vo.image3D_VoxelsColor||null===this.vo.image3D_VoxelsColor)return alert("You must select a voxelizator object with albedo fillmode enabled."),!1;this.data=this.vo.clglBuff_VoxelsColor.items[0].inData;for(var t=0,n=0,r=this.data.length/4;n<r;n++){var o=4*n;this.data[o+3]>0&&t++}var i=(this.currentNodeId-1)/t;this.incremNodesCell=0;var s=-1;this.currentVoxelCell=null,this.CCX=0,this.CCY=0,this.CCZ=0,this.CCXMAX=this.vo.resolution-1,this.CCYMAX=this.vo.resolution-1,this.CCZMAX=this.vo.resolution-1;for(var a=void 0,l=void 0,u=function(){for(;;){if(this.CCX===this.CCXMAX&&this.CCZ===this.CCZMAX&&this.CCY===this.CCYMAX)break;if(this.CCX===this.CCXMAX&&this.CCZ===this.CCZMAX?(this.CCX=0,this.CCZ=0,this.CCY++):this.CCX===this.CCXMAX?(this.CCX=0,this.CCZ++):this.CCX++,this.currentVoxelCell=this.CCY*(this.vo.resolution*this.vo.resolution)+this.CCZ*this.vo.resolution+this.CCX,this.data[4*this.currentVoxelCell+3]>0&&(this.incremNodesCell+=i,this.incremNodesCell>=1)){this.incremNodesCell-=1;break}}}.bind(this),c=0;c<this.arrayNodeId.length;c++)s!==this.arrayNodeId[c]?(s=this.arrayNodeId[c],this.incremNodesCell>=1?this.incremNodesCell-=1:u(),a=(a=(a=$V3([0,0,0]).add($V3([-this.vo.size/2,-this.vo.size/2,-this.vo.size/2]))).add($V3([this.vo.cs*this.CCX*1,this.vo.cs*this.CCY*1,this.vo.cs*(this.CCZMAX-this.CCZ)*1]))).add($V3([this.vo.cs*Math.random(),this.vo.cs*Math.random(),this.vo.cs*Math.random()])),l=$V3([this.data[4*this.currentVoxelCell]/255,this.data[4*this.currentVoxelCell+1]/255,this.data[4*this.currentVoxelCell+2]/255]),this.arrayNodeDestination.push(a.e[0],a.e[1],a.e[2],1),this.arrayNodeVertexColor.push(l.e[0],l.e[1],l.e[2],1)):(this.arrayNodeDestination.push(a.e[0],a.e[1],a.e[2],1),this.arrayNodeVertexColor.push(l.e[0],l.e[1],l.e[2],1));comp_renderer_nodes.setArg("dest",function(){return this.arrayNodeDestination}.bind(this),this.splitNodes),comp_renderer_nodes.setArg("nodeVertexCol",function(){return this.arrayNodeVertexColor}.bind(this),this.splitNodes)}}],[{key:"randomArray",value:function(e){for(var t=[],n=0;n<e.count;n++)"float"===e.type?t.push(-e.offset/2+Math.random()*e.offset):t.push(-e.offset/2+Math.random()*e.offset,-e.offset/2+Math.random()*e.offset,-e.offset/2+Math.random()*e.offset,-e.offset/2+Math.random()*e.offset);return t}},{key:"widthHeightArray",value:function(e){for(var t=[],n=e.width*e.height,r=e.count/n,o=0,i=0,s=0,a=void 0!==e.spacing&&null!==e.spacing?e.spacing:.01,l=0;l<e.count;l++)o>=r&&(++i>e.width-1&&(i=0,s++),o-=r),o+=1,t.push(i*a,0,s*a,1);return t}},{key:"float4Array",value:function(e){for(var t=[],n=0;n<e.count;n++)t.push(e.float4[0],e.float4[1],e.float4[2],e.float4[3]);return t}},{key:"sphericalArray",value:function(e){for(var t=[],n=void 0===e?1:e.radius,r=0;r<e.count;r++){var o=360*Math.random(),i=180*Math.random();t.push(Math.cos(o)*Math.abs(Math.sin(i))*n,Math.cos(i)*n*Math.random(),Math.sin(o)*Math.abs(Math.sin(i))*n,1)}return t}},{key:"hemArray",value:function(e){for(var t=[],n=void 0===e?1:e.radius,r=0;r<e.count;r++){var o=(new s.Utils).getVector(e.normalVector,e.degrees);t.push(o.e[0]*n,o.e[1]*n,o.e[2]*n,1)}return t}},{key:"imageArray",value:function(e){for(var t=s.Utils.getUint8ArrayFromHTMLImageElement(e.image),n=[],r=0;r<e.count;r++){var o=4*r;n.push(parseFloat(t[o]/255),parseFloat(t[o+1]/255),parseFloat(t[o+2]/255),parseFloat(t[o+3]/255))}return n}}]),e}();r.ArrayGenerator=a,t.exports.ArrayGenerator=a}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Utils.class":22}],3:[function(e,t,n){(function(e){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n.Component=function(){function e(){r(this,e),this.type=null,this.node=null}return o(e,[{key:"initialize",value:function(e,t){}},{key:"tick",value:function(e){}}]),e}();e.Component=i,t.exports.Component=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentControllerTransformTarget=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./Constants"),c=n.ComponentControllerTransformTarget=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=u.Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET,e.node=null,e.gl=null,e.comp_transformTarget=null,e.comp_projection=null,e._vel=.1,e.forward=0,e.backwardE=0,e.leftE=0,e.rightE=0,e.frontE=0,e.backE=0,e.leftButton=0,e.middleButton=0,e.rightButton=0,e.leftButtonAction="ORBIT",e.middleButtonAction="PAN",e.rightButtonAction="ZOOM",e.lastX=0,e.lastY=0,e.lockRotX=!1,e.lockRotY=!1,e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t,this.comp_transformTarget=this.node.getComponent(u.Constants.COMPONENT_TYPES.TRANSFORM_TARGET),this.comp_projection=this.node.getComponent(u.Constants.COMPONENT_TYPES.PROJECTION)}},{key:"setVelocity",value:function(e){this._vel=e}},{key:"lockRotX",value:function(){this.lockRotX=!0}},{key:"unlockRotX",value:function(){this.lockRotX=!1}},{key:"isLockRotX",value:function(){return this.lockRotX}},{key:"lockRotY",value:function(){this.lockRotY=!0}},{key:"unlockRotY",value:function(){this.lockRotY=!1}},{key:"isLockRotY",value:function(){return this.lockRotY}},{key:"forward",value:function(){this.forward=1}},{key:"backward",value:function(){this.backwardE=1}},{key:"strafeLeft",value:function(){this.leftE=1}},{key:"strafeRight",value:function(){this.rightE=1}},{key:"strafeFront",value:function(){this.frontE=1}},{key:"strafeBack",value:function(){this.backE=1}},{key:"stopForward",value:function(){this.forward=0}},{key:"stopBackward",value:function(){this.backwardE=0}},{key:"stopStrafeLeft",value:function(){this.leftE=0}},{key:"stopStrafeRight",value:function(){this.rightE=0}},{key:"stopStrafeFront",value:function(){this.frontE=0}},{key:"stopStrafeBack",value:function(){this.backE=0}},{key:"mouseDown",value:function(e){this.lastX=e.screenX,this.lastY=e.screenY,0===e.button&&(this.leftButton=1),1===e.button&&(this.middleButton=1),2===e.button&&(this.rightButton=1),this.updateGoal(e)}},{key:"mouseUp",value:function(e){0===e.button&&(this.leftButton=0),1===e.button&&(this.middleButton=0),2===e.button&&(this.rightButton=0)}},{key:"mouseMove",value:function(e){1!==this.leftButton&&1!==this.middleButton||this.updateGoal(e)}},{key:"isLeftBtnActive",value:function(){return 1===this.leftButton}},{key:"isMiddleBtnActive",value:function(){return 1===this.middleButton}},{key:"isRightBtnActive",value:function(){return 1===this.rightButton}},{key:"setLeftButtonAction",value:function(e){this.leftButtonAction=e}},{key:"setMiddleButtonAction",value:function(e){this.middleButtonAction=e}},{key:"setRightButtonAction",value:function(e){this.rightButtonAction=e}},{key:"tick",value:function(e){var t=$V3([0,0,0]);1===this.forward&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getForward().x(-this._vel))),1===this.backwardE&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getForward().x(this._vel))),1===this.leftE&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getLeft().x(-this._vel))),1===this.rightE&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getLeft().x(this._vel))),1===this.backE&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getUp().x(-this._vel))),1===this.frontE&&(t=t.add(this.comp_transformTarget.getMatrix().inverse().getUp().x(this._vel))),this.comp_transformTarget.setPositionTarget(this.comp_transformTarget.getPositionTarget().add(t)),this.comp_transformTarget.setPositionGoal(this.comp_transformTarget.getPositionGoal().add(t))}},{key:"updateGoal",value:function(e){1===this.middleButton?"PAN"===this.middleButtonAction?this.makePan(e):"ORBIT"===this.middleButtonAction&&this.makeOrbit(e):"PAN"===this.leftButtonAction?this.comp_projection.getProjection()===u.Constants.PROJECTION_TYPES.PERSPECTIVE?this.makeOrbit(e):this.makePan(e):"ORBIT"===this.leftButtonAction&&this.makeOrbit(e),this.lastX=e.screenX,this.lastY=e.screenY}},{key:"makePan",value:function(e){e.preventDefault();var t=this.comp_transformTarget.getMatrix().getLeft().x((this.lastX-e.screenX)*(.005*this.comp_projection.getFov())),n=this.comp_transformTarget.getMatrix().getUp().x((this.lastY-e.screenY)*(-.005*this.comp_projection.getFov())),r=t.add(n.x(-1));this.comp_transformTarget.setPositionGoal(this.comp_transformTarget.getPositionGoal().add(r)),this.comp_transformTarget.setPositionTarget(this.comp_transformTarget.getPositionTarget().add(r))}},{key:"makeOrbit",value:function(e){!1===this.lockRotY&&(this.lastX>e.screenX?this.comp_transformTarget.yaw(.5*-(this.lastX-e.screenX)):this.comp_transformTarget.yaw(.5*(e.screenX-this.lastX))),!1===this.lockRotX&&(this.lastY>e.screenY?this.comp_transformTarget.pitch(.5*(this.lastY-e.screenY)):this.comp_transformTarget.pitch(.5*-(e.screenY-this.lastY)))}}]),t}();r.ComponentControllerTransformTarget=c,t.exports.ComponentControllerTransformTarget=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11}],5:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentKeyboardEvents=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./Constants"),c=n.ComponentKeyboardEvents=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=u.Constants.COMPONENT_TYPES.KEYBOARD_EVENTS,e.node=null,e.gl=null,e._onkeydown=null,e._onkeyup=null,e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t}},{key:"onkeydown",value:function(e){this._onkeydown=e}},{key:"onkeyup",value:function(e){this._onkeyup=e}}]),t}();r.ComponentKeyboardEvents=c,t.exports.ComponentKeyboardEvents=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11}],6:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentMouseEvents=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./Constants"),c=n.ComponentMouseEvents=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=u.Constants.COMPONENT_TYPES.MOUSE_EVENTS,e.node=null,e.gl=null,e._onmousedown=null,e._onmouseup=null,e._onmousemove=null,e._onmousewheel=null,e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t}},{key:"onmousedown",value:function(e){this._onmousedown=e}},{key:"onmouseup",value:function(e){this._onmouseup=e}},{key:"onmousemove",value:function(e){this._onmousemove=e}},{key:"onmousewheel",value:function(e){this._onmousewheel=e}}]),t}();r.ComponentMouseEvents=c,t.exports.ComponentMouseEvents=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11}],7:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentProjection=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./StormMath.class"),c=e("./Constants"),h=n.ComponentProjection=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=c.Constants.COMPONENT_TYPES.PROJECTION,e.node=null,e.gl=null,e.mProjectionMatrix=$M16([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e.proy=c.Constants.PROJECTION_TYPES.PERSPECTIVE,e._width=512,e._height=512,e._fov=45,e._fovOrtho=20,e._near=.1,e._far=1e4,e._nearOrtho=-1e5,e._farOrtho=1e5,e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t,this.updateProjectionMatrix()}},{key:"getMatrix",value:function(){return this.mProjectionMatrix}},{key:"getProjection",value:function(){return this.proy}},{key:"setProjection",value:function(e){this.proy=e,this.updateProjectionMatrix()}},{key:"setResolution",value:function(e,t){this._width=e,this._height=t,this.updateProjectionMatrix()}},{key:"getResolution",value:function(){return{width:this._width,height:this._height}}},{key:"setFov",value:function(e){this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._fov=e:this._fovOrtho=e,this.updateProjectionMatrix()}},{key:"getFov",value:function(){return this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._fov:this._fovOrtho}},{key:"setNear",value:function(e){this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._near=e:this._nearOrtho=e,this.updateProjectionMatrix()}},{key:"getNear",value:function(){return this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._near:this._nearOrtho}},{key:"setFar",value:function(e){this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._far=e:this._farOrtho=e,this.updateProjectionMatrix()}},{key:"getFar",value:function(){return this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._far:this._farOrtho}},{key:"updateProjectionMatrix",value:function(){var e=this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this._fov:this._fovOrtho,t=this._width/this._height;this.proy===c.Constants.PROJECTION_TYPES.PERSPECTIVE?this.mProjectionMatrix=u.StormM16.setPerspectiveProjection(e,t,this._near,this._far):this.mProjectionMatrix=u.StormM16.setOrthographicProjection(-t*e,t*e,-t*e,t*e,this._nearOrtho,this._farOrtho)}}]),t}();r.ComponentProjection=h,t.exports.ComponentProjection=h}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11,"./StormMath.class":20}],8:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentTransform=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./Constants"),c=n.ComponentTransform=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=u.Constants.COMPONENT_TYPES.TRANSFORM,e.node=null,e.gl=null,e.mModelMatrix_Position=$M16([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e.mModelMatrix_Rotation=$M16([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t}},{key:"getMatrixPosition",value:function(){return this.mModelMatrix_Position}},{key:"getMatrixRotation",value:function(){return this.mModelMatrix_Rotation}}]),t}();r.ComponentTransform=c,t.exports.ComponentTransform=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11}],9:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentTransformTarget=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=e("./Component.class"),u=e("./Utils.class"),c=e("./StormMath.class"),h=e("./Constants"),f=n.ComponentTransformTarget=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=h.Constants.COMPONENT_TYPES.TRANSFORM_TARGET,e.node=null,e.gl=null,e.mModelMatrix=$M16([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e.targetDistance=5,e.positionGoal=$V3([0,0,e.targetDistance]),e.positionTarget=$V3([0,0,0]),e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t,this.performMatrix()}},{key:"getMatrix",value:function(){return this.mModelMatrix}},{key:"setTargetDistance",value:function(e){this.targetDistance=e}},{key:"getTargetDistance",value:function(){return this.targetDistance}},{key:"setPositionGoal",value:function(e){this.positionGoal=e,this.performMatrix()}},{key:"getPositionGoal",value:function(){return this.positionGoal}},{key:"setPositionTarget",value:function(e){this.positionTarget=e,this.performMatrix()}},{key:"getPositionTarget",value:function(){return this.positionTarget}},{key:"reset",value:function(){this.positionGoal=$V3([0,0,this.targetDistance]),this.positionTarget=$V3([0,0,0]),this.performMatrix()}},{key:"yaw",value:function(e){var t=this.getPositionGoal().subtract(this.getPositionTarget()),n=u.Utils.cartesianToSpherical(t.normalize()),r=u.Utils.sphericalToCartesian(n.radius,n.lat,n.lng+e);this.setPositionGoal(this.getPositionTarget().add(r.x(this.getTargetDistance())))}},{key:"pitch",value:function(e){var t=this.getPositionGoal().subtract(this.getPositionTarget()),n=u.Utils.cartesianToSpherical(t.normalize()),r=u.Utils.sphericalToCartesian(n.radius,n.lat+e,n.lng);this.setPositionGoal(this.getPositionTarget().add(r.x(this.getTargetDistance())))}},{key:"performMatrix",value:function(){this.mModelMatrix=c.StormM16.makeLookAt(this.getPositionGoal().e[0],this.getPositionGoal().e[1],this.getPositionGoal().e[2],this.getPositionTarget().e[0],this.getPositionTarget().e[1],this.getPositionTarget().e[2],0,1,0)}}]),t}();r.ComponentTransformTarget=f,t.exports.ComponentTransformTarget=f}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11,"./StormMath.class":20,"./Utils.class":22}],10:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.Component_GPU=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();e("webclgl");var l=e("./Component.class"),u=e("./Constants"),c=n.Component_GPU=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.type=u.Constants.COMPONENT_TYPES.GPU,e.node=null,e.gl=null,e.gpufG=null,e.args={},e}return s(t,l.Component),a(t,[{key:"initialize",value:function(e,t){this.node=e,this.gl=t}},{key:"tick",value:function(e){this.tickArguments(),null!=this.gpufG&&this.gpufG.processKernels(),null!=this.gpufG&&this.gpufG.processGraphic(void 0)}},{key:"setGPUFor",value:function(){var e=this,t=arguments;for(var n in arguments[1]){var r=n.split(" ");if(null!=r&&r.length>1){var o=r[1];this.args[o]={fnvalue:arguments[1][n],updatable:null,splits:null,overrideDimensions:null}}arguments[1][n]=arguments[1][n]()}this.gpufG=new function(){return gpufor.apply(e,t)}}},{key:"getWebCLGL",value:function(){return this.gpufG.getWebCLGL()}},{key:"addArgument",value:function(e,t){this.args[e.split(" ")[1]]={fnvalue:t,updatable:null,splits:null,overrideDimensions:null},this.gpufG.addArg(e)}},{key:"setArg",value:function(e,t,n,r){var o=this.gpufG.setArg(e,t(),n,r);return this.args[e]={fnvalue:t,updatable:null,splits:n,overrideDimensions:r},o}},{key:"getComponentBufferArg",value:function(e,t){this.gpufG.getGPUForArg(e,t.gpufG),this.args[e]={fnvalue:null,updatable:null,splits:null,overrideDimensions:null}}},{key:"getArgs",value:function(){return this.args}},{key:"getAllArgs",value:function(){return this.gpufG.getAllArgs()}},{key:"getBuffers",value:function(){return this.gpufG._argsValues}},{key:"setArgUpdatable",value:function(e,t){this.args[e].updatable=t}},{key:"tickArguments",value:function(){for(var e in this.args)if(!0===this.args[e].updatable){var t=this.args[e];this.gpufG.setArg(e,t.fnvalue(),t.splits,t.overrideDimensions)}}}]),t}();r.Component_GPU=c,t.exports.Component_GPU=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Component.class":3,"./Constants":11,webclgl:1}],11:[function(e,t,n){(function(e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=n.Constants={EVENT_TYPES:{KEY_DOWN:0,KEY_UP:1,MOUSE_DOWN:2,MOUSE_UP:3,MOUSE_MOVE:4,MOUSE_WHEEL:5},COMPONENT_TYPES:{KEYBOARD_EVENTS:0,MOUSE_EVENTS:1,TRANSFORM:2,TRANSFORM_TARGET:3,CONTROLLER_TRANSFORM_TARGET:4,PROJECTION:5,GPU:6},PROJECTION_TYPES:{PERSPECTIVE:0,ORTHO:1},VIEW_TYPES:{LEFT:0,RIGHT:1,FRONT:2,BACK:3,TOP:4,BOTTOM:5},BLENDING_MODES:{ZERO:"ZERO",ONE:"ONE",SRC_COLOR:"SRC_COLOR",ONE_MINUS_SRC_COLOR:"ONE_MINUS_SRC_COLOR",DST_COLOR:"DST_COLOR",ONE_MINUS_DST_COLOR:"ONE_MINUS_DST_COLOR",SRC_ALPHA:"SRC_ALPHA",ONE_MINUS_SRC_ALPHA:"ONE_MINUS_SRC_ALPHA",DST_ALPHA:"DST_ALPHA",ONE_MINUS_DST_ALPHA:"ONE_MINUS_DST_ALPHA",SRC_ALPHA_SATURATE:"SRC_ALPHA_SATURATE",CONSTANT_COLOR:"CONSTANT_COLOR",ONE_MINUS_CONSTANT_COLOR:"ONE_MINUS_CONSTANT_COLOR",CONSTANT_ALPHA:"CONSTANT_ALPHA",ONE_MINUS_CONSTANT_ALPHA:"ONE_MINUS_CONSTANT_ALPHA"},BLENDING_EQUATION_TYPES:{FUNC_ADD:"FUNC_ADD",FUNC_SUBTRACT:"FUNC_SUBTRACT",FUNC_REVERSE_SUBTRACT:"FUNC_REVERSE_SUBTRACT"},DRAW_MODES:{POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6}};e.Constants=r,t.exports.Constants=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],12:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.Mesh=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./Utils.class"),a=n.Mesh=function(){function e(){o(this,e),this._obj={},this._textures={},this.objIndex=null,this.indexMax=0}return i(e,[{key:"loadPoint",value:function(){return this._obj.vertexArray=[0,0,0,0],this._obj.normalArray=[0,1,0,0],this._obj.textureArray=[0,0,0,0],this._obj.textureUnitArray=[0],this._obj.indexArray=[0],this._obj}},{key:"loadTriangle",value:function(e){var t=void 0!==e&&void 0!==e.scale?e.scale:1,n=void 0!==e&&void 0!==e.side?e.side:1;return this._obj.vertexArray=[0,0,0,1,n/2*t,0,-1*t,1,-n/2*t,0,-1*t,1],this._obj.normalArray=[0,0,1,1,0,0,1,1,0,0,1,1],this._obj.textureArray=[0,0,0,1,1,0,0,1,1,1,0,1],this._obj.textureUnitArray=[0,0,0],this._obj.indexArray=[0,1,2],this._obj}},{key:"loadQuad",value:function(e,t){var n=void 0===e?.5:e,r=void 0===t?.5:t;return this._obj={},this._obj.vertexArray=[-n,-r,0,1,n,-r,0,1,n,r,0,1,-n,r,0,1],this._obj.normalArray=[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1],this._obj.textureArray=[0,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1],this._obj.textureUnitArray=[0,0,0,0],this._obj.indexArray=[0,1,2,0,2,3],this._obj}},{key:"loadCircle",value:function(e){this._obj={vertexArray:[],normalArray:[],textureArray:[],textureUnitArray:[],indexArray:[]},this.objIndex=[],this.indexMax=0;for(var t=void 0!==e&&void 0!==e.segments?e.segments:6,n=void 0!==e&&void 0!==e.radius?e.radius:.5,r=360/t,o=360/r,i=function(e){return Math.cos((new s.Utils).degToRad(e))}.bind(this),a=function(e){return Math.sin((new s.Utils).degToRad(e))}.bind(this),l=1,u=o;l<=u;l++){var c=r*l,h=$V3([i(c)*n,0,a(c)*n]),f=$V3([i(c-r)*n,0,a(c-r)*n]),d=$V3([0,0,0]),g=f.subtract(h).cross(d.subtract(h)).normalize(),_=$V3([c/360,0,0]),v=$V3([(c-r)/360,0,0]),p=$V3([0,0,0]),m=this.testIfInIndices(this._obj,h,g,_),y=this.testIfInIndices(this._obj,f,g,v),b=this.testIfInIndices(this._obj,d,g,p);this._obj.indexArray.push(m,y,b)}return this._obj}},{key:"testIfInIndices",value:function(e,t,n,r){for(var o=void 0,i=0,s=this.objIndex.length;i<s;i++)this.objIndex[i].v.e[0]===t.e[0]&&this.objIndex[i].v.e[1]===t.e[1]&&this.objIndex[i].v.e[2]===t.e[2]&&(o=this.objIndex[i].i);return void 0===o&&(o=this.indexMax,this.objIndex.push({i:o,v:$V3([t.e[0],t.e[1],t.e[2]])}),this.indexMax++,e.vertexArray.push(t.e[0],t.e[1],t.e[2],1),e.normalArray.push(n.e[0],n.e[1],n.e[2],1),e.textureArray.push(t.e[0]+.5,t.e[2]+.5,t.e[2]+.5,1),e.textureUnitArray.push(0)),o}},{key:"loadBox",value:function(){this._obj={};var e=new Float32Array([.5,.5,.5]);return this._obj.vertexArray=[-1*e[0],-1*e[1],1*e[2],1,1*e[0],-1*e[1],1*e[2],1,1*e[0],1*e[1],1*e[2],1,-1*e[0],1*e[1],1*e[2],1,-1*e[0],-1*e[1],-1*e[2],1,-1*e[0],1*e[1],-1*e[2],1,1*e[0],1*e[1],-1*e[2],1,1*e[0],-1*e[1],-1*e[2],1,-1*e[0],1*e[1],-1*e[2],1,-1*e[0],1*e[1],1*e[2],1,1*e[0],1*e[1],1*e[2],1,1*e[0],1*e[1],-1*e[2],1,-1*e[0],-1*e[1],-1*e[2],1,1*e[0],-1*e[1],-1*e[2],1,1*e[0],-1*e[1],1*e[2],1,-1*e[0],-1*e[1],1*e[2],1,1*e[0],-1*e[1],-1*e[2],1,1*e[0],1*e[1],-1*e[2],1,1*e[0],1*e[1],1*e[2],1,1*e[0],-1*e[1],1*e[2],1,-1*e[0],-1*e[1],-1*e[2],1,-1*e[0],-1*e[1],1*e[2],1,-1*e[0],1*e[1],1*e[2],1,-1*e[0],1*e[1],-1*e[2],1],this._obj.normalArray=[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,-1,1,0,0,-1,1,0,0,-1,1,0,0,-1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,-1,0,1,0,-1,0,1,0,-1,0,1,0,-1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,-1,0,0,1,-1,0,0,1,-1,0,0,1,-1,0,0,1],this._obj.textureArray=[0,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,1,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1],this._obj.textureUnitArray=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this._obj.indexArray=[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23],this._obj}},{key:"loadObj",value:function(e,t){for(var n="",r=e.split("/"),o=0,i=r.length-1;o<i;o++)n=n+r[o]+"/";var s=new XMLHttpRequest;s.open("GET",e,!0),s.responseType="blob",s.onload=function(e){var t=new FileReader;t.onload=function(e,t){var r=t.target.result;this.loadObjFromSourceText({sourceText:r,objDirectory:n}),void 0!==e&&"function"==typeof e&&e(this._obj,this._textures)}.bind(this,e),t.readAsText(s.response)}.bind(this,t),s.send(null)}},{key:"loadObjFromSourceText",value:function(e){this._obj={},this._textures={};var t=void 0,n=void 0;t=void 0!==e.sourceText?e.sourceText:void 0,n=void 0!==e.objDirectory?e.objDirectory:void 0;var r=t.split("\r\n");if(1===r.length&&(r=t.split("\n")),null!=r[0].match(/OBJ/gim)){var o=[],i=[],s=[],a=[],l=[],u=[],c=[],h=[],f=[],d=[],g=0,_=[],v=0,p=0,m=!1,y=[],b=[],E=[],C=[],T=[],x=[],P=[],L=[],A=[],w=0,R=0,S=0,k=[],M=0,O={},F=[-1,0];O._unnamed=F;for(var N="",G="",U=0,B=r.length;U<B;U++){var D=r[U].replace(/\t+/gi," ").replace(/\s+$/gi,"").replace(/\s+/gi," ");if("#"!==D[0]){var W=D.split(" ");if("mtllib"===W[0]&&(N=W[1]),"g"===W[0]&&(F=[_.length,0],O[W[1]]=F),"v"===W[0]&&(y[w]=parseFloat(W[1]),b[w]=parseFloat(W[2]),E[w]=parseFloat(W[3]),w++),"vn"===W[0]&&(C[R]=parseFloat(W[1]),T[R]=parseFloat(W[2]),x[R]=parseFloat(W[3]),R++),"vt"===W[0]&&(P[S]=parseFloat(W[1]),L[S]=parseFloat(W[2]),A[S]=parseFloat(W[3]),S++),"usemtl"===W[0]&&(G=W[1],this._textures[g]={fileUrl:n+N,materialName:G},g++),"f"===W[0]){4!==W.length&&console.log("*** Error: face '"+D+"' not handled");for(var j=1;j<4;++j){m=!0;var V=W[j].split("/");if(void 0===k[W[j]]){var I=void 0,Y=void 0,X=void 0;if(1===V.length)Y=I=parseInt(V[0])-1,X=I;else{if(3!==V.length)return null;I=parseInt(V[0])-1,X=parseInt(V[1])-1,Y=parseInt(V[2])-1}d[v]=g-1,o[v]=0,i[v]=0,s[v]=0,I<E.length&&(o[v]=y[I],i[v]=b[I],s[v]=E[I]),c[v]=0,h[v]=0,f[v]=0,X<A.length&&(c[v]=P[X],h[v]=L[X],f[v]=A[X]),a[v]=0,l[v]=0,u[v]=1,Y<x.length&&(a[v]=C[Y],l[v]=T[Y],u[v]=x[Y]),v++,k[W[j]]=M,M++}_[p]=k[W[j]],p++,F[1]++}}}}if(!0===m){this._obj.vertexArray=new Float32Array(4*o.length);for(var H=0,z=o.length;H<z;H++){var K=4*H;this._obj.vertexArray[K]=o[H],this._obj.vertexArray[K+1]=i[H],this._obj.vertexArray[K+2]=s[H],this._obj.vertexArray[K+3]=1}this._obj.normalArray=new Float32Array(4*a.length);for(var q=0,$=a.length;q<$;q++){var J=4*q;this._obj.normalArray[J]=a[q],this._obj.normalArray[J+1]=l[q],this._obj.normalArray[J+2]=u[q],this._obj.normalArray[J+3]=1}this._obj.textureArray=new Float32Array(4*c.length);for(var Z=0,Q=c.length;Z<Q;Z++){var ee=4*Z;this._obj.textureArray[ee]=c[Z],this._obj.textureArray[ee+1]=h[Z],this._obj.textureArray[ee+2]=f[Z],this._obj.textureArray[ee+3]=1}this._obj.textureUnitArray=d,this._obj.indexArray=_}}else alert("Not OBJ file")}}]),e}();r.Mesh=a,t.exports.Mesh=a}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Utils.class":22}],13:[function(e,t,n){(function(e){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n.Node=function(){function e(){r(this,e),this._components={},this._name=null,this._gl=null,this._enabled=!0,this.onTick=null}return o(e,[{key:"initialize",value:function(e,t){this._name=e,this._gl=t}},{key:"addComponent",value:function(e){this._components[e.type]=e,this._components[e.type].initialize(this,this._gl)}},{key:"getComponent",value:function(e){return this._components[e]}},{key:"getComponents",value:function(){return this._components}},{key:"setEnabled",value:function(e){this._enabled=e}},{key:"isEnabled",value:function(){return this._enabled}},{key:"setName",value:function(e){this._name=e}},{key:"getName",value:function(){return this._name}}]),e}();e.Node=i,t.exports.Node=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],14:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.Grid=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("../../Utils.class"),a=e("../../ComponentTransform.class"),l=e("../../Component_GPU.class"),u=e("../../Mesh.class"),c=e("../../Constants"),h=n.Grid=function(){function e(t){o(this,e),this._sce=t,this._project=this._sce.getLoadedProject(),this._gl=this._project.getActiveStage().getWebGLContext(),this._utils=new s.Utils,this.node=new Node,this.node.setName("grid"),this._project.getActiveStage().addNode(this.node),this.mesh=(new u.Mesh).loadBox(),this.comp_transform=new a.ComponentTransform,this.node.addComponent(this.comp_transform),this.comp_renderer=new l.Component_GPU,this.node.addComponent(this.comp_renderer),this.gridColor=$V3([.3,.3,.3])}return i(e,[{key:"generate",value:function(e,t){this.gridEnabled=!0,this.size=void 0!==e&&null!==e?e:this.size,this.separation=void 0!==t&&null!==t?t:this.separation,this.countLines=this.size/this.separation+1,this.countLines*=2;var n=-this.size/2,r=this.size/2,o=-this.size/2,i=this.size/2,s=n,a=o,l=[],u=[],h=[];this.id=0;for(var f=0,d=this.countLines;f<d;f++)a<=i?(l.push(n,0,a,1,r,0,a,1),a+=this.separation):(l.push(s,0,o,1,s,0,i,1),s+=this.separation),u.push(this.gridColor.e[0],this.gridColor.e[1],this.gridColor.e[2],1,this.gridColor.e[0],this.gridColor.e[1],this.gridColor.e[2],1),h.push(this.id,this.id+1),this.id+=2;l.push(0,0,0,1,10,0,0,1),u.push(1,0,0,1,1,0,0,1),h.push(this.id,this.id+1),this.id+=2,l.push(0,0,0,1,0,10,0,1),u.push(0,1,0,1,0,1,0,1),h.push(this.id,this.id+1),this.id+=2,l.push(0,0,0,1,0,0,10,1),u.push(0,0,1,1,0,0,1,1),h.push(this.id,this.id+1),this.comp_renderer.setGPUFor(this.comp_renderer.gl,{"float4*attr vertexPos":function(){return l}.bind(this),"float4*attr vertexColor":function(){return u}.bind(this),indices:function(){return h}.bind(this),"mat4 PMatrix":function(){return this._project.getActiveStage().getActiveCamera().getComponent(c.Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e}.bind(this),"mat4 cameraWMatrix":function(){return this._project.getActiveStage().getActiveCamera().getComponent(c.Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e}.bind(this),"mat4 nodeWMatrix":function(){return this.node.getComponent(c.Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e}.bind(this)},{type:"GRAPHIC",config:[["RGB"],"varying vec4 vVC;\n","vec4 vp = vertexPos[];\nvec4 vc = vertexColor[];\nvVC = vc;gl_Position = PMatrix * cameraWMatrix * nodeWMatrix * vp;\n","varying vec4 vVC;\n","return [vVC];\n"],drawMode:1,depthTest:!0,blend:!0,blendEquation:c.Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,blendSrcMode:c.Constants.BLENDING_MODES.SRC_ALPHA,blendDstMode:c.Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA}),this.comp_renderer.setArgUpdatable("PMatrix",!0),this.comp_renderer.setArgUpdatable("cameraWMatrix",!0),this.comp_renderer.setArgUpdatable("nodeWMatrix",!0),this.comp_renderer.getComponentBufferArg("RGB",this._project.getActiveStage().getActiveCamera().getComponent(c.Constants.COMPONENT_TYPES.GPU))}}]),e}();r.Grid=h,t.exports.Grid=h}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../ComponentTransform.class":8,"../../Component_GPU.class":10,"../../Constants":11,"../../Mesh.class":12,"../../Utils.class":22}],15:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.SimpleCamera=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("../../ComponentTransformTarget.class"),a=e("../../ComponentProjection.class"),l=e("../../ComponentControllerTransformTarget.class"),u=e("../../Component_GPU.class"),c=e("../../ComponentKeyboardEvents.class"),h=e("../../ComponentMouseEvents.class"),f=e("../../Node.class"),d=e("../../Constants"),g=function(){function e(t,n){var r=this;o(this,e);var i=t,g=i.getLoadedProject();this._onkeydown=void 0!==n&&void 0!==n.onkeydown&&null!==n.onkeydown?n.onkeydown:null,this._onkeyup=void 0!==n&&void 0!==n.onkeyup&&null!==n.onkeyup?n.onkeyup:null,this._onmousedown=void 0!==n&&void 0!==n.onmousedown&&null!==n.onmousedown?n.onmousedown:null,this._onmouseup=void 0!==n&&void 0!==n.onmouseup&&null!==n.onmouseup?n.onmouseup:null,this._onmousemove=void 0!==n&&void 0!==n.onmousemove&&null!==n.onmousemove?n.onmousemove:null,this._onmousewheel=void 0!==n&&void 0!==n.onmousewheel&&null!==n.onmousewheel?n.onmousewheel:null,this._useAltKey=!0,this.altKeyPressed=!1,this._preventMove=!1,this.camera=new f.Node,this.camera.setName("simple camera"),g.getActiveStage().addNode(this.camera),g.getActiveStage().setActiveCamera(this.camera),this.comp_transformTarget=new s.ComponentTransformTarget,this.camera.addComponent(this.comp_transformTarget),this.comp_transformTarget.setTargetDistance(.5),this.comp_projection=new a.ComponentProjection,this.camera.addComponent(this.comp_projection),this.comp_controllerTransformTarget=new l.ComponentControllerTransformTarget,this.camera.addComponent(this.comp_controllerTransformTarget),this.comp_screenEffects=new u.Component_GPU,this.camera.addComponent(this.comp_screenEffects),this.comp_screenEffects.setGPUFor(this.comp_screenEffects.gl,{"float4* RGB":function(){return new Float32Array(i.getCanvas().width*i.getCanvas().width*4)}},{type:"KERNEL",name:"CAMERA_RGB_KERNEL",viewSource:!1,config:["n",void 0,"","vec4 color = RGB[n];\nreturn color;\n"],drawMode:4,depthTest:!1,blend:!1,blendEquation:d.Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,blendSrcMode:d.Constants.BLENDING_MODES.ONE,blendDstMode:d.Constants.BLENDING_MODES.ZERO}),this.comp_screenEffects.gpufG.onPostProcessKernel(0,function(){}),this.comp_keyboardEvents=new c.ComponentKeyboardEvents,this.camera.addComponent(this.comp_keyboardEvents),this.comp_keyboardEvents.onkeydown(function(e){var t=String.fromCharCode(e.keyCode);"W"===t&&r.comp_controllerTransformTarget.forward(),"S"===t&&r.comp_controllerTransformTarget.backward(),"A"!==t&&"%"!==t||r.comp_controllerTransformTarget.strafeLeft(),"D"!==t&&"'"!==t||r.comp_controllerTransformTarget.strafeRight(),"E"!==t&&"&"!==t||r.comp_controllerTransformTarget.strafeFront(),"C"!==t&&"("!==t||r.comp_controllerTransformTarget.strafeBack(),"L"===t&&r.setView(d.Constants.VIEW_TYPES.LEFT),"R"===t&&r.setView(d.Constants.VIEW_TYPES.RIGHT),"F"===t&&r.setView(d.Constants.VIEW_TYPES.FRONT),"B"===t&&r.setView(d.Constants.VIEW_TYPES.BACK),"T"===t&&r.setView(d.Constants.VIEW_TYPES.TOP),"P"===t&&r.comp_projection.setProjection(d.Constants.PROJECTION_TYPES.PERSPECTIVE),"O"===t&&r.comp_projection.setProjection(d.Constants.PROJECTION_TYPES.ORTHO),!0===e.altKey&&(r.altKeyPressed=!0),null!=r._onkeydown&&r._onkeydown()}),this.comp_keyboardEvents.onkeyup(function(e){var t=String.fromCharCode(e.keyCode);"W"===t&&r.comp_controllerTransformTarget.stopForward(),"S"===t&&r.comp_controllerTransformTarget.stopBackward(),"A"!==t&&"%"!==t||r.comp_controllerTransformTarget.stopStrafeLeft(),"D"!==t&&"'"!==t||r.comp_controllerTransformTarget.stopStrafeRight(),"E"!==t&&"&"!==t||r.comp_controllerTransformTarget.stopStrafeFront(),"C"!==t&&"("!==t||r.comp_controllerTransformTarget.stopStrafeBack(),!1===e.altKey&&(r.altKeyPressed=!1),null!=r._onkeyup&&r._onkeyup()});var _=new h.ComponentMouseEvents;this.camera.addComponent(_),_.onmousedown(function(e){r.comp_controllerTransformTarget.mouseDown(e),!0===e.altKey&&(r.altKeyPressed=!0),null!=r._onmousedown&&r._onmousedown()}),_.onmouseup(function(e){r.comp_controllerTransformTarget.mouseUp(e),!1===e.altKey&&(r.altKeyPressed=!1),null!=r._onmouseup&&r._onmouseup()}),_.onmousemove(function(e,t){null!=r._onmousemove&&r._onmousemove(),!1===r._preventMove&&((r.comp_projection.getProjection()===d.Constants.PROJECTION_TYPES.PERSPECTIVE||!0===r._useAltKey&&!0===r.altKeyPressed||!1===r._useAltKey)&&r.comp_controllerTransformTarget.mouseMove(e),!0===r.comp_controllerTransformTarget.isRightBtnActive()&&r.comp_projection.getProjection()===d.Constants.PROJECTION_TYPES.ORTHO&&!0===r.altKeyPressed&&(t.e[2]>0?r.comp_projection.setFov(r.comp_projection.getFov()*(1+Math.abs(.005*t.e[2]))):r.comp_projection.setFov(r.comp_projection.getFov()/(1+Math.abs(.005*t.e[2])))))}),_.onmousewheel(function(e,t){void 0!==e.wheelDeltaY&&e.wheelDeltaY>=0||void 0!==e.deltaY&&e.deltaY<=0?r.comp_projection.setFov(r.comp_projection.getFov()/1.1):r.comp_projection.setFov(1.1*r.comp_projection.getFov()),r.comp_projection.getProjection()===d.Constants.PROJECTION_TYPES.ORTHO&&(r.comp_transformTarget.setPositionTarget(r.comp_transformTarget.getPositionTarget().add(t)),r.comp_transformTarget.setPositionGoal(r.comp_transformTarget.getPositionGoal().add(t))),null!=r._onmousewheel&&r._onmousewheel()})}return i(e,[{key:"setView",value:function(e){switch(this.comp_projection.setProjection(d.Constants.PROJECTION_TYPES.ORTHO),this.comp_transformTarget.reset(),e){case d.Constants.VIEW_TYPES.LEFT:this.comp_transformTarget.yaw(90);break;case d.Constants.VIEW_TYPES.RIGHT:this.comp_transformTarget.yaw(-90);break;case d.Constants.VIEW_TYPES.FRONT:case d.Constants.VIEW_TYPES.BACK:break;case d.Constants.VIEW_TYPES.TOP:this.comp_transformTarget.pitch(-89.9);break;case d.Constants.VIEW_TYPES.BOTTOM:this.comp_transformTarget.pitch(90)}}},{key:"setLeftButtonAction",value:function(e){this.comp_controllerTransformTarget.setLeftButtonAction(e)}},{key:"setMiddleButtonAction",value:function(e){this.comp_controllerTransformTarget.setMiddleButtonAction(e)}},{key:"setRightButtonAction",value:function(e){this.comp_controllerTransformTarget.setRightButtonAction(e)}},{key:"isAltKeyEnabled",value:function(){return this._useAltKey}},{key:"isAltKeyPressed",value:function(){return this.altKeyPressed}},{key:"setVelocity",value:function(e){this.comp_controllerTransformTarget.setVelocity(e)}},{key:"setFov",value:function(e){this.comp_projection.setFov(e)}},{key:"getFov",value:function(){return this.comp_projection.getFov()}}],[{key:"preventMove",value:function(e){this._preventMove=e}},{key:"useAltKey",value:function(e){this._useAltKey=e}}]),e}();n.SimpleCamera=g,r.SimpleCamera=g,t.exports.SimpleCamera=g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../ComponentControllerTransformTarget.class":4,"../../ComponentKeyboardEvents.class":5,"../../ComponentMouseEvents.class":6,"../../ComponentProjection.class":7,"../../ComponentTransformTarget.class":9,"../../Component_GPU.class":10,"../../Constants":11,"../../Node.class":13}],16:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.SimpleNode=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("../../ComponentTransform.class"),a=e("../../Component_GPU.class"),l=e("../../VFP_RGB.class"),u=e("../../Constants"),c=n.SimpleNode=function(){function e(t){o(this,e),this._sce=t,this._project=this._sce.getLoadedProject(),this.node=new Node,this._project.getActiveStage().addNode(this.node),this._mesh=null;var n=new s.ComponentTransform;this.node.addComponent(n),this.comp_renderer=new a.Component_GPU,this.node.addComponent(this.comp_renderer)}return i(e,[{key:"setMesh",value:function(e){var t=this;this._mesh=e,this.comp_renderer.setGPUFor(this.comp_renderer.gl,{"float4*attr vertexPos":function(){return t._mesh.vertexArray},"float4*attr vertexNormal":function(){return t._mesh.normalArray},"float4*attr vertexTexture":function(){return t._mesh.textureArray},"float*attr vertexTextureUnit":function(){return t._mesh.textureUnitArray},indices:function(){return t._mesh.indexArray},"mat4 PMatrix":function(){return t._project.getActiveStage().getActiveCamera().getComponent(u.Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e},"mat4 cameraWMatrix":function(){return t._project.getActiveStage().getActiveCamera().getComponent(u.Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e},"mat4 nodeWMatrix":function(){return t.node.getComponent(u.Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e},"float nodesSize":function(){return 30},"float4* texAlbedo":function(){return t._mesh.vertexArray}},{type:"GRAPHIC",config:new l.VFP_RGB(1).getSrc(),drawMode:4,depthTest:!0,blend:!0,blendEquation:u.Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,blendSrcMode:u.Constants.BLENDING_MODES.SRC_ALPHA,blendDstMode:u.Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA}),this.comp_renderer.setArgUpdatable("PMatrix",!0),this.comp_renderer.setArgUpdatable("cameraWMatrix",!0),this.comp_renderer.setArgUpdatable("nodeWMatrix",!0),this.comp_renderer.getComponentBufferArg("RGB",this._project.getActiveStage().getActiveCamera().getComponent(u.Constants.COMPONENT_TYPES.GPU)),this.comp_renderer.gpufG.onPreProcessGraphic(0,function(){})}},{key:"setImage",value:function(e){var t=this,n=new Image;n.onload=function(){t.comp_renderer.setArg("texAlbedo",function(){return n})},n.src=e}}]),e}();r.SimpleNode=c,t.exports.SimpleNode=c}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../ComponentTransform.class":8,"../../Component_GPU.class":10,"../../Constants":11,"../../VFP_RGB.class":23}],17:[function(e,t,n){(function(e){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n.Project=function(){function e(){r(this,e),this.stages=[],this.activeStage=null,this.gl=null}return o(e,[{key:"setActiveStage",value:function(e){this.activeStage=e,this.activeStage.setWebGLContext(this.gl)}},{key:"getActiveStage",value:function(){return this.activeStage}},{key:"addStage",value:function(e){this.stages.push(e)}},{key:"setWebGLContext",value:function(e){this.gl=e}}]),e}();e.Project=i,t.exports.Project=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],18:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.SCE=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./SystemEvents.class"),a=e("./Utils.class"),l=e("./Constants"),u=n.SCE=function(){function e(){o(this,e),this.target=null,this.project=null,this.dimensions=null,this.canvas=null,this.gl=null,this._UI=null,this._enableUI=null,this._events=null,this.sceDirectory=document.querySelector('script[src$="SCE.class.js"]'),null===this.sceDirectory&&(this.sceDirectory=document.querySelector('script[src$="SCEJS.min.js"]')),this.sceDirectory=this.sceDirectory.getAttribute("src");var t=this.sceDirectory.split("/").pop();this.sceDirectory=this.sceDirectory.replace("/"+t,"")}return i(e,[{key:"initialize",value:function(e){if(this.target=void 0!==e.target?e.target:void 0,this.dimensions=void 0!==e.dimensions?e.dimensions:{width:512,height:512},this._enableUI=void 0!==e.enableUI&&e.enableUI,null!=this.target){if(this.canvas=document.createElement("canvas"),this.target.appendChild(this.canvas),this.setDimensions(this.dimensions.width,this.dimensions.height),void 0!==e.gl&&null!==e.gl)this.gl=e.gl;else if(!(this.gl=a.Utils.getWebGLContextFromCanvas(this.canvas)))return alert("No WebGLRenderingContext"),!1}else alert("Target DIV required")}},{key:"loadProject",value:function(e){this.project=e,this.project.setWebGLContext(this.gl),!0===this._enableUI&&(this._UI=new UI(this.project).render(this.target,this.canvas)),this._events=new s.SystemEvents(this,this.canvas),this._events.initialize()}},{key:"getLoadedProject",value:function(){return this.project}},{key:"getCanvas",value:function(){return this.canvas}},{key:"getEvents",value:function(){return this._events}},{key:"setDimensions",value:function(e,t){if(this.dimensions={width:e,height:t},this.canvas.setAttribute("width",this.dimensions.width),this.canvas.setAttribute("height",this.dimensions.height),null!=this.project&&null!=this.project.getActiveStage()){var n=this.project.getActiveStage().getActiveCamera();if(null!=n){var r=n.getComponent(l.Constants.COMPONENT_TYPES.PROJECTION),o=n.getComponent(l.Constants.COMPONENT_TYPES.GPU);r.setResolution(this.dimensions.width,this.dimensions.width),o.setArg("RGB",function(){return new Float32Array(this.dimensions.width*this.dimensions.width*4)}.bind(this))}}}},{key:"getDimensions",value:function(){return this.dimensions}}]),e}();r.SCE=u,t.exports.SCE=u}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Constants":11,"./SystemEvents.class":21,"./Utils.class":22}],19:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.Stage=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./Constants"),a=n.Stage=function(){function e(){o(this,e),this.nodes=[],this.activeCamera=null,this.selectedNode=null,this.paused=!1,this.backgroundColor=[0,0,0,1],this.gl=null,this._ontick=null}return i(e,[{key:"setActiveCamera",value:function(e){this.activeCamera=e}},{key:"getActiveCamera",value:function(){return this.activeCamera}},{key:"setSelectedNode",value:function(e){this.selectedNode=e}},{key:"getSelectedNode",value:function(){return this.selectedNode}},{key:"addNode",value:function(e){this.nodes.push(e),e.initialize(null!=e.getName()?e.getName():"node "+(this.nodes.length-1),this.gl)}},{key:"removeNode",value:function(e){for(var t=0;t<this.nodes.length;t++)if(this.nodes[t]===e){this.nodes.splice(t,1);break}}},{key:"getNodes",value:function(){return this.nodes}},{key:"render",value:function(e){this._ontick=e,this.paused=!1,this.setBackgroundColor(this.backgroundColor),this.tick()}},{key:"pause",value:function(){this.paused=!0}},{key:"setWebGLContext",value:function(e){this.gl=e}},{key:"setBackgroundColor",value:function(e){this.backgroundColor=e}},{key:"getBackgroundColor",value:function(){return this.backgroundColor}},{key:"getWebGLContext",value:function(){return this.gl}},{key:"tick",value:function(){if(null!=this.activeCamera){void 0!==this._ontick&&null!==this._ontick&&this._ontick();var e=this.activeCamera.getComponent(s.Constants.COMPONENT_TYPES.PROJECTION).getResolution();this.gl.viewport(0,0,e.width,e.height),this.gl.clearColor(this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],this.backgroundColor[3]),this.gl.clearDepth(1),this.gl.depthFunc(this.gl.LEQUAL);var t=this.activeCamera.getComponent(s.Constants.COMPONENT_TYPES.GPU);void 0!==t&&null!==t&&t.gpufG.fillArg("RGB",[this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],this.backgroundColor[3]]);for(var n=0,r=this.nodes.length;n<r;n++)if(this.nodes[n]!==this.activeCamera){for(var o in this.nodes[n].getComponents()){var i=this.nodes[n].getComponent(o);null!=i.tick&&i.tick()}null!=this.nodes[n].onTick&&this.nodes[n].onTick()}for(var a=0,l=this.nodes.length;a<l;a++)if(this.nodes[a]!==this.activeCamera)for(var u in this.nodes[a].getComponents()){var c=this.nodes[a].getComponent(u);if(null!=c.gpufG)for(var h in c.gpufG.vertexFragmentPrograms){var f=c.gpufG.vertexFragmentPrograms[h],d=WebCLGLUtils.getOutputBuffers(f,c.gpufG._argsValues);!0===f.enabled&&null!=d&&(c.gpufG._gl.bindFramebuffer(c.gpufG._gl.FRAMEBUFFER,d[0].fBuffer),c.gpufG._gl.clear(c.gpufG._gl.DEPTH_BUFFER_BIT),c.gpufG._gl.bindFramebuffer(c.gpufG._gl.FRAMEBUFFER,d[0].fBufferTemp),c.gpufG._gl.clear(c.gpufG._gl.DEPTH_BUFFER_BIT))}}for(var g in this.activeCamera.getComponents()){var _=this.activeCamera.getComponent(g);null!=_.tick&&_.tick()}}}}]),e}();r.Stage=a,t.exports.Stage=a}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Constants":11}],20:[function(e,t,n){(function(e){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e){return new a(e)}function i(e){return new l(e)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n.$M16=o,n.$V3=i;var a=n.StormM16=function(){function e(t){r(this,e),this.e=null,this.e=void 0!==t&&null!==t?new Float32Array(t):new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return s(e,[{key:"x",value:function(t){return o(t instanceof e?[this.e[0]*t.e[0]+this.e[1]*t.e[4]+this.e[2]*t.e[8]+this.e[3]*t.e[12],this.e[0]*t.e[1]+this.e[1]*t.e[5]+this.e[2]*t.e[9]+this.e[3]*t.e[13],this.e[0]*t.e[2]+this.e[1]*t.e[6]+this.e[2]*t.e[10]+this.e[3]*t.e[14],this.e[0]*t.e[3]+this.e[1]*t.e[7]+this.e[2]*t.e[11]+this.e[3]*t.e[15],this.e[4]*t.e[0]+this.e[5]*t.e[4]+this.e[6]*t.e[8]+this.e[7]*t.e[12],this.e[4]*t.e[1]+this.e[5]*t.e[5]+this.e[6]*t.e[9]+this.e[7]*t.e[13],this.e[4]*t.e[2]+this.e[5]*t.e[6]+this.e[6]*t.e[10]+this.e[7]*t.e[14],this.e[4]*t.e[3]+this.e[5]*t.e[7]+this.e[6]*t.e[11]+this.e[7]*t.e[15],this.e[8]*t.e[0]+this.e[9]*t.e[4]+this.e[10]*t.e[8]+this.e[11]*t.e[12],this.e[8]*t.e[1]+this.e[9]*t.e[5]+this.e[10]*t.e[9]+this.e[11]*t.e[13],this.e[8]*t.e[2]+this.e[9]*t.e[6]+this.e[10]*t.e[10]+this.e[11]*t.e[14],this.e[8]*t.e[3]+this.e[9]*t.e[7]+this.e[10]*t.e[11]+this.e[11]*t.e[15],this.e[12]*t.e[0]+this.e[13]*t.e[4]+this.e[14]*t.e[8]+this.e[15]*t.e[12],this.e[12]*t.e[1]+this.e[13]*t.e[5]+this.e[14]*t.e[9]+this.e[15]*t.e[13],this.e[12]*t.e[2]+this.e[13]*t.e[6]+this.e[14]*t.e[10]+this.e[15]*t.e[14],this.e[12]*t.e[3]+this.e[13]*t.e[7]+this.e[14]*t.e[11]+this.e[15]*t.e[15]]:[0,0,0,this.e[0]*t.e[0]+this.e[1]*t.e[1]+this.e[2]*t.e[2],0,0,0,this.e[4]*t.e[0]+this.e[5]*t.e[1]+this.e[6]*t.e[2],0,0,0,this.e[8]*t.e[0]+this.e[9]*t.e[1]+this.e[10]*t.e[2],0,0,0,this.e[12]*t.e[0]+this.e[13]*t.e[1]+this.e[14]*t.e[2]])}},{key:"transpose",value:function(){return o([this.e[0],this.e[4],this.e[8],this.e[12],this.e[1],this.e[5],this.e[9],this.e[13],this.e[2],this.e[6],this.e[10],this.e[14],this.e[3],this.e[7],this.e[11],this.e[15]])}},{key:"inverse",value:function(){var e=o(this.e).transpose().e,t=new Float32Array(12),n=new Float32Array(16);t[0]=e[10]*e[15],t[1]=e[11]*e[14],t[2]=e[9]*e[15],t[3]=e[11]*e[13],t[4]=e[9]*e[14],t[5]=e[10]*e[13],t[6]=e[8]*e[15],t[7]=e[11]*e[12],t[8]=e[8]*e[14],t[9]=e[10]*e[12],t[10]=e[8]*e[13],t[11]=e[9]*e[12],n[0]=t[0]*e[5]+t[3]*e[6]+t[4]*e[7],n[0]-=t[1]*e[5]+t[2]*e[6]+t[5]*e[7],n[1]=t[1]*e[4]+t[6]*e[6]+t[9]*e[7],n[1]-=t[0]*e[4]+t[7]*e[6]+t[8]*e[7],n[2]=t[2]*e[4]+t[7]*e[5]+t[10]*e[7],n[2]-=t[3]*e[4]+t[6]*e[5]+t[11]*e[7],n[3]=t[5]*e[4]+t[8]*e[5]+t[11]*e[6],n[3]-=t[4]*e[4]+t[9]*e[5]+t[10]*e[6],n[4]=t[1]*e[1]+t[2]*e[2]+t[5]*e[3],n[4]-=t[0]*e[1]+t[3]*e[2]+t[4]*e[3],n[5]=t[0]*e[0]+t[7]*e[2]+t[8]*e[3],n[5]-=t[1]*e[0]+t[6]*e[2]+t[9]*e[3],n[6]=t[3]*e[0]+t[6]*e[1]+t[11]*e[3],n[6]-=t[2]*e[0]+t[7]*e[1]+t[10]*e[3],n[7]=t[4]*e[0]+t[9]*e[1]+t[10]*e[2],n[7]-=t[5]*e[0]+t[8]*e[1]+t[11]*e[2],t[0]=e[2]*e[7],t[1]=e[3]*e[6],t[2]=e[1]*e[7],t[3]=e[3]*e[5],t[4]=e[1]*e[6],t[5]=e[2]*e[5],t[6]=e[0]*e[7],t[7]=e[3]*e[4],t[8]=e[0]*e[6],t[9]=e[2]*e[4],t[10]=e[0]*e[5],t[11]=e[1]*e[4],n[8]=t[0]*e[13]+t[3]*e[14]+t[4]*e[15],n[8]-=t[1]*e[13]+t[2]*e[14]+t[5]*e[15],n[9]=t[1]*e[12]+t[6]*e[14]+t[9]*e[15],n[9]-=t[0]*e[12]+t[7]*e[14]+t[8]*e[15],n[10]=t[2]*e[12]+t[7]*e[13]+t[10]*e[15],n[10]-=t[3]*e[12]+t[6]*e[13]+t[11]*e[15],n[11]=t[5]*e[12]+t[8]*e[13]+t[11]*e[14],n[11]-=t[4]*e[12]+t[9]*e[13]+t[10]*e[14],n[12]=t[2]*e[10]+t[5]*e[11]+t[1]*e[9],n[12]-=t[4]*e[11]+t[0]*e[9]+t[3]*e[10],n[13]=t[8]*e[11]+t[0]*e[8]+t[7]*e[10],n[13]-=t[6]*e[10]+t[9]*e[11]+t[1]*e[8],n[14]=t[6]*e[9]+t[11]*e[11]+t[3]*e[8],n[14]-=t[10]*e[11]+t[2]*e[8]+t[7]*e[9],n[15]=t[10]*e[10]+t[4]*e[8]+t[9]*e[9],n[15]-=t[8]*e[9]+t[11]*e[10]+t[5]*e[8];var r=e[0]*n[0]+e[1]*n[1]+e[2]*n[2]+e[3]*n[3];return o([n[0]*r,n[1]*r,n[2]*r,n[3]*r,n[4]*r,n[5]*r,n[6]*r,n[7]*r,n[8]*r,n[9]*r,n[10]*r,n[11]*r,n[12]*r,n[13]*r,n[14]*r,n[15]*r])}},{key:"getLeft",value:function(){return i([this.e[0],this.e[4],this.e[8]]).normalize()}},{key:"getUp",value:function(){return i([this.e[1],this.e[5],this.e[9]]).normalize()}},{key:"getForward",value:function(){return i([this.e[2],this.e[6],this.e[10]]).normalize()}},{key:"setRotation",value:function(e,t,n){return void 0!==n&&null!==n&&null!==n.e[0]?void 0===t||null===t||!0===t?this.x(o([1,0,0,0,0,Math.cos(e),-Math.sin(e),0,0,Math.sin(e),Math.cos(e),0,0,0,0,1])):o([1,0,0,0,0,Math.cos(e),-Math.sin(e),0,0,Math.sin(e),Math.cos(e),0,0,0,0,1]):void 0!==n&&null!==n&&null!==n.e[1]?void 0===t||null===t||!0===t?this.x(o([Math.cos(e),0,Math.sin(e),0,0,1,0,0,-Math.sin(e),0,Math.cos(e),0,0,0,0,1])):o([Math.cos(e),0,Math.sin(e),0,0,1,0,0,-Math.sin(e),0,Math.cos(e),0,0,0,0,1]):void 0!==n&&null!==n&&null!==n.e[2]?void 0===t||null===t||!0===t?this.x(o([Math.cos(e),-Math.sin(e),0,0,Math.sin(e),Math.cos(e),0,0,0,0,1,0,0,0,0,1])):o([Math.cos(e),-Math.sin(e),0,0,Math.sin(e),Math.cos(e),0,0,0,0,1,0,0,0,0,1]):void 0}},{key:"setRotationX",value:function(e,t){return this.setRotation(e,t,i([1,0,0]))}},{key:"setRotationY",value:function(e,t){return this.setRotation(e,t,i([0,1,0]))}},{key:"setRotationZ",value:function(e,t){return this.setRotation(e,t,i([0,0,1]))}},{key:"setScale",value:function(e,t,n){return void 0!==n&&null!==n&&null!==n.e[0]?void 0===t||null===t||!0===t?this.x(o([e,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])):o([e,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]):void 0!==n&&null!==n&&null!==n.e[1]?void 0===t||null===t||!0===t?this.x(o([1,0,0,0,0,e,0,0,0,0,1,0,0,0,0,1])):o([1,0,0,0,0,e,0,0,0,0,1,0,0,0,0,1]):void 0!==n&&null!==n&&null!==n.e[2]?void 0===t||null===t||!0===t?this.x(o([1,0,0,0,0,1,0,0,0,0,e,0,0,0,0,1])):o([1,0,0,0,0,1,0,0,0,0,e,0,0,0,0,1]):void 0}},{key:"setScaleX",value:function(e,t){return this.setScale(e,t,i([1,0,0]))}},{key:"setScaleY",value:function(e,t){return this.setScale(e,t,i([0,1,0]))}},{key:"setScaleZ",value:function(e,t){return this.setScale(e,t,i([0,0,1]))}},{key:"getPosition",value:function(){return i([this.e[3],this.e[7],this.e[11]])}},{key:"setPosition",value:function(e){return this.e[3]=e.e[0],this.e[7]=e.e[1],this.e[11]=e.e[2],this}}],[{key:"makeLookAt",value:function(e,t,n,r,s,a,l,u,c){var h=i([e,t,n]),f=i([r,s,a]),d=i([l,u,c]),g=h.subtract(f).normalize(),_=d.cross(g).normalize(),v=g.cross(_).normalize(),p=o([_.e[0],_.e[1],_.e[2],0,v.e[0],v.e[1],v.e[2],0,g.e[0],g.e[1],g.e[2],0,0,0,0,1]),m=o([1,0,0,-e,0,1,0,-t,0,0,1,-n,0,0,0,1]);return p.x(m)}},{key:"setPerspectiveProjection",value:function(e,t,n,r){var i=Math.tan(e*Math.PI/360)*n,s=-i,a=t*s,l=t*i;return o([2*n/(l-a),0,(l+a)/(l-a),0,0,2*n/(i-s),(i+s)/(i-s),0,0,0,-(r+n)/(r-n),-2*r*n/(r-n),0,0,-1,0])}},{key:"setOrthographicProjection",value:function(e,t,n,r,i,s){return o([2/(t-e),0,0,-(t+e)/(t-e),0,2/(r-n),0,-(r+n)/(r-n),0,0,-2/(s-i),-(s+i)/(s-i),0,0,0,1])}}]),e}();e.StormM16=a,t.exports.StormM16=a,e.$M16=o,t.exports.$M16=o;var l=n.StormV3=function(){function e(t){r(this,e),this.e=new Float32Array(t)}return s(e,[{key:"add",value:function(e){return i([this.e[0]+e.e[0],this.e[1]+e.e[1],this.e[2]+e.e[2]])}},{key:"cross",value:function(e){return i([this.e[1]*e.e[2]-this.e[2]*e.e[1],this.e[2]*e.e[0]-this.e[0]*e.e[2],this.e[0]*e.e[1]-this.e[1]*e.e[0]])}},{key:"distance",value:function(e){return Math.sqrt((this.e[0]-e.e[0])*(this.e[0]-e.e[0])+(this.e[1]-e.e[1])*(this.e[1]-e.e[1])+(this.e[2]-e.e[2])*(this.e[2]-e.e[2]))}},{key:"dot",value:function(e){return this.e[0]*e.e[0]+this.e[1]*e.e[1]+this.e[2]*e.e[2]}},{key:"equal",value:function(e){return this.e[0]===e.e[0]&&this.e[1]===e.e[1]&&this.e[2]===e.e[2]}},{key:"modulus",value:function(){return Math.sqrt(this.sumComponentSqrs())}},{key:"sumComponentSqrs",value:function(){var e=this.sqrComponents();return e[0]+e[1]+e[2]}},{key:"sqrComponents",value:function(){var e=new Float32Array(3);return e.set([this.e[0]*this.e[0],this.e[1]*this.e[1],this.e[2]*this.e[2]]),e}},{key:"x",value:function(t){var n=t instanceof a;if(t instanceof e)return i([this.e[0]*t.e[0],this.e[1]*t.e[1],this.e[2]*t.e[2]]);if(n){var r=o([1,0,0,this.e[0],0,1,0,this.e[1],0,0,1,this.e[2],0,0,0,1]);return o([r.e[0]+0+0+0,0+r.e[1]+0+0,0+r.e[2]+0,r.e[0]*t.e[0]+r.e[1]*t.e[1]+r.e[2]*t.e[2]+r.e[3],r.e[4]+0+0+0,0+r.e[5]+0+0,0+r.e[6]+0,r.e[4]*t.e[0]+r.e[5]*t.e[1]+r.e[6]*t.e[2]+r.e[7],r.e[8]+0+0+0,0+r.e[9]+0+0,0+r.e[10]+0,r.e[8]*t.e[0]+r.e[9]*t.e[1]+r.e[10]*t.e[2]+r.e[11],r.e[12]+0+0+0,0+r.e[13]+0+0,0+r.e[14]+0,r.e[12]*t.e[0]+r.e[13]*t.e[1]+r.e[14]*t.e[2]+r.e[15]*t.e[15]])}return i([this.e[0]*t,this.e[1]*t,this.e[2]*t])}},{key:"reflect",value:function(e){var t=i([this.e[0],this.e[1],this.e[2]]),n=i([e.e[0],e.e[1],e.e[2]]),r=n.x(t.dot(n));return r=r.x(2),r=t.subtract(r)}},{key:"subtract",value:function(e){return i([this.e[0]-e.e[0],this.e[1]-e.e[1],this.e[2]-e.e[2]])}},{key:"normalize",value:function(){var e=1/this.modulus();return i([this.e[0]*e,this.e[1]*e,this.e[2]*e])}}]),e}();e.StormV3=l,t.exports.StormV3=l,e.$V3=i,t.exports.$V3=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],21:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.SystemEvents=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=e("./Utils.class"),a=e("./Constants"),l=n.SystemEvents=function(){function e(t,n){o(this,e),this._sce=t,this._project=this._sce.getLoadedProject(),this._target=n,this._utils=new s.Utils,this.mousePosX_orig=0,this.mousePosY_orig=0,this.mousePosX=0,this.mousePosY=0,this.mouseOldPosX=0,this.mouseOldPosY=0,this.divPositionX=0,this.divPositionY=0,this.focused=!1}return i(e,[{key:"initialize",value:function(){document.body.addEventListener("keydown",this.keydownListener.bind(this)),document.body.addEventListener("keyup",this.keyupListener.bind(this)),this._target.addEventListener("mousewheel",this.mousewheelListener.bind(this)),this._target.addEventListener("wheel",this.mousewheelListener.bind(this)),document.body.addEventListener("mouseup",this.mouseupListener.bind(this),!1),document.body.addEventListener("touchend",this.mouseupListener.bind(this),!1),this._target.addEventListener("mousedown",this.mousedownListener.bind(this),!1),this._target.addEventListener("touchstart",this.mousedownListener.bind(this).bind(this),!1),document.body.addEventListener("mousemove",this.mousemoveListener.bind(this),!1),document.body.addEventListener("touchmove",this.mousemoveListener.bind(this),!1),this._target.addEventListener("mouseover",function(){this.focused=!0}.bind(this),!1),this._target.addEventListener("mouseleave",function(){this.focused=!1}.bind(this),!1)}},{key:"getMousePosition",value:function(){return{x:this.mousePosX,y:this.mousePosY}}},{key:"updateDivPosition",value:function(e){this.divPositionX=s.Utils.getElementPosition(this._sce.getCanvas()).x,this.divPositionY=s.Utils.getElementPosition(this._sce.getCanvas()).y,this.mousePosX=e.clientX-this.divPositionX,this.mousePosY=e.clientY-this.divPositionY,this.mousePosX_orig=this.mousePosX,this.mousePosY_orig=this.mousePosY,this.mouseOldPosX=this.mousePosX,this.mouseOldPosY=this.mousePosY}},{key:"callComponentEvent",value:function(e,t,n){if(void 0!==this._project&&null!==this._project){var r=this._project.getActiveStage(),o=r.getActiveCamera().getComponent(a.Constants.COMPONENT_TYPES.PROJECTION),i=null;if(t===a.Constants.EVENT_TYPES.MOUSE_DOWN&&this.updateDivPosition(n),t===a.Constants.EVENT_TYPES.MOUSE_MOVE&&(this.mouseOldPosX=this.mousePosX,this.mouseOldPosY=this.mousePosY,this.mousePosX=n.clientX-this.divPositionX,this.mousePosY=n.clientY-this.divPositionY,i=$V3([this.mousePosX-this.mousePosX_orig,0,this.mousePosY-this.mousePosY_orig])),t===a.Constants.EVENT_TYPES.MOUSE_WHEEL){this.updateDivPosition(n);var s=o.getFov(),l=(this.mousePosX-this._sce.getCanvas().width/2)/this._sce.getCanvas().width*s*.2,u=(this.mousePosY-this._sce.getCanvas().height/2)/this._sce.getCanvas().height*s*.2;(void 0!==n.wheelDeltaY&&n.wheelDeltaY>=0||void 0!==n.deltaY&&n.deltaY>=0)&&(l*=-1,u*=-1);var c=r.getActiveCamera().getComponent(a.Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix(),h=c.getLeft().x(l),f=c.getUp().x(u);i=h.add(f)}for(var d=0,g=r.getNodes().length;d<g;d++)for(var _ in r.getNodes()[d].getComponents()){var v=r.getNodes()[d].getComponent(_);v.type===e&&(t===a.Constants.EVENT_TYPES.KEY_DOWN&&null!=v._onkeydown&&!0===this.focused&&v._onkeydown(n),t===a.Constants.EVENT_TYPES.KEY_UP&&null!=v._onkeyup&&v._onkeyup(n),t===a.Constants.EVENT_TYPES.MOUSE_DOWN&&null!=v._onmousedown&&v._onmousedown(n),t===a.Constants.EVENT_TYPES.MOUSE_UP&&null!=v._onmouseup&&v._onmouseup(n),t===a.Constants.EVENT_TYPES.MOUSE_MOVE&&null!=v._onmousemove&&v._onmousemove(n,i),t===a.Constants.EVENT_TYPES.MOUSE_WHEEL&&null!=v._onmousewheel&&v._onmousewheel(n,i))}}}},{key:"keydownListener",value:function(e){this.callComponentEvent(a.Constants.COMPONENT_TYPES.KEYBOARD_EVENTS,a.Constants.EVENT_TYPES.KEY_DOWN,e)}},{key:"keyupListener",value:function(e){this.callComponentEvent(a.Constants.COMPONENT_TYPES.KEYBOARD_EVENTS,a.Constants.EVENT_TYPES.KEY_UP,e)}},{key:"mousedownListener",value:function(e){this.callComponentEvent(a.Constants.COMPONENT_TYPES.MOUSE_EVENTS,a.Constants.EVENT_TYPES.MOUSE_DOWN,e)}},{key:"mouseupListener",value:function(e){this.callComponentEvent(a.Constants.COMPONENT_TYPES.MOUSE_EVENTS,a.Constants.EVENT_TYPES.MOUSE_UP,e)}},{key:"mousemoveListener",value:function(e){this.callComponentEvent(a.Constants.COMPONENT_TYPES.MOUSE_EVENTS,a.Constants.EVENT_TYPES.MOUSE_MOVE,e)}},{key:"mousewheelListener",value:function(e){e.preventDefault(),this.callComponentEvent(a.Constants.COMPONENT_TYPES.MOUSE_EVENTS,a.Constants.EVENT_TYPES.MOUSE_WHEEL,e)}}]),e}();r.SystemEvents=l,t.exports.SystemEvents=l}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Constants":11,"./Utils.class":22}],22:[function(e,t,n){(function(r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.Utils=void 0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();e("webclgl");var a=n.Utils=function(){function e(){o(this,e),window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}return s(e,[{key:"getImageFromCanvas",value:function(e,t){var n=document.createElement("img");n.onload=function(){t(n)},n.src=e.toDataURL()}},{key:"pack",value:function(t){var n=[1/255,1/255,1/255,0],r=t,o=e.fract(255*r),i=e.fract(255*o),s=[r,o,i,e.fract(255*i)],a=[s[1]*n[0],s[2]*n[1],s[3]*n[2],s[3]*n[3]];return[s[0]-a[0],s[1]-a[1],s[2]-a[2],s[3]-a[3]]}},{key:"unpack",value:function(t){var n=[1,1/255,1/65025,1/16581375];return e.dot4(t,n)}}],[{key:"getCanvasFromUint8Array",value:function(e,t,n){var r=document.createElement("canvas");r.width=t,r.height=n;for(var o=r.getContext("2d"),i=o.createImageData(t,n),s=0;s<i.data.length;s++)i.data[s]=e[s];return o.putImageData(i,0,0),r}},{key:"getUint8ArrayFromHTMLImageElement",value:function(e){var t=document.createElement("canvas");t.width=e.width,t.height=e.height;var n=t.getContext("2d");return n.drawImage(e,0,0),n.getImageData(0,0,e.width,e.height).data}},{key:"getVector",value:function(t,n){var r=e.cartesianToSpherical(t),o=r.lat,i=r.lng;return o+=n*(180*Math.random()-90),i+=n*(180*Math.random()-90),e.sphericalToCartesian(1,o,i)}},{key:"getVectorGLSLFunctionString",value:function(){return"vec3 getVector(vec3 vecNormal, float degrees, vec2 vecNoise) {\nvec3 ob = cartesianToSpherical(vecNormal);float angleLat = ob.y;float angleLng = ob.z;float desvLat = (vecNoise.x*180.0)-90.0;float desvLng = (vecNoise.y*180.0)-90.0;angleLat += (degrees*desvLat);angleLng += (degrees*desvLng);return sphericalToCartesian(vec3(1.0, angleLat, angleLng));}\n"}},{key:"cartesianToSpherical",value:function(t){var n=Math.sqrt(t.e[0]*t.e[0]+t.e[1]*t.e[1]+t.e[2]*t.e[2]);return{radius:n,lat:e.radToDeg(Math.acos(t.e[1]/n)),lng:e.radToDeg(Math.atan2(t.e[2],t.e[0]))}}},{key:"cartesianToSphericalGLSLFunctionString",value:function(){return"vec3 cartesianToSpherical(vec3 vect) {\nfloat r = sqrt(vect.x*vect.x + vect.y*vect.y + vect.z*vect.z);float angleLat = radToDeg(acos(vect.y/r));float angleLng = radToDeg(atan(vect.z, vect.x));return vec3(r, angleLat, angleLng);}\n"}},{key:"sphericalToCartesian",value:function(t,n,r){var o=t,i=e.degToRad(n),s=e.degToRad(r),a=o*Math.sin(i)*Math.cos(s),l=o*Math.sin(i)*Math.sin(s),u=o*Math.cos(i);return new StormV3([a,u,l])}},{key:"sphericalToCartesianGLSLFunctionString",value:function(){return"vec3 sphericalToCartesian(vec3 vect) {\nfloat r = vect.x;float angleLat = degToRad(vect.y);float angleLng = degToRad(vect.z);float x = r*sin(angleLat)*cos(angleLng);float z = r*sin(angleLat)*sin(angleLng);float y = r*cos(angleLat);return vec3(x,y,z);}\n"}},{key:"refract",value:function(e,t,n,r){var o=n/r,i=-1*t.dot(e),s=1-o*o*(1-i*i);return e.x(o).add(t.x(o*i-Math.sqrt(s)))}},{key:"degToRad",value:function(e){return 3.14159*e/180}},{key:"degToRadGLSLFunctionString",value:function(){return"float degToRad(float deg) {return (deg*3.14159)/180.0;}"}},{key:"radToDeg",value:function(e){return e*(180/3.14159)}},{key:"radToDegGLSLFunctionString",value:function(){return"float radToDeg(float rad) {return rad*(180.0/3.14159);}"}},{key:"hexToRgb",value:function(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;e=e.replace(t,function(e,t,n,r){return t+t+n+n+r+r});var n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:null}},{key:"rgbToHex",value:function(e){return"#"+(16777216+(e[2]|e[1]<<8|e[0]<<16)).toString(16).slice(1)}},{key:"invsqrt",value:function(e){return 1/e}},{key:"smoothstep",value:function(e,t,n){if(n<e)return 0;if(n>=t)return 1;if(e===t)return-1;var r=(n-e)/(t-e);return r*r*(3-2*r)}},{key:"dot4",value:function(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}},{key:"fract",value:function(e){return e>0?e-Math.floor(e):e-Math.ceil(e)}},{key:"packGLSLFunctionString",value:function(){return"vec4 pack (float depth) {const vec4 bias = vec4( 1.0 / 255.0,1.0 / 255.0,1.0 / 255.0,0.0);float r = depth;float g = fract(r * 255.0);float b = fract(g * 255.0);float a = fract(b * 255.0);vec4 colour = vec4(r, g, b, a);return colour - (colour.yzww * bias);}"}},{key:"unpackGLSLFunctionString",value:function(){return"float unpack (vec4 colour) {const vec4 bitShifts = vec4(1.0,1.0 / 255.0,1.0 / (255.0 * 255.0),1.0 / (255.0 * 255.0 * 255.0));return dot(colour, bitShifts);}"}},{key:"rayTraversalInitSTR",value:function(){return"float wh = ceil(sqrt(uResolution*uResolution*uResolution));\nfloat cs = uGridsize/uResolution;\nfloat chs = cs/2.0;\nfloat texelSize = 1.0/(wh-1.0);\nvec3 gl = vec3(-(uGridsize/2.0), -(uGridsize/2.0), -(uGridsize/2.0));\nvec3 _r = vec3(uGridsize, uGridsize, uGridsize);\nvec3 _rRes = vec3(uResolution, uResolution, uResolution);\nvec3 _len = _r/_rRes;\nvec3 worldToVoxel(vec3 world) {\nvec3 ijk = (world - gl) / _len;\nijk = vec3(floor(ijk.x), floor(ijk.y), floor(ijk.z));\nreturn ijk;\n}\nfloat voxelToWorldX(float x) {return x * _len.x + gl.x;}\nfloat voxelToWorldY(float y) {return y * _len.y + gl.y;}\nfloat voxelToWorldZ(float z) {return z * _len.z + gl.z;}\n"}},{key:"rayTraversalSTR",value:function(e){return"vec2 getId(vec3 voxel) {\nint tex3dId = (int(voxel.y)*(int(uResolution)*int(uResolution)))+(int(voxel.z)*(int(uResolution)))+int(voxel.x);\nfloat num = float(tex3dId)/wh;\nfloat col = fract(num)*wh;\nfloat row = floor(num);\nreturn vec2(col*texelSize, row*texelSize);\n}\nvec4 getVoxel_Color(vec2 texVec, vec3 voxel, vec3 RayOrigin) {\nvec4 rgba = vec4(0.0,0.0,0.0,0.0);\nvec4 texture = sampler_voxelColor[vec2(texVec.x, texVec.y)];\nif(texture.a/255.0 > 0.5) {\nrgba = vec4(texture.rgb/255.0,distance(vec3(voxelToWorldX(voxel.x), voxelToWorldX(voxel.y), voxelToWorldX(voxel.z)),RayOrigin));\n}\nreturn rgba;\n}\nvec4 getVoxel_Pos(vec2 texVec) {\nvec4 rgba = vec4(0.0,0.0,0.0,0.0);\nvec4 texture = sampler_voxelPos[vec2(texVec.x, texVec.y)];\nrgba = vec4( ((texture.xyz/255.0)*uGridsize)-(uGridsize/2.0), 1.0);\nreturn rgba;\n}\nvec4 getVoxel_Normal(vec2 texVec) {\nvec4 rgba = vec4(0.0,0.0,0.0,0.0);\nvec4 texture = sampler_voxelNormal[vec2(texVec.x, texVec.y)];\nrgba = vec4(((texture.rgb/255.0)*2.0)-1.0, 1.0);\nreturn rgba;\n}\nstruct RayTraversalResponse {vec4 voxelColor;vec4 voxelPos;vec4 voxelNormal;};RayTraversalResponse rayTraversal(vec3 RayOrigin, vec3 RayDir) {\nvec4 fvoxelColor = vec4(0.0, 0.0, 0.0, 0.0);vec4 fvoxelPos = vec4(0.0, 0.0, 0.0, 0.0);vec4 fvoxelNormal = vec4(0.0, 0.0, 0.0, 0.0);vec3 voxel = worldToVoxel(RayOrigin);vec3 _dir = normalize(RayDir);vec3 tMax;if(RayDir.x < 0.0) tMax.x = (voxelToWorldX(voxel.x)-RayOrigin.x)/RayDir.x;if(RayDir.x > 0.0) tMax.x = (voxelToWorldX(voxel.x+1.0)-RayOrigin.x)/RayDir.x;if(RayDir.y < 0.0) tMax.y = (voxelToWorldY(voxel.y)-RayOrigin.y)/RayDir.y;if(RayDir.y < 0.0) tMax.y = (voxelToWorldY(voxel.y+1.0)-RayOrigin.y)/RayDir.y;if(RayDir.z < 0.0) tMax.z = (voxelToWorldZ(voxel.z)-RayOrigin.z)/RayDir.z;if(RayDir.z < 0.0) tMax.z = (voxelToWorldZ(voxel.z+1.0)-RayOrigin.z)/RayDir.z;float tDeltaX = _r.x/abs(RayDir.x);float tDeltaY = _r.y/abs(RayDir.y);float tDeltaZ = _r.z/abs(RayDir.z);float stepX = 1.0; float stepY = 1.0; float stepZ = 1.0;\nfloat outX = _r.x; float outY = _r.y; float outZ = _r.z;\nif(RayDir.x < 0.0) {stepX = -1.0; outX = -1.0;}if(RayDir.y < 0.0) {stepY = -1.0; outY = -1.0;}if(RayDir.z < 0.0) {stepZ = -1.0; outZ = -1.0;}vec4 color = vec4(0.0,0.0,0.0,0.0);\nbool c1; bool c2; bool c3; bool isOut;vec2 vid;for(int c = 0; c < "+e+"*2; c++) {\nc1 = bool(tMax.x < tMax.y);c2 = bool(tMax.x < tMax.z);c3 = bool(tMax.y < tMax.z);isOut = false;if (c1 && c2) {voxel.x += stepX;if(voxel.x==outX) isOut=true;tMax.x += tDeltaX;} else if(( (c1 && !c2) || (!c1 && !c3) )) {voxel.z += stepZ;if(voxel.z==outZ) isOut=true;tMax.z += tDeltaZ;} else if(!c1 && c3) {voxel.y += stepY;if(voxel.y==outY) isOut=true;tMax.y += tDeltaY;}if(isOut == true) break;\nelse {if((voxel.x >= 0.0 && voxel.x <= _rRes.x && voxel.y >= 0.0 && voxel.y <= _rRes.y && voxel.z >= 0.0 && voxel.z <= _rRes.z)) {;\nvid = getId(voxel);vec4 vcc = getVoxel_Color(vid, voxel, RayOrigin);if(vcc.a != 0.0) {fvoxelColor = vcc;break;\n}}}}fvoxelPos = getVoxel_Pos(vid);fvoxelNormal = getVoxel_Normal(vid);return RayTraversalResponse(fvoxelColor, fvoxelPos, fvoxelNormal);}\n"}},{key:"isPowerOfTwo",value:function(e){return 0==(e&e-1)}},{key:"nextHighestPowerOfTwo",value:function(e){--e;for(var t=1;t<32;t<<=1)e|=e>>t;return e+1}},{key:"getElementPosition",value:function(e){for(var t=e,n=0,r=0;"object"===(void 0===t?"undefined":i(t))&&void 0!==t.tagName;)r+=t.offsetTop,n+=t.offsetLeft,"BODY"===t.tagName.toUpperCase()&&(t=0),"object"===(void 0===t?"undefined":i(t))&&"object"===i(t.offsetParent)&&(t=t.offsetParent);return{x:n,y:r}}},{key:"getWebGLContextFromCanvas",value:function(e,t){return WebCLGLUtils.getWebGLContextFromCanvas(e,t)}},{key:"fullScreen",value:function(){document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?document.cancelFullScreen?document.cancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen&&document.webkitCancelFullScreen():document.documentElement.requestFullscreen?document.documentElement.requestFullscreen():document.documentElement.mozRequestFullScreen?document.documentElement.mozRequestFullScreen():document.documentElement.webkitRequestFullscreen&&document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)}}]),e}();r.Utils=a,t.exports.Utils=a}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{webclgl:1}],23:[function(e,t,n){(function(e){"use strict";function r(e){this.getSrc=function(){return[["RGB"],"varying vec4 vVN;\nvarying vec4 vVT;\nvarying float vVTU;\n","vec4 vp = vertexPos[];\nvec4 vn = vertexNormal[];\nvec4 vt = vertexTexture[];\nfloat vtu = vertexTextureUnit[];\nvVN = vn;vVT = vt;vVTU = vtu;gl_Position = PMatrix * cameraWMatrix * nodeWMatrix * vp;\n","varying vec4 vVN;\nvarying vec4 vVT;\nvarying float vVTU;\n","vec4 textureColor = texture2D(texAlbedo, vVT.xy);\nreturn [textureColor];\n"]}}Object.defineProperty(n,"__esModule",{value:!0}),n.VFP_RGB=r,e.VFP_RGB=r,t.exports.VFP_RGB=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],24:[function(e,t,n){(function(n){"use strict";e("./ArrayGenerator.class"),e("./Component.class"),e("./Component_GPU.class"),e("./ComponentControllerTransformTarget.class"),e("./ComponentKeyboardEvents.class"),e("./ComponentMouseEvents.class"),e("./ComponentProjection.class"),e("./ComponentTransform.class"),e("./ComponentTransformTarget.class"),e("./Constants"),e("./Mesh.class"),e("./Node.class"),e("./Project.class"),e("./SCE.class"),e("./Stage.class"),e("./StormMath.class"),e("./SystemEvents.class"),e("./Utils.class"),e("./VFP_RGB.class"),e("./Prefabs/Grid/Grid.class"),e("./Prefabs/SimpleCamera/SimpleCamera.class"),e("./Prefabs/SimpleNode/SimpleNode.class"),t.exports.ArrayGenerator=n.ArrayGenerator=ArrayGenerator,t.exports.Component=n.Component=Component,t.exports.Component_GPU=n.Component_GPU=Component_GPU,t.exports.ComponentControllerTransformTarget=n.ComponentControllerTransformTarget=ComponentControllerTransformTarget,t.exports.ComponentKeyboardEvents=n.ComponentKeyboardEvents=ComponentKeyboardEvents,t.exports.ComponentMouseEvents=n.ComponentMouseEvents=ComponentMouseEvents,t.exports.ComponentProjection=n.ComponentProjection=ComponentProjection,t.exports.ComponentTransform=n.ComponentTransform=ComponentTransform,t.exports.ComponentTransformTarget=n.ComponentTransformTarget=ComponentTransformTarget,t.exports.Constants=n.Constants=Constants,t.exports.Mesh=n.Mesh=Mesh,t.exports.Node=n.Node=Node,t.exports.Project=n.Project=Project,t.exports.SCE=n.SCE=SCE,t.exports.Stage=n.Stage=Stage,t.exports.StormM16=n.StormM16=StormM16,t.exports.StormV3=n.StormV3=StormV3,t.exports.SystemEvents=n.SystemEvents=SystemEvents,t.exports.Utils=n.Utils=Utils,t.exports.VFP_RGB=n.VFP_RGB=VFP_RGB,t.exports.Grid=n.Grid=Grid,t.exports.SimpleCamera=n.SimpleCamera=SimpleCamera,t.exports.SimpleNode=n.SimpleNode=SimpleNode}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./ArrayGenerator.class":2,"./Component.class":3,"./ComponentControllerTransformTarget.class":4,"./ComponentKeyboardEvents.class":5,"./ComponentMouseEvents.class":6,"./ComponentProjection.class":7,"./ComponentTransform.class":8,"./ComponentTransformTarget.class":9,"./Component_GPU.class":10,"./Constants":11,"./Mesh.class":12,"./Node.class":13,"./Prefabs/Grid/Grid.class":14,"./Prefabs/SimpleCamera/SimpleCamera.class":15,"./Prefabs/SimpleNode/SimpleNode.class":16,"./Project.class":17,"./SCE.class":18,"./Stage.class":19,"./StormMath.class":20,"./SystemEvents.class":21,"./Utils.class":22,"./VFP_RGB.class":23}]},{},[24]);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Graph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _KERNEL_DIR = require("./KERNEL_DIR.class");

var _KERNEL_ADJMATRIX_UPDATE = require("./KERNEL_ADJMATRIX_UPDATE.class");

var _VFP_NODE = require("./VFP_NODE.class");

var _VFP_NODEPICKDRAG = require("./VFP_NODEPICKDRAG.class");

var _ProccessImg = require("./ProccessImg.class");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @class
 * @param {SCE} sce
 * @param {Object} jsonIn
 * @param {boolean} jsonIn.enableFonts
 * @param {String} [jsonIn.nodeDrawMode="plane"] - "plane" or "point"
*/
var Graph = exports.Graph = function () {
    function Graph(sce, jsonIn) {
        var _this = this;

        _classCallCheck(this, Graph);

        this._sce = sce;
        this._project = this._sce.getLoadedProject();
        this._gl = this._project.getActiveStage().getWebGLContext();
        this._utils = new Utils();

        this.MAX_ITEMS_PER_ARRAY = 4294967295 /*4294967295*/; // unsigned int 65535 for limit on indices of 16bit; long unsigned int 4294967295
        this.NODE_IMG_COLUMNS = 8.0;
        this.NODE_IMG_WIDTH = 2048;

        this._enableFont = jsonIn && jsonIn.enableFonts === true;
        this._enableHover = false;
        this._enableAutoLink = true;
        this._enabledForceLayout = false;
        this._MAX_ADJ_MATRIX_WIDTH = 2048;

        this._playAnimation = false;
        this._loop = false;
        this._animationFrames = 500;

        this._geometryLength = jsonIn === undefined || jsonIn && jsonIn.nodeDrawMode === undefined || jsonIn && jsonIn.nodeDrawMode === "plane" ? 4 : 1;
        this.circleSegments = 12;
        this.nodesTextPlanes = 12;

        this.lineVertexCount = 1;

        this._enableNeuronalNetwork = false;
        this.batch_size = null;
        this.layerCount = 0;
        this.afferentNodesCount = 0;
        this.efferentNodesCount = 0;
        this.trainTickCount = 0;
        this.onAction = null;
        this.onTrained = null;
        this.afferentNeuron = [];
        this.efferentNeuron = [];
        this.v_val = 0.0;
        this.return_v = false;

        this._only2d = false;
        this.multiplyOutput = 1;

        this._nodesByName = {};
        this._nodesById = {};
        this._links = {};
        this._customArgs = {}; // {ARG: {"arg": String, "value": Array<Float>}}


        this.arrAdjMatrix = null; // linkBornDate, linkDieDate, linkWeight, columnAsParent
        this.arrAdjMatrixB = null;
        this.arrAdjMatrixC = null;

        this.currentTrainLayer = -3;
        this._ADJ_MATRIX_WIDTH = null;

        this._initTimestamp = 0;
        this._currentFrame = 0;
        this._endTimestamp = Date.now();
        this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;

        this.readPixel = false;
        this.selectedId = -1;
        this._initialPosDrag = null;

        this._onClickNode = null;
        this._onAnimationStep = null;
        this._onAnimationEnd = null;

        // meshes
        this.mesh_nodes = this._geometryLength === 1 ? new Mesh().loadPoint() : new Mesh().loadQuad(4.0, 4.0);
        this.mesh_arrows = new Mesh().loadTriangle({ "scale": 1.75, "side": 0.3 });
        this.mesh_nodesText = new Mesh().loadQuad(4.0, 4.0);

        // nodes image
        this.objNodeImages = {};

        this._stackNodesImg = [];
        this.nodesImgMask = null;
        this.nodesImgMaskLoaded = false;
        this.nodesImgCrosshair = null;
        this.nodesImgCrosshairLoaded = false;

        this.FONT_IMG_COLUMNS = 7.0;

        this.disabVal = 0.0;

        // nodes
        this.arrayNodeData = []; // nodeId, acums, bornDate, dieDate
        // if(own networkWaitData == this.disabVal)
        // own has been read. then see networkWaitData of childs, calculate weights & save output in own networkWaitData & networkProcData(for visualization).
        // else if(own networkWaitData != this.disabVal)
        // own networkWaitData is being read. then set own networkWaitData to disabVal()
        this.arrayNodeDataB = []; // bornDate, dieDate, networkWaitData, networkProcData (SHARED with LINKS, ARROWS & NODESTEXT)
        this.arrayNodeDataF = [];
        this.arrayNodeDataG = [];
        this.arrayNodeDataH = [];
        this.arrayNodePosXYZW = [];
        this.arrayNodeVertexPos = [];
        this.arrayNodeVertexNormal = [];
        this.arrayNodeVertexTexture = [];
        this.startIndexId = 0;
        this.arrayNodeIndices = [];

        this.arrayNodeImgId = [];

        this.arrayNodeDir = [];

        this.currentNodeId = 0;
        this.nodeArrayItemStart = 0;

        // links
        this.linksObj = [];
        this.currentLinksObjItem = -1;
        this.currentLinkId = 0;

        // arrows
        this.arrowsObj = [];
        this.currentArrowsObjItem = -1;
        this.currentArrowId = 0;

        /*this.arrayArrowData = [];
        this.arrayArrowDataC = [];
        this.arrayArrowNodeName = [];
        this.arrayArrowPosXYZW = [];
        this.arrayArrowVertexPos = [];
        this.arrayArrowVertexNormal = [];
        this.arrayArrowVertexTexture = [];
        this.startIndexId_arrow = 0;
        this.arrayArrowIndices = [];
          this.currentArrowId = 0;
        this.arrowArrayItemStart = 0;*/

        // nodesText
        this.arrayNodeTextData = [];
        this.arrayNodeTextNodeName = [];
        this.arrayNodeTextPosXYZW = [];
        this.arrayNodeTextVertexPos = [];
        this.arrayNodeTextVertexNormal = [];
        this.arrayNodeTextVertexTexture = [];
        this.startIndexId_nodestext = 0;
        this.arrayNodeTextIndices = [];

        this.arrayNodeText_itemStart = [];
        this.arrayNodeTextLetterId = [];

        this.currentNodeTextId = 0;
        this.nodeTextArrayItemStart = 0;

        this.layout = null;

        this.currHiddenNeuron = 0;
        this.nodSep = 5.0;

        //**************************************************
        //  NODES
        //**************************************************
        this.nodes = new Node();
        this.nodes.setName("graph_nodes");
        this._project.getActiveStage().addNode(this.nodes);

        // ComponentTransform
        this.nodes.addComponent(new ComponentTransform());

        // Component_GPU
        this.comp_renderer_nodes = new Component_GPU();
        this.nodes.addComponent(this.comp_renderer_nodes);

        // ComponentMouseEvents
        var comp_mouseEvents = new ComponentMouseEvents();
        this.nodes.addComponent(comp_mouseEvents);
        comp_mouseEvents.onmousedown(function (evt) {
            _this.selectedId = -1;
            _this.mouseDown();
        });
        comp_mouseEvents.onmouseup(function (evt) {
            if (_this.selectedId !== -1) {
                var _n = _this._nodesById[_this.selectedId];
                if (_n !== undefined && _n !== null && _n.onmouseup !== undefined && _n.onmouseup !== null) _n.onmouseup(_n, evt);
            }
            _this.mouseUp();
        });
        comp_mouseEvents.onmousemove(function (evt, dir) {
            _this.makeDrag(evt, dir);
        });
        comp_mouseEvents.onmousewheel(function (evt) {});

        //**************************************************
        //  LINKS
        //**************************************************
        this.createLinksObjItem();

        //**************************************************
        //  ARROWS
        //**************************************************
        this.createArrowsObjItem();

        /*let arrows = new Node();
        arrows.setName("graph_arrows");
        this._project.getActiveStage().addNode(arrows);
          // ComponentTransform
        arrows.addComponent(new ComponentTransform());
          // Component_GPU
        let comp_renderer_arrows = new Component_GPU();
        arrows.addComponent(comp_renderer_arrows);*/

        //**************************************************
        //  NODESTEXT
        //**************************************************
        this.nodesText = null;
        this.comp_renderer_nodesText = null;
        if (this._enableFont === true) {
            this.nodesText = new Node();
            this.nodesText.setName("graph_nodesText");
            this._project.getActiveStage().addNode(this.nodesText);

            // ComponentTransform
            this.nodesText.addComponent(new ComponentTransform());

            // Component_GPU
            this.comp_renderer_nodesText = new Component_GPU();
            this.nodesText.addComponent(this.comp_renderer_nodesText);
        }
    }

    _createClass(Graph, [{
        key: "createLinksObjItem",
        value: function createLinksObjItem() {
            this.currentLinksObjItem++;

            this.linksObj.push({
                "node": new Node(),
                "componentTransform": new ComponentTransform(),
                "componentRenderer": new Component_GPU(),
                "arrayLinkData": [], // nodeId origin, nodeId target, currentLineVertex, repeatId
                "arrayLinkDataC": [], // linkBornDate, linkDieDate, linkWeight, 0
                "arrayLinkNodeName": [],
                "arrayLinkPosXYZW": [],
                "arrayLinkVertexPos": [],
                "startIndexId_link": 0,
                "arrayLinkIndices": [] });

            this.linksObj[this.currentLinksObjItem].node.setName("graph_links" + this.currentLinksObjItem);
            this._project.getActiveStage().addNode(this.linksObj[this.currentLinksObjItem].node);

            this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentTransform);

            this.linksObj[this.currentLinksObjItem].node.addComponent(this.linksObj[this.currentLinksObjItem].componentRenderer);
        }
    }, {
        key: "createArrowsObjItem",
        value: function createArrowsObjItem() {
            this.currentArrowsObjItem++;

            this.arrowsObj.push({
                "node": new Node(),
                "componentTransform": new ComponentTransform(),
                "componentRenderer": new Component_GPU(),
                "arrayArrowData": [],
                "arrayArrowDataC": [],
                "arrayArrowNodeName": [],
                "arrayArrowPosXYZW": [],
                "arrayArrowVertexPos": [],
                "arrayArrowVertexNormal": [],
                "arrayArrowVertexTexture": [],
                "startIndexId_arrow": 0,
                "arrayArrowIndices": [],
                "arrowArrayItemStart": 0 });

            this.arrowsObj[this.currentArrowsObjItem].node.setName("graph_arrows" + this.currentArrowsObjItem);
            this._project.getActiveStage().addNode(this.arrowsObj[this.currentArrowsObjItem].node);

            this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentTransform);

            this.arrowsObj[this.currentArrowsObjItem].node.addComponent(this.arrowsObj[this.currentArrowsObjItem].componentRenderer);
        }
    }, {
        key: "onClickNode",


        /**
         * @param {Function} fn
         */
        value: function onClickNode(fn) {
            this._onClickNode = fn;
        }
    }, {
        key: "getBornDieTS",
        value: function getBornDieTS(bornD, dieD) {
            var _this2 = this;

            var generateRandomBornAndDie = function generateRandomBornAndDie() {
                var bornDate = _this2._initTimestamp + Math.round(Math.random() * Math.max(0, _this2._animationFrames - 20)) * _this2._timeFrameIncrement;
                var dieDate = void 0;
                while (true) {
                    dieDate = _this2._initTimestamp + Math.round(Math.random() * _this2._animationFrames) * _this2._timeFrameIncrement;
                    if (dieDate > bornDate) break;
                }
                //console.log(bornDate);
                //console.log(dieDate);

                return { bornDate: bornDate, dieDate: dieDate };
            };

            var bd = void 0;
            var dd = void 0;
            if (bornD != null) {
                if (bornD.constructor === String) {
                    if (bornD === "RANDOM") {
                        var rbdd = generateRandomBornAndDie();
                        bd = rbdd.bornDate;
                        dd = rbdd.dieDate;
                    } else {
                        bd = Graph.datetimeToTimestamp(bornD);
                        dd = Graph.datetimeToTimestamp(dieD);
                    }
                } else {
                    bd = bornD;
                    dd = dieD;
                }
            } else {
                bd = 1.0;
                dd = 0.0;
            }

            return { "bornDate": bd, "dieDate": dd };
        }
    }, {
        key: "showTimeline",


        /**
         * @param {HTMLDivElement} target
         */
        value: function showTimeline(target) {
            var _this3 = this;

            var eSlider = document.createElement("input");
            eSlider.type = "range";
            eSlider.min = "0";
            eSlider.max = this._animationFrames.toString();
            eSlider.step = "1";
            eSlider.value = "0";
            eSlider.style.verticalAlign = "middle";
            eSlider.style.width = "78%";

            target.innerText = "";
            target.appendChild(eSlider);

            var set_spinner = function set_spinner(e) {
                var frame = e.value;
                _this3.setFrame(frame);
            };

            eSlider.addEventListener("input", set_spinner.bind(this, eSlider));
        }
    }, {
        key: "setTimelineDatetimeRange",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.initDatetime - date of animation start
         * @param {String} jsonIn.endDatetime - date of animation end
         */
        value: function setTimelineDatetimeRange(jsonIn) {
            this._initTimestamp = Graph.datetimeToTimestamp(jsonIn.initDatetime);
            this._endTimestamp = Graph.datetimeToTimestamp(jsonIn.endDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineTimestampRangeStart",


        /**
         * @returns {int}
         */
        value: function getTimelineTimestampRangeStart() {
            return this._initTimestamp;
        }
    }, {
        key: "setTimelineDatetimeRangeStart",


        /**
         * @param {String} initDatetime - date of animation start
         */
        value: function setTimelineDatetimeRangeStart(initDatetime) {
            this._initTimestamp = Graph.datetimeToTimestamp(initDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineTimestampRangeEnd",


        /**
         * @returns {int}
         */
        value: function getTimelineTimestampRangeEnd() {
            return this._endTimestamp;
        }
    }, {
        key: "setTimelineDatetimeRangeEnd",


        /**
         * @param {String} endDatetime - date of animation end
         */
        value: function setTimelineDatetimeRangeEnd(endDatetime) {
            this._endTimestamp = Graph.datetimeToTimestamp(endDatetime);

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "getTimelineRangeDates",


        /**
         * @returns {Object}
         */
        value: function getTimelineRangeDates() {
            return { "initDate": this.timestampToDate(this._initTimestamp),
                "endDate": this.timestampToDate(this._endTimestamp) };
        }
    }, {
        key: "getTimelineFramesLength",


        /**
         * @returns {int}
         */
        value: function getTimelineFramesLength() {
            return this._animationFrames;
        }
    }, {
        key: "setTimelineFramesLength",


        /**
         * @param {int} length - frames length
         */
        value: function setTimelineFramesLength(length) {
            this._animationFrames = length;

            this._timeFrameIncrement = (this._endTimestamp - this._initTimestamp) / this._animationFrames;
        }
    }, {
        key: "setTimelineTimestamp",


        /**
         * @param {int} ts
         */
        value: function setTimelineTimestamp(ts) {
            this._currentFrame = Math.round((ts - this._initTimestamp) / this._timeFrameIncrement);
        }
    }, {
        key: "setFrame",


        /**
         * @param {int} frame
         */
        value: function setFrame(frame) {
            this._currentFrame = frame;
        }
    }, {
        key: "getFrame",


        /**
         * @returns {int}
         */
        value: function getFrame(frame) {
            return this._currentFrame;
        }
    }, {
        key: "playTimeline",


        /**
         * @param {bool} [loop=false]
         */
        value: function playTimeline(loop) {
            this._playAnimation = true;
            if (loop !== undefined) this._loop = loop;
        }
    }, {
        key: "pauseTimeline",
        value: function pauseTimeline() {
            this._playAnimation = false;
        }
    }, {
        key: "onAnimationStep",


        /**
         * @param {Function} fn
         */
        value: function onAnimationStep(fn) {
            this._onAnimationStep = fn;
        }
    }, {
        key: "onAnimationEnd",


        /**
         * @param {Function} fn
         */
        value: function onAnimationEnd(fn) {
            this._onAnimationEnd = fn;
        }
    }, {
        key: "getNodesCount",


        /**
         * @returns {int}
         */
        value: function getNodesCount() {
            return Object.keys(this._nodesByName).length;
        }
    }, {
        key: "getLinksCount",


        /**
         * @returns {int}
         */
        value: function getLinksCount() {
            return Object.keys(this._links).length;
        }
    }, {
        key: "getNodeByName",


        /**
         * @param {String} name
         * @returns {Node}
         */
        value: function getNodeByName(name) {
            return this._nodesByName[name];
        }
    }, {
        key: "getNodeById",


        /**
         * @param {int} id
         * @returns {Node}
         */
        value: function getNodeById(id) {
            return this._nodesById[id];
        }
    }, {
        key: "selectNode",


        /**
         * @param {int} nodeId
         */
        value: function selectNode(nodeId) {
            this.selectedId = nodeId;
            this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
        }
    }, {
        key: "getSelectedId",


        /**
         * @returns {number}
         */
        value: function getSelectedId() {
            return this.selectedId;
        }
    }, {
        key: "enableHover",
        value: function enableHover() {
            this._enableHover = true;
            this.readPixel = true;
            this.comp_renderer_nodes.gpufG.enableGraphic(1);
        }
    }, {
        key: "enableAutoLink",
        value: function enableAutoLink() {
            this._enableAutoLink = true;
        }
    }, {
        key: "disableAutoLink",
        value: function disableAutoLink() {
            this._enableAutoLink = false;
        }
    }, {
        key: "only2d",


        /**
         *  @param {boolean} mode2d
         */
        value: function only2d(mode2d) {
            this._only2d = mode2d;
        }
    }, {
        key: "setFontsImage",


        /**
         * @param {String} url
         */
        value: function setFontsImage(url) {
            var _this4 = this;

            if (this._enableFont === true) {
                var image = new Image();
                image.onload = function () {
                    _this4.comp_renderer_nodesText.setArg("fontsImg", function () {
                        return image;
                    });
                };
                image.src = url;
            }
        }
    }, {
        key: "setNodeMesh",


        /**
         * @param {Mesh} mesh
         */
        value: function setNodeMesh(mesh) {
            this.mesh_nodes = mesh;
        }
    }, {
        key: "exportFile",
        value: function exportFile() {
            var data = "[";
            var sep = "";
            for (var key in this._nodesByName) {
                data += sep + JSON.stringify(this._nodesByName[key]);
                sep = ",";
                console.log(this._nodesByName[key]);
            }

            data += "]|[";
            sep = "";
            for (var _key in this._links) {
                data += sep + JSON.stringify(this._links[_key]);
                sep = ",";
                console.log(this._links[_key]);
            }

            data += "]";

            console.log(data);
        }
    }, {
        key: "importFile",
        value: function importFile(data) {
            var expl = data.split("|");
            var nodes = JSON.parse(expl[0]);
            var links = JSON.parse(expl[1]);

            for (var key in nodes) {
                var node = this.addNode({
                    "name": nodes[key].name,
                    "data": nodes[key].name,
                    "label": nodes[key].label,
                    "position": nodes[key].pos,
                    "color": Math.floor(n % 2) === 0.0 ? "../_RESOURCES/lena_128x128.jpg" : "../_RESOURCES/cartman08.jpg",
                    "layoutNodeArgumentData": {
                        // dir
                        "ndirect": [0.0, 0.0, 0.0, 1.0],
                        // pp
                        "particlePolarity": 0.0,
                        // destination
                        "dest": [0.0, 0.0, 0.0, 0.0],
                        // lifeDistance
                        "initPos": nodes[key].pos, "initDir": [0.0, 0.0, 0.0, 0.0],
                        // nodeColor
                        "nodeColor": [Math.random(), Math.random(), Math.random(), 1.0],
                        // lock
                        "nodeLock": 0.0 },
                    "onmouseup": function onmouseup(nodeData) {} });
            }

            for (var _key2 in links) {
                var A = links[_key2].origin_nodeName;
                var B = links[_key2].target_nodeName;

                this.addLink({ "origin": A,
                    "target": B,
                    "directed": true });
            }
        }
    }, {
        key: "loadRBFromFile",


        /**
         * @param {String} fileurl
         * @param {Function} [onload=undefined]
         * @param {bool} [generateBornAndDieDates=false]
         * @param {bool} [randomLinkWeights=false]
         */
        value: function loadRBFromFile(fileurl, onload, generateBornAndDieDates, randomLinkWeights) {
            var _this5 = this;

            var req = new XMLHttpRequest();
            req.open("GET", fileurl, true);
            req.addEventListener("load", function (evt) {
                console.log("RB file Loaded");
                _this5.loadRBFromStr({ "data": evt.target.responseText,
                    "generateBornAndDieDates": generateBornAndDieDates,
                    "randomLinkWeights": randomLinkWeights });

                if (onload !== undefined && onload !== null) onload();
            });

            req.addEventListener("error", function (evt) {
                console.log(evt);
            });

            req.send(null);
        }
    }, {
        key: "loadRBFromStr",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.data
         * @param {bool} [jsonIn.generateBornAndDieDates=false] -
         * @param {bool} [jsonIn.randomLinkWeights=false] -
         */
        value: function loadRBFromStr(jsonIn) {
            var _sourceText = jsonIn.data;
            var lines = _sourceText.split("\r\n");
            if (lines.length === 1) lines = _sourceText.split("\n");

            //if(lines[0].match(/OBJ/gim) == null) {alert('Not OBJ file');	return;}
            var line0 = lines[0].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var title = line0[0] !== undefined && line0[0] !== null ? line0[0] : null; // Title
            var key = line0[1] !== undefined && line0[1] !== null ? line0[1] : null; // Key
            console.log(line0);

            var line1 = lines[1].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var tLines = line1[0] !== undefined && line1[0] !== null ? parseInt(line1[0]) : null; // Total number of lines excluding header (TOTCRD)
            var tLinesPointers = line1[1] !== undefined && line1[1] !== null ? parseInt(line1[1]) : null; // Number of lines for pointers (PTRCRD)
            var tLinesRowIndices = line1[2] !== undefined && line1[2] !== null ? parseInt(line1[2]) : null; // Number of lines for row (or letiable) indices (INDCRD)
            var tLinesValues = line1[3] !== undefined && line1[3] !== null ? parseInt(line1[3]) : null; // Number of lines for numerical values (VALCRD)
            var tLinesRH = line1[4] !== undefined && line1[4] !== null ? parseInt(line1[4]) : null; // Number of lines for right-hand sides (RHSCRD)
            console.log(line1);

            var line2 = lines[2].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var matType = line2[0] !== undefined && line2[0] !== null ? line2[0] : null; // Matrix type (see below) (MXTYPE)
            var rowCount = line2[1] !== undefined && line2[1] !== null ? parseInt(line2[1]) : null; // Number of rows (or variables) (NROW)
            var colCount = line2[2] !== undefined && line2[2] !== null ? parseInt(line2[2]) : null; // Number of columns (or elements) (NCOL)
            var rowIndCount = line2[3] !== undefined && line2[3] !== null ? parseInt(line2[3]) : null; // Number of row (or variable) indices (NNZERO)		(equal to number of entries for assembled matrices)
            var matEntCount = line2[4] !== undefined && line2[4] !== null ? parseInt(line2[4]) : null; // Number of elemental matrix entries (NELTVL)		(zero in the case of assembled matrices)
            console.log(line2);

            var line3 = lines[3].replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            var pointerFormat = line3[0] !== undefined && line3[0] !== null ? line3[0] : null; // Format for pointers (PTRFMT)
            var rowIndFormat = line3[1] !== undefined && line3[1] !== null ? line3[1] : null; // Format for row (or variable) indices (INDFMT)
            var valuesFormat = line3[2] !== undefined && line3[2] !== null ? line3[2] : null; // Format for numerical values of coefficient matrix (VALFMT)
            var RHFormat = line3[3] !== undefined && line3[3] !== null ? line3[3] : null; // Format for numerical values of right-hand sides (RHSFMT)
            console.log(line3);

            var offs = 1000 / 2;
            for (var _n2 = 0; _n2 < rowCount; _n2++) {
                var pos = [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];

                var bd = jsonIn.generateBornAndDieDates !== undefined && jsonIn.generateBornAndDieDates !== null && jsonIn.generateBornAndDieDates === true ? { "bornDate": "RANDOM", "dieDate": "RANDOM" } : { "bornDate": 1.0, "dieDate": 0.0 };

                var node = this.addNode({
                    "name": _n2.toString(),
                    "data": _n2.toString(),
                    "label": _n2.toString(),
                    "position": pos,
                    "color": this._enableNeuronalNetwork === false ? "../_RESOURCES/UV.jpg" : "../_RESOURCES/white.jpg",
                    "bornDate": bd.bornDate,
                    "dieDate": bd.dieDate,
                    "layoutNodeArgumentData": {
                        // dir
                        "ndirect": [0.0, 0.0, 0.0, 1.0],
                        // pp
                        "particlePolarity": 0.0,
                        // destination
                        "dest": [0.0, 0.0, 0.0, 0.0],
                        // lifeDistance
                        "initPos": pos, "initDir": [0.0, 0.0, 0.0, 0.0],
                        // nodeColor
                        "nodeColor": [1.0, 1.0, 1.0, 1.0],
                        // lock
                        "nodeLock": 0.0 },
                    "onmouseup": function onmouseup(nodeData) {} });
            }

            var startValues = 4;
            var str = "";
            for (var _n3 = startValues; _n3 < startValues + tLinesPointers; _n3++) {
                str += lines[_n3];
            }
            //console.log(str);
            var pointers = str.replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            console.log(pointers);

            str = "";
            for (var _n4 = startValues + tLinesPointers; _n4 < startValues + tLinesPointers + tLinesRowIndices; _n4++) {
                str += lines[_n4];
            }
            //console.log(str);
            var rowIndices = str.replace(/(\s|\t)+/gi, ' ').trim().split(" ");
            console.log(rowIndices);

            var yy = 0;
            for (var _n5 = 0, fn = pointers.length; _n5 < fn; _n5++) {
                var pointer = parseInt(pointers[_n5]) - 1;
                var nextPointer = parseInt(pointers[_n5 + 1]) - 1;

                for (var nb = 0, fnb = nextPointer - pointer; nb < fnb; nb++) {
                    var xx = parseInt(rowIndices[pointer + nb]) - 1;

                    var _bd = jsonIn.generateBornAndDieDates !== undefined && jsonIn.generateBornAndDieDates !== null && jsonIn.generateBornAndDieDates === true ? { "bornDate": "RANDOM", "dieDate": "RANDOM" } : { "bornDate": 1.0, "dieDate": 0.0 };
                    var w = jsonIn.randomLinkWeights !== undefined && jsonIn.randomLinkWeights !== null && jsonIn.randomLinkWeights === true ? "RANDOM" : null;

                    this.addLink({ "origin": xx.toString(),
                        "target": yy.toString(),
                        "directed": true,
                        "bornDate": _bd.bornDate,
                        "dieDate": _bd.dieDate,
                        "weight": w });
                }

                yy++;
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            var removeBuffers = function removeBuffers(comp) {
                var args = comp.gpufG.getAllArgs();
                for (var key in args) {
                    if (args[key] instanceof WebCLGLBuffer === true && key !== "RGB") args[key].remove();
                }
            };
            removeBuffers(this.comp_renderer_nodes);
            for (var na = 0; na < this.linksObj.length; na++) {
                removeBuffers(this.linksObj[na].componentRenderer);
            }for (var _na = 0; _na < this.arrowsObj.length; _na++) {
                removeBuffers(this.arrowsObj[_na].componentRenderer);
            }if (this._enableFont === true) removeBuffers(this.comp_renderer_nodesText);

            this._project.getActiveStage().removeNode(this.nodes);
            for (var _na2 = 0; _na2 < this.linksObj.length; _na2++) {
                this._project.getActiveStage().removeNode(this.linksObj[_na2].node);
            }for (var _na3 = 0; _na3 < this.arrowsObj.length; _na3++) {
                this._project.getActiveStage().removeNode(this.arrowsObj[_na3].node);
            }this._project.getActiveStage().removeNode(this.nodesText);
        }
    }, {
        key: "applyLayout",


        // ██████╗ ██████╗ ██╗   ██╗███████╗ ██████╗ ██████╗
        //██╔════╝ ██╔══██╗██║   ██║██╔════╝██╔═══██╗██╔══██╗
        //██║  ███╗██████╔╝██║   ██║█████╗  ██║   ██║██████╔╝
        //██║   ██║██╔═══╝ ██║   ██║██╔══╝  ██║   ██║██╔══██╗
        //╚██████╔╝██║     ╚██████╔╝██║     ╚██████╔╝██║  ██║
        // ╚═════╝ ╚═╝      ╚═════╝ ╚═╝      ╚═════╝ ╚═╝  ╚═╝
        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argsDirection - example "float4* argA, float* argB, mat4 argC, float4 argD, float argE"
         * @param {String} jsonIn.codeDirection
         * @param {String} jsonIn.argsObject - example "float4* argA, float* argB, mat4 argC, float4 argD, float argE"
         * @param {String} jsonIn.codeObject
         */
        value: function applyLayout(jsonIn) {
            this.layout = jsonIn;
            // Create custom user arrays args
            var createCustomArgsArrays = function createCustomArgsArrays(obj, arr) {
                for (var _n6 = 0, fn = arr.length; _n6 < fn; _n6++) {
                    obj[arr[_n6].trim().split(" ")[1]] = { "arg": arr[_n6].trim(),
                        "nodes_array_value": [],
                        "links_array_value": [],
                        "arrows_array_value": [],
                        "nodestext_array_value": [] };
                }
                return obj;
            };

            this.layout.argsDirection = this.layout.argsDirection !== undefined && this.layout.argsDirection !== null ? this.layout.argsDirection.split(",") : null;
            this.layout.argsObject = this.layout.argsObject !== undefined && this.layout.argsObject !== null ? this.layout.argsObject.split(",") : null;

            this._customArgs = {};
            if (this.layout.argsDirection != null) this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsDirection);

            if (this.layout.argsObject != null) this._customArgs = createCustomArgsArrays(this._customArgs, this.layout.argsObject);
        }
    }, {
        key: "createWebGLBuffers",
        value: function createWebGLBuffers() {
            var _this6 = this;

            var varDef_VFPNode = {
                'float4* posXYZW': function float4PosXYZW() {
                    return null;
                },
                "float4* dataB": function float4DataB() {
                    return null;
                }, // in nodes (SHARED with LINKS, ARROWS & NODESTEXT)
                "float4* dataF": function float4DataF() {
                    return null;
                }, // in nodes
                "float4* dataG": function float4DataG() {
                    return null;
                }, // in nodes
                "float4* dataH": function float4DataH() {
                    return null;
                }, // in nodes
                "float4*attr data": function float4AttrData() {
                    return null;
                }, // in nodes, nodesText, links & arrows
                "float4*attr dataC": function float4AttrDataC() {
                    return null;
                }, // in links & arrows
                'float4*attr nodeVertexPos': function float4AttrNodeVertexPos() {
                    return null;
                },
                'float4*attr nodeVertexNormal': function float4AttrNodeVertexNormal() {
                    return null;
                },
                'float4*attr nodeVertexTexture': function float4AttrNodeVertexTexture() {
                    return null;
                },
                'float*attr letterId': function floatAttrLetterId() {
                    return null;
                },
                'float*attr nodeImgId': function floatAttrNodeImgId() {
                    return null;
                },
                'indices': function indices() {
                    return null;
                },
                "float4* adjacencyMatrix": function float4AdjacencyMatrix() {
                    return null;
                },
                "float4* adjacencyMatrixB": function float4AdjacencyMatrixB() {
                    return null;
                },
                "float4* adjacencyMatrixC": function float4AdjacencyMatrixC() {
                    return null;
                },
                "float widthAdjMatrix": function floatWidthAdjMatrix() {
                    return null;
                },
                'float nodesCount': function floatNodesCount() {
                    return null;
                },
                "float currentTimestamp": function floatCurrentTimestamp() {
                    return null;
                },
                'mat4 PMatrix': function mat4PMatrix() {
                    return null;
                },
                'mat4 cameraWMatrix': function mat4CameraWMatrix() {
                    return null;
                },
                'mat4 nodeWMatrix': function mat4NodeWMatrix() {
                    return null;
                },
                'float isNode': function floatIsNode() {
                    return null;
                },
                'float isLink': function floatIsLink() {
                    return null;
                },
                'float isArrow': function floatIsArrow() {
                    return null;
                },
                'float isNodeText': function floatIsNodeText() {
                    return null;
                },
                'float bufferNodesWidth': function floatBufferNodesWidth() {
                    return null;
                },
                'float bufferLinksWidth': function floatBufferLinksWidth() {
                    return null;
                },
                'float bufferArrowsWidth': function floatBufferArrowsWidth() {
                    return null;
                },
                'float bufferTextsWidth': function floatBufferTextsWidth() {
                    return null;
                },
                'float idToDrag': function floatIdToDrag() {
                    return null;
                },
                'float idToHover': function floatIdToHover() {
                    return null;
                },
                "float enableForceLayout": function floatEnableForceLayout() {
                    return null;
                },
                'float enableForceLayoutCollision': function floatEnableForceLayoutCollision() {
                    return null;
                },
                'float enableNeuronalNetwork': function floatEnableNeuronalNetwork() {
                    return null;
                },
                'float afferentNodesCount': function floatAfferentNodesCount() {
                    return null;
                },
                'float efferentNodesCount': function floatEfferentNodesCount() {
                    return null;
                },
                'float efferentStart': function floatEfferentStart() {
                    return null;
                },
                'float currentTrainLayer': function floatCurrentTrainLayer() {
                    return null;
                },
                'float multiplyOutput': function floatMultiplyOutput() {
                    return null;
                },
                'float only2d': function floatOnly2d() {
                    return null;
                },
                'float nodeImgColumns': function floatNodeImgColumns() {
                    return null;
                },
                'float fontImgColumns': function floatFontImgColumns() {
                    return null;
                },
                'float4* fontsImg': function float4FontsImg() {
                    return null;
                },
                'float4* nodesImg': function float4NodesImg() {
                    return null;
                },
                'float4* nodesImgCrosshair': function float4NodesImgCrosshair() {
                    return null;
                }
            };
            var aC = this.afferentNodesCount === 0 ? 1 : this.afferentNodesCount;
            var eC = this.efferentNodesCount === 0 ? 1 : this.efferentNodesCount;
            varDef_VFPNode['float afferentNodesA[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesA[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesB[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesB[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesC[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesC[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesD[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesD[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesE[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesE[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesF[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesF[' + eC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float afferentNodesG[' + aC + ']'] = function () {
                return null;
            };
            varDef_VFPNode['float efferentNodesG[' + eC + ']'] = function () {
                return null;
            };

            if (this.layout.argsDirection !== undefined && this.layout.argsDirection !== null) {
                for (var _n7 = 0; _n7 < this.layout.argsDirection.length; _n7++) {
                    varDef_VFPNode[this.layout.argsDirection[_n7]] = function () {
                        return null;
                    };
                }
            }

            if (this.layout.argsObject !== undefined && this.layout.argsObject !== null) {
                for (var _n8 = 0; _n8 < this.layout.argsObject.length; _n8++) {
                    varDef_VFPNode[this.layout.argsObject[_n8]] = function () {
                        return null;
                    };
                }
            }

            var varDef_NodesKernel = {
                'float4* dir': function float4Dir() {
                    return null;
                },
                'float nodesCount': function floatNodesCount() {
                    return null;
                },
                'float enableDrag': function floatEnableDrag() {
                    return null;
                },
                'float initialPosX': function floatInitialPosX() {
                    return null;
                },
                'float initialPosY': function floatInitialPosY() {
                    return null;
                },
                'float initialPosZ': function floatInitialPosZ() {
                    return null;
                },
                'float MouseDragTranslationX': function floatMouseDragTranslationX() {
                    return null;
                },
                'float MouseDragTranslationY': function floatMouseDragTranslationY() {
                    return null;
                },
                'float MouseDragTranslationZ': function floatMouseDragTranslationZ() {
                    return null;
                } };

            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          LINKS
            ///////////////////////////////////////////////////////////////////////////////////////////
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setGPUFor(this.linksObj[na].componentRenderer.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "LINKS_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 1,
                    "depthTest": true,
                    "blend": false,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.ONE,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.linksObj[na].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          ARROWS
            ///////////////////////////////////////////////////////////////////////////////////////////
            for (var _na4 = 0; _na4 < this.arrowsObj.length; _na4++) {
                this.arrowsObj[_na4].componentRenderer.setGPUFor(this.arrowsObj[_na4].componentRenderer.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "ARROWS_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 4,
                    "depthTest": true,
                    "blend": true,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.arrowsObj[_na4].componentRenderer.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          NODES
            ///////////////////////////////////////////////////////////////////////////////////////////
            // NODES= nodeId, acums, bornDate, dieDate // LINKS & ARROWS= nodeId origin, nodeId target, currentLineVertex, repeatId
            // bornDate, dieDate, 0.0, 0.0 (NODES share TO LINKS & ARROWS)

            var nodesVarDef = Object.create(varDef_VFPNode);
            for (var key in varDef_NodesKernel) {
                nodesVarDef[key] = varDef_NodesKernel[key];
            }this.comp_renderer_nodes.setGPUFor(this.comp_renderer_nodes.gl, nodesVarDef, { "type": "KERNEL",
                "name": "NODES_KERNEL_DIR",
                "viewSource": false,
                "config": _KERNEL_DIR.KERNEL_DIR.getSrc(this.layout.codeDirection, this._geometryLength, this.currentNodeId - this.efferentNodesCount, this.efferentNodesCount, this._enableNeuronalNetwork),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": false,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ONE }, { "type": "KERNEL",
                "name": "NODES_KERNEL_ADJMATRIX_UPDATE",
                "viewSource": false,
                "config": _KERNEL_ADJMATRIX_UPDATE.KERNEL_ADJMATRIX_UPDATE.getSrc(this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": false,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ONE }, { "type": "GRAPHIC",
                "name": "NODES_VFP_NODE",
                "viewSource": false,
                "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": true,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA }, { "type": "GRAPHIC",
                "name": "NODES_VFP_NODEPICKDRAG",
                "viewSource": false,
                "config": _VFP_NODEPICKDRAG.VFP_NODEPICKDRAG.getSrc(this._geometryLength),
                "drawMode": this._geometryLength === 1 ? 0 : 4,
                "depthTest": true,
                "blend": true,
                "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                "blendSrcMode": Constants.BLENDING_MODES.ONE,
                "blendDstMode": Constants.BLENDING_MODES.ZERO });
            var comp_screenEffects = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU);
            this.comp_renderer_nodes.getComponentBufferArg("RGB", comp_screenEffects);

            // KERNEL_DIR
            this.comp_renderer_nodes.gpufG.onPreProcessKernel(0, function () {
                var currentTimestamp = _this6._initTimestamp + _this6._currentFrame * _this6._timeFrameIncrement;
                _this6.comp_renderer_nodes.setArg("currentTimestamp", function (ts) {
                    return ts;
                }.bind(_this6, currentTimestamp));
                for (var _na5 = 0; _na5 < _this6.linksObj.length; _na5++) {
                    _this6.linksObj[_na5].componentRenderer.setArg("currentTimestamp", function (ts) {
                        return ts;
                    }.bind(_this6, currentTimestamp));
                }for (var _na6 = 0; _na6 < _this6.arrowsObj.length; _na6++) {
                    _this6.arrowsObj[_na6].componentRenderer.setArg("currentTimestamp", function (ts) {
                        return ts;
                    }.bind(_this6, currentTimestamp));
                }if (_this6._playAnimation === true) {
                    _this6._currentFrame++;
                    if (_this6._onAnimationStep !== undefined && _this6._onAnimationStep !== null) _this6._onAnimationStep(_this6._currentFrame);

                    if (_this6._currentFrame === _this6._animationFrames) {
                        _this6._currentFrame = 0;
                        if (_this6._loop === false) {
                            _this6.pauseTimeline();
                            if (_this6._onAnimationEnd !== undefined && _this6._onAnimationEnd !== null) _this6._onAnimationEnd();
                        }
                    }
                    //console.log(currentTimestamp+"  "+this._currentFrame);
                }

                _this6.comp_renderer_nodes.setArg("enableNeuronalNetwork", function () {
                    return _this6._enableNeuronalNetwork;
                });
                for (var _na7 = 0; _na7 < _this6.linksObj.length; _na7++) {
                    _this6.linksObj[_na7].componentRenderer.setArg("enableNeuronalNetwork", function () {
                        return _this6._enableNeuronalNetwork;
                    });
                }for (var _na8 = 0; _na8 < _this6.arrowsObj.length; _na8++) {
                    _this6.arrowsObj[_na8].componentRenderer.setArg("enableNeuronalNetwork", function () {
                        return _this6._enableNeuronalNetwork;
                    });
                }_this6.comp_renderer_nodes.setArg("only2d", function () {
                    return _this6._only2d === true ? 1.0 : 0.0;
                });
            });
            this.comp_renderer_nodes.gpufG.onPostProcessKernel(0, function () {});

            // KERNEL_ADJMATRIX_UPDATE
            this.comp_renderer_nodes.gpufG.onPreProcessKernel(1, function () {});
            this.comp_renderer_nodes.gpufG.onPostProcessKernel(1, function () {});
            this.comp_renderer_nodes.gpufG.disableKernel(1);

            // VFP_NODE
            this.comp_renderer_nodes.gpufG.onPreProcessGraphic(0, function () {});
            this.comp_renderer_nodes.gpufG.onPostProcessGraphic(0, function () {});

            // VFP_NODEPICKDRAG
            this.comp_renderer_nodes.gpufG.onPreProcessGraphic(1, function () {
                //this.comp_renderer_nodes.gl.clear(this.comp_renderer_nodes.gl.COLOR_BUFFER_BIT | this.comp_renderer_nodes.gl.DEPTH_BUFFER_BIT);
            });
            this.comp_renderer_nodes.gpufG.onPostProcessGraphic(1, function () {
                _this6.procSelectedOrHover();
            });

            this.comp_renderer_nodes.gpufG.disableGraphic(1);

            ///////////////////////////////////////////////////////////////////////////////////////////
            //                          NODESTEXT
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setGPUFor(this.comp_renderer_nodesText.gl, Object.create(varDef_VFPNode), { "type": "GRAPHIC",
                    "name": "NODESTEXT_VFP_NODE",
                    "viewSource": false,
                    "config": _VFP_NODE.VFP_NODE.getSrc(this.layout.codeObject, this._geometryLength),
                    "drawMode": 4,
                    "depthTest": true,
                    "blend": true,
                    "blendEquation": Constants.BLENDING_EQUATION_TYPES.FUNC_ADD,
                    "blendSrcMode": Constants.BLENDING_MODES.SRC_ALPHA,
                    "blendDstMode": Constants.BLENDING_MODES.ONE_MINUS_SRC_ALPHA });
                this.comp_renderer_nodesText.getComponentBufferArg("RGB", this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.GPU));
            }

            this.enableHov(-1);

            this.updateNodes();
            this.updateLinks();
        }
    }, {
        key: "mouseDown",
        value: function mouseDown() {
            if (this._enableHover === false) {
                this.readPixel = true;

                this.comp_renderer_nodes.gpufG.enableGraphic(1);
            }
        }
    }, {
        key: "mouseUp",
        value: function mouseUp() {
            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
            }for (var _na9 = 0; _na9 < this.arrowsObj.length; _na9++) {
                this.arrowsObj[_na9].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
            }if (this._enableFont === true) this.comp_renderer_nodesText.setArg("enableDrag", function () {
                return 0;
            });

            if (this.selectedId === -1) {
                this.comp_renderer_nodes.setArg("idToDrag", function () {
                    return -1;
                });
                for (var _na10 = 0; _na10 < this.linksObj.length; _na10++) {
                    this.linksObj[_na10].componentRenderer.setArg("idToDrag", function () {
                        return -1;
                    });
                }for (var _na11 = 0; _na11 < this.arrowsObj.length; _na11++) {
                    this.arrowsObj[_na11].componentRenderer.setArg("idToDrag", function () {
                        return -1;
                    });
                }if (this._enableFont === true) this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return -1;
                });
            }

            if (this._enableHover === true) {
                this.readPixel = true;

                this.comp_renderer_nodes.gpufG.enableGraphic(1);
            }
        }
    }, {
        key: "procSelectedOrHover",
        value: function procSelectedOrHover() {
            if (this._enableHover === false) {
                if (this.readPixel === true) {
                    this.readPixel = false;

                    this.readPix();

                    this.comp_renderer_nodes.gpufG.disableGraphic(1);
                }
            } else {
                var comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.readPixel = false;
                }

                this.readPix();

                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.comp_renderer_nodes.gpufG.disableGraphic(1);
                }
            }
        }
    }, {
        key: "readPix",
        value: function readPix() {
            var arrayPick = new Uint8Array(4);
            var mousePos = this._sce.getEvents().getMousePosition();
            this._gl.readPixels(mousePos.x, this._sce.getCanvas().height - mousePos.y, 1, 1, this._gl.RGBA, this._gl.UNSIGNED_BYTE, arrayPick);

            var unpackValue = this._utils.unpack([arrayPick[0] / 255, arrayPick[1] / 255, arrayPick[2] / 255, arrayPick[3] / 255]); // value from 0.0 to 1.0
            this.selectedId = Math.round(unpackValue * 1000000.0) - 1.0;
            //console.log("hoverId: "+this.selectedId);
            if (this.selectedId !== -1 && this.selectedId < this.currentNodeId) {
                var node = this._nodesById[this.selectedId];
                if (node !== undefined && node !== null && node.onmousedown !== undefined && node.onmousedown !== null) node.onmousedown(node);

                if (node !== undefined && node !== null && this._onClickNode !== undefined && this._onClickNode !== null) this._onClickNode(node);

                var arr4Uint8_XYZW = this.comp_renderer_nodes.gpufG.readArg("posXYZW");
                var x = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4];
                var y = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4 + 1];
                var z = arr4Uint8_XYZW[this._nodesById[this.selectedId].itemStart * 4 + 2];
                this._initialPosDrag = $V3([x, y, z]);

                this.makeDrag(null, $V3([0.0, 0.0, 0.0]));
            }
        }
    }, {
        key: "makeDrag",


        /**
         * @param {MouseEvent} [evt]
         * @param {StormV3} dir
         */
        value: function makeDrag(evt, dir) {
            var comp_controller_trans_target = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET);

            if (this._enableHover === false) {
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    if (this.selectedId === -1) this.disableDrag();else {
                        this.enableDrag(this.selectedId, dir);
                        console.log("selectedId: " + this.selectedId);
                    }
                }
            } else {
                if (comp_controller_trans_target.isLeftBtnActive() === true) {
                    this.enableHov(-1);

                    if (this.selectedId === -1) this.disableDrag();else {
                        this.enableDrag(this.selectedId, dir);
                        console.log("selectedId: " + this.selectedId);
                    }
                } else {
                    this.enableHov(this.selectedId);
                }
            }
        }
    }, {
        key: "enableHov",


        /**
         * @param {int} selectedId
         */
        value: function enableHov(selectedId) {
            this.comp_renderer_nodes.setArg("idToHover", function () {
                return selectedId;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("idToHover", function () {
                    return selectedId;
                });
            }for (var _na12 = 0; _na12 < this.arrowsObj.length; _na12++) {
                this.arrowsObj[_na12].componentRenderer.setArg("idToHover", function () {
                    return selectedId;
                });
            }if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("idToHover", function () {
                    return selectedId;
                });
            }
        }
    }, {
        key: "enableDrag",


        /**
         * @param {int} selectedId
         * @param {StormV3} dir
         */
        value: function enableDrag(selectedId, dir) {
            var _this7 = this;

            var comp_projection = this._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION);
            var finalPos = this._initialPosDrag.add(dir.x(comp_projection.getFov() * 2.0 / this._sce.getCanvas().width));

            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 1;
            });
            this.comp_renderer_nodes.setArg("idToDrag", function () {
                return selectedId;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationX", function () {
                return finalPos.e[0];
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationY", function () {
                return finalPos.e[1];
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationZ", function () {
                return finalPos.e[2];
            });
            this.comp_renderer_nodes.setArg("initialPosX", function () {
                return _this7._initialPosDrag.e[0];
            });
            this.comp_renderer_nodes.setArg("initialPosY", function () {
                return _this7._initialPosDrag.e[1];
            });
            this.comp_renderer_nodes.setArg("initialPosZ", function () {
                return _this7._initialPosDrag.e[2];
            });

            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 1;
                });
                this.linksObj[na].componentRenderer.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.linksObj[na].componentRenderer.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }

            for (var _na13 = 0; _na13 < this.arrowsObj.length; _na13++) {
                this.arrowsObj[_na13].componentRenderer.setArg("enableDrag", function () {
                    return 1;
                });
                this.arrowsObj[_na13].componentRenderer.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.arrowsObj[_na13].componentRenderer.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }

            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("enableDrag", function () {
                    return 1;
                });
                this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return selectedId;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationX", function () {
                    return finalPos.e[0];
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationY", function () {
                    return finalPos.e[1];
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", function () {
                    return finalPos.e[2];
                });
                this.comp_renderer_nodesText.setArg("initialPosX", function () {
                    return _this7._initialPosDrag.e[0];
                });
                this.comp_renderer_nodesText.setArg("initialPosY", function () {
                    return _this7._initialPosDrag.e[1];
                });
                this.comp_renderer_nodesText.setArg("initialPosZ", function () {
                    return _this7._initialPosDrag.e[2];
                });
            }
        }
    }, {
        key: "disableDrag",


        /**
         * disableDrag
         */
        value: function disableDrag() {
            this.comp_renderer_nodes.setArg("enableDrag", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("idToDrag", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationX", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationY", function () {
                return 0;
            });
            this.comp_renderer_nodes.setArg("MouseDragTranslationZ", function () {
                return 0;
            });

            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("idToDrag", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.linksObj[na].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }

            for (var _na14 = 0; _na14 < this.arrowsObj.length; _na14++) {
                this.arrowsObj[_na14].componentRenderer.setArg("enableDrag", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("idToDrag", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.arrowsObj[_na14].componentRenderer.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }

            if (this._enableFont === true) {
                this.comp_renderer_nodesText.setArg("enableDrag", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("idToDrag", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationX", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationY", function () {
                    return 0;
                });
                this.comp_renderer_nodesText.setArg("MouseDragTranslationZ", function () {
                    return 0;
                });
            }
        }
    }, {
        key: "enableNeuronalNetwork",
        value: function enableNeuronalNetwork() {
            this._enableNeuronalNetwork = true;

            this.disableAutoLink();

            // APPLY THIS LAYOUT
            this.applyLayout({
                // DIRECTION
                "argsDirection":
                // destination
                "float4* dest,float* enableDestination",
                "codeDirection":
                // destination
                "if(enableDestination[x] == 1.0) {\n                    vec3 destinationPos = dest[x].xyz;\n                    vec3 dirDestination = normalize(destinationPos-currentPos);\n                    float distan = abs(distance(currentPos,destinationPos));\n                    float dirDestWeight = sqrt(distan);\n                    currentDir = (currentDir+(dirDestination*dirDestWeight))*dirDestWeight*0.1;\n                }",

                // OBJECT
                "argsObject":
                // nodeColor
                "float4*attr nodeColor",
                "codeObject":
                // nodeColor
                //'if(isNode == 1.0) nodeVertexColor = nodeColor[x];'+
                //'if(isLink == 1.0 && currentLineVertex == 1.0) nodeVertexColor = vec4(0.0, 1.0, 0.0, 1.0);'+ // this is isTarget for arrows

                //'float degr = (currentLineVertex/vertexCount)/2.0;'+
                //'if(isLink == 1.0) nodeVertexColor = vec4(0.3, 0.2, 0.2, 1.0);'+ // this is isTarget for arrows
                'if(isArrow == 1.0 && currentLineVertex == 1.0) nodeVertexColor = vec4(0.3, 0.2, 0.2, 1.0);' + // this is isTarget for arrows
                'if(isArrow == 1.0 && currentLineVertex == 0.0) nodeVertexColor = vec4(1.0, 0.0, 0.0, 0.0);' // this is isTarget for arrows

            });
        }
    }, {
        key: "disableNeuronalNetwork",
        value: function disableNeuronalNetwork() {
            this._enableNeuronalNetwork = false;
        }
    }, {
        key: "addNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addNeuron(neuronName, destination) {
            var offs = 1000;
            var pos = [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];
            var dest = destination !== undefined && destination !== null ? destination : [0.0, 0.0, 0.0, 1.0];
            var enableDest = destination !== undefined && destination !== null ? 1.0 : 0.0;

            this.addNode({
                "name": neuronName,
                "data": neuronName,
                "label": neuronName.toString(),
                "position": pos,
                "color": "../_RESOURCES/white.jpg",
                "layoutNodeArgumentData": {
                    "nodeColor": [1.0, 1.0, 1.0, 1.0],
                    "enableDestination": enableDest,
                    "dest": dest
                },
                "onmouseup": function onmouseup(nodeData) {} });
        }
    }, {
        key: "addAfferentNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addAfferentNeuron(neuronName, destination) {
            this.afferentNeuron.push(neuronName);
            this.addNeuron(neuronName, destination);
        }
    }, {
        key: "addEfferentNeuron",


        /**
         * @param {String} neuronName
         * @param {Array<number>} [destination=[0.0, 0.0, 0.0, 1.0]]
         */
        value: function addEfferentNeuron(neuronName, destination) {
            this.efferentNeuron.push(neuronName);
            this.addNeuron(neuronName, destination);
        }
    }, {
        key: "createNeuronLayer",
        value: function createNeuronLayer(numX, numY, pos, nodSep) {
            var arr = [];
            for (var x = 0; x < numX; x++) {
                for (var y = 0; y < numY; y++) {
                    var position = [pos[0] + (x - numX / 2) * nodSep, pos[1], pos[2] + (y - numY / 2) * nodSep, pos[3]];

                    this.addNeuron(this.currHiddenNeuron.toString(), position);
                    arr.push(this.currHiddenNeuron);
                    this.currHiddenNeuron++;
                }
            }

            return arr;
        }
    }, {
        key: "createXYNeuronsFromImage",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuron
         * @param {Array<number>} jsonIn.position
         * @param {int} jsonIn.w
         * @param {int} jsonIn.h
         */
        value: function createXYNeuronsFromImage(jsonIn) {
            var arr = [];
            for (var x = 0; x < jsonIn.w; x++) {
                for (var y = 0; y < jsonIn.h; y++) {
                    var position = [jsonIn.position[0] + (y - jsonIn.w / 2) * this.nodSep, jsonIn.position[1], jsonIn.position[2] + (x - jsonIn.h / 2) * this.nodSep, jsonIn.position[3]];

                    this.addNeuron(jsonIn.neuron + x + "_" + y, position);
                    arr.push(jsonIn.neuron + x + "_" + y);
                }
            }

            return arr;
        }
    }, {
        key: "createConvXYNeuronsFromXYNeurons",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} jsonIn.position
         * @param {int} jsonIn.w
         * @param {int} jsonIn.h
         * @param {String} jsonIn.idOrigin
         * @param {String} jsonIn.idTarget
         * @param {int} jsonIn.activationFunc
         * @param {Array<number>} jsonIn.convMatrix
         */
        value: function createConvXYNeuronsFromXYNeurons(jsonIn) {
            var arr = [];
            for (var x = 0; x < jsonIn.w - 2; x++) {
                for (var y = 0; y < jsonIn.h - 2; y++) {
                    var position = [jsonIn.position[0] + (y - jsonIn.w / 2) * this.nodSep, jsonIn.position[1], jsonIn.position[2] + (x - jsonIn.h / 2) * this.nodSep, jsonIn.position[3]];

                    this.addNeuron(jsonIn.idTarget + x + "_" + y, position);
                    arr.push(jsonIn.idTarget + x + "_" + y);

                    var idConvM = 0;
                    for (var xa = x; xa < x + 3; xa++) {
                        for (var ya = y; ya < y + 3; ya++) {
                            this.addSinapsis({ "neuronNameA": jsonIn.idOrigin + xa + "_" + ya,
                                "neuronNameB": jsonIn.idTarget + x + "_" + y,
                                "activationFunc": jsonIn.activationFunc,
                                "multiplier": jsonIn.convMatrix[idConvM],
                                "layerNum": 0 }); //TODO layerNum
                            idConvM++;
                        }
                    }
                }
            }

            return arr;
        }
    }, {
        key: "addSinapsis",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuronNameA
         * @param {String} jsonIn.neuronNameB
         * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
         * @param {number} [jsonIn.weight]
         * @param {number} [jsonIn.multiplier=1.0]
         * @param {int} jsonIn.layerNum
         */
        value: function addSinapsis(jsonIn) {
            var _this8 = this;

            var gaussRandom = function gaussRandom() {
                if (_this8.return_v === true) {
                    _this8.return_v = false;
                    return _this8.v_val;
                }
                var u = 2 * Math.random() - 1;
                var v = 2 * Math.random() - 1;
                var r = u * u + v * v;
                if (r === 0 || r > 1) return gaussRandom();
                var c = Math.sqrt(-2 * Math.log(r) / r);
                _this8.v_val = v * c; // cache this
                _this8.return_v = true;
                return u * c;
            };
            var randn = function randn(mu, std) {
                return mu + gaussRandom() * std;
            };

            var scale = Math.sqrt(1.0 / 50);

            var _activationFunc = jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null ? jsonIn.activationFunc : 1.0;
            var _weight = jsonIn.weight !== undefined && jsonIn.weight !== null ? jsonIn.weight : randn(0.0, scale);
            var _linkMultiplier = jsonIn.multiplier !== undefined && jsonIn.multiplier !== null ? jsonIn.multiplier : 1.0;

            this.addLink({
                "origin": jsonIn.neuronNameA,
                "target": jsonIn.neuronNameB,
                "directed": true,
                "showArrow": false,
                "activationFunc": _activationFunc,
                "weight": _weight,
                "linkMultiplier": _linkMultiplier,
                "layerNum": jsonIn.layerNum });
        }
    }, {
        key: "connectNeuronWithNeuronLayer",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.neuron
         * @param {Array<int>} jsonIn.neuronLayer
         * @param {int} [jsonIn.activationFunc=1.0] 1.0=use weight*data;0.0=use multiplier*data
         * @param {number|null} [jsonIn.weight]
         * @param {number} [jsonIn.multiplier=1.0]
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronWithNeuronLayer(jsonIn) {
            for (var _n9 = 0; _n9 < jsonIn.neuronLayer.length; _n9++) {
                this.addSinapsis({ "neuronNameA": jsonIn.neuron.toString(),
                    "neuronNameB": jsonIn.neuronLayer[_n9].toString(),
                    "activationFunc": jsonIn.activationFunc,
                    "weight": jsonIn.weight,
                    "multiplier": jsonIn.multiplier,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "connectNeuronLayerWithNeuron",


        /**
         * @param {Object} jsonIn
         * @param {Array<int>} jsonIn.neuronLayer
         * @param {String} jsonIn.neuron
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronLayerWithNeuron(jsonIn) {
            for (var _n10 = 0; _n10 < jsonIn.neuronLayer.length; _n10++) {
                this.addSinapsis({ "neuronNameA": jsonIn.neuronLayer[_n10].toString(),
                    "neuronNameB": jsonIn.neuron,
                    "activationFunc": 1.0,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "connectNeuronLayerWithNeuronLayer",


        /**
         * @param {Object} jsonIn
         * @param {Array<int>} jsonIn.neuronLayerOrigin
         * @param {Array<int>} jsonIn.neuronLayerTarget
         * @param {int} jsonIn.layerNum
         */
        value: function connectNeuronLayerWithNeuronLayer(jsonIn) {
            for (var _n11 = 0; _n11 < jsonIn.neuronLayerOrigin.length; _n11++) {
                var neuronOrigin = jsonIn.neuronLayerOrigin[_n11];
                this.connectNeuronWithNeuronLayer({ "neuron": neuronOrigin.toString(),
                    "neuronLayer": jsonIn.neuronLayerTarget,
                    "layerNum": jsonIn.layerNum });
            }
        }
    }, {
        key: "forward",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} jsonIn.state
         * @param {Function} jsonIn.onAction
         */
        value: function forward(jsonIn) {
            var _this9 = this;

            this.onAction = jsonIn.onAction;

            var state = jsonIn.state.slice(0);
            var length = jsonIn.state.length;
            for (var _n12 = length; _n12 < this.afferentNodesCount; _n12++) {
                state[_n12] = 0.0;
            }var lett = ["A", "B", "C", "D", "E", "F", "G"];
            var currLett = 0;

            var _loop = function _loop(i, j) {
                _this9.comp_renderer_nodes.setArg("afferentNodes" + lett[currLett++], function () {
                    return state.slice(i, i + _this9.afferentNodesCount);
                });
            };

            for (var i = 0, j = state.length; i < j; i += this.afferentNodesCount) {
                _loop(i, j);
            }for (var _n13 = 0; _n13 < this.layerCount; _n13++) {
                this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);
            }this._sce.getLoadedProject().getActiveStage().tick();

            if (this.onAction !== null) {
                var loc = [["dataB", 2], ["dataF", 0], ["dataF", 2], ["dataG", 0], ["dataG", 2], ["dataH", 0], ["dataH", 2]];
                var o = [[]];
                var currO = 0;
                for (var _n14 = 0; _n14 < this.efferentNodesCount * this.batch_size; _n14++) {
                    if (o[currO].length === this.efferentNodesCount) {
                        o.push([]);
                        currO++;
                    }

                    var u = this.getNeuronOutput(this.efferentNeuron[o[currO].length], loc[currO]);
                    if (isNaN(u[2]) === true) debugger;
                    o[currO].push({ "output": u[loc[currO][1]] });
                }
                this.onAction(o);
            }
        }
    }, {
        key: "train",


        /**
         * @param {Object} jsonIn
         * @param {Object} jsonIn.arrReward
         * @param {Function} jsonIn.onTrained
         */
        value: function train(jsonIn) {
            var _this10 = this;

            this.onTrained = jsonIn.onTrained;

            var reward = jsonIn.arrReward.slice(0);
            var length = jsonIn.arrReward.length;
            for (var _n15 = length; _n15 < this.efferentNodesCount * this.batch_size; _n15++) {
                reward[_n15] = 0.0;
            }var lett = ["A", "B", "C", "D", "E", "F", "G"];
            var currLett = 0;

            var _loop2 = function _loop2(i, j) {
                _this10.comp_renderer_nodes.setArg("efferentNodes" + lett[currLett++], function () {
                    return reward.slice(i, i + _this10.efferentNodesCount);
                });
            };

            for (var i = 0, j = reward.length; i < j; i += this.efferentNodesCount) {
                _loop2(i, j);
            }for (var _n16 = 0; _n16 < this.layerCount - 1; _n16++) {
                this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[0], true, true);
            } //this.comp_renderer_nodes.gpufG.disableKernel(0);
            this.comp_renderer_nodes.gpufG.enableKernel(1);
            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return 10;
            });
            this._sce.getLoadedProject().getActiveStage().tick();
            //this.comp_renderer_nodes.tick();
            //this.comp_renderer_nodes.gpufG.processKernel(this.comp_renderer_nodes.gpufG.kernels[1], true, true);
            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return -3;
            });
            this.comp_renderer_nodes.gpufG.disableKernel(1);
            //this.comp_renderer_nodes.gpufG.enableKernel(0);

            if (this.onTrained !== null) {
                var o = [];
                for (var _n17 = 0; _n17 < this.efferentNodesCount; _n17++) {
                    /*let u = this.getNeuronOutput(this.efferentNeuron[n]);
                    if(isNaN(u[2]) === true || isNaN(u[3]) === true)
                        debugger;
                    o.push({"output": u[2], "error": u[3]});*/
                }
                this.onTrained(o);
            }
        }
    }, {
        key: "getNeuronOutput",
        value: function getNeuronOutput(neuronName, loc) {
            var arr4Uint8_XYZW = this.comp_renderer_nodes.gpufG.readArg(loc[0]);

            var n = this._nodesByName[neuronName].itemStart * 4;
            return [arr4Uint8_XYZW[n], arr4Uint8_XYZW[n + 1], arr4Uint8_XYZW[n + 2], arr4Uint8_XYZW[n + 3]];
        }
    }, {
        key: "setLayoutArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argName
         * @param {number|Array<number>} jsonIn.value [number, number, number, number]
         */
        value: function setLayoutArgumentData(jsonIn) {
            this._customArgs[jsonIn.argName]["nodes_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["links_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["arrows_array_value"] = jsonIn.value;
            this._customArgs[jsonIn.argName]["nodestext_array_value"] = jsonIn.value;
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return jsonIn.value;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return jsonIn.value;
                });
            }for (var _na15 = 0; _na15 < this.arrowsObj.length; _na15++) {
                this.arrowsObj[_na15].componentRenderer.setArg(jsonIn.argName, function () {
                    return jsonIn.value;
                });
            }if (this._enableFont === true) this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                return jsonIn.value;
            });
        }
    }, {
        key: "getLayoutNodeArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.nodeName
         * @param {String} jsonIn.argName
         * @returns {number|Array<number>}
         */
        value: function getLayoutNodeArgumentData(jsonIn) {
            var node = this._nodesByName[jsonIn.nodeName];
            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            for (var _n18 = 0; _n18 < this.arrayNodeData.length / 4; _n18++) {
                if (jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[_n18 * 4] === node.nodeId) {
                    var ca = this._customArgs[jsonIn.argName]["nodes_array_value"];
                    if (type === "float") {
                        var id = _n18;
                        if (ca[id] !== undefined && ca[id] !== null) return ca[id];
                    } else {
                        var _id = _n18 * 4;
                        if (ca[_id] !== undefined && ca[_id] !== null) return [ca[_id], ca[_id + 1], ca[_id + 2], ca[_id + 3]];
                    }
                }
            }
        }
    }, {
        key: "setLayoutNodeArgumentData",


        /**
         * @param {Object} jsonIn
         * @param {String} [jsonIn.nodeName=undefined] - If undefined then value is setted in all nodes
         * @param {String} jsonIn.argName
         * @param {number|Array<number>} jsonIn.value [number, number, number, number]
         * @param {boolean} jsonIn.update
         */
        value: function setLayoutNodeArgumentData(jsonIn) {
            var _this11 = this;

            var node = this._nodesByName[jsonIn.nodeName];
            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            /**
             * @param {String} type - "float" | "float4"
             * @param {String} argName -
             * @param {String} targetArray - "nodes_array_value" | "links_array_value" | "arrows_array_value" | "nodestext_array_value"
             * @param {int} n
             * @param {number} value
             */
            var setVal = function setVal(type, argName, targetArray, n, value) {
                if (type === "float") {
                    _this11._customArgs[argName][targetArray][n] = value;
                } else {
                    var id = n * 4;
                    _this11._customArgs[argName][targetArray][id] = value[0];
                    _this11._customArgs[argName][targetArray][id + 1] = value[1];
                    _this11._customArgs[argName][targetArray][id + 2] = value[2];
                    _this11._customArgs[argName][targetArray][id + 3] = value[3];
                }
            };

            // nodes id
            for (var _n19 = 0; _n19 < this.arrayNodeData.length / 4; _n19++) {
                if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeData[_n19 * 4] === node.nodeId) setVal(type, jsonIn.argName, "nodes_array_value", _n19, jsonIn.value);else {
                    var id = type === "float" ? _n19 : _n19 * 4;
                    if (this._customArgs[jsonIn.argName]["nodes_array_value"][id] === undefined && this._customArgs[jsonIn.argName]["nodes_array_value"][id] === null && jsonIn.update === false) {
                        if (type === "float") setVal(type, jsonIn.argName, "nodes_array_value", _n19, 0.0);else setVal(type, jsonIn.argName, "nodes_array_value", _n19, [0.0, 0.0, 0.0, 0.0]);
                    }
                }
            }
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return _this11._customArgs[jsonIn.argName].nodes_array_value;
            });

            // link id
            for (var na = 0; na < this.linksObj.length; na++) {
                for (var _n20 = 0; _n20 < this.linksObj[na].arrayLinkData.length / 4; _n20++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.linksObj[na].arrayLinkData[_n20 * 4] === node.nodeId) setVal(type, jsonIn.argName, "links_array_value", _n20, jsonIn.value);else {
                        var _id2 = type === "float" ? _n20 : _n20 * 4;
                        if (this._customArgs[jsonIn.argName]["links_array_value"][_id2] === undefined && this._customArgs[jsonIn.argName]["links_array_value"][_id2] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "links_array_value", _n20, 0.0);else setVal(type, jsonIn.argName, "links_array_value", _n20, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].links_array_value;
                });
            }

            // arrow id
            for (var _na16 = 0; _na16 < this.arrowsObj.length; _na16++) {
                for (var _n21 = 0; _n21 < this.arrowsObj[_na16].arrayArrowData.length / 4; _n21++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrowsObj[_na16].arrayArrowData[_n21 * 4] === node.nodeId) setVal(type, jsonIn.argName, "arrows_array_value", _n21, jsonIn.value);else {
                        var _id3 = type === "float" ? _n21 : _n21 * 4;
                        if (this._customArgs[jsonIn.argName]["arrows_array_value"][_id3] === undefined && this._customArgs[jsonIn.argName]["arrows_array_value"][_id3] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "arrows_array_value", _n21, 0.0);else setVal(type, jsonIn.argName, "arrows_array_value", _n21, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.arrowsObj[_na16].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].arrows_array_value;
                });
            }

            if (this._enableFont === true) {
                // nodeText id
                for (var _n22 = 0; _n22 < this.arrayNodeTextData.length / 4; _n22++) {
                    if (jsonIn.nodeName === undefined || jsonIn.nodeName === null || jsonIn.nodeName !== undefined && jsonIn.nodeName !== null && this.arrayNodeTextData[_n22 * 4] === node.nodeId) setVal(type, jsonIn.argName, "nodestext_array_value", _n22, jsonIn.value);else {
                        var _id4 = type === "float" ? _n22 : _n22 * 4;
                        if (this._customArgs[jsonIn.argName]["nodestext_array_value"][_id4] === undefined && this._customArgs[jsonIn.argName]["nodestext_array_value"][_id4] === null && jsonIn.update === false) {
                            if (type === "float") setVal(type, jsonIn.argName, "nodestext_array_value", _n22, 0.0);else setVal(type, jsonIn.argName, "nodestext_array_value", _n22, [0.0, 0.0, 0.0, 0.0]);
                        }
                    }
                }
                this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                    return _this11._customArgs[jsonIn.argName].nodestext_array_value;
                });
            }
        }
    }, {
        key: "setLayoutNodeArgumentArrayData",


        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.argName
         * @param {Array<number>} jsonIn.value [number] or [number, number, number, number]
         */
        value: function setLayoutNodeArgumentArrayData(jsonIn) {
            var _this12 = this;

            var expl = this._customArgs[jsonIn.argName].arg.split("*");
            var type = expl[0]; // float or float4

            // nodes
            var currentId = -1;
            var x = 0,
                y = 0,
                z = 0,
                w = 0;
            this._customArgs[jsonIn.argName].nodes_array_value = [];
            for (var _n23 = 0; _n23 < this.arrayNodeData.length / 4; _n23++) {
                if (currentId !== this.arrayNodeData[_n23 * 4]) {
                    currentId = this.arrayNodeData[_n23 * 4];

                    if (type === "float") {
                        x = jsonIn.value[currentId];
                        this._customArgs[jsonIn.argName].nodes_array_value.push(x);
                    } else {
                        x = jsonIn.value[currentId * 4];
                        y = jsonIn.value[currentId * 4 + 1];
                        z = jsonIn.value[currentId * 4 + 2];
                        w = jsonIn.value[currentId * 4 + 3];
                        this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
                    }
                } else {
                    if (type === "float") this._customArgs[jsonIn.argName].nodes_array_value.push(x);else this._customArgs[jsonIn.argName].nodes_array_value.push(x, y, z, w);
                }
            }
            this.comp_renderer_nodes.setArg(jsonIn.argName, function () {
                return _this12._customArgs[jsonIn.argName].nodes_array_value;
            });

            // links
            this._customArgs[jsonIn.argName].links_array_value = [];
            for (var na = 0; na < this.linksObj.length; na++) {
                for (var _n24 = 0; _n24 < this.linksObj[na].arrayLinkNodeName.length; _n24++) {
                    var currentLinkNodeName = this.linksObj[na].arrayLinkNodeName[_n24];
                    var nodeNameItemStart = this._nodesByName[currentLinkNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].links_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart]);
                    } else {
                        this._customArgs[jsonIn.argName].links_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[nodeNameItemStart * 4 + 3]);
                    }
                }
                this.linksObj[na].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].links_array_value;
                });
            }

            // arrows
            this._customArgs[jsonIn.argName].arrows_array_value = [];
            for (var _na17 = 0; _na17 < this.arrowsObj.length; _na17++) {
                for (var _n25 = 0; _n25 < this.arrowsObj[_na17].arrayArrowNodeName.length; _n25++) {
                    var currentArrowNodeName = this.arrowsObj[_na17].arrayArrowNodeName[_n25];
                    var _nodeNameItemStart = this._nodesByName[currentArrowNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart]);
                    } else {
                        this._customArgs[jsonIn.argName].arrows_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart * 4 + 3]);
                    }
                }
                this.arrowsObj[_na17].componentRenderer.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].arrows_array_value;
                });
            }

            // nodestext
            if (this._enableFont === true) {
                this._customArgs[jsonIn.argName].nodestext_array_value = [];
                for (var _n26 = 0; _n26 < this.arrayNodeTextNodeName.length; _n26++) {
                    var currentNodeTextNodeName = this.arrayNodeTextNodeName[_n26];
                    var _nodeNameItemStart2 = this._nodesByName[currentNodeTextNodeName].itemStart;

                    if (type === "float") {
                        this._customArgs[jsonIn.argName].nodestext_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2]);
                    } else {
                        this._customArgs[jsonIn.argName].nodestext_array_value.push(this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 1], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 2], this._customArgs[jsonIn.argName].nodes_array_value[_nodeNameItemStart2 * 4 + 3]);
                    }
                }
                this.comp_renderer_nodesText.setArg(jsonIn.argName, function () {
                    return _this12._customArgs[jsonIn.argName].nodestext_array_value;
                });
            }
        }
    }, {
        key: "addNode",


        // █████╗ ██████╗ ██████╗     ███╗   ██╗ ██████╗ ██████╗ ███████╗
        //██╔══██╗██╔══██╗██╔══██╗    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝
        //███████║██║  ██║██║  ██║    ██╔██╗ ██║██║   ██║██║  ██║█████╗
        //██╔══██║██║  ██║██║  ██║    ██║╚██╗██║██║   ██║██║  ██║██╔══╝
        //██║  ██║██████╔╝██████╔╝    ██║ ╚████║╚██████╔╝██████╔╝███████╗
        //╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝
        /**
        * @param {Object} jsonIn
        * @param {String} jsonIn.name - Name of node
           * @param {String} [jsonIn.label=undefined] - Label to show
        * @param {String} [jsonIn.data=""] - Custom data associated to this node
        * @param {Array<number>} [jsonIn.position=new Array(Math.Random(), Math.Random(), Math.Random(), 1.0)] - Position of node
        * @param {String} [jsonIn.color=undefined] - URL of image
           * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
           * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
        * @param {Object} [jsonIn.layoutNodeArgumentData=undefined] - Data for the custom layout
        * @param {Function} [jsonIn.onmousedown=undefined] - Event when mousedown
        * @param {Function} [jsonIn.onmouseup=undefined] - Event when mouseup
        * @returns {String|boolean} - Name of node
         */
        value: function addNode(jsonIn) {
            if (this._nodesByName.hasOwnProperty(jsonIn.name) === false) {
                var node = this.createNode(jsonIn);
                this._nodesByName[jsonIn.name] = node;
                this._nodesById[node.nodeId] = node;

                if (node.label !== undefined && node.label !== null && this._enableFont === true) this.createNodeText(node);

                console.log("%cnode " + Object.keys(this._nodesByName).length + " (" + jsonIn.name + ")", "color:green");

                return jsonIn.name;
            } else {
                console.log("node " + jsonIn.name + " already exists");
                return false;
            }
        }
    }, {
        key: "createNode",


        /**
         * @param {Object} jsonIn
         * @param {Array<number>} [jsonIn.position=[Math.Random(), Math.Random(), Math.Random(), 1.0]] - Position of node
         * @param {Object} [jsonIn.layoutNodeArgumentData=undefined]
         * @param {String} [jsonIn.color]
         * @param {int} [jsonIn.nodeId]
         * @param {int} [jsonIn.itemStart]
         * @returns {Object}
         */
        value: function createNode(jsonIn) {
            var nAIS = this.nodeArrayItemStart;

            var offs = 100.0;
            var pos = jsonIn.position !== undefined && jsonIn.position !== null ? jsonIn.position : [-(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, -(offs / 2) + Math.random() * offs, 1.0];

            var color = jsonIn.color;

            var nodeImgId = -1;
            if (color !== undefined && color !== null && color.constructor === String) {
                // color is string URL
                if (this.objNodeImages.hasOwnProperty(color) === false) {
                    var locationIdx = Object.keys(this.objNodeImages).length;
                    this.objNodeImages[color] = locationIdx;

                    this.addNodesImage(color, locationIdx);
                }
                nodeImgId = this.objNodeImages[color];
            }
            for (var _n27 = 0; _n27 < this.mesh_nodes.vertexArray.length / 4; _n27++) {
                var idxVertex = _n27 * 4;

                var ts = this.getBornDieTS(jsonIn.bornDate, jsonIn.dieDate);
                this.arrayNodeData.push(this.currentNodeId, 0.0, ts.bornDate, ts.dieDate);
                this.arrayNodeDataB.push(ts.bornDate, ts.dieDate, 0.0, 0.0);
                this.arrayNodeDataF.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodeDataG.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodeDataH.push(0.0, 0.0, 0.0, 0.0);
                this.arrayNodePosXYZW.push(pos[0], pos[1], pos[2], pos[3]);
                this.arrayNodeDir.push(0, 0, 0, 1.0);
                this.arrayNodeVertexPos.push(this.mesh_nodes.vertexArray[idxVertex], this.mesh_nodes.vertexArray[idxVertex + 1], this.mesh_nodes.vertexArray[idxVertex + 2], 1.0);
                this.arrayNodeVertexNormal.push(this.mesh_nodes.normalArray[idxVertex], this.mesh_nodes.normalArray[idxVertex + 1], this.mesh_nodes.normalArray[idxVertex + 2], 1.0);
                this.arrayNodeVertexTexture.push(this.mesh_nodes.textureArray[idxVertex], this.mesh_nodes.textureArray[idxVertex + 1], this.mesh_nodes.textureArray[idxVertex + 2], 1.0);

                this.arrayNodeImgId.push(nodeImgId);

                if (jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                    for (var argNameKey in this._customArgs) {
                        var expl = this._customArgs[argNameKey].arg.split("*");
                        if (expl.length > 0) {
                            // argument is type buffer
                            if (jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                                if (expl[0] === "float") this._customArgs[argNameKey].nodes_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].nodes_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey][0], jsonIn.layoutNodeArgumentData[argNameKey][1], jsonIn.layoutNodeArgumentData[argNameKey][2], jsonIn.layoutNodeArgumentData[argNameKey][3]);
                            }
                        }
                    }
                }

                this.nodeArrayItemStart++;
            }

            var maxNodeIndexId = 0;
            for (var _n28 = 0; _n28 < this.mesh_nodes.indexArray.length; _n28++) {
                var idxIndex = _n28;

                this.arrayNodeIndices.push(this.startIndexId + this.mesh_nodes.indexArray[idxIndex]);

                if (this.mesh_nodes.indexArray[idxIndex] > maxNodeIndexId) maxNodeIndexId = this.mesh_nodes.indexArray[idxIndex];
            }
            this.startIndexId += maxNodeIndexId + 1;

            jsonIn.nodeId = this.currentNodeId++;
            jsonIn.itemStart = nAIS; // nodeArrayItemStart
            return jsonIn;
        }
    }, {
        key: "createNodeText",
        value: function createNodeText(jsonIn) {
            var getLetterId = function getLetterId(letter) {
                var obj = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6,
                    "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13,
                    "Ñ": 14, "O": 15, "P": 16, "Q": 17, "R": 18, "S": 19, "T": 20,
                    "U": 21, "V": 22, "W": 23, "X": 24, "Y": 25, "Z": 26, " ": 27,
                    "0": 28, "1": 29, "2": 30, "3": 31, "4": 32, "5": 33, "6": 34,
                    "7": 35, "8": 36, "9": 37
                };
                return obj[letter];
            };

            for (var i = 0; i < this.nodesTextPlanes; i++) {
                var letterId = null;
                if (jsonIn.label !== undefined && jsonIn.label !== null && jsonIn.label[i] !== undefined && jsonIn.label[i] !== null) letterId = getLetterId(jsonIn.label[i].toUpperCase());
                if (letterId === null) letterId = getLetterId(" ");

                for (var _n29 = 0; _n29 < this.mesh_nodesText.vertexArray.length / 4; _n29++) {
                    var idxVertex = _n29 * 4;

                    this.arrayNodeTextData.push(jsonIn.nodeId, 0.0, 0.0, 0.0);
                    this.arrayNodeTextPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                    this.arrayNodeTextVertexPos.push(this.mesh_nodesText.vertexArray[idxVertex] + i * 5, this.mesh_nodesText.vertexArray[idxVertex + 1], this.mesh_nodesText.vertexArray[idxVertex + 2], 1.0);
                    this.arrayNodeTextVertexNormal.push(this.mesh_nodesText.normalArray[idxVertex], this.mesh_nodesText.normalArray[idxVertex + 1], this.mesh_nodesText.normalArray[idxVertex + 2], 1.0);
                    this.arrayNodeTextVertexTexture.push(this.mesh_nodesText.textureArray[idxVertex], this.mesh_nodesText.textureArray[idxVertex + 1], this.mesh_nodesText.textureArray[idxVertex + 2], 1.0);

                    this.arrayNodeTextNodeName.push(jsonIn.name);

                    this.arrayNodeText_itemStart.push(jsonIn.itemStart);

                    this.arrayNodeTextLetterId.push(letterId);

                    if (jsonIn.layoutNodeArgumentData !== undefined && jsonIn.layoutNodeArgumentData !== null) {
                        for (var argNameKey in this._customArgs) {
                            var expl = this._customArgs[argNameKey].arg.split("*");
                            if (expl.length > 0) {
                                // argument is type buffer
                                if (jsonIn.layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.layoutNodeArgumentData[argNameKey] !== null) {
                                    if (expl[0] === "float") this._customArgs[argNameKey].nodestext_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].nodestext_array_value.push(jsonIn.layoutNodeArgumentData[argNameKey][0], jsonIn.layoutNodeArgumentData[argNameKey][1], jsonIn.layoutNodeArgumentData[argNameKey][2], jsonIn.layoutNodeArgumentData[argNameKey][3]);
                                }
                            }
                        }
                    }

                    this.nodeTextArrayItemStart++;
                }
            }
            var maxNodeIndexId = 0;
            for (var _i = 0; _i < this.nodesTextPlanes; _i++) {
                for (var _n30 = 0; _n30 < this.mesh_nodesText.indexArray.length; _n30++) {
                    var idxIndex = _n30;

                    var b = _i * 4; // 4 = indices length of quad (0, 1, 2, 0, 2, 3)
                    var ii = this.mesh_nodesText.indexArray[idxIndex] + b;

                    this.arrayNodeTextIndices.push(this.startIndexId_nodestext + ii);

                    if (ii > maxNodeIndexId) maxNodeIndexId = ii;
                }
            }
            this.startIndexId_nodestext += maxNodeIndexId + 1;

            this.currentNodeTextId++; // augment node id
        }
    }, {
        key: "addNodesImage",


        /**
         * @param {String} url
         * @param {int} locationIdx
         */
        value: function addNodesImage(url, locationIdx) {
            this._stackNodesImg.push({
                "url": url,
                "locationIdx": locationIdx });
        }
    }, {
        key: "generateNodesImage",
        value: function generateNodesImage() {
            var _this13 = this;

            if (this.nodesImgMaskLoaded === false) {
                this.nodesImgMask = new Image();
                this.nodesImgMask.onload = function () {
                    _this13.nodesImgMaskLoaded = true;
                    _this13.generateNodesImage();
                };
                this.nodesImgMask.src = this._sce.sceDirectory + "/Prefabs/Graph/nodesImgMask.png";
            } else if (this.nodesImgCrosshairLoaded === false) {
                this.nodesImgCrosshair = new Image();
                this.nodesImgCrosshair.onload = function () {
                    _this13.nodesImgCrosshairLoaded = true;
                    _this13.generateNodesImage();
                };
                this.nodesImgCrosshair.src = this._sce.sceDirectory + "/Prefabs/Graph/nodesImgCrosshair.png";
            } else {
                new _ProccessImg.ProccessImg({
                    "stackNodesImg": this._stackNodesImg,
                    "NODE_IMG_WIDTH": this.NODE_IMG_WIDTH,
                    "NODE_IMG_COLUMNS": this.NODE_IMG_COLUMNS,
                    "nodesImgMask": this.nodesImgMask,
                    "nodesImgCrosshair": this.nodesImgCrosshair,
                    "onend": function onend(jsonIn) {
                        _this13.comp_renderer_nodes.setArg("nodesImg", function () {
                            return jsonIn.nodesImg;
                        });
                        _this13.comp_renderer_nodes.setArg("nodesImgCrosshair", function () {
                            return jsonIn.nodesImgCrosshair;
                        });
                    } });
            }
        }
    }, {
        key: "addLink",


        // █████╗ ██████╗ ██████╗     ██╗     ██╗███╗   ██╗██╗  ██╗
        //██╔══██╗██╔══██╗██╔══██╗    ██║     ██║████╗  ██║██║ ██╔╝
        //███████║██║  ██║██║  ██║    ██║     ██║██╔██╗ ██║█████╔╝
        //██╔══██║██║  ██║██║  ██║    ██║     ██║██║╚██╗██║██╔═██╗
        //██║  ██║██████╔╝██████╔╝    ███████╗██║██║ ╚████║██║  ██╗
        //╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
        /**
         * @param {Object} jsonIn
         * @param {String} jsonIn.origin - NodeName Origin for this link
         * @param {String} jsonIn.target - NodeName Target for this link
         * @param {boolean} [jsonIn.directed=false] - Default false=bidir
         * @param {number} [jsonIn.activationFunc=1.0] 1.0=linkWeight*data; 0.0=multiplier*data
         * @param {number|String} [jsonIn.weight=1.0] - Float weight or "RANDOM"
         * @param {number} [jsonIn.linkMultiplier=1.0]
         * @param {number} [jsonIn.layerNum]
         * @param {boolean} [jsonIn.showArrow]
         * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         *
         * @param {String} [jsonIn.origin_nodeName] - NodeName Origin for this link
         * @param {String} [jsonIn.target_nodeName] - NodeName Target for this link
         * @param {int} [jsonIn.origin_nodeId]
         * @param {int} [jsonIn.target_nodeId]
         * @param {int} [jsonIn.origin_itemStart]
         * @param {int} [jsonIn.target_itemStart]
         * @param {Array<>} [jsonIn.origin_layoutNodeArgumentData]
         * @param {Array<>} [jsonIn.target_layoutNodeArgumentData]
         * @param {int} [jsonIn.repeatId]
         */
        value: function addLink(jsonIn) {
            var pass = true;

            if (this._nodesByName[jsonIn.origin] === undefined && this._nodesByName[jsonIn.origin] === null) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target + ". Node " + jsonIn.origin + " not exists", "color:red");
                pass = false;
            }

            if (this._nodesByName[jsonIn.target] === undefined && this._nodesByName[jsonIn.target] === null) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target + ". Node " + jsonIn.target + " not exists", "color:red");
                pass = false;
            }

            if (jsonIn.origin === jsonIn.target && this._enableAutoLink === false) {
                console.log("%cDiscarting autolink " + jsonIn.origin + "->" + jsonIn.target, "color:orange");
                pass = false;
            }

            if (pass === true) {
                console.log("%clink " + jsonIn.origin + "->" + jsonIn.target, "color:green");

                jsonIn.origin_nodeName = jsonIn.origin.toString();
                jsonIn.target_nodeName = jsonIn.target.toString();
                jsonIn.origin_nodeId = this._nodesByName[jsonIn.origin].nodeId;
                jsonIn.target_nodeId = this._nodesByName[jsonIn.target].nodeId;
                jsonIn.origin_itemStart = this._nodesByName[jsonIn.origin].itemStart;
                jsonIn.target_itemStart = this._nodesByName[jsonIn.target].itemStart;
                jsonIn.origin_layoutNodeArgumentData = this._nodesByName[jsonIn.origin].layoutNodeArgumentData;
                jsonIn.target_layoutNodeArgumentData = this._nodesByName[jsonIn.target].layoutNodeArgumentData;

                var ts = this.getBornDieTS(jsonIn.bornDate, jsonIn.dieDate);
                jsonIn.bornDate = ts.bornDate;
                jsonIn.dieDate = ts.dieDate;

                jsonIn.activationFunc = jsonIn.activationFunc !== undefined && jsonIn.activationFunc !== null ? jsonIn.activationFunc : 1.0;
                jsonIn.weight = jsonIn.weight !== undefined && jsonIn.weight !== null && jsonIn.weight.constructor === String ? Math.random() : jsonIn.weight || 1.0;
                jsonIn.linkMultiplier = jsonIn.linkMultiplier !== undefined && jsonIn.linkMultiplier !== null ? jsonIn.linkMultiplier : 1.0;

                var repeatId = 1;
                while (true) {
                    var exists = this._links.hasOwnProperty(jsonIn.origin + "->" + jsonIn.target + "_" + repeatId) || this._links.hasOwnProperty(jsonIn.target + "->" + jsonIn.origin + "_" + repeatId);
                    if (exists === true) {
                        repeatId++;
                    } else break;
                }
                jsonIn.repeatId = repeatId;

                jsonIn = this.createLink(jsonIn);

                if (jsonIn.directed !== undefined && jsonIn.directed !== null && jsonIn.directed === true) {
                    if (jsonIn.showArrow !== undefined && jsonIn.showArrow !== null && jsonIn.showArrow === false) {} else this.createArrow(jsonIn);
                }

                // ADD LINK TO ARRAY LINKS
                this._links[jsonIn.origin + "->" + jsonIn.target + "_" + repeatId] = jsonIn;
                //console.log("link "+jsonIn.origin+"->"+jsonIn.target);


                // UPDATE arrayNodeData
                for (var _n31 = 0; _n31 < this.arrayNodeData.length / 4; _n31++) {
                    var id = _n31 * 4;
                    if (this.arrayNodeData[id] === this._nodesByName[jsonIn.origin].nodeId) {
                        this.arrayNodeData[id + 1] = this.arrayNodeData[id + 1] + 1.0;
                    }
                    if (this.arrayNodeData[id] === this._nodesByName[jsonIn.target].nodeId) {
                        this.arrayNodeData[id + 1] = this.arrayNodeData[id + 1] + 1.0;
                    }
                }
            }
        }
    }, {
        key: "createLink",


        /**
         * Create new link for the graph
         * @param {Object} jsonIn
         * @param {String} jsonIn.origin_nodeName
         * @param {String} jsonIn.target_nodeName
         * @param {int} jsonIn.origin_nodeId
         * @param {int} jsonIn.target_nodeId
         * @param {int} jsonIn.origin_itemStart
         * @param {int} jsonIn.target_itemStart
         * @param {Array<>} jsonIn.origin_layoutNodeArgumentData
         * @param {Array<>} jsonIn.target_layoutNodeArgumentData
         * @param {int} [jsonIn.linkId]
         * @param {boolean} [jsonIn.directed=false]
         * @param {number} [jsonIn.weight=1.0] - Float weight or "RANDOM"
         * @param {number|String|Date} [jsonIn.bornDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @param {number|String|Date} [jsonIn.dieDate=undefined] - Float timestamp, "RANDOM" or "24-Nov-2009 17:57:35"
         * @returns {Object}
         */
        value: function createLink(jsonIn) {
            if (this.currentLinkId % 60000 === 0) this.createLinksObjItem();

            for (var _n32 = 0; _n32 < this.lineVertexCount * 2; _n32++) {
                this.linksObj[this.currentLinksObjItem].arrayLinkData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, Math.ceil(_n32 / 2), jsonIn.repeatId);
                this.linksObj[this.currentLinksObjItem].arrayLinkDataC.push(jsonIn.bornDate, jsonIn.dieDate, jsonIn.weight, 0.0);

                if (Math.ceil(_n32 / 2) !== this.lineVertexCount - 1) {
                    this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.origin_nodeName);
                } else {
                    this.linksObj[this.currentLinksObjItem].arrayLinkNodeName.push(jsonIn.target_nodeName);
                }
                this.linksObj[this.currentLinksObjItem].arrayLinkPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                this.linksObj[this.currentLinksObjItem].arrayLinkVertexPos.push(0.0, 0.0, 0.0, 1.0);

                if (jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                    for (var argNameKey in this._customArgs) {
                        var expl = this._customArgs[argNameKey].arg.split("*");
                        if (expl.length > 0) {
                            // argument is type buffer
                            if (jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                                if (expl[0] === "float") this._customArgs[argNameKey].links_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].links_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey][0], jsonIn.origin_layoutNodeArgumentData[argNameKey][1], jsonIn.origin_layoutNodeArgumentData[argNameKey][2], jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                            }
                        }
                    }
                }
            }

            for (var _n33 = 0; _n33 < this.lineVertexCount * 2; _n33++) {
                this.linksObj[this.currentLinksObjItem].arrayLinkIndices.push(this.linksObj[this.currentLinksObjItem].startIndexId_link++);
            }this.currentLinkId += 2; // augment link id

            jsonIn.linkId = this.currentLinkId - 2;
            return jsonIn;
        }
    }, {
        key: "createArrow",


        /**
         * Create new arrow for the graph
         * @param {Object} jsonIn
         * @param {int} jsonIn.origin_nodeName
         * @param {int} jsonIn.target_nodeName
         * @param {int} jsonIn.origin_nodeId
         * @param {int} jsonIn.target_nodeId
         * @param {int} jsonIn.origin_itemStart
         * @param {int} jsonIn.target_itemStart
         * @param {int} jsonIn.origin_layoutNodeArgumentData
         * @param {int} jsonIn.target_layoutNodeArgumentData
         * @param {bool} [jsonIn.directed=false]
         * @param {Mesh} [jsonIn.node] - Node with the mesh for the node
         * @returns {int}
         */
        value: function createArrow(jsonIn) {
            if (this.currentArrowId % 20000 === 0) this.createArrowsObjItem();

            if (jsonIn !== undefined && jsonIn !== null && jsonIn.node !== undefined && jsonIn.node !== null) this.mesh_arrows = jsonIn.node;

            var oppositeId = 0;

            for (var o = 0; o < 2; o++) {
                for (var _n34 = 0; _n34 < this.mesh_arrows.vertexArray.length / 4; _n34++) {
                    var idxVertex = _n34 * 4;
                    if (o === 0) oppositeId = this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart;

                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowPosXYZW.push(0.0, 0.0, 0.0, 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexPos.push(this.mesh_arrows.vertexArray[idxVertex], this.mesh_arrows.vertexArray[idxVertex + 1], this.mesh_arrows.vertexArray[idxVertex + 2], 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexNormal.push(this.mesh_arrows.normalArray[idxVertex], this.mesh_arrows.normalArray[idxVertex + 1], this.mesh_arrows.normalArray[idxVertex + 2], 1.0);
                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowVertexTexture.push(this.mesh_arrows.textureArray[idxVertex], this.mesh_arrows.textureArray[idxVertex + 1], this.mesh_arrows.textureArray[idxVertex + 2], 1.0);
                    if (o === 0) {
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.origin_nodeId, jsonIn.target_nodeId, 0.0, jsonIn.repeatId);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowDataC.push(jsonIn.bornDate, jsonIn.dieDate, 0.0, 0.0);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.origin_nodeName);
                        if (jsonIn.origin_layoutNodeArgumentData !== undefined && jsonIn.origin_layoutNodeArgumentData !== null) {
                            for (var argNameKey in this._customArgs) {
                                var expl = this._customArgs[argNameKey].arg.split("*");
                                if (expl.length > 0) {
                                    // argument is type buffer
                                    if (jsonIn.origin_layoutNodeArgumentData.hasOwnProperty(argNameKey) === true && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== undefined && jsonIn.origin_layoutNodeArgumentData[argNameKey] !== null) {
                                        if (expl[0] === "float") this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey]);else if (expl[0] === "float4") this._customArgs[argNameKey].arrows_array_value.push(jsonIn.origin_layoutNodeArgumentData[argNameKey][0], jsonIn.origin_layoutNodeArgumentData[argNameKey][1], jsonIn.origin_layoutNodeArgumentData[argNameKey][2], jsonIn.origin_layoutNodeArgumentData[argNameKey][3]);
                                    }
                                }
                            }
                        }
                    } else {
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowData.push(jsonIn.target_nodeId, jsonIn.origin_nodeId, 1.0, jsonIn.repeatId);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowDataC.push(jsonIn.bornDate, jsonIn.dieDate, 0.0, 0.0);
                        this.arrowsObj[this.currentArrowsObjItem].arrayArrowNodeName.push(jsonIn.target_nodeName);
                        if (jsonIn.target_layoutNodeArgumentData !== undefined && jsonIn.target_layoutNodeArgumentData !== null) {
                            for (var _argNameKey in this._customArgs) {
                                var _expl = this._customArgs[_argNameKey].arg.split("*");
                                if (_expl.length > 0) {
                                    // argument is type buffer
                                    if (jsonIn.target_layoutNodeArgumentData.hasOwnProperty(_argNameKey) === true && jsonIn.target_layoutNodeArgumentData[_argNameKey] !== undefined && jsonIn.target_layoutNodeArgumentData[_argNameKey] !== null) {
                                        if (_expl[0] === "float") this._customArgs[_argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[_argNameKey]);else if (_expl[0] === "float4") this._customArgs[_argNameKey].arrows_array_value.push(jsonIn.target_layoutNodeArgumentData[_argNameKey][0], jsonIn.target_layoutNodeArgumentData[_argNameKey][1], jsonIn.target_layoutNodeArgumentData[_argNameKey][2], jsonIn.target_layoutNodeArgumentData[_argNameKey][3]);
                                    }
                                }
                            }
                        }
                    }

                    this.arrowsObj[this.currentArrowsObjItem].arrowArrayItemStart++;
                }

                var maxArrowIndexId = 0;
                for (var _n35 = 0; _n35 < this.mesh_arrows.indexArray.length; _n35++) {
                    var idxIndex = _n35;

                    this.arrowsObj[this.currentArrowsObjItem].arrayArrowIndices.push(this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow + this.mesh_arrows.indexArray[idxIndex]);

                    if (this.mesh_arrows.indexArray[idxIndex] > maxArrowIndexId) {
                        maxArrowIndexId = this.mesh_arrows.indexArray[idxIndex];
                    }
                }
                this.arrowsObj[this.currentArrowsObjItem].startIndexId_arrow += maxArrowIndexId + 1;

                this.currentArrowId++; // augment arrow id
            }
        }
    }, {
        key: "updateNodes",


        //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ███╗   ██╗ ██████╗ ██████╗ ███████╗███████╗
        //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔════╝
        //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██╔██╗ ██║██║   ██║██║  ██║█████╗  ███████╗
        //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║╚██╗██║██║   ██║██║  ██║██╔══╝  ╚════██║
        //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ██║ ╚████║╚██████╔╝██████╔╝███████╗███████║
        // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
        value: function updateNodes() {
            var _this14 = this;

            console.log(this.currentNodeId + " nodes");

            this._ADJ_MATRIX_WIDTH = this._MAX_ADJ_MATRIX_WIDTH;

            this.comp_renderer_nodes.setArg("adjacencyMatrix", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);
            }for (var _na18 = 0; _na18 < this.arrowsObj.length; _na18++) {
                this.arrowsObj[_na18].componentRenderer.getComponentBufferArg("adjacencyMatrix", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("adjacencyMatrixB", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var _na19 = 0; _na19 < this.linksObj.length; _na19++) {
                this.linksObj[_na19].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);
            }for (var _na20 = 0; _na20 < this.arrowsObj.length; _na20++) {
                this.arrowsObj[_na20].componentRenderer.getComponentBufferArg("adjacencyMatrixB", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("adjacencyMatrixC", function () {
                return new Float32Array(_this14._ADJ_MATRIX_WIDTH * _this14._ADJ_MATRIX_WIDTH * 4);
            });
            for (var _na21 = 0; _na21 < this.linksObj.length; _na21++) {
                this.linksObj[_na21].componentRenderer.getComponentBufferArg("adjacencyMatrixC", this.comp_renderer_nodes);
            }for (var _na22 = 0; _na22 < this.arrowsObj.length; _na22++) {
                this.arrowsObj[_na22].componentRenderer.getComponentBufferArg("adjacencyMatrixC", this.comp_renderer_nodes);
            }this.comp_renderer_nodes.setArg("widthAdjMatrix", function () {
                return _this14._ADJ_MATRIX_WIDTH;
            });
            for (var _na23 = 0; _na23 < this.linksObj.length; _na23++) {
                this.linksObj[_na23].componentRenderer.setArg("widthAdjMatrix", function () {
                    return _this14._ADJ_MATRIX_WIDTH;
                });
            }for (var _na24 = 0; _na24 < this.arrowsObj.length; _na24++) {
                this.arrowsObj[_na24].componentRenderer.setArg("widthAdjMatrix", function () {
                    return _this14._ADJ_MATRIX_WIDTH;
                });
            }this.comp_renderer_nodes.setArg("data", function () {
                return _this14.arrayNodeData;
            });
            this.comp_renderer_nodes.setArg("dataB", function () {
                return _this14.arrayNodeDataB;
            });
            this.comp_renderer_nodes.setArg("dataF", function () {
                return _this14.arrayNodeDataF;
            });
            this.comp_renderer_nodes.setArg("dataG", function () {
                return _this14.arrayNodeDataG;
            });
            this.comp_renderer_nodes.setArg("dataH", function () {
                return _this14.arrayNodeDataH;
            });

            if (this.comp_renderer_nodes.getBuffers()["posXYZW"] !== undefined && this.comp_renderer_nodes.getBuffers()["posXYZW"] !== null) this.arrayNodePosXYZW = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("posXYZW"));
            this.comp_renderer_nodes.setArg("posXYZW", function () {
                return _this14.arrayNodePosXYZW;
            });

            this.comp_renderer_nodes.setArg("nodeVertexPos", function () {
                return _this14.arrayNodeVertexPos;
            });
            this.comp_renderer_nodes.setArg("nodeVertexNormal", function () {
                return _this14.arrayNodeVertexNormal;
            });
            this.comp_renderer_nodes.setArg("nodeVertexTexture", function () {
                return _this14.arrayNodeVertexTexture;
            });

            this.comp_renderer_nodes.setArg("nodesCount", function () {
                return _this14.currentNodeId;
            });
            this._MAX_ADJ_MATRIX_WIDTH = this.currentNodeId;
            this.comp_renderer_nodes.setArg("nodeImgColumns", function () {
                return _this14.NODE_IMG_COLUMNS;
            });
            this.comp_renderer_nodes.setArg("nodeImgId", function () {
                return _this14.arrayNodeImgId;
            });
            this.comp_renderer_nodes.setArg("indices", function () {
                return _this14.arrayNodeIndices;
            });

            if (this.comp_renderer_nodes.getBuffers()["dir"] !== undefined && this.comp_renderer_nodes.getBuffers()["dir"] !== null) this.arrayNodeDir = Array.prototype.slice.call(this.comp_renderer_nodes.gpufG.readArg("dir"));
            this.comp_renderer_nodes.setArg("dir", function () {
                return _this14.arrayNodeDir;
            });

            this.comp_renderer_nodes.setArg("PMatrix", function () {
                return _this14._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("PMatrix", true);
            this.comp_renderer_nodes.setArg("cameraWMatrix", function () {
                return _this14._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("cameraWMatrix", true);
            this.comp_renderer_nodes.setArg("nodeWMatrix", function () {
                return _this14.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
            });
            this.comp_renderer_nodes.setArgUpdatable("nodeWMatrix", true);

            this.comp_renderer_nodes.setArg("currentTrainLayer", function () {
                return _this14.currentTrainLayer;
            });
            this.comp_renderer_nodes.setArg("afferentNodesCount", function () {
                return _this14.afferentNodesCount;
            });
            this.comp_renderer_nodes.setArg("efferentNodesCount", function () {
                return _this14.efferentNodesCount;
            });
            this.comp_renderer_nodes.setArg("efferentStart", function () {
                return _this14.currentNodeId - _this14.efferentNodesCount;
            });

            this.comp_renderer_nodes.setArg("afferentNodesA", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesA", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesB", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesB", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesC", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesC", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesD", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesD", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesE", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesE", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesF", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesF", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("afferentNodesG", function () {
                return new Float32Array(_this14.afferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("efferentNodesG", function () {
                return new Float32Array(_this14.efferentNodesCount);
            });
            this.comp_renderer_nodes.setArg("isNode", function () {
                return 1;
            });
            this.comp_renderer_nodes.setArg("bufferNodesWidth", function () {
                return _this14.comp_renderer_nodes.getBuffers()["posXYZW"].W;
            });

            var _loop3 = function _loop3(argNameKey) {
                var expl = _this14._customArgs[argNameKey].arg.split("*");
                if (expl.length > 0) {
                    // argument is type buffer
                    _this14.comp_renderer_nodes.setArg(argNameKey, function () {
                        return _this14._customArgs[argNameKey].nodes_array_value;
                    });
                }
            };

            for (var argNameKey in this._customArgs) {
                _loop3(argNameKey);
            }

            this.generateNodesImage();
            if (this._enableFont === true) this.updateNodesText();
        }
    }, {
        key: "updateNodesText",
        value: function updateNodesText() {
            var _this15 = this;

            this.comp_renderer_nodesText.setArg("data", function () {
                return _this15.arrayNodeTextData;
            });
            this.comp_renderer_nodesText.getComponentBufferArg("posXYZW", this.comp_renderer_nodes);

            this.comp_renderer_nodesText.setArg("nodeVertexPos", function () {
                return _this15.arrayNodeTextVertexPos;
            });
            this.comp_renderer_nodesText.setArg("nodeVertexNormal", function () {
                return _this15.arrayNodeTextVertexNormal;
            });
            this.comp_renderer_nodesText.setArg("nodeVertexTexture", function () {
                return _this15.arrayNodeTextVertexTexture;
            });

            this.comp_renderer_nodesText.setArg("fontImgColumns", function () {
                return _this15.FONT_IMG_COLUMNS;
            });
            this.comp_renderer_nodesText.setArg("letterId", function () {
                return _this15.arrayNodeTextLetterId;
            });
            this.comp_renderer_nodesText.setArg("indices", function () {
                return _this15.arrayNodeTextIndices;
            });

            this.comp_renderer_nodesText.setArg("PMatrix", function () {
                return _this15._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("PMatrix", true);
            this.comp_renderer_nodesText.setArg("cameraWMatrix", function () {
                return _this15._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("cameraWMatrix", true);
            this.comp_renderer_nodesText.setArg("nodeWMatrix", function () {
                return _this15.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
            });
            this.comp_renderer_nodesText.setArgUpdatable("nodeWMatrix", true);

            this.comp_renderer_nodesText.setArg("isNodeText", function () {
                return 1;
            });
            this.comp_renderer_nodesText.setArg("bufferNodesWidth", function () {
                return _this15.comp_renderer_nodes.getBuffers()["posXYZW"].W;
            });
            this.comp_renderer_nodesText.setArg("bufferTextsWidth", function () {
                return _this15.comp_renderer_nodesText.getBuffers()["data"].W;
            });

            var _loop4 = function _loop4(argNameKey) {
                var expl = _this15._customArgs[argNameKey].arg.split("*");
                if (expl.length > 0) // argument is type buffer
                    _this15.comp_renderer_nodesText.setArg(argNameKey, function () {
                        return _this15._customArgs[argNameKey].nodestext_array_value;
                    });
            };

            for (var argNameKey in this._customArgs) {
                _loop4(argNameKey);
            }
        }
    }, {
        key: "updateLinks",


        //██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ██╗     ██╗███╗   ██╗██╗  ██╗███████╗
        //██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██║     ██║████╗  ██║██║ ██╔╝██╔════╝
        //██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██║     ██║██╔██╗ ██║█████╔╝ ███████╗
        //██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██║     ██║██║╚██╗██║██╔═██╗ ╚════██║
        //╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ███████╗██║██║ ╚████║██║  ██╗███████║
        // ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
        value: function updateLinks() {
            var _this16 = this;

            console.log(Object.keys(this._links).length + " links");

            this.comp_renderer_nodes.setArg("data", function () {
                return _this16.arrayNodeData;
            });
            //this.comp_renderer_nodes.setArg("dataB", () => {return this.arrayNodeDataB;});

            var _loop5 = function _loop5(na) {
                _this16.linksObj[na].componentRenderer.setArg("data", function () {
                    return _this16.linksObj[na].arrayLinkData;
                });
                _this16.linksObj[na].componentRenderer.setArg("dataC", function () {
                    return _this16.linksObj[na].arrayLinkDataC;
                });
                _this16.linksObj[na].componentRenderer.getComponentBufferArg("dataB", _this16.comp_renderer_nodes);
                _this16.linksObj[na].componentRenderer.getComponentBufferArg("posXYZW", _this16.comp_renderer_nodes);
                _this16.linksObj[na].componentRenderer.setArg("nodeVertexPos", function () {
                    return _this16.linksObj[na].arrayLinkVertexPos;
                });
                _this16.linksObj[na].componentRenderer.setArg("indices", function () {
                    return _this16.linksObj[na].arrayLinkIndices;
                });

                _this16.linksObj[na].componentRenderer.setArg("nodesCount", function () {
                    return _this16.currentNodeId;
                });
                _this16.linksObj[na].componentRenderer.setArg("PMatrix", function () {
                    return _this16._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
                _this16.linksObj[na].componentRenderer.setArg("cameraWMatrix", function () {
                    return _this16._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
                _this16.linksObj[na].componentRenderer.setArg("nodeWMatrix", function () {
                    return _this16.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
                });
                _this16.linksObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

                _this16.linksObj[na].componentRenderer.setArg("isLink", function () {
                    return 1;
                });
                _this16.linksObj[na].componentRenderer.setArg("bufferNodesWidth", function () {
                    return _this16.comp_renderer_nodes.getBuffers()["posXYZW"].W;
                });
                _this16.linksObj[na].componentRenderer.setArg("bufferLinksWidth", function () {
                    return _this16.linksObj[na].componentRenderer.getBuffers()["data"].W;
                });

                var _loop6 = function _loop6(argNameKey) {
                    var expl = _this16._customArgs[argNameKey].arg.split("*");
                    if (expl.length > 0) {
                        // argument is type buffer
                        _this16.linksObj[na].componentRenderer.setArg(argNameKey, function () {
                            return _this16._customArgs[argNameKey].links_array_value;
                        });
                    }
                };

                for (var argNameKey in _this16._customArgs) {
                    _loop6(argNameKey);
                }
            };

            for (var na = 0; na < this.linksObj.length; na++) {
                _loop5(na);
            }

            this.updateArrows();

            if (Object.keys(this._links).length > 0) this.updateAdjMat();
        }
    }, {
        key: "updateArrows",
        value: function updateArrows() {
            var _this17 = this;

            var _loop7 = function _loop7(na) {
                _this17.arrowsObj[na].componentRenderer.setArg("data", function () {
                    return _this17.arrowsObj[na].arrayArrowData;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("dataC", function () {
                    return _this17.arrowsObj[na].arrayArrowDataC;
                });
                _this17.arrowsObj[na].componentRenderer.getComponentBufferArg("dataB", _this17.comp_renderer_nodes);
                _this17.arrowsObj[na].componentRenderer.getComponentBufferArg("posXYZW", _this17.comp_renderer_nodes);

                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexPos", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexPos;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexNormal", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexNormal;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("nodeVertexTexture", function () {
                    return _this17.arrowsObj[na].arrayArrowVertexTexture;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("indices", function () {
                    return _this17.arrowsObj[na].arrayArrowIndices;
                });

                _this17.arrowsObj[na].componentRenderer.setArg("PMatrix", function () {
                    return _this17._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.PROJECTION).getMatrix().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("PMatrix", true);
                _this17.arrowsObj[na].componentRenderer.setArg("cameraWMatrix", function () {
                    return _this17._project.getActiveStage().getActiveCamera().getComponent(Constants.COMPONENT_TYPES.TRANSFORM_TARGET).getMatrix().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("cameraWMatrix", true);
                _this17.arrowsObj[na].componentRenderer.setArg("nodeWMatrix", function () {
                    return _this17.nodes.getComponent(Constants.COMPONENT_TYPES.TRANSFORM).getMatrixPosition().transpose().e;
                });
                _this17.arrowsObj[na].componentRenderer.setArgUpdatable("nodeWMatrix", true);

                _this17.arrowsObj[na].componentRenderer.setArg("nodesCount", function () {
                    return _this17.currentNodeId;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("isArrow", function () {
                    return 1.0;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("bufferNodesWidth", function () {
                    return _this17.comp_renderer_nodes.getBuffers()["posXYZW"].W;
                });
                _this17.arrowsObj[na].componentRenderer.setArg("bufferArrowsWidth", function () {
                    return _this17.arrowsObj[na].componentRenderer.getBuffers()["data"].W;
                });

                var _loop8 = function _loop8(argNameKey) {
                    var expl = _this17._customArgs[argNameKey].arg.split("*");
                    if (expl.length > 0) {
                        // argument is type buffer
                        _this17.arrowsObj[na].componentRenderer.setArg(argNameKey, function () {
                            return _this17._customArgs[argNameKey].arrows_array_value;
                        });
                    }
                };

                for (var argNameKey in _this17._customArgs) {
                    _loop8(argNameKey);
                }
            };

            for (var na = 0; na < this.arrowsObj.length; na++) {
                _loop7(na);
            }
        }
    }, {
        key: "updateAdjMat",
        value: function updateAdjMat() {
            var _this18 = this;

            var setAdjMat = function setAdjMat(columnAsParent, pixel, nodeId, nodeIdInv, bornDate, dieDate, weight, linkMultiplier, activationFunc, layerNum) {
                var idx = pixel * 4;

                _this18.arrAdjMatrix[idx] = bornDate;
                _this18.arrAdjMatrix[idx + 1] = dieDate;
                _this18.arrAdjMatrix[idx + 2] = columnAsParent === true ? _this18.disabVal : weight;
                _this18.arrAdjMatrix[idx + 3] = columnAsParent === true ? 1.0 : 0.5; // columnAsParent=1.0;

                _this18.arrAdjMatrixB[idx] = linkMultiplier;
                _this18.arrAdjMatrixB[idx + 1] = activationFunc;
                _this18.arrAdjMatrixB[idx + 2] = nodeId;
                _this18.arrAdjMatrixB[idx + 3] = nodeIdInv;

                _this18.arrAdjMatrixC[idx] = 0.0; // error
                _this18.arrAdjMatrixC[idx + 1] = layerNum;
                _this18.arrAdjMatrixC[idx + 2] = 0.0;
                _this18.arrAdjMatrixC[idx + 3] = 0.0;
            };

            this.arrAdjMatrix = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            this.arrAdjMatrixB = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            this.arrAdjMatrixC = new Float32Array(this._ADJ_MATRIX_WIDTH * this._ADJ_MATRIX_WIDTH * 4);
            for (var key in this._links) {
                var childNodeId = this._links[key].origin_nodeId;
                var parentNodeId = this._links[key].target_nodeId;

                var pixelParent = parentNodeId * this._ADJ_MATRIX_WIDTH + childNodeId;
                var pixelChild = childNodeId * this._ADJ_MATRIX_WIDTH + parentNodeId;
                setAdjMat(true, pixelParent, parentNodeId, childNodeId, this._links[key].bornDate, this._links[key].dieDate, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, -99); // (columns=child;rows=parent)
                setAdjMat(false, pixelChild, childNodeId, parentNodeId, this._links[key].bornDate, this._links[key].dieDate, this._links[key].weight, this._links[key].linkMultiplier, this._links[key].activationFunc, this._links[key].layerNum); // (columns=parent;rows=child)
            }

            this.comp_renderer_nodes.setArg("adjacencyMatrix", function () {
                return _this18.arrAdjMatrix;
            });
            this.comp_renderer_nodes.setArg("adjacencyMatrixB", function () {
                return _this18.arrAdjMatrixB;
            });
            this.comp_renderer_nodes.setArg("adjacencyMatrixC", function () {
                return _this18.arrAdjMatrixC;
            });

            /*
            this.adjacencyMatrixToImage(this.arrAdjMatrix, this._ADJ_MATRIX_WIDTH, (img) => {
                document.body.appendChild(img);
                img.style.border = "1px solid red";
            }); */
        }
    }, {
        key: "adjacencyMatrixToImage",


        /**
         * adjacencyMatrixToImage
         * @param {Float32Array} adjMat
         * @param {int} width
         * @param {Function} onload
         */
        value: function adjacencyMatrixToImage(adjMat, width, onload) {
            var _this19 = this;

            var toArrF = function toArrF(arr) {
                var arrO = new Uint8Array(arr.length * 4);
                for (var _n36 = 0; _n36 < arr.length; _n36++) {
                    var idO = _n36 * 4;
                    arrO[idO] = arr[_n36] * 255;
                    arrO[idO + 1] = arr[_n36] * 255;
                    arrO[idO + 2] = arr[_n36] * 255;
                    arrO[idO + 3] = 255;
                }

                return arrO;
            };

            var toImage = function toImage(arrO, w, h) {
                var canvas = Utils.getCanvasFromUint8Array(arrO, w, h);
                _this19._utils.getImageFromCanvas(canvas, function (im) {
                    onload(im);
                });
            };

            var arrF = toArrF(adjMat);
            toImage(arrF, width, width);
        }
    }, {
        key: "enableForceLayout",
        value: function enableForceLayout() {
            this.comp_renderer_nodes.setArg("enableForceLayout", function () {
                return 1.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableForceLayout", function () {
                    return 1.0;
                });
            }this._enabledForceLayout = true;
        }
    }, {
        key: "disableForceLayout",
        value: function disableForceLayout() {
            this.comp_renderer_nodes.setArg("enableForceLayout", function () {
                return 0.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("enableForceLayout", function () {
                    return 0.0;
                });
            }this._enabledForceLayout = false;
        }
    }, {
        key: "enableForceLayoutCollision",
        value: function enableForceLayoutCollision() {
            this.comp_renderer_nodes.setArg("enableForceLayoutCollision", function () {
                return 1.0;
            });
        }
    }, {
        key: "disableForceLayoutCollision",
        value: function disableForceLayoutCollision() {
            this.comp_renderer_nodes.setArg("enableForceLayoutCollision", function () {
                return 0.0;
            });
        }
    }, {
        key: "enableShowOutputWeighted",
        value: function enableShowOutputWeighted() {
            this.comp_renderer_nodes.setArg("multiplyOutput", function () {
                return 1.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("multiplyOutput", function () {
                    return 1.0;
                });
            }for (var _na25 = 0; _na25 < this.arrowsObj.length; _na25++) {
                this.arrowsObj[_na25].componentRenderer.setArg("multiplyOutput", function () {
                    return 1.0;
                });
            }
        }
    }, {
        key: "disableShowOutputWeighted",
        value: function disableShowOutputWeighted() {
            this.comp_renderer_nodes.setArg("multiplyOutput", function () {
                return 0.0;
            });
            for (var na = 0; na < this.linksObj.length; na++) {
                this.linksObj[na].componentRenderer.setArg("multiplyOutput", function () {
                    return 0.0;
                });
            }for (var _na26 = 0; _na26 < this.arrowsObj.length; _na26++) {
                this.arrowsObj[_na26].componentRenderer.setArg("multiplyOutput", function () {
                    return 0.0;
                });
            }
        }
    }], [{
        key: "datetimeToTimestamp",


        /**
         * datetimeToTimestamp
         * @example
         * let ts = datetimeToTimestamp("24-Nov-2009 17:57:35")
         * */
        value: function datetimeToTimestamp(dt) {
            return Date.parse(dt);
        }
    }, {
        key: "timestampToDate",
        value: function timestampToDate(ts) {
            var d = new Date(ts);
            d = d.toISOString().split("T")[0].split("-");

            return d[2] + "/" + d[1] + "/" + d[0];
        }
    }]);

    return Graph;
}();

global.Graph = Graph;
module.exports.Graph = Graph;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./KERNEL_ADJMATRIX_UPDATE.class":3,"./KERNEL_DIR.class":4,"./ProccessImg.class":5,"./VFP_NODE.class":6,"./VFP_NODEPICKDRAG.class":7,"scejs":1}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KERNEL_ADJMATRIX_UPDATE = exports.KERNEL_ADJMATRIX_UPDATE = function () {
    function KERNEL_ADJMATRIX_UPDATE() {
        _classCallCheck(this, KERNEL_ADJMATRIX_UPDATE);
    }

    _createClass(KERNEL_ADJMATRIX_UPDATE, null, [{
        key: "getSrc",
        value: function getSrc(geometryLength) {
            return ["x", ["adjacencyMatrix"],
            // head
            "",

            // source
            // adjacencyMatrix= bornDate, dieDate, weight(childs), isParent(1.0:parent;0.5:child)
            // adjacencyMatrixB= linkMultiplier, activationFunc, nodeId, nodeIdInv
            "vec4 adjMat = adjacencyMatrix[x]; \n            vec4 adjMatB = adjacencyMatrixB[x]; \n            vec4 adjMatC = adjacencyMatrixC[x]; \n\n            float linkBornDate = adjMat.x;\n            float linkDieDate = adjMat.y;\n            float linkWeight = adjMat.z;\n            float linkTypeParent = adjMat.w;\n\n            float id = adjMatB.z;\n            float idInv = adjMatB.w;\n            float linkLayerNum = adjMatC.y;\n\n           if(linkTypeParent == 0.5) {\n                vec2 xGeometryCurrentChild = get_global_id(id, bufferNodesWidth, " + geometryLength.toFixed(1) + ");\n                vec2 xGeometryParent = get_global_id(idInv, bufferNodesWidth, " + geometryLength.toFixed(1) + ");\n\n                float childGOutputA = dataB[xGeometryCurrentChild].z;\n                float parentGErrorA = dataB[xGeometryParent].w;\n                \n                float childGOutputB = dataF[xGeometryCurrentChild].x;\n                float parentGErrorB = dataF[xGeometryParent].y;\n                \n                float childGOutputC = dataF[xGeometryCurrentChild].z;\n                float parentGErrorC = dataF[xGeometryParent].w;\n                \n                float childGOutputD = dataG[xGeometryCurrentChild].x;\n                float parentGErrorD = dataG[xGeometryParent].y;\n                \n                float childGOutputE = dataG[xGeometryCurrentChild].z;\n                float parentGErrorE = dataG[xGeometryParent].w;\n                \n                float childGOutputF = dataH[xGeometryCurrentChild].x;\n                float parentGErrorF = dataH[xGeometryParent].y;\n                \n                float childGOutputG = dataH[xGeometryCurrentChild].z;\n                float parentGErrorG = dataH[xGeometryParent].w;                \n            \n                if(linkLayerNum > 0.0) {                        \n                    float learningRate = 0.01;\n                    float l2_decay = 0.01;\n                    float cpu_batch_repeats = 7.0;\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputA*parentGErrorA))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputB*parentGErrorB))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputC*parentGErrorC))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputD*parentGErrorD))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputE*parentGErrorE))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputF*parentGErrorF))/(7.0*cpu_batch_repeats));\n                    linkWeight += -learningRate*(((l2_decay*linkWeight)+(childGOutputG*parentGErrorG))/(7.0*cpu_batch_repeats));\n                }\n            }\n            \n            return [vec4(linkBornDate, linkDieDate, linkWeight, linkTypeParent)];\n            "];
        }
    }]);

    return KERNEL_ADJMATRIX_UPDATE;
}();

global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
module.exports.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KERNEL_DIR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphUtil = require("./graphUtil");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KERNEL_DIR = exports.KERNEL_DIR = function () {
    function KERNEL_DIR() {
        _classCallCheck(this, KERNEL_DIR);
    }

    _createClass(KERNEL_DIR, null, [{
        key: "getSrc",
        value: function getSrc(customCode, geometryLength, efferentStart, efferentNodesCount, _enableNeuronalNetwork) {
            var outputArr = null;
            var returnStr = null;
            if (_enableNeuronalNetwork === true) {
                outputArr = ["dir", "posXYZW", "dataB", "dataF", "dataG", "dataH"];
                returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0), currentDataB, currentDataF, currentDataG, currentDataH];';
            } else {
                outputArr = ["dir", "posXYZW"];
                returnStr = 'return [vec4(currentDir, 1.0), vec4(currentPos.x, currentPos.y, currentPos.z, 1.0)];';
            }

            return ["x", outputArr,
            // head
            _graphUtil.GraphUtils.adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount),

            // source
            "float nodeId = data[x].x;\n                    float numOfConnections = data[x].y;\n                    vec2 xGeometry = get_global_id(nodeId, uBufferWidth, " + geometryLength.toFixed(1) + ");\n\n\n                    vec3 currentPos = posXYZW[xGeometry].xyz;\n\n                    float bornDate = dataB[xGeometry].x;\n                    float dieDate = dataB[xGeometry].y;\n\n                    vec3 currentDir = dir[xGeometry].xyz;\n\n\n                    vec4 currentDataB = dataB[xGeometry];\n                    vec4 currentDataF = dataF[xGeometry];\n                    vec4 currentDataG = dataG[xGeometry];\n                    vec4 currentDataH = dataH[xGeometry];\n\n                    currentDir = vec3(0.0, 0.0, 0.0);\n\n                    if(enableForceLayout == 1.0) {\n                        idAdjMatrixResponse adjM = idAdjMatrix_ForceLayout(nodeId, currentPos, currentDir, numOfConnections, currentTimestamp, bornDate, dieDate, enableNeuronalNetwork);\n                        currentDir = (adjM.collisionExists == 1.0) ? adjM.force : currentDir+(adjM.force*1.0);\n\n                        if(enableNeuronalNetwork == 1.0 && currentTrainLayer == -3.0) {\n                            currentDataB = vec4(currentDataB.x, currentDataB.y, adjM.netFOutputA, adjM.netErrorWeightA);\n                            currentDataF = vec4(adjM.netFOutputB, adjM.netErrorWeightB, adjM.netFOutputC, adjM.netErrorWeightC);\n                            currentDataG = vec4(adjM.netFOutputD, adjM.netErrorWeightD, adjM.netFOutputE, adjM.netErrorWeightE);\n                            currentDataH = vec4(adjM.netFOutputF, adjM.netErrorWeightF, adjM.netFOutputG, adjM.netErrorWeightG);\n                        }\n                    }\n\n                    " + (customCode !== undefined ? customCode : '') + "\n\n                    if(enableDrag == 1.0) {\n                        if(nodeId == idToDrag) {\n                            currentPos = vec3(MouseDragTranslationX, MouseDragTranslationY, MouseDragTranslationZ);\n                        }\n                    }\n\n                    currentPos += currentDir;\n                    if(only2d == 1.0) {\n                        currentPos.y = 0.0;\n                    }\n\n                    " + returnStr];
        }
    }]);

    return KERNEL_DIR;
}();

global.KERNEL_DIR = KERNEL_DIR;
module.exports.KERNEL_DIR = KERNEL_DIR;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./graphUtil":10}],5:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProccessImg = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProccessImg = exports.ProccessImg = function () {
    function ProccessImg(jsonIn) {
        _classCallCheck(this, ProccessImg);

        this.stackNodesImg = jsonIn.stackNodesImg;
        this.drawedImages = 0;
        this.output = {
            "nodesImg": null,
            "nodesImgCrosshair": null };

        var NODE_IMG_WIDTH = jsonIn.NODE_IMG_WIDTH;
        this.NODE_IMG_COLUMNS = jsonIn.NODE_IMG_COLUMNS;
        this.NODE_IMG_SPRITE_WIDTH = NODE_IMG_WIDTH / this.NODE_IMG_COLUMNS;

        var nodesImgMask = jsonIn.nodesImgMask;
        this.datMask = Utils.getUint8ArrayFromHTMLImageElement(nodesImgMask);

        var nodesImgCrosshair = jsonIn.nodesImgCrosshair;
        this.datCrosshair = Utils.getUint8ArrayFromHTMLImageElement(nodesImgCrosshair);

        this.canvasNodeImg = document.createElement('canvas');
        this.canvasNodeImg.width = NODE_IMG_WIDTH;
        this.canvasNodeImg.height = NODE_IMG_WIDTH;
        this.ctxNodeImg = this.canvasNodeImg.getContext('2d');

        this.canvasNodeImgCrosshair = document.createElement('canvas');
        this.canvasNodeImgCrosshair.width = NODE_IMG_WIDTH;
        this.canvasNodeImgCrosshair.height = NODE_IMG_WIDTH;
        this.ctxNodeImgCrosshair = this.canvasNodeImgCrosshair.getContext('2d');

        var canvasNodeImgTMP = document.createElement('canvas');
        canvasNodeImgTMP.width = this.NODE_IMG_SPRITE_WIDTH;
        canvasNodeImgTMP.height = this.NODE_IMG_SPRITE_WIDTH;
        var ctxNodeImgTMP = canvasNodeImgTMP.getContext('2d');

        for (var n = 0; n < this.stackNodesImg.length; n++) {
            var currStack = this.stackNodesImg[n];
            var image = new Image();
            image.onload = function (image, currStack) {
                ctxNodeImgTMP.clearRect(0, 0, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH);
                var quarter = this.NODE_IMG_SPRITE_WIDTH / 4;
                ctxNodeImgTMP.drawImage(image, 0, 0, image.width, image.height, quarter, quarter, this.NODE_IMG_SPRITE_WIDTH / 2, this.NODE_IMG_SPRITE_WIDTH / 2);

                new Utils().getImageFromCanvas(canvasNodeImgTMP, function (currStack, img) {
                    currStack.image = Utils.getUint8ArrayFromHTMLImageElement(img);

                    var allImg = true;
                    for (var nb = 0; nb < this.stackNodesImg.length; nb++) {
                        if (this.stackNodesImg[nb].image == null) {
                            allImg = false;
                            break;
                        }
                    }

                    if (allImg === true) this.generateAll(jsonIn);
                }.bind(this, currStack));
            }.bind(this, image, currStack);
            image.src = currStack.url;
        }
    }

    _createClass(ProccessImg, [{
        key: "generateAll",
        value: function generateAll(jsonIn) {
            var drawOnAtlas = function (currStack, ctx, newImgData) {
                var _this = this;

                var get2Dfrom1D = function ( /*Int*/idx, /*Int*/columns) {
                    var n = idx / columns;
                    var row = parseFloat(parseInt(n));
                    var col = Utils.fract(n) * columns;

                    return {
                        "col": col,
                        "row": row };
                }.bind(this);

                var readAll = function (onend) {
                    var pasteImg = function (onend, imgname, img) {
                        this.output[imgname] = img;
                        if (this.output.nodesImg != null && this.output.nodesImgCrosshair != null) onend(this.output);
                    }.bind(this, onend);

                    new Utils().getImageFromCanvas(this.canvasNodeImg, function (imgAtlas) {
                        pasteImg("nodesImg", imgAtlas);
                    }.bind(this));
                    new Utils().getImageFromCanvas(this.canvasNodeImgCrosshair, function (imgAtlas) {
                        pasteImg("nodesImgCrosshair", imgAtlas);
                    }.bind(this));
                }.bind(this, jsonIn.onend);

                new Utils().getImageFromCanvas(Utils.getCanvasFromUint8Array(newImgData, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH), function (imgB) {
                    // draw image on atlas
                    var loc = get2Dfrom1D(currStack.locationIdx, _this.NODE_IMG_COLUMNS);
                    ctx.drawImage(imgB, loc.col * _this.NODE_IMG_SPRITE_WIDTH, loc.row * _this.NODE_IMG_SPRITE_WIDTH, _this.NODE_IMG_SPRITE_WIDTH, _this.NODE_IMG_SPRITE_WIDTH);

                    _this.drawedImages++;
                    if (_this.drawedImages === _this.stackNodesImg.length * 2) readAll();
                });
            }.bind(this);

            for (var n = 0; n < this.stackNodesImg.length; n++) {
                var currStack = this.stackNodesImg[n];
                var newImgData = this.stackNodesImg[n].image;

                // masked image
                for (var nb = 0; nb < this.datMask.length / 4; nb++) {
                    var idx = nb * 4;
                    if (newImgData[idx + 3] > 0) newImgData[idx + 3] = this.datMask[idx + 3];
                }
                drawOnAtlas(currStack, this.ctxNodeImg, newImgData);

                // crosshair image
                for (var _nb = 0; _nb < this.datCrosshair.length / 4; _nb++) {
                    var _idx = _nb * 4;

                    newImgData[_idx] = (this.datCrosshair[_idx] * this.datCrosshair[_idx + 3] + newImgData[_idx] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 1] = (this.datCrosshair[_idx + 1] * this.datCrosshair[_idx + 3] + newImgData[_idx + 1] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 2] = (this.datCrosshair[_idx + 2] * this.datCrosshair[_idx + 3] + newImgData[_idx + 2] * (255 - this.datCrosshair[_idx + 3])) / 255;
                    newImgData[_idx + 3] = (this.datCrosshair[_idx + 3] * this.datCrosshair[_idx + 3] + newImgData[_idx + 3] * (255 - this.datCrosshair[_idx + 3])) / 255;
                }
                drawOnAtlas(currStack, this.ctxNodeImgCrosshair, newImgData);
            }
        }
    }]);

    return ProccessImg;
}();

global.ProccessImg = ProccessImg;
module.exports.ProccessImg = ProccessImg;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"scejs":1}],6:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VFP_NODE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _graphUtil = require("./graphUtil");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VFP_NODE = exports.VFP_NODE = function () {
    function VFP_NODE() {
        _classCallCheck(this, VFP_NODE);
    }

    _createClass(VFP_NODE, null, [{
        key: "getSrc",
        value: function getSrc(customCode, geometryLength) {
            return [["RGB"],

            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████║█████╗  ███████║██║  ██║
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ██╔══██║██╔══╝  ██╔══██║██║  ██║
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ██║  ██║███████╗██║  ██║██████╔╝
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
            'varying vec4 vVertexColor;\n' + 'varying vec4 vVertexColorNetError;\n' + 'varying vec4 vUV;\n' + 'varying vec2 vVertexUV;\n' + 'varying float vUseTex;\n' + 'varying vec4 vWNMatrix;\n' + 'varying float vNodeId;\n' + 'varying float vNodeIdOpposite;\n' + 'varying float vDist;\n' + 'varying float vVisibility;\n' + 'varying float vIsSelected;\n' + 'varying float vIsHover;\n' + 'varying float vUseCrosshair;\n' + 'varying float vIstarget;\n' + 'vec2 get2Dfrom1D(float idx, float columns) {' + 'float n = idx/columns;' + 'float row = float(int(n));' + 'float col = fract(n)*columns;' + 'float ts = 1.0/columns;' + 'return vec2(ts*col, ts*row);' + '}' + 'mat4 lookAt(vec3 eye, vec3 center, vec3 up) {' + 'vec3 zaxis = normalize(center - eye);' + 'vec3 xaxis = normalize(cross(up, zaxis));' + 'vec3 yaxis = cross(zaxis, xaxis);' + 'mat4 matrix;' +
            //Column Major
            'matrix[0][0] = xaxis.x;' + 'matrix[1][0] = yaxis.x;' + 'matrix[2][0] = zaxis.x;' + 'matrix[3][0] = 0.0;' + 'matrix[0][1] = xaxis.y;' + 'matrix[1][1] = yaxis.y;' + 'matrix[2][1] = zaxis.y;' + 'matrix[3][1] = 0.0;' + 'matrix[0][2] = xaxis.z;' + 'matrix[1][2] = yaxis.z;' + 'matrix[2][2] = zaxis.z;' + 'matrix[3][2] = 0.0;' + 'matrix[0][3] = -dot(xaxis, eye);' + 'matrix[1][3] = -dot(yaxis, eye);' + 'matrix[2][3] = -dot(zaxis, eye);' + 'matrix[3][3] = 1.0;' + 'return matrix;' + '}' + 'mat4 transpose(mat4 m) {' + 'return mat4(  m[0][0], m[1][0], m[2][0], m[3][0],' + 'm[0][1], m[1][1], m[2][1], m[3][1],' + 'm[0][2], m[1][2], m[2][2], m[3][2],' + 'm[0][3], m[1][3], m[2][3], m[3][3]);' + '}' + 'mat4 rotationMatrix(vec3 axis, float angle) {' + 'axis = normalize(axis);' + 'float s = sin(angle);' + 'float c = cos(angle);' + 'float oc = 1.0 - c;' + 'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,' + 'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,' + 'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,' + '0.0,                                0.0,                                0.0,                                1.0);' + '}' + _graphUtil.GraphUtils.adjMatrix_Autolink_GLSLFunctionString(geometryLength) + Utils.degToRadGLSLFunctionString() + Utils.radToDegGLSLFunctionString() + Utils.cartesianToSphericalGLSLFunctionString() + Utils.sphericalToCartesianGLSLFunctionString() + Utils.getVectorGLSLFunctionString() + 'vec3 getVV(vec3 crB, float acum) {' + 'vec3 ob = cartesianToSpherical(crB);' + 'float angleLat = ob.y;' + 'float angleLng = ob.z;' + 'float desvLat = 0.0;' + // (vecNoise.x*180.0)-90.0
            'float desvLng = 10.0;' + // (vecNoise.x*180.0)-90.0
            //'angleLat += (degrees*desvLat);'+
            'angleLng += (acum*desvLng);' + 'return sphericalToCartesian(vec3(1.0, angleLat, angleLng));' + '}' + 'float getOddEven(float repeatId) {' + 'return (ceil(fract(repeatId/2.0)) == 0.0) ? 1.0*floor(repeatId/2.0) : -1.0*floor(repeatId/2.0);' + '}' + 'vec3 getFirstDispl(float nodeId, vec4 currentPosition, float repeatId) {' + 'float repeatDistribution = -0.1;' +
            // first check output edges of own node and return the node (textCoord for get posXYZW) with max available angle to the right
            'vec4 adjMatrix = idAdjMatrix_Autolink(nodeId, currentPosition.xyz);' + 'vec3 initialVec = normalize(posXYZW[adjMatrix.xy].xyz-currentPosition.xyz)*vec3(1.0, -1.0, 1.0);' + 'float totalAngleRelations = adjMatrix.z;' +
            // then first sum half of available angle received
            'initialVec = getVV(initialVec, (totalAngleRelations/2.0)*repeatDistribution);' +
            // and now left or right (oddEven)
            'return getVV(initialVec, getOddEven(repeatId)*totalAngleRelations*0.01);' + '}' + 'float checkLinkArrowVisibility(float currentTimestamp, float bornDate, float dieDate, float bornDateOpposite, float dieDateOpposite, float linkBornDate, float linkDieDate) {' + 'float visible =1.0;' + 'if(dieDate != 0.0) {' + 'if((currentTimestamp < bornDate || currentTimestamp > dieDate) || (currentTimestamp < bornDateOpposite || currentTimestamp > dieDateOpposite)) {' + 'visible = 0.0;' + '} else {' +
            // now check link
            'if(linkDieDate != 0.0) {' + 'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {' + 'visible = 0.0;' + '}' + '}' + '}' + '} else {' +
            // now check link
            'if(linkDieDate != 0.0) {' + 'if(currentTimestamp < linkBornDate || currentTimestamp > linkDieDate) {' + 'visible = 0.0;' + '}' + '}' + '}' + 'return visible;' + '}',

            //██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝     ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗     ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            // ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗    ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            'float nodeId = data[].x;' + 'float nodeIdOpposite = data[].y;' + 'float currentLineVertex = data[].z;' + // this is isTarget for arrows
            'float repeatId = data[].w;' + 'vec2 xGeometryNode = get_global_id(nodeId, bufferNodesWidth, ' + geometryLength.toFixed(1) + ');' + // bufferWidth6, geometryLength
            'vec2 xGeometryNode_opposite = get_global_id(nodeIdOpposite, bufferNodesWidth, ' + geometryLength.toFixed(1) + ');' + 'vec2 xGeometryLinks = get_global_id(nodeId, bufferLinksWidth, 2.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryLinks_opposite = get_global_id(nodeIdOpposite, bufferLinksWidth, 2.0);' + 'vec2 xGeometryArrows = get_global_id(nodeId, bufferArrowsWidth, 3.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryArrows_opposite = get_global_id(nodeIdOpposite, bufferArrowsWidth, 3.0);' + 'vec2 xGeometryText = get_global_id(nodeId, bufferTextsWidth, 4.0*12.0);' + // bufferWidth, geometryLength
            'vec2 xGeometryText_opposite = get_global_id(nodeIdOpposite, bufferTextsWidth, 4.0*12.0);' + 'vec4 nodeVertexPosition = nodeVertexPos[];\n' + 'vec4 nodeVertexTex = nodeVertexTexture[];\n' + 'float linkBornDate = dataC[].x;' + 'float linkDieDate = dataC[].y;' + 'float bornDate = dataB[xGeometryNode].x;' + 'float dieDate = dataB[xGeometryNode].y;' + 'float foutput = dataB[xGeometryNode].z;' + 'float error = dataF[xGeometryNode].x;' + 'float bornDateOpposite = dataB[xGeometryNode_opposite].x;' + 'float dieDateOpposite = dataB[xGeometryNode_opposite].y;' + 'vec4 currentPosition = posXYZW[xGeometryNode];\n' + 'vec3 oppositePosition = posXYZW[xGeometryNode_opposite].xyz;\n' + 'vec4 nodeVertexColor = vec4(1.0, 1.0, 1.0, 1.0);\n' + 'vec4 nodeVertexColorNetError = vec4(1.0, 1.0, 1.0, 1.0);\n' + 'vec3 dir = oppositePosition-vec3(currentPosition.x, currentPosition.y, currentPosition.z);' + 'float dist = length(dir);' + 'float vertexCount = 1.0;' + 'float lineIncrements = dist/vertexCount;' + 'vec3 dirN = normalize(dir);' + 'vec3 cr = cross(dirN, vec3(0.0, 1.0, 0.0));' + 'float currentLineVertexSQRT = abs( currentLineVertex-(vertexCount/2.0) )/(vertexCount/2.0);' + 'currentLineVertexSQRT = sqrt(1.0-currentLineVertexSQRT);' + 'vVertexUV = vec2(-1.0, -1.0);' + 'vDist = max(0.3, 1.0-(distance(currentPosition.xyz, oppositePosition)*0.01));\n' + // dist/acum

            'mat4 nodepos = nodeWMatrix;' + 'if(isNode == 1.0) {' + 'vVisibility = 1.0;' + 'currentPosition += vec4(0.0, 0.1, 0.0, 1.0);' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'float nodeImgId = nodeImgId[];' + 'if(nodeImgId != -1.0) {' + 'vUseTex = 1.0;' + 'vVertexUV = get2Dfrom1D(nodeImgId, nodeImgColumns)+vec2(nodeVertexTexture.x/nodeImgColumns,nodeVertexTexture.y/nodeImgColumns);' + '}' + 'if(dieDate != 0.0 && (currentTimestamp < bornDate || currentTimestamp > dieDate)) ' + 'vVisibility = 0.0;' + 'if(enableNeuronalNetwork == 1.0) {' + 'nodeVertexColor = vec4(0.0, 0.0, 0.0, 1.0);' + 'if(foutput > 0.0) ' + 'nodeVertexColor = vec4(abs(foutput), abs(foutput), abs(foutput), 1.0);' + 'else if(foutput < 0.0) ' + 'nodeVertexColor = vec4(abs(foutput), 0.0, 0.0, 1.0);' + 'if(error > 0.0) ' + 'nodeVertexColorNetError = vec4(abs(error), 0.0, 0.0, 1.0);' + 'else if(error < 0.0) ' + 'nodeVertexColorNetError = vec4(0.0, abs(error), 0.0, 1.0);' + 'else ' + 'nodeVertexColorNetError = vec4(0.0,0.0,0.0, 0.0);' + '}' + 'vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;' + '}' + 'if(isLink == 1.0) {' + 'if(xGeometryLinks != xGeometryLinks_opposite) {' +
            // displacing from center to first point
            'currentPosition += vec4(dirN*(lineIncrements*currentLineVertex), 1.0);' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) ' + 'currentPosition += vec4(cr*currentLineVertexSQRT*getOddEven(repeatId)*4.0, 1.0);' + '} else {' + // is Autolink
            'float currentLineVertexMM = abs( currentLineVertex-(vertexCount/2.0) );' + 'currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;' +

            // displacing from center to first point
            'vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);' + 'currentPosition += vec4(initialVec*(5.0*currentLineVertexMM), 1.0);' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {' + 'float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;' + 'vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);' + 'float hhSCount = (vertexCount/2.0)/2.0;' + 'float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));' + 'currentPosition += vec4((crB*sig)*currentLineVertexMMB*1.0, 1.0);' + '}' + '}' + 'vVisibility = checkLinkArrowVisibility(currentTimestamp, bornDate, dieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);' + 'vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;' + 'if(enableNeuronalNetwork == 1.0) {' + 'nodeVertexColor = vec4(abs(foutput), abs(foutput), abs(foutput), 1.0);' + 'if(error > 0.0) ' + 'nodeVertexColorNetError = vec4(0.0, abs(error), 0.0, 1.0);' + 'else if(error < 0.0) ' + 'nodeVertexColorNetError = vec4(abs(error), 0.0, 0.0, 1.0);' + 'else ' + 'nodeVertexColorNetError = vec4(0.0,0.0,0.0, 0.0);' + '}' + '}' + 'if(isArrow == 1.0) {' + 'vec3 currentPositionTMP;' + 'if(xGeometryArrows != xGeometryArrows_opposite) {' +
            // displacing from center to first point
            'float currentLineVertexU = vertexCount-1.0;' + 'currentPositionTMP = oppositePosition+((dirN*-1.0)*(lineIncrements*currentLineVertexU));' +

            // displacing from first point to cross direction (repeatId)
            'currentPositionTMP -= cr*(currentLineVertexSQRT*getOddEven(repeatId)*4.0);' + '} else {' + // is Autolink
            'float currentLineVertexU = vertexCount-1.0;' + 'float currentLineVertexMM = abs( currentLineVertexU-(vertexCount/2.0) );' + 'currentLineVertexMM = (vertexCount/2.0)-currentLineVertexMM;' +

            // displacing from center to first point
            'vec3 initialVec = getFirstDispl(nodeId, currentPosition, repeatId);' + 'currentPositionTMP = oppositePosition+(initialVec*(5.0*currentLineVertexMM));' +

            // displacing from first point to cross direction (repeatId)
            'if(currentLineVertex != 0.0 && currentLineVertex != vertexCount) {' + 'float sig = (currentLineVertex > (vertexCount/2.0)) ? 1.0 : -1.0;' + 'vec3 crB = cross(vec3(0.0, 1.0, 0.0), initialVec);' + 'float hhSCount = (vertexCount/2.0)/2.0;' + 'float currentLineVertexMMB = hhSCount-(abs(currentLineVertexMM-hhSCount));' + 'currentPositionTMP += (crB*sig)*currentLineVertexMMB*1.0;' +
            //'currentPositionTMP -= vec4((crB*sig)*(currentLineVertexSQRT*(repeatId+1.0)*4.0), 1.0);'+
            '}' + '}' + 'mat4 pp = lookAt(currentPositionTMP, vec3(currentPosition.x, currentPosition.y, currentPosition.z), vec3(0.0, 1.0, 0.0));' + 'pp = transpose(pp);' + 'nodepos[0][0] = pp[0][0];' + 'nodepos[0][1] = pp[1][0];' + 'nodepos[0][2] = pp[2][0];' + 'nodepos[1][0] = pp[0][1];' + 'nodepos[1][1] = pp[1][1];' + 'nodepos[1][2] = pp[2][1];' + 'nodepos[2][0] = pp[0][2];' + 'nodepos[2][1] = pp[1][2];' + 'nodepos[2][2] = pp[2][2];' +

            // displace from center to node border
            'dir = currentPositionTMP-vec3(currentPosition.x, currentPosition.y, currentPosition.z);' + 'currentPosition += vec4(normalize(dir),1.0)*2.0;' + 'vVisibility = checkLinkArrowVisibility(currentTimestamp, bornDate, dieDate, bornDateOpposite, dieDateOpposite, linkBornDate, linkDieDate);' + 'vIsSelected = (idToDrag == data[].x || idToDrag == data[].y) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x || idToHover == data[].y) ? 1.0 : 0.0;' + '}' + 'if(isNodeText == 1.0) {' + 'float letId = letterId[];\n' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'vVertexUV = get2Dfrom1D(letId, fontImgColumns)+vec2(nodeVertexTexture.x/fontImgColumns,nodeVertexTexture.y/fontImgColumns);' + 'nodeVertexPosition = vec4(nodeVertexPosition.x*0.1, nodeVertexPosition.y*0.1, nodeVertexPosition.z*0.1, 1.0);' + 'currentPosition.z += 2.5;' + 'vVisibility = 1.0;' + 'vIsSelected = (idToDrag == data[].x) ? 1.0 : 0.0;' + 'vIsHover = (idToHover == data[].x) ? 1.0 : 0.0;' + '}' + 'nodepos[3][0] = currentPosition.x;' + 'nodepos[3][1] = currentPosition.y;' + 'nodepos[3][2] = currentPosition.z;' + 'mat4 nodeposG = nodeWMatrix;' + 'vWNMatrix = nodeposG * nodeVertexNormal[];\n' + 'vUseCrosshair = 0.0;' + 'vIstarget = (currentLineVertex == 1.0) ? 1.0 : 0.0;' + customCode + 'vVertexColor = nodeVertexColor;' + 'vVertexColorNetError = nodeVertexColorNetError;' + 'vUV = nodeVertexTexture;' + 'vNodeId = nodeId;\n' + 'vNodeIdOpposite = nodeIdOpposite;\n' + 'gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPosition;\n',

            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ██╗  ██╗███████╗ █████╗ ██████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██║  ██║██╔════╝██╔══██╗██╔══██╗
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████║█████╗  ███████║██║  ██║
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ██╔══██║██╔══╝  ██╔══██║██║  ██║
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ██║  ██║███████╗██║  ██║██████╔╝
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
            'varying vec4 vVertexColor;\n' + 'varying vec4 vVertexColorNetError;\n' + 'varying vec4 vUV;\n' + 'varying vec2 vVertexUV;\n' + 'varying float vUseTex;\n' + 'varying vec4 vWNMatrix;\n' + 'varying float vNodeId;\n' + 'varying float vNodeIdOpposite;\n' + 'varying float vDist;\n' + 'varying float vVisibility;\n' + 'varying float vIsSelected;\n' + 'varying float vIsHover;\n' + 'varying float vUseCrosshair;\n' + 'varying float vIstarget;\n',

            //███████╗██████╗  █████╗  ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗    ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗
            //██╔════╝██╔══██╗██╔══██╗██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
            //█████╗  ██████╔╝███████║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║       ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗
            //██╔══╝  ██╔══██╗██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝
            //██║     ██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║       ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗
            //╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝
            'vec4 color = vVertexColor;\n' + 'vec4 colorB = vVertexColorNetError;\n' + 'vec4 colorOrange = vec4(255.0/255.0, 131.0/255.0, 0.0/255.0, 1.0);' + 'vec4 colorOrangeDark = vec4(255.0/255.0, 80.0/255.0, 0.0/255.0, 1.0);' + 'vec4 colorPurple = vec4(132.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);' + 'vec4 fcolor = vec4(0.0, 0.0, 0.0, 1.0);' + 'if(isNode == 1.0) {' + 'if(vUseTex == 1.0) {' + 'vec4 tex;' + 'if(vUseCrosshair == 1.0) {' + 'tex = nodesImgCrosshair[vVertexUV.xy];' + '} else if(vIsSelected == 1.0) {' + 'color = colorOrangeDark;' + 'tex = nodesImgCrosshair[vVertexUV.xy];' + '} else if(vIsHover == 1.0) {' + 'color = colorPurple;' + 'tex = nodesImg[vVertexUV.xy];' + '} else {' + 'tex = nodesImg[vVertexUV.xy];' + '}' + 'color = ' + _graphUtil.GraphUtils.nodesDrawMode(geometryLength) + ';\n' + '}' + 'if(color.a < 0.1) discard;' + 'fcolor = color;\n' + 'if(enableNeuronalNetwork == 1.0) {' +
            // half up: ouput; half down: error
            'if(vUV.y > (0.7)) ' + 'fcolor = colorB;\n' + // 0.75-(colorB.w*1.0)   'fcolor = (vUV.y < (0.5)) ? color : ((colorB.w == 0.0)?color:colorB);\n'+
            '}' + '} else if(isLink == 1.0) {' + 'if(vIsSelected == 1.0) ' + 'color = colorOrange;' + 'else if(vIsHover == 1.0) ' + 'color = colorPurple;' + 'if(enableNeuronalNetwork == 1.0) {' +
            // weight color
            'vec2 xAdjMatCurrent = get_global_id(vec2(vNodeIdOpposite, vNodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n' + 'vec4 pixAdjMatCCurrent = adjacencyMatrixC[xAdjMatCurrent];\n' +

            // x weight
            'if(pixAdjMatACurrent.z > 0.0) ' + 'fcolor = vec4(0.0, pixAdjMatACurrent.z, 0.0, 1.0);\n' + 'else ' + 'fcolor = vec4(abs(pixAdjMatACurrent.z), 0.0, 0.0, 1.0);\n' +

            /*'if(pixAdjMatCCurrent.x > 0.0) '+
                'fcolor *= vec4(0.0, abs(pixAdjMatCCurrent.x), 0.0, 1.0);'+
            'else if(pixAdjMatCCurrent.x < 0.0) '+
                'fcolor *= vec4(abs(pixAdjMatCCurrent.x), 0.0, 0.0, 1.0);'+
            'else '+
                'fcolor *= vec4(0.0,0.0,0.0, 0.0);'+*/

            // x output
            'if(multiplyOutput == 1.0) ' + 'fcolor *= vec4(color.xyz, 1.0);\n' + '} else ' + 'fcolor = vec4(color.xyz, 1.0);\n' + '} else if(isArrow == 1.0) {' + 'if(vIstarget == 1.0) {' + 'if(vIsSelected == 1.0) {' + 'color = vec4(colorOrange.rgb*vDist, 1.0);\n' + '} else if(vIsHover == 1.0) {' + 'color = vec4(colorPurple.rgb*vDist, 1.0);\n' + '}' + '} else {' + 'color = vec4(1.0, 0.0, 0.0, 0.0);' + '}' + 'fcolor = color;\n' + '} else if(isNodeText == 1.0) {' + 'fcolor = fontsImg[vVertexUV.xy];\n' + '}' + 'if(vVisibility == 0.0) ' + 'discard;' + 'return [fcolor];'];
        }
    }]);

    return VFP_NODE;
}();

global.VFP_NODE = VFP_NODE;
module.exports.VFP_NODE = VFP_NODE;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./graphUtil":10,"scejs":1}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});
exports.VFP_NODEPICKDRAG = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('scejs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VFP_NODEPICKDRAG = exports.VFP_NODEPICKDRAG = function () {
            function VFP_NODEPICKDRAG() {
                        _classCallCheck(this, VFP_NODEPICKDRAG);
            }

            _createClass(VFP_NODEPICKDRAG, null, [{
                        key: 'getSrc',
                        value: function getSrc(geometryLength) {
                                    return [[undefined],
                                    // vertex head
                                    'varying vec4 vColor;\n' +
                                    //'uniform sampler2D posXYZW;\n'+
                                    Utils.packGLSLFunctionString() + 'mat4 rotationMatrix(vec3 axis, float angle) {' + 'axis = normalize(axis);' + 'float s = sin(angle);' + 'float c = cos(angle);' + 'float oc = 1.0 - c;' + 'return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,' + 'oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,' + 'oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,' + '0.0,                                0.0,                                0.0,                                1.0);' + '}',

                                    // vertex source
                                    'vec2 xGeometry = get_global_id(data[].x, uBufferWidth, ' + geometryLength.toFixed(1) + ');' + 'vec4 nodePosition = posXYZW[xGeometry];\n' + 'float bornDate = dataB[xGeometry].x;' + 'float dieDate = dataB[xGeometry].y;' + 'mat4 nodepos = nodeWMatrix;' + 'mat4 mm = rotationMatrix(vec3(1.0,0.0,0.0), (3.1416/2.0)*3.0);' + 'nodepos = nodepos*mm;' + 'nodepos[3][0] = nodePosition.x;' + 'nodepos[3][1] = nodePosition.y;' + 'nodepos[3][2] = nodePosition.z;' + 'vColor = vec4(1.0, 1.0, 1.0, 1.0);' + 'int mak = 0;' + 'if(dieDate != 0.0) {' + 'if(currentTimestamp > bornDate && currentTimestamp < dieDate) ' + 'mak = 1;' + '} else ' + 'mak = 1;' + 'if(mak == 1) {' + 'vColor = pack((data[].x+1.0)/1000000.0);' + '}' + 'if(vColor.x == 1.0 && vColor.y == 1.0 && vColor.z == 1.0 && vColor.w == 1.0) ' + 'nodepos[3][0] = 10000.0;' + 'gl_Position = PMatrix * cameraWMatrix * nodepos * nodeVertexPos[];\n' + 'gl_PointSize = 10.0;\n',

                                    // fragment head
                                    'varying vec4 vColor;\n',

                                    // fragment source
                                    //'vec2 x = get_global_id();'+ // no needed

                                    'return [vColor];\n'];
                        }
            }]);

            return VFP_NODEPICKDRAG;
}();

global.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
module.exports.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"scejs":1}],8:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GBrainRL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gbrain = require("./gbrain");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ConvNetJS Reinforcement Learning Module (https://github.com/karpathy/convnetjs)
 */
/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.num_inputs
 * @param {int} jsonIn.num_actions
 * @param {int} jsonIn.temporal_window
 * @param {int} jsonIn.experience_size
 * @param {number} jsonIn.gamma
 * @param {number} jsonIn.epsilon_min
 * @param {number} jsonIn.epsilon_test_time
 * @param {int} jsonIn.start_learn_threshold
 * @param {int} jsonIn.gpu_batch_repeats
 * @param {Array<Object>} jsonIn.layer_defs
 */

var GBrainRL = exports.GBrainRL = function () {
    function GBrainRL(jsonIn) {
        _classCallCheck(this, GBrainRL);

        this.gbrain = null;

        this.num_inputs = jsonIn.num_inputs;
        this.num_actions = jsonIn.num_actions;
        this.temporal_window = jsonIn.temporal_window;
        this.experience_size = jsonIn.experience_size;
        this.gamma = jsonIn.gamma;
        this.epsilon_min = jsonIn.epsilon_min;
        this.epsilon_test_time = jsonIn.epsilon_test_time;
        this.start_learn_threshold = jsonIn.start_learn_threshold;

        this.net_inputs = this.num_inputs * this.temporal_window + this.num_actions * this.temporal_window + this.num_inputs;
        this.window_size = Math.max(this.temporal_window, 2);

        this.state_window = new Array(this.window_size);
        this.action_window = new Array(this.window_size);
        this.reward_window = new Array(this.window_size);
        this.net_window = new Array(this.window_size);

        this.experience = [];

        this.onLearned = null;

        this.age = 0;
        this.epsilon = 1.0;
        this.avcost = 0.0;

        this.latest_reward = 0;
        this.last_input_array = null;
        this.forward_passes = 0;
        this.learning = true;

        this.sweep = 0;
        this.sweepMax = 200;
        this.sweepDir = 0;

        this.learning_steps_total = 60000;
        this.learning_steps_burnin = 300;

        this.arrInputs = [];
        this.arrTargets = [];

        this.gbrain = new _gbrain.GBrain({ "target": jsonIn.target,
            "dimensions": jsonIn.dimensions });
        this.gbrain.makeLayers(jsonIn.layer_defs);

        this.lastTotalError = 0;
        this.currentBatchRepeat = jsonIn.gpu_batch_repeats;
    }

    _createClass(GBrainRL, [{
        key: "getNetInput",
        value: function getNetInput(xt) {
            // return s = (x,a,x,a,x,a,xt) state vector.
            // It's a concatenation of last window_size (x,a) pairs and current state x
            var w = [];
            w = w.concat(xt); // start with current state
            // and now go backwards and append states and actions from history temporal_window times
            var n = this.window_size;
            for (var k = 0; k < this.temporal_window; k++) {
                // state
                w = w.concat(this.state_window[n - 1 - k]);
                // action, encoded as 1-of-k indicator vector. We scale it up a bit because
                // we dont want weight regularization to undervalue this information, as it only exists once
                var action1ofk = new Array(this.num_actions);
                for (var q = 0; q < this.num_actions; q++) {
                    action1ofk[q] = 0.0;
                }action1ofk[this.action_window[n - 1 - k]] = 1.0 * this.num_inputs;
                w = w.concat(action1ofk);
            }
            return w;
        }
    }, {
        key: "random_action",
        value: function random_action() {
            return Math.floor(Math.random() * this.num_actions);
        }
    }, {
        key: "policy",
        value: function policy(s, onP) {
            // compute the value of doing any action in this state
            // and return the argmax action and its value
            this.gbrain.forward(s, function (data) {
                var maxacts = [];
                for (var n = 0; n < data.length; n++) {
                    var maxk = 0;
                    var maxval = data[n][0].output;

                    for (var nb = 1; nb < data[n].length; nb++) {
                        if (data[n][nb].output > maxval) {
                            maxk = nb;
                            maxval = data[n][nb].output;
                        }
                    }
                    maxacts.push({ "action": maxk, "value": maxval });
                }

                onP(maxacts);
            });
        }
    }, {
        key: "pushWindow",
        value: function pushWindow(input_array, net_input, action) {
            // remember the state and action we took for backward pass
            this.state_window.shift();
            this.state_window.push(input_array);

            this.net_window.shift();
            this.net_window.push(net_input);

            this.action_window.shift();
            this.action_window.push(action);
        }
    }, {
        key: "forward",
        value: function forward(input_array, onAction) {
            var _this = this;

            this.forward_passes++;
            this.last_input_array = input_array;

            var action = null;
            var net_input = null;
            if (this.forward_passes > this.temporal_window) {
                // we have enough to actually do something reasonable
                net_input = this.getNetInput(input_array);
                if (this.learning === true) {
                    var otr = Math.min(1, Math.max(0, this.latest_reward));
                    var rewardMultiplier = otr > 0 ? 1.0 - otr : otr * -1;
                    rewardMultiplier = Math.min(1, Math.max(0, rewardMultiplier)) * 2;
                    rewardMultiplier = Math.min(1, Math.max(0.1, rewardMultiplier));

                    if (this.sweep >= this.sweepMax) this.sweepDir = -1;else if (this.sweep <= 0) this.sweepDir = 1;

                    this.sweep += this.sweepDir;
                    var sweepMultiplier = this.sweep / this.sweepMax;
                    //this.epsilon = Math.max(this.epsilon_min, rewardMultiplier*sweepMultiplier);


                    this.epsilon = Math.min(1.0, Math.max(this.epsilon_min, 1.0 - (this.age - this.learning_steps_burnin) / (this.learning_steps_total - this.learning_steps_burnin)));
                } else this.epsilon = this.epsilon_test_time;

                var rf = Math.random();
                if (rf < this.epsilon) {
                    // choose a random action with epsilon probability
                    action = this.random_action();
                    this.pushWindow(input_array, net_input, action);
                    onAction(action);
                } else {
                    // otherwise use our policy to make decision
                    this.policy(net_input, function (maxact) {
                        _this.pushWindow(input_array, net_input, maxact[0].action);
                        onAction(maxact[0].action);
                    });
                }
            } else {
                // pathological case that happens first few iterations
                // before we accumulate window_size inputs
                net_input = [];
                action = this.random_action();
                this.pushWindow(input_array, net_input, action);
                onAction(action);
            }
        }
    }, {
        key: "train",
        value: function train() {
            var _this2 = this;

            this.gbrain.forward(this.arrInputs, function (data) {
                _this2.gbrain.train(_this2.arrTargets, function (data) {
                    _this2.arrInputs = [];
                    _this2.arrTargets = [];

                    //this.avcost = this.avcost/this.gbrain.batch_size;
                    //this.average_loss_window.add(this.avcost); TODO

                    if (_this2.currentBatchRepeat === 9) _this2.onLearned();else {
                        _this2.currentBatchRepeat++;
                        _this2.bb();
                    }
                });
            });
        }
    }, {
        key: "bb",
        value: function bb() {
            var _this3 = this;

            var bEntries = [];
            var state1_entries = [];
            for (var n = 0; n < this.gbrain.batch_size; n++) {
                var e = this.experience[Math.floor(Math.random() * this.experience.length)];
                bEntries.push(e);
                for (var nb = 0; nb < e.state1.length; nb++) {
                    state1_entries.push(e.state1[nb]);
                }
            }
            this.policy(state1_entries, function (maxact) {
                var state0_entries = [];

                for (var _n = 0; _n < _this3.gbrain.batch_size; _n++) {
                    var r = bEntries[_n].reward0 + _this3.gamma * maxact[_n].value;
                    var ystruct = { dim: bEntries[_n].action0, val: r };

                    for (var _nb = 0; _nb < bEntries[_n].state0.length; _nb++) {
                        state0_entries.push(bEntries[_n].state0[_nb]);
                    }_this3.arrTargets.push(ystruct);
                }
                _this3.arrInputs = state0_entries;

                _this3.avcost = 0.0;
                _this3.train();
            });
        }
    }, {
        key: "backward",
        value: function backward(reward, _onLearned) {
            this.latest_reward = reward;
            this.onLearned = _onLearned;
            //this.average_reward_window.add(reward); TODO
            this.reward_window.shift();
            this.reward_window.push(reward);

            if (this.learning === false) this.onLearned();else {
                this.age++;

                // it is time t+1 and we have to store (s_t, a_t, r_t, s_{t+1}) as new experience
                // (given that an appropriate number of state measurements already exist, of course)
                if (this.forward_passes > this.temporal_window + 1) {
                    var n = this.window_size;
                    var e = { "state0": this.net_window[n - 2],
                        "action0": this.action_window[n - 2],
                        "reward0": this.reward_window[n - 2],
                        "state1": this.net_window[n - 1] };
                    if (this.experience.length < this.experience_size) this.experience.push(e);else {
                        var _e = Math.floor(Math.random() * this.experience.length);
                        this.experience[_e] = _e;
                    }
                }

                if (this.experience.length > this.start_learn_threshold) {
                    this.currentBatchRepeat = 0;
                    this.bb();
                } else this.onLearned();
            }
        }
    }]);

    return GBrainRL;
}();

global.GBrainRL = GBrainRL;
module.exports.GBrainRL = GBrainRL;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./gbrain":9}],9:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GBrain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("scejs");

var _Graph = require("./Graph.class");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @param {Object} jsonIn
 * @param {HTMLElement} jsonIn.target
 * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
 * @param {int} jsonIn.batch_size
 */
var GBrain = exports.GBrain = function () {
    function GBrain(jsonIn) {
        _classCallCheck(this, GBrain);

        this.project = null;
        this.graph = null;

        this.inputCount = 0;
        this.outputCount = 0;
        this.neuronLayers = [];
        this.batch_size = 7;

        this.ini(jsonIn);
    }

    /**
     * @param {Object} jsonIn
     * @param {HTMLElement} jsonIn.target
     * @param {Object} [jsonIn.dimensions={width: Int, height: Int}]
     * @param {boolean} [jsonIn.enableUI=false]
     * @param {WebGLRenderingContext} [jsonIn.gl=undefined]
     */


    _createClass(GBrain, [{
        key: "ini",
        value: function ini(jsonIn) {
            var sce = new SCE();
            sce.initialize(jsonIn);

            this.project = new Project();
            sce.loadProject(this.project);

            var stage = new Stage();
            this.project.addStage(stage);
            this.project.setActiveStage(stage);

            // CAMERA
            var simpleCamera = new SimpleCamera(sce);
            simpleCamera.setView(Constants.VIEW_TYPES.TOP);
            simpleCamera.setVelocity(1.0);
            sce.setDimensions(jsonIn.dimensions.width, jsonIn.dimensions.height);

            // GRID
            //let grid = new Grid(sce);
            //grid.generate(100.0, 1.0);

            this.graph = new _Graph.Graph(sce, { "enableFonts": true });
            this.graph.enableNeuronalNetwork();
            this.graph.layerCount = 0;
            this.graph.batch_size = this.batch_size;

            var mesh_point = new Mesh().loadPoint();
            //this.graph.setNodeMesh(mesh_point);


            this.graph.setFontsImage(sce.sceDirectory + "/Prefabs/Graph/fonts.png");
        }
    }, {
        key: "makeLayers",


        /**
         * @param {Array<Object>} layer_defs
         */
        value: function makeLayers(layer_defs) {
            var _this = this;

            var offsetX = -30;
            var lType = { "input": function input(l) {
                    var offsetZ = -10.0 * (l.depth / 2);
                    for (var n = 0; n < l.depth; n++) {
                        _this.graph.afferentNodesCount++;
                        _this.graph.addAfferentNeuron("input" + _this.inputCount, [offsetX, 0.0, offsetZ, 1.0]); // afferent neuron (sensor)
                        _this.inputCount++;
                        offsetZ += 10.0;
                    }

                    _this.graph.layerCount++;
                    offsetX += 30.0;
                },
                "fc": function fc(l) {
                    var neuronLayer = _this.graph.createNeuronLayer(1, l.num_neurons, [offsetX, 0.0, 0.0, 1.0], 5.0); // numX, numY, visible position
                    _this.neuronLayers.push(neuronLayer);

                    if (_this.graph.layerCount === 1) {
                        for (var n = 0; n < _this.inputCount; n++) {
                            _this.graph.connectNeuronWithNeuronLayer({ "neuron": "input" + n,
                                "neuronLayer": _this.neuronLayers[_this.neuronLayers.length - 1],
                                "activationFunc": 0,
                                "weight": null,
                                "multiplier": 1,
                                "layerNum": _this.graph.layerCount - 1 });
                        }
                    } else _this.graph.connectNeuronLayerWithNeuronLayer({ "neuronLayerOrigin": _this.neuronLayers[_this.neuronLayers.length - 2],
                        "neuronLayerTarget": _this.neuronLayers[_this.neuronLayers.length - 1],
                        "layerNum": _this.graph.layerCount - 1 }); // TODO l.activation

                    _this.graph.layerCount++;
                    offsetX += 30.0;
                },
                "regression": function regression(l) {
                    var offsetZ = -30.0 * (l.num_neurons / 2);
                    for (var n = 0; n < l.num_neurons; n++) {
                        _this.graph.efferentNodesCount++;
                        _this.graph.addEfferentNeuron("output" + _this.outputCount, [offsetX, 0.0, offsetZ, 1.0]); // efferent neuron (actuator)
                        _this.graph.connectNeuronLayerWithNeuron({ "neuronLayer": _this.neuronLayers[_this.neuronLayers.length - 1],
                            "neuron": "output" + _this.outputCount,
                            "layerNum": _this.graph.layerCount - 1 });

                        _this.outputCount++;
                        offsetZ += 30.0;
                    }
                    _this.graph.layerCount++;
                } };
            for (var n = 0; n < layer_defs.length; n++) {
                var l = layer_defs[n];
                lType[l.type](l);
            }

            this.graph.createWebGLBuffers();
            this.graph.enableForceLayout();
        }
    }, {
        key: "forward",


        /**
         * @param {Array<number>} state
         * @param {Function} onAction
         */
        value: function forward(state, _onAction) {
            this.graph.forward({ "state": state,
                "onAction": function onAction(data) {
                    _onAction(data);
                } });
        }
    }, {
        key: "train",


        /**
         * @param {Object} reward {dim: actionId for the reward , val: number}
         * @param {Function} onTrain
         */
        value: function train(reward, onTrain) {
            var arrReward = [];
            for (var n = 0; n < reward.length; n++) {
                for (var nb = 0; nb < this.outputCount / this.batch_size; nb++) {
                    if (nb === reward[n].dim) arrReward.push(reward[n].val);else arrReward.push(0.0);
                }
            }

            this.graph.train({ "arrReward": arrReward,
                "onTrained": function onTrained(data) {
                    onTrain(data);
                } });
        }
    }, {
        key: "enableShowOutputWeighted",
        value: function enableShowOutputWeighted() {
            this.graph.enableShowOutputWeighted();
        }
    }, {
        key: "disableShowOutputWeighted",
        value: function disableShowOutputWeighted() {
            this.graph.disableShowOutputWeighted();
        }
    }, {
        key: "tick",
        value: function tick() {
            this.project.getActiveStage().tick();
        }
    }]);

    return GBrain;
}();

global.GBrain = GBrain;
module.exports.GBrain = GBrain;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Graph.class":2,"scejs":1}],10:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphUtils = exports.GraphUtils = function () {
    function GraphUtils() {
        _classCallCheck(this, GraphUtils);
    }

    _createClass(GraphUtils, null, [{
        key: "nodesDrawMode",
        value: function nodesDrawMode(geometryLength) {
            if (geometryLength === 1) return "vec4(color.rgb, 1.0)";else return "vec4(tex.rgb*color.rgb, tex.a)";
        }
    }, {
        key: "adjMatrix_ForceLayout_GLSLFunctionString",
        value: function adjMatrix_ForceLayout_GLSLFunctionString(geometryLength, efferentStart, efferentNodesCount) {
            return '' + "vec3 sphericalColl(vec3 currentDir, vec3 currentDirB, vec3 dirToBN) {\n            vec3 currentDirN = normalize(currentDir);\n            float pPoint = abs(dot(currentDirN, dirToBN));\n            vec3 reflectV = reflect(currentDirN*-1.0, dirToBN);\n\n            vec3 currentDirBN = normalize(currentDirB);\n            float pPointB = abs(dot(currentDirBN, dirToBN));\n\n            vec3 repulsionForce = (reflectV*-1.0)* (((1.0-pPoint)*length(currentDir))+((pPointB)*length(currentDirB)));\n\n            return (repulsionForce.x > 0.0 && repulsionForce.y > 0.0 && repulsionForce.z > 0.0) ? repulsionForce : dirToBN*-0.1;\n        }\n\n        struct CalculationResponse {\n            vec3 atraction;\n            float acumAtraction;\n            vec3 repulsion;\n            float collisionExists;\n            float netChildInputSumA;\n            float netParentErrorWeightA;\n            float netChildInputSumB;\n            float netParentErrorWeightB;\n            float netChildInputSumC;\n            float netParentErrorWeightC;\n            float netChildInputSumD;\n            float netParentErrorWeightD;\n            float netChildInputSumE;\n            float netParentErrorWeightE;\n            float netChildInputSumF;\n            float netParentErrorWeightF;\n            float netChildInputSumG;\n            float netParentErrorWeightG;\n        };" +

            // pixAdjMatA (bornDate, dieDate, weight (parent:-2;child:w), isParent (1.0:parent;0.0:child))
            // pixAdjMatA (linkMultiplier, activationFunction)
            "CalculationResponse calculate(float nodeId,\n                                        vec4 pixAdjMatACurrent, vec4 pixAdjMatAOpposite,\n                                        vec4 pixAdjMatBCurrent, vec4 pixAdjMatBOpposite,\n                                        vec2 xGeomCurrent, vec2 xGeomOpposite,\n                                        vec3 currentPos, vec3 currentDir,\n                                        vec3 atraction, float acumAtraction, vec3 repulsion,\n                                        float enableNeuronalNetwork,\n                                        float netChildInputSumA, float netParentErrorWeightA,\n                                        float netChildInputSumB, float netParentErrorWeightB,\n                                        float netChildInputSumC, float netParentErrorWeightC,\n                                        float netChildInputSumD, float netParentErrorWeightD,\n                                        float netChildInputSumE, float netParentErrorWeightE,\n                                        float netChildInputSumF, float netParentErrorWeightF,\n                                        float netChildInputSumG, float netParentErrorWeightG) {" +
            // pixAdjMatACurrent
            "float currentBornDate = pixAdjMatACurrent.x;\n            float currentDieDate = pixAdjMatACurrent.y;\n            float currentWeight = pixAdjMatACurrent.z;\n            float currentIsParent = pixAdjMatACurrent.w;" +

            // pixAdjMatAOpposite
            "float oppositeBornDate = pixAdjMatAOpposite.x;\n            float oppositeDieDate = pixAdjMatAOpposite.y;\n            float oppositeWeight = pixAdjMatAOpposite.z;\n            float oppositeIsParent = pixAdjMatAOpposite.w;" +

            // pixAdjMatBCurrent
            "float currentLinkMultiplier = pixAdjMatBCurrent.x;\n            float currentActivationFn = pixAdjMatBCurrent.y;" +

            // pixAdjMatBOpposite
            "float oppositeLinkMultiplier = pixAdjMatBOpposite.x;\n            float oppositeActivationFn = pixAdjMatBOpposite.y;" +

            // dataB Current
            //'float currentBornDate = dataB[xGeomCurrent].x;'+
            //'float currentDieDate = dataB[xGeomCurrent].y;'+
            //'float currentNetOutput = dataB[xGeomCurrent].z;'+
            //'float currentNetError = dataB[xGeomCurrent].w;'+

            // dataB Opposite
            //'float oppositeBornDate = dataB[xGeomOpposite].x;'+
            //'float oppositeDieDate = dataB[xGeomOpposite].y;'+
            "float oppositeNetOutputA = dataB[xGeomOpposite].z;\n            float oppositeNetErrorA = dataB[xGeomOpposite].w;\n\n            float oppositeNetOutputB = dataF[xGeomOpposite].x;\n            float oppositeNetErrorB = dataF[xGeomOpposite].y;\n        \n            float oppositeNetOutputC = dataF[xGeomOpposite].z;\n            float oppositeNetErrorC = dataF[xGeomOpposite].w;\n        \n            float oppositeNetOutputD = dataG[xGeomOpposite].x;\n            float oppositeNetErrorD = dataG[xGeomOpposite].y;\n        \n            float oppositeNetOutputE = dataG[xGeomOpposite].z;\n            float oppositeNetErrorE = dataG[xGeomOpposite].w;\n        \n            float oppositeNetOutputF = dataH[xGeomOpposite].x;\n            float oppositeNetErrorF = dataH[xGeomOpposite].y;\n        \n            float oppositeNetOutputG = dataH[xGeomOpposite].z;\n            float oppositeNetErrorG = dataH[xGeomOpposite].w;" +

            // pos & dir Current
            //'vec3 currentPos = posXYZW[xGeomCurrent].xyz;\n'+
            //'vec3 currentDir = dir[xGeomCurrent].xyz;\n'+

            // pos & dir Opposite
            "vec3 oppositePos = posXYZW[xGeomOpposite].xyz;\n            vec3 oppositeDir = dir[xGeomOpposite].xyz;" +

            // dir / dist to opposite
            'vec3 dirToOpposite = (oppositePos-currentPos);\n' + 'vec3 dirToOppositeN = normalize(dirToOpposite);\n' + 'float dist = distance(oppositePos, currentPos);\n' + // near=0.0 ; far=1.0
            'float distN = max(0.0,dist)/100000.0;' + 'float p = 1.0;' + 'if(currentDieDate != 0.0 && (currentTimestamp < currentBornDate || currentTimestamp > currentDieDate)) ' + 'p = 0.0;' + 'if(oppositeDieDate != 0.0 && (currentTimestamp < oppositeBornDate || currentTimestamp > oppositeDieDate)) ' + 'p = 0.0;' + 'if(p == 1.0) {' + 'float m1 = (enableNeuronalNetwork == 1.0) ? 0.0 : 400000.0;' + 'float m2 = (enableNeuronalNetwork == 1.0) ? 0.0 : 48.0;' + 'if(currentIsParent == 1.0) {' +
            //'if(enableNeuronalNetwork == 1.0) '+
            'netChildInputSumA += oppositeNetOutputA*oppositeWeight;' + 'netChildInputSumB += oppositeNetOutputB*oppositeWeight;' + 'netChildInputSumC += oppositeNetOutputC*oppositeWeight;' + 'netChildInputSumD += oppositeNetOutputD*oppositeWeight;' + 'netChildInputSumE += oppositeNetOutputE*oppositeWeight;' + 'netChildInputSumF += oppositeNetOutputF*oppositeWeight;' + 'netChildInputSumG += oppositeNetOutputG*oppositeWeight;' +
            //'else {'+
            'atraction += dirToOppositeN*max(1.0, distN*abs(oppositeWeight)*(m1/2.0));\n' + 'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(oppositeWeight)*(m2/2.0));\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '} else if(currentIsParent == 0.5) {' +
            //'if(enableNeuronalNetwork == 1.0) '+
            'netParentErrorWeightA += oppositeNetErrorA*currentWeight;' + 'netParentErrorWeightB += oppositeNetErrorB*currentWeight;' + 'netParentErrorWeightC += oppositeNetErrorC*currentWeight;' + 'netParentErrorWeightD += oppositeNetErrorD*currentWeight;' + 'netParentErrorWeightE += oppositeNetErrorE*currentWeight;' + 'netParentErrorWeightF += oppositeNetErrorF*currentWeight;' + 'netParentErrorWeightG += oppositeNetErrorG*currentWeight;' +
            //'else {'+
            'atraction += dirToOppositeN*max(1.0, distN*abs(currentWeight)*m1);\n' + 'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*m2);\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '}' +

            //'if(enableNeuronalNetwork == 0.0) {'+
            'repulsion += -dirToOppositeN*max(1.0, (1.0-distN)*abs(currentWeight)*(m2/8.0));\n' + 'acumAtraction += 1.0;\n' +
            //'}'+
            '}' + ("float collisionExists = 0.0;\n            if(enableForceLayoutCollision == 1.0 && dist < 4.0) {\n                collisionExists = 1.0;\n                atraction = sphericalColl(currentDir, oppositeDir, dirToOppositeN);\n            }\n\n            return CalculationResponse(atraction, acumAtraction, repulsion, collisionExists,\n                                        netChildInputSumA, netParentErrorWeightA,\n                                        netChildInputSumB, netParentErrorWeightB,\n                                        netChildInputSumC, netParentErrorWeightC,\n                                        netChildInputSumD, netParentErrorWeightD,\n                                        netChildInputSumE, netParentErrorWeightE,\n                                        netChildInputSumF, netParentErrorWeightF,\n                                        netChildInputSumG, netParentErrorWeightG);\n        }\n        struct idAdjMatrixResponse {\n            vec3 force;\n            float collisionExists;\n            float netFOutputA;\n            float netErrorWeightA;\n            float netFOutputB;\n            float netErrorWeightB;\n            float netFOutputC;\n            float netErrorWeightC;\n            float netFOutputD;\n            float netErrorWeightD;\n            float netFOutputE;\n            float netErrorWeightE;\n            float netFOutputF;\n            float netErrorWeightF;\n            float netFOutputG;\n            float netErrorWeightG;\n        };\n        float tanh(float val) {\n            float tmp = exp(val);\n            float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);\n            return tanH;\n        }\n        float sigm(float val) {\n            return (1.0 / (1.0 + exp(-val)));\n        }\n        idAdjMatrixResponse idAdjMatrix_ForceLayout(float nodeId, vec3 currentPos, vec3 currentDir, float numOfConnections, float currentTimestamp, float bornDate, float dieDate, float enableNeuronalNetwork) {\n            vec3 atraction = vec3(0.0, 0.0, 0.0);\n            float acumAtraction = 1.0;\n            vec3 repulsion = vec3(0.0, 0.0, 0.0);\n\n            float collisionExists = 0.0;\n            vec3 force = vec3(0.0, 0.0, 0.0);\n\n\n            float netChildInputSumA = 0.0;\n            float foutputA = 0.0;\n            float netParentErrorWeightA = 0.0;\n            \n            float netChildInputSumB = 0.0;\n            float foutputB = 0.0;\n            float netParentErrorWeightB = 0.0;\n            \n            float netChildInputSumC = 0.0;\n            float foutputC = 0.0;\n            float netParentErrorWeightC = 0.0;\n            \n            float netChildInputSumD = 0.0;\n            float foutputD = 0.0;\n            float netParentErrorWeightD = 0.0;\n            \n            float netChildInputSumE = 0.0;\n            float foutputE = 0.0;\n            float netParentErrorWeightE = 0.0;\n            \n            float netChildInputSumF = 0.0;\n            float foutputF = 0.0;\n            float netParentErrorWeightF = 0.0;\n            \n            float netChildInputSumG = 0.0;\n            float foutputG = 0.0;\n            float netParentErrorWeightG = 0.0;\n            \n\n            if(nodeId < nodesCount) {\n                float currentActivationFn = 0.0;\n                vec2 xGeomCurrent = get_global_id(nodeId, uBufferWidth, " + geometryLength.toFixed(1) + ");\n                for(int n=0; n < 4096; n++) {\n                    if(float(n) >= nodesCount) {break;}\n                    if(float(n) != nodeId) {\n                        vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, " + geometryLength.toFixed(1) + ");\n\n\n                        vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);\n                        vec2 xAdjMatOpposite = get_global_id(vec2(nodeId, float(n)), widthAdjMatrix);\n\n                        vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n                        vec4 pixAdjMatAOpposite = adjacencyMatrix[xAdjMatOpposite];\n\n                        vec4 pixAdjMatBCurrent = adjacencyMatrixB[xAdjMatCurrent];\n                        vec4 pixAdjMatBOpposite = adjacencyMatrixB[xAdjMatOpposite];\n\n\n                        CalculationResponse calcResponse = calculate(nodeId,\n                                                                    pixAdjMatACurrent, pixAdjMatAOpposite,\n                                                                    pixAdjMatBCurrent, pixAdjMatBOpposite,\n                                                                    xGeomCurrent, xGeomOpposite,\n                                                                    currentPos, currentDir,\n                                                                    atraction, acumAtraction, repulsion,\n                                                                    enableNeuronalNetwork,\n                                                                    netChildInputSumA, netParentErrorWeightA,\n                                                                    netChildInputSumB, netParentErrorWeightB,\n                                                                    netChildInputSumC, netParentErrorWeightC,\n                                                                    netChildInputSumD, netParentErrorWeightD,\n                                                                    netChildInputSumE, netParentErrorWeightE,\n                                                                    netChildInputSumF, netParentErrorWeightF,\n                                                                    netChildInputSumG, netParentErrorWeightG);\n                        atraction = calcResponse.atraction;\n                        acumAtraction = calcResponse.acumAtraction;\n                        repulsion = calcResponse.repulsion;\n                        \n                        \n                        netChildInputSumA = calcResponse.netChildInputSumA;\n                        netParentErrorWeightA = calcResponse.netParentErrorWeightA;\n                        \n                        netChildInputSumB = calcResponse.netChildInputSumB;\n                        netParentErrorWeightB = calcResponse.netParentErrorWeightB;\n                        \n                        netChildInputSumC = calcResponse.netChildInputSumC;\n                        netParentErrorWeightC = calcResponse.netParentErrorWeightC;\n                        \n                        netChildInputSumD = calcResponse.netChildInputSumD;\n                        netParentErrorWeightD = calcResponse.netParentErrorWeightD;\n                        \n                        netChildInputSumE = calcResponse.netChildInputSumE;\n                        netParentErrorWeightE = calcResponse.netParentErrorWeightE;\n                        \n                        netChildInputSumF = calcResponse.netChildInputSumF;\n                        netParentErrorWeightF = calcResponse.netParentErrorWeightF;\n                        \n                        netChildInputSumG = calcResponse.netChildInputSumG;\n                        netParentErrorWeightG = calcResponse.netParentErrorWeightG;\n\n\n                        if(calcResponse.collisionExists == 1.0) {\n                            collisionExists = 1.0;\n                            force = calcResponse.atraction;\n                            break;\n                        }\n\n                        if(dieDate != 0.0) {\n                            if(currentTimestamp < bornDate || currentTimestamp > dieDate) {\n                                force = vec3(0.0, 0.0, 0.0);\n                                break;\n                            }\n                        }\n                    }\n                }\n\n                if(collisionExists == 0.0) {\n                    force += (atraction/acumAtraction)*1.0;\n                    force += (repulsion/acumAtraction)*1.0;\n                }\n\n                if(enableNeuronalNetwork == 1.0) {\n                    " + GraphUtils.efferentNodesStr(efferentStart, efferentNodesCount) + "\n                }\n            }\n\n            return idAdjMatrixResponse(vec3(force), collisionExists,\n                                        foutputA, netParentErrorWeightA,\n                                        foutputB, netParentErrorWeightB,\n                                        foutputC, netParentErrorWeightC,\n                                        foutputD, netParentErrorWeightD,\n                                        foutputE, netParentErrorWeightE,\n                                        foutputF, netParentErrorWeightF,\n                                        foutputG, netParentErrorWeightG);\n        }");
        }
    }, {
        key: "efferentNodesStr",
        value: function efferentNodesStr(efferentStart, efferentNodesCount) {
            var str = "\n            if(nodeId < afferentNodesCount) {\n                for(float n=0.0; n < 1024.0; n+=1.0) {\n                    if(n >= afferentNodesCount) {\n                        break;\n                    }\n                    if(nodeId == n) {\n                        foutputA = afferentNodesA[int(n)];\n                        foutputB = afferentNodesB[int(n)];\n                        foutputC = afferentNodesC[int(n)];\n                        foutputD = afferentNodesD[int(n)];\n                        foutputE = afferentNodesE[int(n)];\n                        foutputF = afferentNodesF[int(n)];\n                        foutputG = afferentNodesG[int(n)];\n                        break;\n                    }\n                }\n            } else {\n                foutputA = max(0.0, netChildInputSumA); " + "\n                foutputB = max(0.0, netChildInputSumB);\n                foutputC = max(0.0, netChildInputSumC);\n                foutputD = max(0.0, netChildInputSumD);\n                foutputE = max(0.0, netChildInputSumE);\n                foutputF = max(0.0, netChildInputSumF);\n                foutputG = max(0.0, netChildInputSumG);\n            }";

            str += "\n        if(nodeId == " + efferentStart.toFixed(1) + (") {\n            netParentErrorWeightA = (efferentNodesA[0] != 0.0) ? netChildInputSumA-efferentNodesA[0] : 0.0;\n            " + "\n            netParentErrorWeightB = (efferentNodesB[0] != 0.0) ? netChildInputSumB-efferentNodesB[0] : 0.0;\n            " + "\n            netParentErrorWeightC = (efferentNodesC[0] != 0.0) ? netChildInputSumC-efferentNodesC[0] : 0.0;\n            " + "\n            netParentErrorWeightD = (efferentNodesD[0] != 0.0) ? netChildInputSumD-efferentNodesD[0] : 0.0;\n            " + "\n            netParentErrorWeightE = (efferentNodesE[0] != 0.0) ? netChildInputSumE-efferentNodesE[0] : 0.0;\n            " + "\n            netParentErrorWeightF = (efferentNodesF[0] != 0.0) ? netChildInputSumF-efferentNodesF[0] : 0.0;\n            " + "\n            netParentErrorWeightG = (efferentNodesG[0] != 0.0) ? netChildInputSumG-efferentNodesG[0] : 0.0;\n            " + "\n        }");
            for (var n = efferentStart + 1; n < efferentStart + efferentNodesCount; n++) {
                str += "\n            else if(nodeId == " + n.toFixed(1) + ") {\n                netParentErrorWeightA = (efferentNodesA[" + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumA-efferentNodesA[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightB = (efferentNodesB[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumB-efferentNodesB[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightC = (efferentNodesC[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumC-efferentNodesC[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightD = (efferentNodesD[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumD-efferentNodesD[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightE = (efferentNodesE[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumE-efferentNodesE[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightF = (efferentNodesF[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumF-efferentNodesF[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n                netParentErrorWeightG = (efferentNodesG[") + Math.round(n - efferentStart) + "] != 0.0) ? netChildInputSumG-efferentNodesG[" + Math.round(n - efferentStart) + ("] : 0.0;\n                " + "\n            }");
            }str += "\n        else {\n            if(foutputA <= 0.0) {\n                netParentErrorWeightA = 0.0;\n            }\n            if(foutputB <= 0.0) {\n                netParentErrorWeightB = 0.0;\n            }\n            if(foutputC <= 0.0) {\n                netParentErrorWeightC = 0.0;\n            }\n            if(foutputD <= 0.0) {\n                netParentErrorWeightD = 0.0;\n            }\n            if(foutputE <= 0.0) {\n                netParentErrorWeightE = 0.0;\n            }\n            if(foutputF <= 0.0) {\n                netParentErrorWeightF = 0.0;\n            }\n            if(foutputG <= 0.0) {\n                netParentErrorWeightG = 0.0;\n            }\n        }";

            return str;
        }
    }, {
        key: "adjMatrix_Autolink_GLSLFunctionString",
        value: function adjMatrix_Autolink_GLSLFunctionString(geometryLength) {
            return '' + 'float GetAngle(vec3 A, vec3 B) {' + // from -180.0 to 180.0
            'vec3 cr = cross(A, B);' + 'float d = dot(A, B);' + 'if(cr.y < 0.0) {' + 'if(d > 0.0) {' + 'd =        (1.0-d)*90.0;' + '} else {' + 'd = 90.0+  (abs(d)*90.0);' + '}' + '} else {' + 'if(d > 0.0) {' + 'd = 270.0+ (d*90.0);' + '} else {' + 'd = 180.0+ ((1.0-abs(d))*90.0);' + '}' + '}' + 'return d;' + '}' + 'vec4 idAdjMatrix_Autolink(float nodeId, vec3 currentPos) {\n' +
            // INIT VARS
            'vec2 totalIDrelation = vec2(0.0, 0.0);' + 'float totalAngleRelations = 0.0;' +
            // END INIT VARS

            'if(nodeId < nodesCount) {\n' + 'for(int n=0; n < 4096; n++) {\n' + 'if(float(n) >= nodesCount) break;\n' + 'if(float(n) != nodeId) {' + 'vec2 xAdjMatCurrent = get_global_id(vec2(float(n), nodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent = adjacencyMatrix[xAdjMatCurrent];\n' +

            // RELATION FOUND
            'if(pixAdjMatACurrent.x > 0.0) {' + 'vec2 xGeomOpposite = get_global_id(float(n), uBufferWidth, ' + geometryLength.toFixed(1) + ');\n' + 'vec3 currentPosB = posXYZW[xGeomOpposite].xyz;\n' + 'vec3 dirToBN = normalize(currentPosB-currentPos);\n' + 'vec2 IDrelation = vec2(0.0, 0.0);' + 'float angleRelations = 360.0;' + 'if(nodeId < nodesCount) {\n' + 'for(int nB=0; nB < 4096; nB++) {\n' + 'if(float(nB) >= nodesCount) break;\n' + 'if(float(nB) != float(n) && float(nB) != nodeId) {' + 'vec2 xAdjMatCurrentB = get_global_id(vec2(float(nB), nodeId), widthAdjMatrix);' + 'vec4 pixAdjMatACurrent_B = adjacencyMatrix[xAdjMatCurrentB];\n' + 'if(pixAdjMatACurrent_B.x > 0.0) {' + 'vec2 xGeom_oppoB = get_global_id(float(nB), uBufferWidth, ' + geometryLength.toFixed(1) + ');\n' + 'vec3 currentPosBB = posXYZW[xGeom_oppoB].xyz;\n' + 'vec3 dirToBBN = normalize(currentPosBB-currentPos);\n' + 'float angle = GetAngle(dirToBN,dirToBBN);' + 'if(angle > 0.0 && angle < angleRelations) {' + 'IDrelation = xGeom_oppoB;' + 'angleRelations = angle;' + '}' + '}' + '}' + '}' + '}' + 'if(angleRelations < 360.0 && angleRelations > totalAngleRelations) {' + 'totalIDrelation = IDrelation;' + 'totalAngleRelations = angleRelations;' + '}' + '}' +
            // END RELATION FOUND

            '}' + '}' +
            // SUMMATION
            // END SUMMATION

            '}' + 'return vec4(totalIDrelation, totalAngleRelations, 0.0);' + '}';
        }
    }]);

    return GraphUtils;
}();

global.GraphUtils = GraphUtils;
module.exports.GraphUtils = GraphUtils;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
"use strict";

require("./gbrain");

require("./gbrain-rl");

require("./Graph.class");

require("./graphUtil");

require("./KERNEL_ADJMATRIX_UPDATE.class");

require("./KERNEL_DIR.class");

require("./ProccessImg.class");

require("./VFP_NODE.class");

require("./VFP_NODEPICKDRAG.class");

module.exports.GBrain = global.GBrain = GBrain;

module.exports.GBrainRL = global.GBrainRL = GBrainRL;

module.exports.Graph = global.Graph = Graph;

module.exports.GraphUtils = global.GraphUtils = GraphUtils;

module.exports.KERNEL_ADJMATRIX_UPDATE = global.KERNEL_ADJMATRIX_UPDATE = KERNEL_ADJMATRIX_UPDATE;

module.exports.KERNEL_DIR = global.KERNEL_DIR = KERNEL_DIR;

module.exports.ProccessImg = global.ProccessImg = ProccessImg;

module.exports.VFP_NODE = global.VFP_NODE = VFP_NODE;

module.exports.VFP_NODEPICKDRAG = global.VFP_NODEPICKDRAG = VFP_NODEPICKDRAG;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Graph.class":2,"./KERNEL_ADJMATRIX_UPDATE.class":3,"./KERNEL_DIR.class":4,"./ProccessImg.class":5,"./VFP_NODE.class":6,"./VFP_NODEPICKDRAG.class":7,"./gbrain":9,"./gbrain-rl":8,"./graphUtil":10}]},{},[11]);
