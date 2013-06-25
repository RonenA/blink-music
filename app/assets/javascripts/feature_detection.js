$(function(){
	if (!Modernizr.audio.m4a){
		$('body').addClass('no-m4a');
	}
});