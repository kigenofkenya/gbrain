[![Logo](demos/webclgl.jpg)](https://github.com/stormcolor/webclgl)

<h2>Javascript Library for GPGPU computing</h2>
WebCLGL use WebGL specification to interpret code.<br />
First version of algorithm was created in 2013 (hosted on <a href="https://code.google.com/archive/p/webclgl/downloads">Google Code</a>). On this, WebGL is used like OpenCL for GPGPU calculus using the traditional Render To Texture technique. <br />

Features: <br />
- Basic numerical calculus on GPU. <br />
- WebGL graphics allowing write multiple shaders, interconnect and save arguments. <br />
- WebCLGL handle any WebGL operation preparing all neccesary resources (buffers and programs initialization, vertex/fragment programs buffers interconnection, Renders to texture, etc... reducing time to write any advanced shaders. <br /> 

<h3><a href="https://rawgit.com/stormcolor/webclgl/master/APIdoc/WebCLGLFor.html">API Doc WebCLGL</a></h3>
<h3><a href="http://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf">OpenGL ES Shading Language 1.0 Reference Card (Pag 3-4)</a></h3>

<h3>Import library</h3>

```html
npm install webclgl
```
```html
<script src="/dist/WebCLGL.min.js"></script>    
```

<h3>Simple A+B</h3>

```js
// TYPICAL A + B WITH CPU
var arrayResult = [];
for(var n = 0; n < _length; n++) {
    var sum = arrayA[n]+arrayB[n];
    arrayResult[n] = sum;
}

// PERFORM A + B WITH GPU
var arrayResult = gpufor({"float* A": arrayA, "float* B": arrayB}, "n",
                          "float sum = A[n]+B[n];"+
                          "return sum;");
```
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor/index.html"> gpufor A+B</a><br />

<h3>Using numbers</h3>

```js
var num = 0.01;

// CPU
var arrayResult = [];
for(var n = 0; n < _length; n++) {
    var sum = arrayA[n]+arrayB[n]+num;
    arrayResult[n] = sum;
}

// GPU
var arrayResult = gpufor({"float* A": arrayA, "float* B": arrayB, "float num": num}, "n",
                          "float sum = A[n]+B[n]+num;"+
                          "return sum;");
```
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor_numbers/index.html"> gpufor A+B+number</a><br />

<h3>Using vector array types</h3>

```js
var arrayResult = gpufor({"float* A": arrayA, "float4* B": arrayB}, "n",
                          "float _A = A[n];"+
                          "vec4 _B = B[n];"+
                          "float sum = _A+_B.z;"+
                          "return sum;");
```
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor_vectors/index.html"> gpufor vector read</a><br />

<h3>Vector as output</h3>

```js
var arrayResult = gpufor({"float4* A": arrayA, "float4* B": arrayB}, "n", "FLOAT4",
                          "vec4 _A = A[n];"+
                          "vec4 _B = B[n];"+
                          "vec4 sum = _A+_B;"+
                          "return sum;");
```
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor_vectors_output/index.html"> gpufor vector output</a><br />


<h3>Graphical output</h3>
Previous examples only execute one program type "KERNEL" (fragment program), write to a hidden buffer "result", perform readPixels over this buffer and return the output.
<br />
To represent data that evolve over time you can enable the graphical output indicating one WebGLRenderingContext or canvas element as first argument:

```html
<canvas id="graph" width="512" height="512"></canvas>
``` 

```js
var gpufG = gpufor( document.getElementById("graph"), // canvas or existings WebGL context
                   {"float4* posXYZW": arrayNodePosXYZW,
                   "float4* dir": arrayNodeDir,
                   "float*attr nodeId": arrayNodeId,
                   "mat4 PMatrix": transpose(getProyection()),
                   "mat4 cameraWMatrix": transpose(new Float32Array([  1.0, 0.0, 0.0, 0.0,
                                                                       0.0, 1.0, 0.0, 0.0,
                                                                       0.0, 0.0, 1.0, -100.0,
                                                                       0.0, 0.0, 0.0, 1.0])),
                   "mat4 nodeWMatrix": transpose(new Float32Array([1.0, 0.0, 0.0, 0.0,
                                                                   0.0, 1.0, 0.0, 0.0,
                                                                   0.0, 0.0, 1.0, 0.0,
                                                                   0.0, 0.0, 0.0, 1.0]))},
               
                   // KERNEL PROGRAM (update "dir" & "posXYZW" in return instruction)
                   {"type": "KERNEL",
                    "name": "PROG_KERNEL",
                    "viewSource": false,
                    "config": ["n", ["dir","posXYZW"],
                               // head
                               '',
                               // source
                               'vec3 currentPos = posXYZW[n].xyz;'+
                               'vec3 newDir = dir[n].xyz*0.995;'+
                               'return [vec4(newDir,0.0), vec4(currentPos,1.0)+vec4(newDir,0.0)];'],
                    "depthTest": true,
                    "blend": false,
                    "blendEquation": "FUNC_ADD",
                    "blendSrcMode": "SRC_ALPHA",
                    "blendDstMode": "ONE_MINUS_SRC_ALPHA"},
               
                   // GRAPHIC PROGRAM
                   {"type": "GRAPHIC",
                    "name": "PROG_GRAPHIC",
                    "viewSource": false,
                    "config": [ // vertex head
                               '',
                       
                               // vertex source
                               'vec2 xx = get_global_id(nodeId[], uBufferWidth, 1.0);'+
                       
                               'vec4 nodePosition = posXYZW[xx];'+ // now use the updated posXYZW
                               'mat4 nodepos = nodeWMatrix;'+
                               'nodepos[3][0] = nodePosition.x;'+
                               'nodepos[3][1] = nodePosition.y;'+
                               'nodepos[3][2] = nodePosition.z;'+
                       
                               'gl_Position = PMatrix * cameraWMatrix * nodepos * vec4(1.0, 1.0, 1.0, 1.0);'+
                               'gl_PointSize = 2.0;',
                       
                               // fragment head
                               '',
                       
                               // fragment source
                               'return vec4(1.0, 1.0, 1.0, 1.0);' // color
                             ],
                    "drawMode": 4,
                    "depthTest": true,
                    "blend": false,
                    "blendEquation": "FUNC_ADD",
                    "blendSrcMode": "SRC_ALPHA",
                    "blendDstMode": "ONE_MINUS_SRC_ALPHA"}
                 );
```

```js
var tick = function() {
                window.requestAnimFrame(tick);

                gpufG.processKernels();

                var gl = gpufG.getCtx();
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, 512, 512);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  

                //gpufG.setArg("pole1X", 30);

                gpufG.processGraphic("posXYZW");
            };
```
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor_graphics/index.html"> gpufor graphic output</a><br />
- <a href="https://rawgit.com/stormcolor/webclgl/master/demos/gpufor_graphics_geometry/index.html"> gpufor graphic output (using custom geometry)</a><br />
First program type KERNEL is a fragment program that perform a RenderToTexture updating "dir" and "posXYZW" buffers. Second program type GRAPHIC is a vertex and fragment program with output to direct screen (framebuffer=null) because we not indicate output on this program. <br />
You can use multiples KERNELS or GRAPHICS on any order. Anterior example only use two programs, KERNEL("dir","posXYZW")->GRAPHIC(null=screen) but you can select an appropiate order for you algorithm. Examples: <br />
GRAPHIC("a","b")->KERNEL(null) <br />
KERNEL("a")->GRAPHIC("b")->KERNEL(null) <br />
In case of you not indicate output it will be the same like indicate null as output [null].

```js
// GRAPHIC PROGRAM
{"type": "GRAPHIC",
 "config": [ [null],
            // vertex head
           '',
            ...
```
or

```js
// GRAPHIC PROGRAM
{"type": "GRAPHIC",
 "config": [ null,
            // vertex head
           '',
            ...
```

You can indicate arguments with one Json as second argument. With <b>setArg</b> method you can update any argument and to add new arguments with <b>addArgument</b>/<b>setArg</b>.

```js
gpufG.addArg("float4* destination");
gpufG.setArg("destination", destinationArray);
   
```
Also you can get an argument from others gpufor and to shared a same buffer.
 
 ```js
other_gpufG.getGPUForArg("destination", gpufG);
...
gpufG.setArg("destination", destinationArray); // update destination for gpufG and other_gpufG
```

<h3>Argument types</h3>

Variable type	|	Value
----------------------- |-------------------------------
float*			            | Array<Float or Int>, Float32Array, Uint8Array, WebGLTexture, HTMLImageElement
float4*		            	| Array<Float or Int>, Float32Array, Uint8Array, WebGLTexture, HTMLImageElement
float		            	| 30
float4		            	| [30.0, 10.0, 5.0, 100.0]
mat4		            	| new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, -100.0, 0.0, 0.0, 0.0, 1.0]);
float*attr			        | Array<Float or Int>, Float32Array, Uint8Array, WebGLTexture, HTMLImageElement
float4*attr		            | Array<Float or Int>, Float32Array, Uint8Array, WebGLTexture, HTMLImageElement
Use float4 instead vec4 only in the definition of the variables (not in code). 

