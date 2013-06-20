"use strict";
//TODO: Remove

var snippetLength = 2000;

$(function(){
	getCandidates().done(function(trackIds){
		var sounds = _.map(trackIds, getSound);
		var voteSpinner = new Spinner( document.getElementById('spinner') );

		var loop, finishLoop;
		loop = function(){
			var sound = sounds.shift();
			var trackId = trackIds.shift();

			sound.done(function(sound){
				playSound(sound);
				startSpinner(voteSpinner);

				finishLoop = function(liked) {
					stopSound(sound);
					submitVote(liked, trackId);
					if (sounds.length > 0){
						loop();
					} else {
						console.log('Done all songs.');
					}
				};

				setTimeout(function(){
					finishLoop(false);
				}, snippetLength);
			});
		};
		loop();

		$('.js-vote-track').click(function(){
			finishLoop($(this).data('liked'));
		});

		$(document).keypress(function(e){
			if (e.which == 97){
				$('.btn--like').cssAnimate('pulse', 500);
				finishLoop(true);
			}
			else if(e.which == 108){
				$('.btn--dislike').cssAnimate('pulse', 500);
				finishLoop(false);
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
		alert("Error: " + textStatus);
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

//  startSpinner :: Spinner -> ()
var startSpinner = function(spinner){
	console.log('pop');
	//$('.vote-pod__inner__icon').cssAnimate('pulse', 500);  pop the play icon
	spinner.spin();
}
