// Average Window class from CONVNETJS
export class AvgWin {
    constructor(size, minsize) {
        this.v = [];
        this.size = typeof(size)==='undefined' ? 100 : size;
        this.minsize = typeof(minsize)==='undefined' ? 20 : minsize;
        this.sum = 0;
    }

    add(x) {
        this.v.push(x);
        this.sum += x;
        if(this.v.length>this.size) {
            let xold = this.v.shift();
            this.sum -= xold;
        }
    }
    get_average() {
        if(this.v.length < this.minsize) return -1;
        else return this.sum/this.v.length;
    }
    reset(x) {
        this.v = [];
        this.sum = 0;
    }
}
global.AvgWin = AvgWin;
module.exports.AvgWin = AvgWin;