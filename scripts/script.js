clearText();
eventListeners();
var r,
    time_update_interval = 0;

function clearText() {
	document.getElementById('artist').value = "";
	document.getElementById('song').value = "";
	document.getElementById('tracks').value = "";
};
function eventListeners() {
	document.querySelector('#addButtonT').addEventListener('click', addAlbums);
	document.querySelector('#addButtonU').addEventListener('click', getTracks);
	document.querySelector('#addButtonV').addEventListener('click', getSong);
	document.querySelector('#back').addEventListener('click', function(){
		document.querySelector('.input').style.display = "flex";
		document.querySelector('#trackList').style.display = "none";
		clearText();
	})

	document.querySelector('#artist').addEventListener('keydown', event => {
		if (event.isComposing || event.keyCode === 229) {
		  return;
		} else if (event.keyCode === 13) {
			addAlbums();
		}});
	document.querySelector('#tracks').addEventListener('keydown', event => {
		if (event.isComposing || event.keyCode === 229) {
			return;
		} else if (event.keyCode === 13) {
			getTracks();
		}});
	document.querySelector('#song').addEventListener('keydown', event => {
		if (event.isComposing || event.keyCode === 229) {
			return;
		} else if (event.keyCode === 13) {
			getSong();
		}});
};

function titleCase(myStr) {
	return myStr.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

function trackInfo(id,artist, song){
	console.log(song)
	fetch('https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+artist+'&track='+ song +'&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
			document.getElementById(id).setAttribute('data-poster', lastFM.track.album.image[3]["#text"]);
			postersrc = lastFM.track.album.image[3]["#text"]
			let posterdiv = document.querySelector('.poster');
			/*posterdiv.className = "poster";*/
			let poster = document.createElement('img');
			/*poster.id = 'poster';*/
			poster.src = postersrc;
			let playerDiv = document.querySelector('#playerDiv');
			/*playerDiv.appendChild(poster)*/
			posterdiv.innerHTML = "";
			posterdiv.appendChild(poster);
			posterdiv.style.display = "flex";
		})
}

function getSong() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let song = document.getElementById('song').value;
	trackList.innerHTML=" ";  	
	fetch('https://ws.audioscrobbler.com/2.0/?method=track.search&track='+ song +'&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
			let trackURL = 'https://www.last.fm/search/tracks?q='+song;
			//let postersrc = lastFM.results.trackmatches.track[0].image[3]["#text"];
			let data = [
			    {
			        url: trackURL, // url string rquired
			        selector: 'td.chartlist-play', // selector string rquired
			        loop: true, // each boolean rquired
			        result: [
			            {
			                name: 'id', // key string rquired
			                find: 'a', // selector child string rquired
			                grab: {
			                    by: 'attr', // attribut string rquired
			                    value: 'data-youtube-id' // attribut value string optional
			                }
			            }			    
			        ]
			    },
			];
			for (let i = 0; i < lastFM.results.trackmatches.track.length; i++) {
				let track = document.createElement('li');  			
				let trackName = lastFM.results.trackmatches.track[i].name;
				let artistName = lastFM.results.trackmatches.track[i].artist;
				track.className = "item wide";
				track.id = 'track'+i
				track.innerHTML = "<p>"+trackName+" - "+artistName+"</p>";
				//track.setAttribute('data-poster', postersrc);
				track.setAttribute('data-artist', artistName);
				track.setAttribute('data-track', trackName);
				track.addEventListener('click', newSetVideo);
				trackList.appendChild(track);
				let imgdiv = document.createElement('div');
				imgdiv.className = "imgdiv";
				track.appendChild(imgdiv);
				let player = document.querySelector('#youtube-audio');
				let playBtn = document.createElement('img');
				playBtn.src = "icons/play.png";
				playBtn.className = "ytImage";
				playBtn.setAttribute("id", "youtube-icon"+i);
				playBtn.setAttribute("data-html2canvas-ignore","");
				playBtn.addEventListener('click', newSetVideo);
				imgdiv.appendChild(playBtn);
		  	};
			ygrab(data, async function(result) {
				let trackIds = result;
				
				for (let i = 0; i < lastFM.results.trackmatches.track.length; i++) {
					let vidId = trackIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
					
				};
				if (r == undefined) {
				
					await createPlayer();
				}
			});
			document.querySelector('.input').style.display = "none";
			trackList.style.display = "flex";
			  /*document.querySelector('#listTitle').value = titleCase(album);*/
		}
		)};

