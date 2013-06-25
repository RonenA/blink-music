$(function() {
	var jsPage = $('body').data('js-page');
	window[jsPage].go();
});
