//I feel as terrible about this as you do
//but Modernizr can't detect touch devices
//because Windows 8 browsers think they are
//touch devices.

$(function(){

	var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
	};

	if (isMobile.any()){
		$('html').addClass('mobile');
	}

	if (!Modernizr.audio.m4a){
		$('html').addClass('no-m4a');
	}
});