function getTracks() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let artist = document.getElementById('tracks').value;
	trackList.innerHTML=" ";
	fetch('https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist='+ artist +'&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {			
			let trackURL = lastFM.toptracks.track[0].artist.url+"/%2Btracks";
			let postersrc = lastFM.toptracks.track[0].image[3]["#text"];
			let data = [
			    {
			        url: trackURL, // url string rquired
			        selector: 'td.chartlist-play', // selector string rquired
			        loop: true, // each boolean rquired
			        result: [
			            {
			                name: 'id', // key string rquired
			                find: 'a', // selector child string rquired
			                grab: {
			                    by: 'attr', // attribut string rquired
			                    value: 'data-youtube-id' // attribut value string optional
			                }
			            }			    
			        ]
			    },
			];
			for (let i = 0; i < lastFM.toptracks.track.length; i++) {
				let track = document.createElement('li');  			
				let trackName = lastFM.toptracks.track[i].name;
				track.className = "item wide";
				track.id = 'track'+i
				track.innerHTML = "<p>"+trackName+"</p>";
				track.setAttribute('data-poster', postersrc);
				track.setAttribute('data-artist', artist);
				track.setAttribute('data-track', trackName);
				track.addEventListener('click', newSetVideo);
				trackList.appendChild(track);
				let player = document.querySelector('#youtube-audio');
				let playBtn = document.createElement('img');
				playBtn.src = "icons/play.png";
				playBtn.className = "ytImage";
				playBtn.setAttribute("id", "youtube-icon"+i);
				playBtn.setAttribute("data-html2canvas-ignore","");
				playBtn.addEventListener('click', newSetVideo);
				
				let imgdiv = document.createElement('div');
				imgdiv.className = "imgdiv";
				imgdiv.appendChild(playBtn);
				track.appendChild(imgdiv);
		  	};
			ygrab(data, async function(result) {
				let trackIds = result;
				
				for (let i = 0; i < lastFM.toptracks.track.length; i++) {
					let vidId = trackIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
				};
				if (r == undefined) {
					
					await createPlayer();
				}
			});
			document.querySelector('.input').style.display = "none";
			trackList.style.display = "flex";
			  /*document.querySelector('#listTitle').value = titleCase(album);*/
		}
		)};

function addAlbums() {
	const trackList = document.querySelector('#trackList');
	trackList.innerHTML = "";
	let artist = document.getElementById('artist').value;
	fetch('https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist='+artist+ '&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM1) {
    		console.log(lastFM1.topalbums.album)
    		for (let i = 0; i < lastFM1.topalbums.album.length && i < 20; i++) {
    			
					let album = document.createElement('li');  			
					let albumName = lastFM1.topalbums.album[i].name;
					let albumCoverSrc = lastFM1.topalbums.album[i].image[3]["#text"];
					let albumCover = document.createElement('img');
					albumCover.src = albumCoverSrc;
					album.className = "item";
					album.id = 'album' + i ;
					album.setAttribute('data-artist', lastFM1.topalbums.album[i].artist.name);
					album.setAttribute('data-album', lastFM1.topalbums.album[i].name);
					albumCover.addEventListener('click', addTracks);
					album.appendChild(albumCover);
					trackList.appendChild(album);
			  	};
		})
		document.querySelector('.input').style.display = "none";
		document.querySelector('#trackList').style.display = "flex";
}
function addTracks() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let artist = this.parentNode.getAttribute('data-artist');
	let album = this.parentNode.getAttribute('data-album');
	trackList.innerHTML=" ";
	fetch('https://ws.audioscrobbler.com/2.0/?method=album.getInfo&artist='+ artist +'&album='+ album + '&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
    		console.log(lastFM)
			let albumURL = lastFM.album.url;
			let postersrc = lastFM.album.image[4]["#text"];
			let posterdiv = document.querySelector('.poster');
			/*posterdiv.className = "poster";*/
			let poster = document.createElement('img');
			/*poster.id = 'poster';*/
			poster.src = postersrc;
			let playerDiv = document.querySelector('#playerDiv');
			/*playerDiv.appendChild(poster)*/
			
			let data = [
			    {
			        url: albumURL, // url string rquired
			        selector: 'td.chartlist-play', // selector string rquired
			        loop: true, // each boolean rquired
			        result: [
			            {
			                name: 'id', // key string rquired
			                find: 'a', // selector child string rquired
			                grab: {
			                    by: 'attr', // attribut string rquired
			                    value: 'data-youtube-id' // attribut value string optional
			                }
			            }			    
			        ]
			    },
			];
			for (let i = 0; i < lastFM.album.tracks.track.length; i++) {
				let track = document.createElement('li');  			
				let trackName = lastFM.album.tracks.track[i].name;
				track.className = "item wide";
				track.id = 'track'+i
				track.innerHTML = "<p>"+trackName+"</p>";
				track.setAttribute('data-poster', postersrc);
				track.setAttribute('data-artist', artist);
				track.setAttribute('data-track', trackName);
				track.addEventListener('click', newSetVideo);
				trackList.appendChild(track);
				let imgdiv = document.createElement('div');
				imgdiv.className = "imgdiv";
				track.appendChild(imgdiv);
				let player = document.querySelector('#youtube-audio');
				let playBtn = document.createElement('img');
				playBtn.src = "icons/play.png";
				playBtn.className = "ytImage";
				playBtn.setAttribute("id", "youtube-icon"+i);
				playBtn.setAttribute("data-html2canvas-ignore","");
				playBtn.addEventListener('click', setVideo);
				imgdiv.appendChild(playBtn);
		  	};
			ygrab(data, async function(result) {
				let albumIds = result;
				
				for (let i = 0; i < lastFM.album.tracks.track.length; i++) {
					let vidId = albumIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
				};
			if (r == undefined) {
				await createPlayer();
			}
		
			});
  			/*document.querySelector('#listTitle').value = titleCase(album);*/
		}
	)};
