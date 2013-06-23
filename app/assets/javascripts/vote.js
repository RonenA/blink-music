"use strict";
//TODO: Remove

var snippetLength = 2000;
var readySetGo = ["Set...", "Go!"];

$(function(){
	var sounds = getSounds(tracksInfo);

	$('.js-start-button').click(function(){
		$('#page-home').hide();
		$('#page-get-ready').show();

		var swapHeading = setInterval(function(){
			if (readySetGo.length > 0){
				$('.js-ready-heading').text( readySetGo.shift() );
			} else {
				$('.js-ready-heading').text('');
				startBlast(sounds);
				$('.instructions').addClass('is-mini');
				clearInterval(swapHeading);
			}
		}, 1500);

	});
});

var startBlast = function(sounds){
	var liked;

	var loop;
	var i = 0;
	loop = function(){
		if(i == sounds.length) {
			window.location.pathname = '/'+shareToken;
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
	}, snippetLength/4);

	return _.clone(sounds);
};

// Ajax put vote
//  submitVote :: Bool -> Integer -> ()
var submitVote = function(liked, trackId){
	$.ajax({
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
