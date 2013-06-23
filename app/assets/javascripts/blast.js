"use strict";
//TODO: Remove

var snippetLength = 2000;

var blast = (function(){

	var go = function() {
		var sounds = getSounds(tracksInfo);

		if(getParameterByName('play_again') != 'true') {
			$('.js-start-button').click(function(){
				$('#page-home').fadeOut(function(){
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
									startBlast(sounds);
								});

							});
						});

					});

				});

			});
		} else {
			$('#page-home').hide();
			$('.instructions').addClass('is-mini');

			window.setTimeout(function(){
				startBlast(sounds);
			}, snippetLength);
		}
	};

	var startBlast = function(sounds){
		var liked;

		var loop;
		var i = 0;
		loop = function(){
			if(i == sounds.length) {
				window.location = window.location.origin+'/'+shareToken;
			}

			var sound = sounds[i];
			var trackInfo = tracksInfo[i];

			sound.done(function(sound) {
				if(!isReady(sound)) {
					++i; loop();
					return;
				}

				playSound(sound);
				startLoadingBar();

				liked = defer(false, snippetLength);
				liked.done(function(liked){
					stopSound(sound);
					submitVote(liked, trackInfo.id);

					++i; loop();
				});
			});
		};
		loop();

		$(document).keypress(function(e){
			if (e.which == 97){
				animateKeyPress($('.js-like-key'));
				animateFeedbackIcon('<i class="icon-heart"></i>');
				liked.resolve(true);
			}
			else if(e.which == 108){
				animateKeyPress($('.js-dislike-key'));
				animateFeedbackIcon('<i class="icon-cancel-circled"></i>');
				liked.resolve(false);
			}
		});
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
				return;
			}
			sounds[i].resolve($('<audio>',
					{src: tracksInfo[i].preview_url, preload: 'auto'}));
			++i;
		}, snippetLength/2);

		return _.clone(sounds);
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
	}

	var animateFeedbackIcon = function(contents){
		var icon = $('.feedback-icon');

		icon.html(contents).removeClass('fadeOutDown').addClass('bounceIn');
		window.setTimeout(function(){
			icon.removeClass('bounceIn').addClass('fadeOutDown');
		}, 800);
	}

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
			callback();
		}, duration);
	};

	return {
		'submitVote': submitVote,
		'go'        : go
	};
})();