function setVideo(){
	let player = document.querySelector('#youtube-audio');
	if (player.getAttribute('data-video') == this.parentNode.parentNode.getAttribute('data-video')) {
		if ( r.getPlayerState() == 1 || r.getPlayerState() == 3 ) {
	      r.pauseVideo(); 
	      document.getElementById("youtube-icon").src = "icons/play.png";
		  document.getElementById(player.getAttribute('data-video')).src = "icons/play.png";
	    } else {
	      r.playVideo(); 
	      document.getElementById("youtube-icon").src = "icons/pause.png";
		  document.getElementById(player.getAttribute('data-video')).src = "icons/pause.png";
	    } 
	} else {
		document.getElementById(player.getAttribute('data-video')).src = "icons/play.png";
		document.querySelector('#youtube-player').remove();
		let ytdiv = document.createElement('div');
		ytdiv.id = "youtube-player";
		player.appendChild(ytdiv);
		player.setAttribute('data-video', this.parentNode.parentNode.getAttribute('data-video'));
		player.setAttribute('data-autoplay', '1');
		this.src = "icons/pause.png"
		document.querySelector('#nowPlaying').innerHTML = this.parentNode.parentNode.firstChild.innerHTML;
		createPlayer();
	}
}
function createPlayer() {
	let player = document.querySelector('#youtube-audio');
	player.onclick = toggleAudio;
	r = new YT.Player("youtube-player", {
		    			height: "0",
		    			width: "0",
		    			videoId: player.dataset.video,
		    			playerVars: {
		      				autoplay: player.dataset.autoplay,
		      				loop: player.dataset.loop
		    			},
		    			events: {
		      				'onReady': initialize,
		      				}
		 			 });
	function togglePlayButton(play) {    
		document.getElementById("youtube-icon").src = play ? "icons/pause.png" : "icons/play.png";
		document.getElementById(player.getAttribute('data-video')).src = play ? "icons/pause.png" : "icons/play.png";
		}
	function toggleAudio() {
	    if ( r.getPlayerState() == 1 || r.getPlayerState() == 3 ) {
	      r.pauseVideo(); 
	      togglePlayButton(false);
	    } else {
	      r.playVideo(); 
	      togglePlayButton(true);
	    } 
	  } 
	function onPlayerReady(event) {
	    togglePlayButton(r.getPlayerState() !== 5);
	  }
	function onPlayerStateChange(event) {
	    if (event.data === 0) {
	      togglePlayButton(false); 
	    }
	  }
}


/*function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: 'Xa0Q0J5tOP0',
        playerVars: {
            color: 'white',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g'
        },
        events: {
            onReady: initialize
        }
    });
}*/

function initialize(){

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(r.getVolume()));
}


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( r.getCurrentTime() ));
    $('#duration').text(formatTime( r.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((r.getCurrentTime() / r.getDuration()) * 100);
}


// Progress bar

$('#progress-bar').on('mouseup touchend', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = r.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    r.seekTo(newTime);

});


// Playback

$('#play').on('click', function () {
    r.playVideo();
});


$('#pause').on('click', function () {
    r.pauseVideo();
});


// Sound volume


$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);

    if(r.isMuted()){
        r.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        r.mute();
        mute_toggle.text('volume_off');
    }
});

$('#volume-input').on('change', function () {
    r.setVolume($(this).val());
});


// Other options


$('#speed').on('change', function () {
    r.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    r.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    r.nextVideo()
});

$('#prev').on('click', function () {
    r.previousVideo()
});


// Load video

$('#track0').on('click', function () {

    var url = $(this).attr('data-video-id');

    console.log(url);

});
function newSetVideo(){
	console.log(this.getAttribute('data-video'))
	r.cueVideoById(this.getAttribute('data-video'));
	document.querySelector('#nowPlaying').innerHTML = this.getAttribute('data-track') +" - "+ this.getAttribute('data-artist');
	console.log(this.firstChild.innerHTML);
	r.playVideo()
	console.log(this.getAttribute('data-track'))
	trackInfo(this.id,this.getAttribute('data-artist'),this.getAttribute('data-track'));
	//let postersrc = this.getAttribute('data-poster');
	//let posterdiv = document.querySelector('.poster');
	/*posterdiv.className = "poster";*/
	//let poster = document.createElement('img');
	/*poster.id = 'poster';*/
	//poster.src = postersrc;
	//let playerDiv = document.querySelector('#playerDiv');
	/*playerDiv.appendChild(poster)*/
	//posterdiv.innerHTML = "";
	//posterdiv.appendChild(poster);
	//posterdiv.style.display = "flex";
	/*document.querySelector('.player').prepend(posterdiv);*/

}



// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}