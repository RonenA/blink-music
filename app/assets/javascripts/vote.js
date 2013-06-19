"use strict";
//TODO: Remove

var scClientId = '33e780b8fadb971a1cd5793866664a05';
var snippetLength = 1000;

$(function(){
	SC.initialize({
	  client_id: scClientId
	});

	getCandidates().done(function(trackIds){
		var sounds = getSounds(trackIds);

		playNextSound(sounds, trackIds);

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

//Get array of soundcloud track ids
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

//Ajax put vote
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

//Get track attributes from Soundcloud
var getTrackData = function(trackId){
	return $.ajax({
		url: 'https://api.soundcloud.com/tracks/'+trackId+'.json?consumer_key='+scClientId,
		type: 'GET',
		dataType: 'json'
	}).fail(function (jqXHR, textStatus, errorThrown) {
		//TODO: Handle errors better
		alert("Error: " + textStatus);
	});
};

//Get deferred stream from soundcloud
var getSound = function(trackId){
	var result = $.Deferred();

	getTrackData(trackId).done(function(data){
		var trackData = data;
		var options = {
			from: trackData.duration/2,
			to: trackData.duration/2 + snippetLength,
			stream: true,
			autoPlay:true
		};

		SC.stream("/tracks/"+trackId, options, function(sound){
			sound.load(options);
			result.resolve(sound);
		});
	});

	return result;
};

//Get array of deferred sounds
var getSounds = function(trackIds){
	var sounds = [];

	for(var i=0; i < trackIds.length; i++){
		sounds[i] = getSound(trackIds[i]);
	}

	return sounds;
};

//Cast vote and play next track
var voteHandler = function(liked, sounds, trackIds){
	submitVote(liked, trackIds.shift());
	sounds.shift();
	playNextSound(sounds);
}

//play the sound at the
var playNextSound = function(sounds){
	if (sounds.length == 0){
		alert("No tracks");
	}
	else{
		sounds[0].done(function(sound){
			sound.play();
		});
	}
}