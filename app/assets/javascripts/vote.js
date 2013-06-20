"use strict";
//TODO: Remove

var snippetLength = 2000;

$(function(){
	getCandidates().done(function(trackIds){
		var sounds = _.map(trackIds, getSound);

		var liked;

		var loop;
		loop = function(){
			var sound = sounds.shift();
			var trackId = trackIds.shift();

			sound.done(function(sound){
				playSound(sound);
				startLoadingBar();

				liked = defer(false, snippetLength);
				liked.done(function(liked){
					stopSound(sound);
					submitVote(liked, trackId);
					if (sounds.length > 0){
						loop();
					} else {
						window.location.pathname = '/results'
					}
				});
			});
		};
		loop();

		$(document).keypress(function(e){
			if (e.which == 97){
				//$('.js-like-key').cssAnimate('pulse', 500);
				animateKeyPress($('.js-like-key'));
				animateCornerPopup('<i class="icon-heart"></i>');
				liked.resolve(true);
			}
			else if(e.which == 108){
				animateKeyPress($('.js-dislike-key'));
				animateCornerPopup('<i class="icon-cancel-circled"></i>');
				liked.resolve(false);
			}
		});

	});
});

// Get array of iTunes track ids
//  getCandidates :: Deferred [Integer]
var getCandidates = function(){
	return $.ajax({
		url: '/votes/candidates',
		type: 'GET',
		dataType: 'json'
	}).fail(function (jqXHR, textStatus, errorThrown){
		//TODO: Handle errors better
		alert("Error: " + textStatus);
	});
};

// Get track attributes from iTunes
//  getTrackData :: Integer -> Deferred Map
var getTrackData = function(trackId){
	return $.ajax({
		url: 'http://itunes.apple.com/lookup?id='+trackId,
		type: 'GET',
		dataType: 'jsonp'
	}).fail(function (jqXHR, textStatus, errorThrown) {
		//TODO: Handle errors better
		alert("Error: " + textStatus);
	});
};

// Get deferred stream from iTunes
//  getSound :: Integer -> Deferred $(<audio>)
var getSound = function(trackId){
	return getTrackData(trackId).pipe(function(trackData){
		var source = trackData.results[0].previewUrl;
		return $('<audio>', {src: source, preload: 'auto'});
	});
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

//  playSound :: $(<audio>) -> ()
var playSound = function(sound){
	$('body').append(sound);
	sound[0].play();
};

//  stopSound :: $(<audio>) -> ()
var stopSound = function(sound){
	sound[0].pause();
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

var animateCornerPopup = function(contents){
	var cornerPopup = $('.corner-popup');

	cornerPopup.html(contents).removeClass('fadeOutDown').addClass('bounceIn');
	window.setTimeout(function(){
		cornerPopup.removeClass('bounceIn').addClass('fadeOutDown');
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
