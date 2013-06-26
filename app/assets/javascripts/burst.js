"use strict";
//TODO: Remove

var snippetLength = 3200;

var burst = (function(){

	var go = function() {
		var sounds = getSounds(tracksInfo);

		if(getParameterByName('skip_intro') != 'true') {
			$('.js-start-button').click(function(){
				$('#page-home').fadeOut(function() {
					prepareBurst(sounds);
				});
			});
		} else {
			$('#page-home').hide();

			prepareBurst(sounds);
		}
	};

	var prepareBurst = function(sounds){
		$('#page-get-ready').show();

		var heading = $('.js-ready-heading');

		heading.cssAnimate('flashInOut', 1000, function(){

			window.setTimeout(function(){
				heading.text( "Set" ).cssAnimate('flashInOut', 1000, function(){

					window.setTimeout(function(){
						heading.text( "Go" ).cssAnimate('flashInOut', 1000, function(){
								heading.text('');
						});
						$('.instructions').addClass('is-mini');
						startBurst(sounds);
					});

				});
			});

		});

	};

	var soundIndex = 0;

	var startBurst = function(sounds){
		var like;
		var hasEverLiked = !$('.js-skip-button').hasClass('hidden');
		var hasVotedThisRound = false;
		var skippedTracks = 0;
		var skipTracks = true;

		var loop = function(){
			var i = soundIndex;

			if(i == sounds.length) {
				window.location = window.location.origin+'/'+shareToken;
			}

			//Draw attention to the instructions if they aren't using them
			if( i != 0 && i % 5 == 0 && !hasVotedThisRound ){
				$('.instructions').cssAnimate('tada');
			}

			// If we're skipping too many tracks, their connection is just bad.
			if(skippedTracks >= 10) {
				skipTracks = false;
				$('.error').text("We're having trouble downloading the tracks. This might be an issue with your internet connection.");
			}

			var sound = sounds[i];
			var trackInfo = tracksInfo[i];

			sound.done(function(sound) {
				if(!isReady(sound) && skipTracks) {
					setTimeout(function() {
						if(!isReady(sound)) {
							++skippedTracks;
							++soundIndex; loop();
						} else {
							continueLoop(sound, trackInfo);
						}
					}, 100);
				} else {
					continueLoop(sound, trackInfo);
				}
			});
		};
		var continueLoop = function(sound, trackInfo) {
			playSound(sound);
			startLoadingBar();

			like = defer({liked: false, source: 'time out'}, snippetLength);
			like.done(function(like){
				var liked = like.liked;

				if(liked && !hasEverLiked){
					$('.js-skip-button').addClass('animated fadeInDown').removeClass('hidden');
					hasEverLiked = true;
				}

				if (like.source === "key"){
					showVoteFeedback(sound, liked);
				}

				var msToVote = Math.floor(sound[0].currentTime*1000);
				ga('send', 'event', 'Vote', liked+' by '+like.source, trackInfo.id, msToVote);

				stopSound(sound);
				submitVote(liked, trackInfo.id);

				++soundIndex; loop();
			});
		};
		loop();

		$(document).keypress(function(e){
			if (e.which == 97){
				hasVotedThisRound = true;
				animateKeyPress($('.js-like-key'));
				like.resolve({liked: true, source: 'key'});
			}
			else if(e.which == 108){
				hasVotedThisRound = true;
				animateKeyPress($('.js-dislike-key'));
				like.resolve({liked: false, source: 'key'});
			}
		});
	};

	var showVoteFeedback = function(sound, liked){
		var icon = (liked ? "heart" : "cancel-circled");
		var feedback = $('.feedback');

		feedback.addClass('is-in');
		feedback.removeClass('fadeOutDown').addClass('bounceIn');
		$('.feedback__icon').removeClass('icon-heart icon-cancel-circled').addClass('icon-'+icon);
		$('.feedback__time').text(sound[0].currentTime.toFixed(2) + "s");

		window.setTimeout(function(){
			feedback.removeClass('bounceIn').addClass('fadeOutDown');
		}, 800);
	};

	//  getSounds :: [Map] -> [Deferred $(<audio>)]
	var getSounds = function(tracksInfo){
		var sounds = _.map(_.range(tracksInfo.length), function(){
			return $.Deferred();
		});
		var i = 0;
		var timer = setInterval(function() {
			if(i == tracksInfo.length) {
				clearInterval(timer);
			} else if(i < soundIndex + 10) {
				sounds[i].resolve($('<audio>',
						{src: tracksInfo[i].preview_url, preload: 'auto'}));
				++i;
			}
		}, 200);

		return sounds;
	};

	// Ajax put vote
	//  submitVote :: Bool -> Integer -> Deferred ()
	var submitVote = function(liked, trackId){
		return $.ajax({
			url: '/votes/'+trackId,
			type: 'PUT',
			dataType: 'json',
			data: { liked: liked }
		}).fail(function (jqXHR, textStatus, errorThrown) {
			//TODO: Handle errors better
			//alert("Error: " + textStatus);
		});
	};

	//  isReady :: $(<audio>) -> Bool
	var isReady = function(sound) {
		return sound[0].readyState >= 3;
	};

	//  playSound :: $(<audio>) -> ()
	var playSound = function(sound){
		$('body').append(sound);
		sound[0].play();
	};

	//  stopSound :: $(<audio>) -> ()
	var stopSound = function(sound){
		sound[0].pause();
		sound.attr('src', '');
		sound.remove();
	};

	var startLoadingBar = function(){
		var loadingBar = $('.loading-bar-bg');
		loadingBar.removeClass('animated load');
		window.setTimeout( function(){ loadingBar.addClass('animated load'); });
	};

	var animateKeyPress = function(key){
		key.addClass('pressed');
		window.setTimeout(function(){ key.removeClass('pressed'); }, 200);
	};

	// Produces the value that was input, but only after a delay.
	//  defer :: a -> Integer -> Deferred a
	var defer = function(val, delay) {
		var result = $.Deferred();

		setTimeout(function(){
			result.resolve(val);
		}, delay);

		return result;
	};

	//  getParameterByName :: String -> String
	var getParameterByName = function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	$.fn.cssAnimate = function(animation, duration, callback){
		duration = duration || 1000;
		var el = $(this);

		el.addClass("animated").addClass(animation);
		setTimeout(function(){
			el.removeClass(animation);
			if (callback !== undefined) { callback(); }
		}, duration);
	};

	return {
		'submitVote': submitVote,
		'go'        : go
	};
})();
