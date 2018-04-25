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

        this.pts = [];

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

            // draw guidelines and values
            ctx.strokeStyle = "#999";
            ctx.beginPath();
            var ng = 10;
            for (var i = 0; i <= ng; i++) {
                var xpos = i / ng * (W - 2 * pad) + pad;
                ctx.moveTo(xpos, pad);
                ctx.lineTo(xpos, H - pad);
                ctx.fillText(f2t(i / ng * this.step_horizon / 1000) + 'k', xpos, H - pad + 14);
            }
            for (var _i = 0; _i <= ng; _i++) {
                var ypos = _i / ng * (H - 2 * pad) + pad;
                ctx.moveTo(pad, ypos);
                ctx.lineTo(W - pad, ypos);
                ctx.fillText(f2t((ng - _i) / ng * (this.maxy - this.miny) + this.miny), 0, ypos);
            }
            ctx.stroke();

            var N = this.pts.length;
            if (N < 2) return;

            // draw the actual curve
            var t = function t(x, y, s) {
                var tx = x / s.step_horizon * (W - pad * 2) + pad;
                var ty = H - ((y - s.miny) / (s.maxy - s.miny) * (H - pad * 2) + pad);
                return { tx: tx, ty: ty };
            };

            ctx.strokeStyle = "red";
            ctx.beginPath();
            for (var _i2 = 0; _i2 < N; _i2++) {
                // draw line from i-1 to i
                var p = this.pts[_i2];
                var pt = t(p.step, p.y, this);
                if (_i2 === 0) ctx.moveTo(pt.tx, pt.ty);else ctx.lineTo(pt.tx, pt.ty);
            }
            ctx.stroke();
        }
    }]);

    return Plot;
}();

global.Plot = Plot;
module.exports.Plot = Plot;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2JyYWluL1Bsb3QuY2xhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vLyBWSVMgbGlicmFyeSBmcm9tIENPTlZORVRKU1xudmFyIFBsb3QgPSBleHBvcnRzLlBsb3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGxvdChvcHRpb25zKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbG90KTtcblxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdGhpcy5zdGVwX2hvcml6b24gPSBvcHRpb25zLnN0ZXBfaG9yaXpvbiB8fCAxMDAwO1xuXG4gICAgICAgIHRoaXMucHRzID0gW107XG5cbiAgICAgICAgdGhpcy5tYXh5ID0gLTk5OTk7XG4gICAgICAgIHRoaXMubWlueSA9IDk5OTk7XG4gICAgfVxuXG4gICAgLy8gY2FudiBpcyB0aGUgY2FudmFzIHdlIHdpc2ggdG8gdXBkYXRlIHdpdGggdGhpcyBuZXcgZGF0YXBvaW50XG5cblxuICAgIF9jcmVhdGVDbGFzcyhQbG90LCBbe1xuICAgICAgICBrZXk6ICdhZGQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKHN0ZXAsIHkpIHtcbiAgICAgICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7IC8vIGluIG1zXG4gICAgICAgICAgICBpZiAoeSA+IHRoaXMubWF4eSAqIDAuOTkpIHRoaXMubWF4eSA9IHkgKiAxLjA1O1xuICAgICAgICAgICAgaWYgKHkgPCB0aGlzLm1pbnkgKiAxLjAxKSB0aGlzLm1pbnkgPSB5ICogMC45NTtcblxuICAgICAgICAgICAgdGhpcy5wdHMucHVzaCh7IHN0ZXA6IHN0ZXAsIHRpbWU6IHRpbWUsIHk6IHkgfSk7XG4gICAgICAgICAgICBpZiAoc3RlcCA+IHRoaXMuc3RlcF9ob3Jpem9uKSB0aGlzLnN0ZXBfaG9yaXpvbiAqPSAyO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsdCBpcyBhIGNhbnZhcyB3ZSB3aXNoIHRvIGRyYXcgaW50b1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdkcmF3U2VsZicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3U2VsZihjYW52KSB7XG4gICAgICAgICAgICB2YXIgcGFkID0gMjU7XG4gICAgICAgICAgICB2YXIgSCA9IGNhbnYuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIFcgPSBjYW52LndpZHRoO1xuICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnYuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBXLCBIKTtcbiAgICAgICAgICAgIGN0eC5mb250ID0gXCIxMHB4IEdlb3JnaWFcIjtcblxuICAgICAgICAgICAgdmFyIGYydCA9IGZ1bmN0aW9uIGYydCh4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGRkID0gMS4wICogTWF0aC5wb3coMTAsIDIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnJyArIE1hdGguZmxvb3IoeCAqIGRkKSAvIGRkO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gZHJhdyBndWlkZWxpbmVzIGFuZCB2YWx1ZXNcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiIzk5OVwiO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgdmFyIG5nID0gMTA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBuZzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHhwb3MgPSBpIC8gbmcgKiAoVyAtIDIgKiBwYWQpICsgcGFkO1xuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeHBvcywgcGFkKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhwb3MsIEggLSBwYWQpO1xuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChmMnQoaSAvIG5nICogdGhpcy5zdGVwX2hvcml6b24gLyAxMDAwKSArICdrJywgeHBvcywgSCAtIHBhZCArIDE0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPD0gbmc7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeXBvcyA9IF9pIC8gbmcgKiAoSCAtIDIgKiBwYWQpICsgcGFkO1xuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocGFkLCB5cG9zKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKFcgLSBwYWQsIHlwb3MpO1xuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChmMnQoKG5nIC0gX2kpIC8gbmcgKiAodGhpcy5tYXh5IC0gdGhpcy5taW55KSArIHRoaXMubWlueSksIDAsIHlwb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB2YXIgTiA9IHRoaXMucHRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChOIDwgMikgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBkcmF3IHRoZSBhY3R1YWwgY3VydmVcbiAgICAgICAgICAgIHZhciB0ID0gZnVuY3Rpb24gdCh4LCB5LCBzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR4ID0geCAvIHMuc3RlcF9ob3Jpem9uICogKFcgLSBwYWQgKiAyKSArIHBhZDtcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSBIIC0gKCh5IC0gcy5taW55KSAvIChzLm1heHkgLSBzLm1pbnkpICogKEggLSBwYWQgKiAyKSArIHBhZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdHg6IHR4LCB0eTogdHkgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBOOyBfaTIrKykge1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgbGluZSBmcm9tIGktMSB0byBpXG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnB0c1tfaTJdO1xuICAgICAgICAgICAgICAgIHZhciBwdCA9IHQocC5zdGVwLCBwLnksIHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmIChfaTIgPT09IDApIGN0eC5tb3ZlVG8ocHQudHgsIHB0LnR5KTtlbHNlIGN0eC5saW5lVG8ocHQudHgsIHB0LnR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQbG90O1xufSgpO1xuXG5nbG9iYWwuUGxvdCA9IFBsb3Q7XG5tb2R1bGUuZXhwb3J0cy5QbG90ID0gUGxvdDsiXX0=
