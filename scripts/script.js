clearText();
eventListeners();

function clearText() {
	document.getElementById('artist').value = "";
	document.getElementById('song').value = "";
	document.getElementById('tracks').value = "";
};
function eventListeners() {
	document.querySelector('#addButtonT').addEventListener('click', addAlbums);
	document.querySelector('#addButtonU').addEventListener('click', getTracks);
	document.querySelector('#addButtonV').addEventListener('click', getSong);

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

function getSong() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let song = document.getElementById('song').value;
	trackList.innerHTML=" ";
	let youtubeAudio = document.querySelector('#youtube-audio');
	youtubeAudio.innerHTML = '<div id="youtube-player"></div>';
	let nowPlaying = document.querySelector('#nowPlaying');
  	/*nowPlaying.id = 'nowPlaying';*/
  	nowPlaying.innerHTML="Song not found, please try again."
  	/*youtubeAudio.appendChild(nowPlaying);*/
	let playerBtn = document.createElement('img');
  	playerBtn.src = "icons/play.png";
  	playerBtn.className = "ytImage";
  	playerBtn.setAttribute("id", "youtube-icon");
  	youtubeAudio.appendChild(playerBtn);
  	
	fetch('https://ws.audioscrobbler.com/2.0/?method=track.search&track='+ song +'&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
			console.log(lastFM.results.trackmatches.track)
			
			let trackURL = 'https://www.last.fm/search/tracks?q='+song;
			let postersrc = lastFM.results.trackmatches.track[0].image[3]["#text"];
			let posterdiv = document.createElement('div');
			posterdiv.className = "poster";
			let poster = document.createElement('img');
			/*poster.id = 'poster';*/
			poster.src = postersrc;
			let playerDiv = document.querySelector('#playerDiv');
			/*playerDiv.appendChild(poster)*/
			posterdiv.appendChild(poster);
			/*document.querySelector('main').appendChild(posterdiv);*/

			document.querySelector('#nowPlaying').innerHTML = lastFM.results.trackmatches.track[0].name;
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
				let trackIds = result;
				document.querySelector('#youtube-audio').setAttribute('data-video', trackIds[0].id);
				for (let i = 0; i < lastFM.results.trackmatches.track.length; i++) {
					let vidId = trackIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
				};
			await createPlayer();
			});
			document.querySelector('.input').style.display = "none";
			  /*document.querySelector('#listTitle').value = titleCase(album);*/
		}
		)};

function getTracks() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let artist = document.getElementById('tracks').value;
	trackList.innerHTML=" ";
	let youtubeAudio = document.querySelector('#youtube-audio');
	youtubeAudio.innerHTML = '<div id="youtube-player"></div>'
	let nowPlaying = document.querySelector('#nowPlaying');
  	/*nowPlaying.id = 'nowPlaying';*/
  	nowPlaying.innerHTML="Song not found, please try again."
  	/*youtubeAudio.appendChild(nowPlaying);*/
	let playerBtn = document.createElement('img');
  	playerBtn.src = "icons/play.png";
  	playerBtn.className = "ytImage";
  	playerBtn.setAttribute("id", "youtube-icon");
  	youtubeAudio.appendChild(playerBtn);
	fetch('https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist='+ artist +'&api_key=cb44e36a7f8b0c6427b01d4de757a2ad&format=json', {mode: 'cors'})
    	.then(function(response) {
      		return response.json();
    	})
    	.then(function(lastFM) {
			console.log(lastFM.toptracks.track.length)
			
			let trackURL = lastFM.toptracks.track[0].artist.url+"/%2Btracks";
			console.log(trackURL)
			let postersrc = lastFM.toptracks.track[0].image[3]["#text"];
			let posterdiv = document.createElement('div');
			posterdiv.className = "poster";
			let poster = document.createElement('img');
			/*poster.id = 'poster';*/
			poster.src = postersrc;
			let playerDiv = document.querySelector('#playerDiv');
			/*playerDiv.appendChild(poster)*/
			posterdiv.appendChild(poster);
			/*document.querySelector('main').appendChild(posterdiv);*/

			document.querySelector('#nowPlaying').innerHTML = lastFM.toptracks.track[0].name;
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
				let trackIds = result;
				document.querySelector('#youtube-audio').setAttribute('data-video', trackIds[0].id);
				for (let i = 0; i < lastFM.toptracks.track.length; i++) {
					let vidId = trackIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
				};
			await createPlayer();
			});
			document.querySelector('.input').style.display = "none";
			  /*document.querySelector('#listTitle').value = titleCase(album);*/
		}
		)};

function addAlbums() {
	const trackList = document.querySelector('#trackList');
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
		document.querySelector('#disappearT').style.display = "none";
		document.querySelector('#disappearV').style.display = "none";
		document.querySelector('.input').style.display = "none";
}
function addTracks() {
	const trackList = document.querySelector('#trackList');
	trackList.style.justifyContent = "space-between";
	let artist = this.parentNode.getAttribute('data-artist');
	let album = this.parentNode.getAttribute('data-album');
	trackList.innerHTML=" ";
	let youtubeAudio = document.querySelector('#youtube-audio');
	youtubeAudio.innerHTML = '<div id="youtube-player"></div>'
	let nowPlaying = document.querySelector('#nowPlaying');
  	/*nowPlaying.id = 'nowPlaying';*/
  	nowPlaying.innerHTML="Song not found, please try again."
  	/*youtubeAudio.appendChild(nowPlaying);*/
	let playerBtn = document.createElement('img');
  	playerBtn.src = "icons/play.png";
  	playerBtn.className = "ytImage";
  	playerBtn.setAttribute("id", "youtube-icon");
  	youtubeAudio.appendChild(playerBtn);
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
			posterdiv.appendChild(poster);
			/*document.querySelector('.player').prepend(posterdiv);*/

			document.querySelector('#nowPlaying').innerHTML = lastFM.album.tracks.track[0].name;
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
				document.querySelector('#youtube-audio').setAttribute('data-video', albumIds[0].id);
				for (let i = 0; i < lastFM.album.tracks.track.length; i++) {
					let vidId = albumIds[i].id;
					var e = document.getElementById("track"+i);
					let player = document.querySelector('#youtube-audio');
					e.setAttribute('data-video', vidId);
					let icon = document.querySelector('#youtube-icon'+i);
					icon.id = vidId;
				};
			await createPlayer();
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
		      				'onReady': onPlayerReady,
		      				'onStateChange': onPlayerStateChange
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