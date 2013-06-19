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

		var i = 0;

		this.clearCanvas = function(){
			ctx.clearRect ( 0 , 0 , w , h );
		};

		this.reset = function(){
			i = 0;
		};

		this.drawCircle = function(){
			ctx.beginPath();
			ctx.arc(ox, oy, radius, 0, circ, false);
			ctx.fillStyle = backgroundColor;
			ctx.fill();
		};

		this.fillCircle = function(){
			this.clearCanvas();
			this.drawCircle();

			ctx.save();
			ctx.beginPath();
			ctx.arc(ox, oy, radius, 0, 2 * Math.PI, false);
			ctx.clip();

			for(var j = 0; j < 4; ++j){
		    // qs = quadrant start
		    var qs_theta = j*rAng;
		    var qs_x = 2*radius*Math.sin(qs_theta);
		    var qs_y = 2*radius*Math.cos(qs_theta);
		    var qf_theta = (j+1)*rAng;
		    var qf_x = 2*radius*Math.sin(qf_theta);
		    var qf_y = 2*radius*Math.cos(qf_theta);

		    if((j+1)*rAng < i){
		    	ctx.beginPath();
		    	ctx.moveTo(ox, oy);
		    	ctx.lineTo(ox + qs_x, oy + qs_y);
		    	ctx.lineTo(ox + qf_x, oy + qf_y);
		    	ctx.lineTo(ox, oy);
		    	ctx.fillStyle = fillColor;
		    	ctx.fill();
		    	ctx.lineWidth = 1;
		    	ctx.strokeStyle = fillColor;
		    	ctx.stroke();
		    } else if (j*rAng < i){
		    	ctx.beginPath();
		    	ctx.moveTo(ox, oy);
		    	ctx.lineTo(ox + qs_x, oy + qs_y);
		    	ctx.lineTo(ox + 2*radius*Math.sin(i), oy + 2*radius*Math.cos(i));
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
		  ctx.arc(ox, oy, radius, 0, 2 * Math.PI, false);
		  ctx.lineWidth = border;
		  ctx.strokeStyle = strokeColor;
		  ctx.stroke();

		  var that = this;
		  // if (i < Math.PI*2){
		  	window.setTimeout(function(){
		  		i += increment;
		  		that.fillCircle();
		  	}, timeoutSpeed);
		  // }
		}

		this.spin = function(){
			i = 0;
			this.fillCircle(0);
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