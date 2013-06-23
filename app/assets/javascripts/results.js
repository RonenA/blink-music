$(function(){
	$('.twitter-popup').click(function(event) {
    var width  = 550,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);

    return false;
  });

  $('.facebook-popup').click(function(){
  	window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),
      'fb-share-dialog',
      'width=626,height=436');

    return false;
  });

  $('.js-play-preview').click(function(e){
    e.preventDefault();
    $(this).find('.icon-play-circled').toggleClass('icon-play-circled icon-pause-circled');
    var audio = $(this).find('audio');
    audio.get(0).play();
  });

});