<h3>When indicate *attr arguments in Graphic program </h3>
In this example:

```js
var gpufG = gpufor( document.getElementById("graph"),
            {'float4* posXYZW': null,
            "float4* data": null,
            "float*attr currentId": null,
            "float*attr otherId": null,
            'float4*attr currentVertexPos': null,
            'float4*attr currentVertexNormal': null,
            'float4*attr currentVertexTexture': null,
            'indices': null,
            'mat4 PMatrix': null,
            'mat4 cameraWMatrix': null,
            'mat4 nodeWMatrix': null,
            'float textureWidth': null,
            'float4* ImgB': null},
        
            {"type": "KERNEL",
            "name": "PROG_KERNEL",
            "viewSource": false,
            "config": ["x", ["posXYZW"],
                        // head
                        '',
                        // source
                        'float cId = currentId[x];'+
                        'vec4 currentPosition = posXYZW[x];'+
                        'float anyData = data[x].x;'+
                        
                        'float oId = otherId[x];'+
                        'vec2 xb = get_global_id(oId, uBufferWidth, 6.0);'+ // uBufferWidth is built-in variable
                        'vec4 otherPosition = posXYZW[xb];'+
                        'float otherData = data[xb].x;'+
                        
                        'vec2 texCoord = get_global_id(vec2(64.0, 128.0), textureWidth);'+
                        'vec4 textureColor = ImgB[texCoord];'+
                        
                        '...'
                      ],
           "depthTest": true,
           "blend": false,
           "blendEquation": "FUNC_ADD",
           "blendSrcMode": "SRC_ALPHA",
           "blendDstMode": "ONE_MINUS_SRC_ALPHA"},

            {"type": "GRAPHIC",
            "name": "PROG_GRAPHIC",
            "viewSource": false,
            "config": [ // vertex head
                        '',
                        
                        // vertex source
                        'float cId = currentId[];'+
                        'float oId = otherId[];'+
                        'vec4 vp = currentVertexPos[];'+
                        'vec4 vn = currentVertexNormal[];'+
                        'vec4 vt = currentVertexTexture[];'+
                        
                        'vec2 x = get_global_id(cId, uBufferWidth, 6.0);'+
                        'vec4 currentPosition = posXYZW[x];'+
                        'float anyData = data[x].x;'+
                        
                        'vec2 xb = get_global_id(oId, uBufferWidth, 6.0);'+
                        'vec4 otherPosition = posXYZW[xb];'+
                        'float otherData = data[xb].x;'+
                        
                        '...',
                        
                        // fragment head
                        '',
                        
                        // fragment source
                        'vec2 texCoord = get_global_id(vCoord, textureWidth);'+
                        'vec4 textureColor = ImgB[texCoord];'+
                        
                        '...'
                      ],
             "drawMode": 4,
             "depthTest": true,
             "blend": false,
             "blendEquation": "FUNC_ADD",
             "blendSrcMode": "SRC_ALPHA",
             "blendDstMode": "ONE_MINUS_SRC_ALPHA"}
        );
```

