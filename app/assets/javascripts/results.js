$(function(){
  $('.track-list').tooltip({animation: false, selector: '.js-tooltip'});

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

	// Playing previews

	var previewPlaying = null;
	var lastPreviewPlayed = null;

	$('.track-list').on('click', '.js-play-preview', function(e){
		e.preventDefault();

		if(!$(this).is(previewPlaying)) {
			if(lastPreviewPlayed != null && !$(this).is(lastPreviewPlayed)) {
				stopPreview(lastPreviewPlayed);
				lastPreviewPlayed.find('audio')[0].currentTime = 0;
			}
			playPreview($(this));
			previewPlaying = lastPreviewPlayed = $(this);
		} else {
			stopPreview($(this));
			previewPlaying = null;
		}
	});

	$('.track-list').on('ended', '.js-play-preview', function() {
		stopPreview($(this));
	});

	var playPreview = function(tag) {
		tag.find('.icon-play-circled').toggleClass('icon-play-circled icon-pause-circled');
		tag.find('audio')[0].play();
	};

	var stopPreview = function(tag) {
		tag.find('.icon-pause-circled').toggleClass('icon-play-circled icon-pause-circled');
		tag.find('audio')[0].pause();
	};

	// Infinite scrolling

	var page = 1;
	var loading = false;

	$(window).scroll(function() {
		if(loading) {
			return;
		}

		if(nearBottomOfPage()) {
			loading = true;
			++page;

			$.ajax({
				url: window.location.pathname+'?page='+page,
				type: 'GET',
				dataType: 'html',
			}).done(function(nextPage) {
				$('.track-list').append(nextPage);
				loading = false;
			});
		}
	});

	var nearBottomOfPage = function() {
		return $(window).scrollTop() > $(document).height() - $(window).height() - 200;
	};
});
