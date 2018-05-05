(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// VIS library from CONVNETJS
var Plot = exports.Plot = function () {
    function Plot(options) {
        _classCallCheck(this, Plot);

        options = options || {};
        this.step_horizon = options.step_horizon || 1000;

        this.currentMode = 0; // 0 total; 1 last 1000
        this.pts = [];
        this.ptsT = [];

        this.maxy = -9999;
        this.miny = 9999;
    }

    // canv is the canvas we wish to update with this new datapoint


    _createClass(Plot, [{
        key: 'add',
        value: function add(step, y) {
            var time = new Date().getTime(); // in ms
            if (y > this.maxy * 0.99) this.maxy = y * 1.05;
            if (y < this.miny * 1.01) this.miny = y * 0.95;

            this.pts.push({ step: step, time: time, y: y });
            if (this.pts.length > 1000) this.pts.shift();
            this.ptsT.push({ step: step, time: time, y: y });
            if (step > this.step_horizon) this.step_horizon *= 2;
        }
        // elt is a canvas we wish to draw into

    }, {
        key: 'drawSelf',
        value: function drawSelf(canv) {
            var pad = 25;
            var H = canv.height;
            var W = canv.width;
            var ctx = canv.getContext('2d');

            ctx.clearRect(0, 0, W, H);
            ctx.font = "10px Georgia";

            var f2t = function f2t(x) {
                var dd = 1.0 * Math.pow(10, 2);
                return '' + Math.floor(x * dd) / dd;
            };

            var horizon = this.currentMode === 0 ? this.step_horizon : 1000;
            // draw guidelines and values
            ctx.strokeStyle = "#999";
            ctx.beginPath();
            var ng = 10;
            for (var i = 0; i <= ng; i++) {
                var xpos = i / ng * (W - 2 * pad) + pad;
                ctx.moveTo(xpos, pad);
                ctx.lineTo(xpos, H - pad);
                ctx.fillText(f2t(i / ng * horizon / 1000) + 'k', xpos, H - pad + 14);
            }
            for (var _i = 0; _i <= ng; _i++) {
                var ypos = _i / ng * (H - 2 * pad) + pad;
                ctx.moveTo(pad, ypos);
                ctx.lineTo(W - pad, ypos);
                ctx.fillText(f2t((ng - _i) / ng * (this.maxy - this.miny) + this.miny), 0, ypos);
            }
            ctx.stroke();

            var selectedPts = this.currentMode === 0 ? this.ptsT : this.pts;
            var N = selectedPts.length;
            if (N < 2) return;

            // draw the actual curve
            var t = function t(x, y, s) {
                var horizon = s.currentMode === 0 ? s.step_horizon : 1000;

                var tx = x / horizon * (W - pad * 2) + pad;
                var ty = H - ((y - s.miny) / (s.maxy - s.miny) * (H - pad * 2) + pad);
                return { tx: tx, ty: ty };
            };

            ctx.strokeStyle = "red";
            ctx.beginPath();
            for (var _i2 = 0; _i2 < N; _i2++) {
                // draw line from i-1 to i
                var p = selectedPts[_i2];
                var pt = t(this.currentMode === 0 ? p.step : _i2, p.y, this);
                if (_i2 === 0) ctx.moveTo(pt.tx, pt.ty);else ctx.lineTo(pt.tx, pt.ty);
            }
            ctx.stroke();
        }
    }, {
        key: 'clear',
        value: function clear() {}
    }]);

    return Plot;
}();

global.Plot = Plot;
module.exports.Plot = Plot;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2JyYWluL1Bsb3QuY2xhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLy8gVklTIGxpYnJhcnkgZnJvbSBDT05WTkVUSlNcbnZhciBQbG90ID0gZXhwb3J0cy5QbG90ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsb3Qob3B0aW9ucykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGxvdCk7XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHRoaXMuc3RlcF9ob3Jpem9uID0gb3B0aW9ucy5zdGVwX2hvcml6b24gfHwgMTAwMDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRNb2RlID0gMDsgLy8gMCB0b3RhbDsgMSBsYXN0IDEwMDBcbiAgICAgICAgdGhpcy5wdHMgPSBbXTtcbiAgICAgICAgdGhpcy5wdHNUID0gW107XG5cbiAgICAgICAgdGhpcy5tYXh5ID0gLTk5OTk7XG4gICAgICAgIHRoaXMubWlueSA9IDk5OTk7XG4gICAgfVxuXG4gICAgLy8gY2FudiBpcyB0aGUgY2FudmFzIHdlIHdpc2ggdG8gdXBkYXRlIHdpdGggdGhpcyBuZXcgZGF0YXBvaW50XG5cblxuICAgIF9jcmVhdGVDbGFzcyhQbG90LCBbe1xuICAgICAgICBrZXk6ICdhZGQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKHN0ZXAsIHkpIHtcbiAgICAgICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7IC8vIGluIG1zXG4gICAgICAgICAgICBpZiAoeSA+IHRoaXMubWF4eSAqIDAuOTkpIHRoaXMubWF4eSA9IHkgKiAxLjA1O1xuICAgICAgICAgICAgaWYgKHkgPCB0aGlzLm1pbnkgKiAxLjAxKSB0aGlzLm1pbnkgPSB5ICogMC45NTtcblxuICAgICAgICAgICAgdGhpcy5wdHMucHVzaCh7IHN0ZXA6IHN0ZXAsIHRpbWU6IHRpbWUsIHk6IHkgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wdHMubGVuZ3RoID4gMTAwMCkgdGhpcy5wdHMuc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMucHRzVC5wdXNoKHsgc3RlcDogc3RlcCwgdGltZTogdGltZSwgeTogeSB9KTtcbiAgICAgICAgICAgIGlmIChzdGVwID4gdGhpcy5zdGVwX2hvcml6b24pIHRoaXMuc3RlcF9ob3Jpem9uICo9IDI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZWx0IGlzIGEgY2FudmFzIHdlIHdpc2ggdG8gZHJhdyBpbnRvXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2RyYXdTZWxmJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXdTZWxmKGNhbnYpIHtcbiAgICAgICAgICAgIHZhciBwYWQgPSAyNTtcbiAgICAgICAgICAgIHZhciBIID0gY2Fudi5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgVyA9IGNhbnYud2lkdGg7XG4gICAgICAgICAgICB2YXIgY3R4ID0gY2Fudi5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIFcsIEgpO1xuICAgICAgICAgICAgY3R4LmZvbnQgPSBcIjEwcHggR2VvcmdpYVwiO1xuXG4gICAgICAgICAgICB2YXIgZjJ0ID0gZnVuY3Rpb24gZjJ0KHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGQgPSAxLjAgKiBNYXRoLnBvdygxMCwgMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnICsgTWF0aC5mbG9vcih4ICogZGQpIC8gZGQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgaG9yaXpvbiA9IHRoaXMuY3VycmVudE1vZGUgPT09IDAgPyB0aGlzLnN0ZXBfaG9yaXpvbiA6IDEwMDA7XG4gICAgICAgICAgICAvLyBkcmF3IGd1aWRlbGluZXMgYW5kIHZhbHVlc1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjOTk5XCI7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICB2YXIgbmcgPSAxMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IG5nOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeHBvcyA9IGkgLyBuZyAqIChXIC0gMiAqIHBhZCkgKyBwYWQ7XG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4cG9zLCBwYWQpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeHBvcywgSCAtIHBhZCk7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGYydChpIC8gbmcgKiBob3Jpem9uIC8gMTAwMCkgKyAnaycsIHhwb3MsIEggLSBwYWQgKyAxNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDw9IG5nOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHlwb3MgPSBfaSAvIG5nICogKEggLSAyICogcGFkKSArIHBhZDtcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHBhZCwgeXBvcyk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhXIC0gcGFkLCB5cG9zKTtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoZjJ0KChuZyAtIF9pKSAvIG5nICogKHRoaXMubWF4eSAtIHRoaXMubWlueSkgKyB0aGlzLm1pbnkpLCAwLCB5cG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkUHRzID0gdGhpcy5jdXJyZW50TW9kZSA9PT0gMCA/IHRoaXMucHRzVCA6IHRoaXMucHRzO1xuICAgICAgICAgICAgdmFyIE4gPSBzZWxlY3RlZFB0cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoTiA8IDIpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gZHJhdyB0aGUgYWN0dWFsIGN1cnZlXG4gICAgICAgICAgICB2YXIgdCA9IGZ1bmN0aW9uIHQoeCwgeSwgcykge1xuICAgICAgICAgICAgICAgIHZhciBob3Jpem9uID0gcy5jdXJyZW50TW9kZSA9PT0gMCA/IHMuc3RlcF9ob3Jpem9uIDogMTAwMDtcblxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHggLyBob3Jpem9uICogKFcgLSBwYWQgKiAyKSArIHBhZDtcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSBIIC0gKCh5IC0gcy5taW55KSAvIChzLm1heHkgLSBzLm1pbnkpICogKEggLSBwYWQgKiAyKSArIHBhZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdHg6IHR4LCB0eTogdHkgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBOOyBfaTIrKykge1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgbGluZSBmcm9tIGktMSB0byBpXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBzZWxlY3RlZFB0c1tfaTJdO1xuICAgICAgICAgICAgICAgIHZhciBwdCA9IHQodGhpcy5jdXJyZW50TW9kZSA9PT0gMCA/IHAuc3RlcCA6IF9pMiwgcC55LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoX2kyID09PSAwKSBjdHgubW92ZVRvKHB0LnR4LCBwdC50eSk7ZWxzZSBjdHgubGluZVRvKHB0LnR4LCBwdC50eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NsZWFyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge31cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUGxvdDtcbn0oKTtcblxuZ2xvYmFsLlBsb3QgPSBQbG90O1xubW9kdWxlLmV4cG9ydHMuUGxvdCA9IFBsb3Q7Il19