`*attr` for indicate arguments of type "attributes" (Graphic program only). <br />
`*` Allow update values and to be written by a kernel program; `*attr` no. <br />
`*` Allow access to another ID; `*attr` Only can access to own ID. <br />
For to access to any `*` value in graphic program must use before get_global_id. <br />

<h3>Multiples Kernels in numeric mode</h3>
If not need graphic output and you want use various KERNELS for to get the output in numeric mode: <br />
KERNEL("A","B")->KERNEL("result")->readPixels

```js
var gpufG = gpufor( document.getElementById("graph"), // canvas or existings WebGL context
                   {"float* A": arrayA,
                    "float* B": arrayB,
                    "float* result": null},
               
                   // KERNEL PROGRAM 1
                   {"type": "KERNEL",
                    "name": "PROG_KERNEL_1",
                    "viewSource": false,
                   "config": ["n", ["A","B"],
                               // head
                               '',
                               // source
                               "float sum = A[n]+B[n];"+
                               "return [sum, sum+sum];"]},
               
                   // KERNEL PROGRAM 2
                  {"type": "KERNEL",
                   "name": "PROG_KERNEL_2",
                   "viewSource": false,
                  "config": ["n", ["result"],
                              // head
                              '',
                              // source
                              "float sum = A[n]+B[n];"+ // sum+(sum+sum)
                              "return sum;"]}
                 );
gpufG.processKernels();
var arrayResult = gpufG.readArg("result");
```



