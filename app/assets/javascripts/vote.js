"use strict";
//TODO: Remove

var snippetLength = 1000;

$(function(){
	getCandidates().done(function(trackIds){
		var sounds = getSounds(trackIds);

		playNextSound(sounds);

		$('.js-vote-track').click(function(){
			voteHandler($(this).data('liked'), sounds, trackIds);
		});

		$(document).keypress(function(e){
			if (e.which == 97){
				voteHandler(true, sounds, trackIds);
			}
			else if(e.which == 108){
				voteHandler(false, sounds, trackIds);
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
//  getSound :: Integer -> Deferred <audio>
var getSound = function(trackId){
	return getTrackData(trackId).pipe(function(trackData){
		var source = trackData.results[0].previewUrl;
		return $('<audio>', {src: source, preload: 'auto'});
	});
};

// Get array of deferred sounds
//  getSounds :: [Integer] -> [Deferred <audio>]
var getSounds = function(trackIds){
	var sounds = [];

	for(var i=0; i < trackIds.length; i++){
		sounds[i] = getSound(trackIds[i]);
	}

	return sounds;
};

// Cast vote and play next track
//  voteHandler :: Bool -> [Deferred <audio>] -> [Integer] -> ()
var voteHandler = function(liked, sounds, trackIds){
	stopSound();
	submitVote(liked, trackIds.shift());
	sounds.shift();
	playNextSound(sounds);
}

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
		alert("Error: " + textStatus);
	});
};

// Play the sound at the beginning of the array
//  playNextSound :: Deferred <audio> -> ()
var playNextSound = function(sounds){
	if (sounds.length == 0){
		alert("No tracks");
	}
	else{
		sounds[0].done(function(sound){
			$('body').append(sound);
			sound[0].play();
			setTimeout(function(){sound[0].pause()}, 2000);
		});
	}
};

// Stop the sound that is currently playing
//  stopSound :: ()
var stopSound = function(){
	var sound = $('audio');
	sound[0].pause();
	sound.remove();
};
