(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Average Window class from CONVNETJS
var AvgWin = exports.AvgWin = function () {
    function AvgWin(size, minsize) {
        _classCallCheck(this, AvgWin);

        this.v = [];
        this.size = typeof size === 'undefined' ? 100 : size;
        this.minsize = typeof minsize === 'undefined' ? 20 : minsize;
        this.sum = 0;
    }

    _createClass(AvgWin, [{
        key: 'add',
        value: function add(x) {
            this.v.push(x);
            this.sum += x;
            if (this.v.length > this.size) {
                var xold = this.v.shift();
                this.sum -= xold;
            }
        }
    }, {
        key: 'get_average',
        value: function get_average() {
            if (this.v.length < this.minsize) return -1;else return this.sum / this.v.length;
        }
    }, {
        key: 'reset',
        value: function reset(x) {
            this.v = [];
            this.sum = 0;
        }
    }]);

    return AvgWin;
}();

global.AvgWin = AvgWin;
module.exports.AvgWin = AvgWin;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2JyYWluL0F2Z1dpbi5jbGFzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8vIEF2ZXJhZ2UgV2luZG93IGNsYXNzIGZyb20gQ09OVk5FVEpTXG52YXIgQXZnV2luID0gZXhwb3J0cy5BdmdXaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXZnV2luKHNpemUsIG1pbnNpemUpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEF2Z1dpbik7XG5cbiAgICAgICAgdGhpcy52ID0gW107XG4gICAgICAgIHRoaXMuc2l6ZSA9IHR5cGVvZiBzaXplID09PSAndW5kZWZpbmVkJyA/IDEwMCA6IHNpemU7XG4gICAgICAgIHRoaXMubWluc2l6ZSA9IHR5cGVvZiBtaW5zaXplID09PSAndW5kZWZpbmVkJyA/IDIwIDogbWluc2l6ZTtcbiAgICAgICAgdGhpcy5zdW0gPSAwO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhBdmdXaW4sIFt7XG4gICAgICAgIGtleTogJ2FkZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoeCkge1xuICAgICAgICAgICAgdGhpcy52LnB1c2goeCk7XG4gICAgICAgICAgICB0aGlzLnN1bSArPSB4O1xuICAgICAgICAgICAgaWYgKHRoaXMudi5sZW5ndGggPiB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgICAgICB2YXIgeG9sZCA9IHRoaXMudi5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VtIC09IHhvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldF9hdmVyYWdlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldF9hdmVyYWdlKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudi5sZW5ndGggPCB0aGlzLm1pbnNpemUpIHJldHVybiAtMTtlbHNlIHJldHVybiB0aGlzLnN1bSAvIHRoaXMudi5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3Jlc2V0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KHgpIHtcbiAgICAgICAgICAgIHRoaXMudiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zdW0gPSAwO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEF2Z1dpbjtcbn0oKTtcblxuZ2xvYmFsLkF2Z1dpbiA9IEF2Z1dpbjtcbm1vZHVsZS5leHBvcnRzLkF2Z1dpbiA9IEF2Z1dpbjsiXX0=