<br />
- <a href="https://github.com/stormcolor/SCEJS"> SCEJS</a> use WebCLGL as low level layer. You can See this for other advanced examples. <br />


<br />
<br />
<h3>ChangeLog</h3>

```

    <h4>v3.5.2</h4>
    - using WebCLGL.min.js instead WebCLGL.class.js
    
    <h4>v3.5.1</h4>
    - getGPUForPointerArg to getGPUForArg, addArgument to addArg, fillPointerArg to fillArg. Added readArg(String)
    
    <h4>v3.5</h4>
    - readPixel type FLOAT instead UNSIGNED_BYTE (removed unpacks). All enqueueRead methods moved to readBuffer
    
    <h4>v3.4</h4>
    - drawMode argument in processGraphic now must be indicated from new drawMode attribute of the program json

    <h4>v3.3</h4>
    - Now is required initialisation through gpufor
    - WEBGL_draw_buffers extension is now required
    - FrameBuffer/RenderBuffer reconfiguration (x4-x5 more fast in same hardware)
    
    <h4>v3.2</h4>
    (Graphic mode only)
    - Using return instead gl_FragColor in fragment of Graphic program
    
    <h4>v3.1</h4>
    (Graphic mode only)
    - Allow write in more than final variable if client hardware allow (WEBGL_draw_buffers extension) 
    - webCLGL.enqueueNDRangeKernel allow webCLGLBuffer or Array of webCLGLBuffer for destination
    - webCLGLWork.enqueueNDRangeKernel not require any argument (nor webCLGL.copy required)
    - gpufor not require update call
    
    <h4>v3.0</h4>
    - Changed *kernel in VertexFragmentPrograms(VFP) to *attr for indicate arguments of type "attributes". <br />
    - Deleted optional geometryLength argument in enqueueNDRangeKernel & enqueueVertexFragmentProgram. It is indicated through glsl code with next available methods: <br />
    get_global_id(ID, bufferWidth, geometryLength) (in Kernels & vertex of VFP) (The last get_global_id(ID) is removed) <br />
    get_global_id(vec2(row, col), bufferWidth) (in Kernels & fragment of VFP) <br />
    get_global_id() (only in Kernels fot to get) <br />
     <br />
    Changed method setUpdateFromKernel to setAllowKernelWriting in WebCLGLWork <br />
```
