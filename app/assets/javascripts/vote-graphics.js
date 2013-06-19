$(function(){

var canvas = document.getElementById('spinner');
var context = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var border = 5;
var radius = (w - border)/2;
var ox = radius + border;
var oy = radius + border;

var circ = 2*Math.PI;
var right = Math.PI/2;

var seconds = 1000;

var timeoutSpeed = 30;
var increment = circ * timeoutSpeed / (5 * seconds);

var backgroundColor = 'black';
var strokeColor = backgroundColor;
var fillColor = '#222';

var clearCanvas = function(){
	context.clearRect ( 0 , 0 , w , h );
};

var drawCircle = function(){
	context.beginPath();
	context.arc(ox, oy, radius, 0, circ, false);
	context.fillStyle = backgroundColor;
	context.fill();
};

var fillCircle = function(i){
	clearCanvas();
	drawCircle();

	context.save();
	context.beginPath();
	context.arc(ox, oy, radius, 0, 2 * Math.PI, false);
	context.clip();

	for(j = 0; j < 4; ++j){
    // qs = quadrant start
    var qs_theta = j*right;
    var qs_x = 2*radius*Math.sin(qs_theta);
    var qs_y = 2*radius*Math.cos(qs_theta);
    var qf_theta = (j+1)*right;
    var qf_x = 2*radius*Math.sin(qf_theta);
    var qf_y = 2*radius*Math.cos(qf_theta);

    if((j+1)*right < i){
    	context.beginPath();
    	context.moveTo(ox, oy);
    	context.lineTo(ox + qs_x, oy + qs_y);
    	context.lineTo(ox + qf_x, oy + qf_y);
    	context.lineTo(ox, oy);
    	context.fillStyle = fillColor;
    	context.fill();
    	context.lineWidth = 1;
    	context.strokeStyle = fillColor;
    	context.stroke();
    } else if (j*right < i){
    	context.beginPath();
    	context.moveTo(ox, oy);
    	context.lineTo(ox + qs_x, oy + qs_y);
    	context.lineTo(ox + 2*radius*Math.sin(i), oy + 2*radius*Math.cos(i));
    	context.lineTo(ox, oy);
    	context.fillStyle = fillColor;
    	context.fill();
    	context.lineWidth = 1;
    	context.strokeStyle = fillColor;
    	context.stroke();
    }
  }

  context.restore();
	context.beginPath();
  context.arc(ox, oy, radius, 0, 2 * Math.PI, false);
  context.lineWidth = border;
  context.strokeStyle = strokeColor;
  context.stroke();

  if (i < Math.PI*2){
  	window.setTimeout(function(){
  		fillCircle(i+increment)
  	}, timeoutSpeed);
  }
}

fillCircle(0);

});

$.fn.cssAnimate = function(animation, duration){
  duration == duration || 1000;
  el = $(this);

  el.addClass("animated").addClass(animation);
  setTimeout(function(){
    el.removeClass("animated").removeClass(animation);
  }, 1000);
};