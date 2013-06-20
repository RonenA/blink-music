"use strict";
//TODO: Remove

var Spinner = function(){
	var circ = 2*Math.PI;
	var rAng = Math.PI/2;

	var timeoutSpeed = 30;
	var increment = circ * timeoutSpeed / snippetLength;

	var backgroundColor = 'black';
	var strokeColor = backgroundColor;
	var fillColor = '#222';

	var border = 2;

	function Spinner(canvas){
		var ctx = canvas.getContext('2d');

		var w = canvas.width;
		var h = canvas.height;

		var radius = (w - border)/2;
		var ox = radius + border;
		var oy = radius + border;

		var started = false;
		var theta = 0;

		var clearCanvas = function(){
			ctx.clearRect ( 0 , 0 , w , h );
		};

		var drawCircle = function(){
			ctx.beginPath();
			ctx.arc(ox, oy, radius, 0, circ, false);
			ctx.fillStyle = backgroundColor;
			ctx.fill();
		};

		var fillCircle = function(){
			clearCanvas();
			drawCircle();

			ctx.save();
			ctx.beginPath();
			ctx.arc(ox, oy, radius, 0, circ, false);
			ctx.clip();

			for(var quad = 0; quad < 4; ++quad){
				if(quad*rAng < theta) {
					var stheta = quad*rAng;
					var sx = 2*radius*Math.sin(stheta);
					var sy = 2*radius*Math.cos(stheta);
					var ftheta = Math.min((quad+1)*rAng, theta);
					var fx = 2*radius*Math.sin(ftheta);
					var fy = 2*radius*Math.cos(ftheta);

					ctx.beginPath();
					ctx.moveTo(ox, oy);
					ctx.lineTo(ox + sx, oy + sy);
					ctx.lineTo(ox + fx, oy + fy);
					ctx.lineTo(ox, oy);
					ctx.fillStyle = fillColor;
					ctx.fill();
					ctx.lineWidth = 1;
					ctx.strokeStyle = fillColor;
					ctx.stroke();
				}
			}

			ctx.restore();
			ctx.beginPath();
			ctx.arc(ox, oy, radius, 0, circ, false);
			ctx.lineWidth = border;
			ctx.strokeStyle = strokeColor;
			ctx.stroke();

			var that = this;
			window.setTimeout(function(){
				// TODO: Improve time accuracy.
				theta += increment;
				fillCircle();
			}, timeoutSpeed);
		}

		this.spin = function(){
			theta = 0;
			if(!started) {
				fillCircle(0);
				started = true;
			}
		};
	};

	return Spinner;
}();

$.fn.cssAnimate = function(animation, duration){
	duration == duration || 1000;
	var el = $(this);

	el.addClass("animated").addClass(animation);
	setTimeout(function(){
		el.removeClass("animated").removeClass(animation);
	}, duration);
};
