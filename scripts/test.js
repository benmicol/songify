const trackList = document.querySelector('#trackList');
const songInput = document.getElementById('song');
const artistInput = document.getElementById('artist');
const tracksInput = document.getElementById('tracks');
const inputs = document.querySelector('.input');
const apiKey = '&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json'
let r;
let time_update_interval = 0;
clearText();

function clearText() {
	artistInput.value = "";
	songInput.value = "";
	tracksInput.value = "";
	inputs.style.display = "flex";
    trackList.style.display = "none";
    trackList.innerHTML = "";
};
function toggleInputs(state) {
    if (state=="off"){
        inputs.style.display = "none";
        trackList.style.display = "flex";
    }
}
function trackInfo(id,artist, song){
	fetch('https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+artist+'&track='+ song +apiKey, {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
            postersrc = lastFM.track.album.image[3]["#text"];
			document.getElementById(id).setAttribute('data-poster', postersrc);
			let posterdiv = document.querySelector('.poster');
			let poster = document.createElement('img');
			poster.src = postersrc;
			posterdiv.innerHTML = "";
			posterdiv.appendChild(poster);
			posterdiv.style.display = "flex";
		})
}
function addAlbums() {
	let artist = document.getElementById('artist').value;
	fetch('https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist='+artist+ apiKey, {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM1) {
    		for (let i = 0; i < lastFM1.topalbums.album.length && i < 20; i++) {
					let album = document.createElement('li');  			
					let albumName = lastFM1.topalbums.album[i].name;
					let albumCoverSrc = lastFM1.topalbums.album[i].image[3]["#text"];
					let albumCover = document.createElement('img');
                    albumCover.src = albumCoverSrc;
                    albumCover.setAttribute("loading","lazy");
					album.className = "item";
					album.id = 'album' + i ;
					album.setAttribute('data-artist', lastFM1.topalbums.album[i].artist.name);
					album.setAttribute('data-album', albumName);
					albumCover.addEventListener('click', tracks);
					album.appendChild(albumCover);
					trackList.appendChild(album);
			  	};
		})
		toggleInputs("off")
}
function generateTracks(tracks,url,type){
    let data = [
        {
            url: url, // url string rquired
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
    for (let i = 0; i < tracks.length; i++) {
        let track = document.createElement('li');  			
        let trackName = tracks[i].name;
        let artistName;
        if (type == "song"){
            artistName = tracks[i].artist;
            track.innerHTML = "<p>"+trackName+" - "+artistName+"</p>";
        } else if (type == "tracks" || type == "album"){
            artistName = tracks[i].artist.name;
            track.innerHTML = "<p>"+trackName+"</p>";
        };
        track.className = "item wide";
        track.id = 'track'+i;
        track.setAttribute('data-artist', artistName);
        track.setAttribute('data-track', trackName);
        track.addEventListener('click', newSetVideo);
        trackList.appendChild(track);
        let imgdiv = document.createElement('div');
        imgdiv.className = "imgdiv";
        track.appendChild(imgdiv);
        let playBtn = document.createElement('img');
        playBtn.src = "icons/play.png";
        playBtn.className = "ytImage";
        playBtn.setAttribute("id", "youtube-icon"+i);
        imgdiv.appendChild(playBtn);
      };
    ygrab(data, function(result) {
        let trackIds = result;				
        for (let i = 0; i < tracks.length; i++) {
            let vidId = trackIds[i].id;
            var e = document.getElementById("track"+i);
            e.setAttribute('data-video', vidId);
            let icon = document.querySelector('#youtube-icon'+i);
            icon.id = vidId;					
        };
    });
}
function tracks(){
    
   
    trackList.style.display = "space-between";
    trackList.innerHTML = " ";
    if (songInput.value != ""){
        let song = songInput.value;
        fetch('https://ws.audioscrobbler.com/2.0/?method=track.search&track='+ song + apiKey, {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
            let trackURL = 'https://www.last.fm/search/tracks?q='+song;
            let tracksObject = lastFM.results.trackmatches.track;
            generateTracks(tracksObject,trackURL,"song");
            toggleInputs("off")
        })
    } else if (tracksInput.value != ""){
        let artist = tracksInput.value;
        fetch('https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist='+ artist +apiKey, {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {			
            let trackURL = lastFM.toptracks.track[0].artist.url+"/%2Btracks";
            let tracksObject = lastFM.toptracks.track;
            generateTracks(tracksObject,trackURL,"tracks");
			toggleInputs("off")
		})
    } else if (artistInput.value != ""){
        let artist = this.parentNode.getAttribute('data-artist');
        let album = this.parentNode.getAttribute('data-album');
        fetch('https://ws.audioscrobbler.com/2.0/?method=album.getInfo&artist='+ artist +'&album='+ album + apiKey, {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
            let albumURL = lastFM.album.url;
            let tracksObject = lastFM.album.tracks.track;
            generateTracks(tracksObject,albumURL,"album");
            trackList.style.display = "flex";			
		})
    }
};

function onYouTubeIframeAPIReady() {
	let player = document.querySelector('#youtube-audio');
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
                    }
function newSetVideo(){
    r.cueVideoById(this.getAttribute('data-video'));
    document.querySelector('#nowPlaying').innerHTML = this.getAttribute('data-track') +" - "+ this.getAttribute('data-artist');
    r.playVideo()
    trackInfo(this.id,this.getAttribute('data-artist'),this.getAttribute('data-track'));
}
function initialize(){
    updateTimerDisplay();
    updateProgressBar();
    clearInterval(time_update_interval);
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);
    $('#volume-input').val(Math.round(r.getVolume()));
}
function updateTimerDisplay(){
    $('#current-time').text(formatTime( r.getCurrentTime() ));
    $('#duration').text(formatTime( r.getDuration() ));
}
function updateProgressBar(){
    $('#progress-bar').val((r.getCurrentTime() / r.getDuration()) * 100);
}
function formatTime(time){
    time = Math.round(time);
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}
// Event Listeners
$('#progress-bar').on('mouseup touchend', function (e) {
    var newTime = r.getDuration() * (e.target.value / 100);
    r.seekTo(newTime);
});
$('#play').on('click', function () {
    r.playVideo();
});
$('#pause').on('click', function () {
    r.pauseVideo();
});
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
document.querySelector('#addButtonT').addEventListener('click', addAlbums);
document.querySelector('#addButtonU').addEventListener('click', tracks);
document.querySelector('#addButtonV').addEventListener('click', tracks);
document.querySelector('#back').addEventListener('click', clearText);
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
        tracks();
    }});
document.querySelector('#song').addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    } else if (event.keyCode === 13) {
        tracks();
    }});