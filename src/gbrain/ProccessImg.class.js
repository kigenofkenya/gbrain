import "scejs";

export class ProccessImg {
    constructor(jsonIn) {
        this.stackNodesImg = jsonIn.stackNodesImg;
        this.drawedImages = 0;
        this.output = {
            "nodesImg": null,
            "nodesImgCrosshair": null};

        let NODE_IMG_WIDTH = jsonIn.NODE_IMG_WIDTH;
        this.NODE_IMG_COLUMNS = jsonIn.NODE_IMG_COLUMNS;
        this.NODE_IMG_SPRITE_WIDTH = NODE_IMG_WIDTH/this.NODE_IMG_COLUMNS;

        let nodesImgMask = jsonIn.nodesImgMask;
        this.datMask = Utils.getUint8ArrayFromHTMLImageElement(nodesImgMask);

        let nodesImgCrosshair = jsonIn.nodesImgCrosshair;
        this.datCrosshair = Utils.getUint8ArrayFromHTMLImageElement(nodesImgCrosshair);

        this.canvasNodeImg = document.createElement('canvas');
        this.canvasNodeImg.width = NODE_IMG_WIDTH;
        this.canvasNodeImg.height = NODE_IMG_WIDTH;
        this.ctxNodeImg = this.canvasNodeImg.getContext('2d');

        this.canvasNodeImgCrosshair = document.createElement('canvas');
        this.canvasNodeImgCrosshair.width = NODE_IMG_WIDTH;
        this.canvasNodeImgCrosshair.height = NODE_IMG_WIDTH;
        this.ctxNodeImgCrosshair = this.canvasNodeImgCrosshair.getContext('2d');

        let canvasNodeImgTMP = document.createElement('canvas');
        canvasNodeImgTMP.width = this.NODE_IMG_SPRITE_WIDTH;
        canvasNodeImgTMP.height = this.NODE_IMG_SPRITE_WIDTH;
        let ctxNodeImgTMP = canvasNodeImgTMP.getContext('2d');

        for(let n=0; n < this.stackNodesImg.length; n++) {
            let currStack = this.stackNodesImg[n];
            let image = new Image();
            image.onload = (function(image, currStack) {
                ctxNodeImgTMP.clearRect(0, 0, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH);
                let quarter = this.NODE_IMG_SPRITE_WIDTH/4;
                ctxNodeImgTMP.drawImage(image, 0, 0, image.width, image.height, quarter, quarter, this.NODE_IMG_SPRITE_WIDTH/2, this.NODE_IMG_SPRITE_WIDTH/2);

                new Utils().getImageFromCanvas(canvasNodeImgTMP, (function(currStack, img) {
                    currStack.image = Utils.getUint8ArrayFromHTMLImageElement( img );

                    let allImg = true;
                    for(let nb=0; nb < this.stackNodesImg.length; nb++) {
                        if(this.stackNodesImg[nb].image == null) {
                            allImg = false;
                            break;
                        }
                    }

                    if(allImg === true)
                        this.generateAll(jsonIn);
                }).bind(this, currStack));
            }).bind(this, image, currStack);
            image.src = currStack.url;
        }
    }

    generateAll(jsonIn) {
        let drawOnAtlas = (function(currStack, ctx, newImgData) {
            let get2Dfrom1D = (function(/*Int*/ idx, /*Int*/ columns) {
                let n = idx/columns;
                let row = parseFloat(parseInt(n));
                let col = Utils.fract(n)*columns;

                return {
                    "col": col,
                    "row": row};
            }).bind(this);

            let readAll = (function(onend) {
                let pasteImg = (function(onend, imgname, img) {
                    this.output[imgname] = img;
                    if(this.output.nodesImg != null && this.output.nodesImgCrosshair != null)
                        onend(this.output);
                }).bind(this, onend);

                new Utils().getImageFromCanvas(this.canvasNodeImg, (function(imgAtlas) {
                    pasteImg("nodesImg", imgAtlas);
                }).bind(this));
                new Utils().getImageFromCanvas(this.canvasNodeImgCrosshair, (function(imgAtlas) {
                    pasteImg("nodesImgCrosshair", imgAtlas);
                }).bind(this));
            }).bind(this, jsonIn.onend);

            new Utils().getImageFromCanvas( Utils.getCanvasFromUint8Array(newImgData, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH), (imgB) => {
                // draw image on atlas
                let loc = get2Dfrom1D(currStack.locationIdx, this.NODE_IMG_COLUMNS);
                ctx.drawImage(imgB, loc.col*this.NODE_IMG_SPRITE_WIDTH, loc.row*this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH, this.NODE_IMG_SPRITE_WIDTH);

                this.drawedImages++;
                if(this.drawedImages === (this.stackNodesImg.length*2))
                    readAll();
            });
        }).bind(this);

        for(let n=0; n < this.stackNodesImg.length; n++) {
            let currStack = this.stackNodesImg[n];
            let newImgData = this.stackNodesImg[n].image;

            // masked image
            for(let nb=0; nb < this.datMask.length/4; nb++) {
                let idx = nb*4;
                if(newImgData[idx+3] > 0) newImgData[idx+3] = this.datMask[idx+3];
            }
            drawOnAtlas(currStack, this.ctxNodeImg, newImgData);

            // crosshair image
            for(let nb=0; nb < this.datCrosshair.length/4; nb++) {
                let idx = nb*4;

                newImgData[idx] = ((this.datCrosshair[idx]*this.datCrosshair[idx+3]) + (newImgData[idx]*(255-this.datCrosshair[idx+3])))/255;
                newImgData[idx+1] =( (this.datCrosshair[idx+1]*this.datCrosshair[idx+3]) + (newImgData[idx+1]*(255-this.datCrosshair[idx+3])))/255;
                newImgData[idx+2] = ((this.datCrosshair[idx+2]*this.datCrosshair[idx+3]) + (newImgData[idx+2]*(255-this.datCrosshair[idx+3])))/255;
                newImgData[idx+3] = ((this.datCrosshair[idx+3]*this.datCrosshair[idx+3]) + (newImgData[idx+3]*(255-this.datCrosshair[idx+3])))/255;
            }
            drawOnAtlas(currStack, this.ctxNodeImgCrosshair, newImgData);
        }
    };
}
global.ProccessImg = ProccessImg;
module.exports.ProccessImg = ProccessImg;