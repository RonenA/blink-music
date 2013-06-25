$(function(){
	//Play button on home page
	$('.ga-play-home').click(function(){
		ga('send', 'event', 'Play', 'From Home', shareToken);
	});

	//Skip during burst
	$('.ga-skip-button').click(function(){
		ga('send', 'event', 'My Likes', 'Skip to likes from burst', shareToken);
	});

	//Play again button from your own likes page
	$('.ga-play-my-likes').click(function(){
		ga('send', 'event', 'Play', 'From My Likes', shareToken);
	});

	//Play button from someone else's likes page
	$('.ga-play-their-likes').click(function(){
		var referrerShareToken = $(this).data('referrer');
		ga('send', 'event', 'Play', 'From Their Likes', referrerShareToken);
	});

	//"My likes" button
	$('.ga-my-likes').click(function(){
		var renderedFrom = $(this).closest('.nav-list').data('rendered-from');
		ga('send', 'event', 'My Likes', 'From '+renderedFrom, shareToken);
	});

	//iTunes Links
	$('.ga-track-link').click(function(){
		var track = $(this).closest('.track-list > li');
		ga('send', 'event', 'Track', 'View on iTunes', track.data('track-id'));
	});

	//Clicking Artist Name
	$('.ga-track-artist').click(function(){
		var track = $(this).closest('.track-list > li');
		ga('send', 'event', 'Track', 'View Artist', track.data('track-id'));
	});

	//Social sharing
	$('.ga-share-links a').click(function(){
		ga('send', 'event', 'Share', $(this).data('share-type'), shareToken);
	});

});