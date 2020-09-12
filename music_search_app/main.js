const clientId = 'e53106c9d30447dc9b464af9abbf4c70';
const clientSecret = '5cdf8f115816418f867a882dfb0a3317';

let tokenVal = "";
let musicBox = [];
let audioIsPlaying = false;
let musicCount = 0;

musicBox = [];

    // private methods
    const getData = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        tokenVal = data.access_token;

    }

    getData();

    function searchData(query){
        fetch(`https://api.spotify.com/v1/search/?q=${query}&type=track&limit=5`, {
            method: 'GET', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokenVal
            }
        })
            .then(res => res.json())
            .then(data => {
                const results = data.tracks.items;
                musicBox = [];
                results.forEach(res => {
                    musicBox.push(
                        {
                            artistName: res.artists[0].name, 
                            songName: res.name,
                            songSrc: res.preview_url,
                            songCoverSrc: res.album.images[1].url
                        }
                    );

                    
                })
                updateDOM();
            })
    }

    //DOM
    const searchForm = document.getElementById("searchForm");
    const audioItem = document.getElementById('audio-item');
    const playBtn = document.querySelector(".playBtn i");

    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const cover = document.querySelector('.image-place img');

    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    const progressWrapper = document.getElementById('progress-wrapper');
    const progress = document.getElementById('progress');
    const durationVal = document.getElementById('duration');
    const currentTimeVal = document.getElementById('current-time');

    const musicResults = document.querySelector('.music-results');

    //functions
    function searchWithQuery(e){
        e.preventDefault();
        let input = document.getElementById("search-input").value;
        if(input){
            input = input.split(" ").join("%20");
            searchData(input);
        }   
        
    }

    function toPlay(){
        playBtn.classList.replace("fa-play", "fa-pause");
        audioItem.play();
        audioIsPlaying = true;
    }

    function toPause(){
        playBtn.classList.replace("fa-pause", "fa-play");
        audioItem.pause();
        audioIsPlaying = false;
    }

    function changeSong(count){
        const {artistName, songName, songSrc, songCoverSrc} = musicBox[count];
    
        author.innerText = artistName;
        title.innerText = songName;
        audioItem.src = songSrc;
        cover.src = songCoverSrc;
        toPlay();
        
    }
 
    //Playing/Pausing songs, playing prev songs, next songs

    function nextBtnFunc(){
        musicCount++;
        if(musicCount > musicBox.length - 1){
            musicCount = 0;
        }
        changeSong(musicCount);
    }

    function prevBtnFunc(){
        musicCount--;
        if(musicCount < 0){
            musicCount = musicBox.length - 1;
        }
        changeSong(musicCount);
        
    }

    function playAudioFunc(){
        if(audioIsPlaying){
            toPause();
        } else {
            toPlay();
        }
    }

    function setTimeProgress(e){
        const {duration, currentTime} = e.srcElement;
        const currentPercent = currentTime / duration * 100 + "%";
        progress.style.width = currentPercent;

        if(duration){
            let songMins = Math.floor(duration / 60);
            let songSecs = Math.floor(duration % 60);
            songSecs = songSecs < 10 ? `0${songSecs}` : songSecs;
            durationVal.innerText = `${songMins}:${songSecs}`;
    
            let curMins = Math.floor(currentTime / 60);
            let curSecs = Math.floor(currentTime % 60);
            curSecs = curSecs < 10 ? `0${curSecs}` : curSecs;
            currentTimeVal.innerText = `${curMins}:${curSecs}`;
        }

        if(currentTime == duration){
            nextBtnFunc();
        }

    }

    function updateDOM(){
        musicResults.innerHTML = "";
        let count = 0;
        musicBox.forEach(item => {
            const newItem = document.createElement('div');
            newItem.classList.add("result-item");
            newItem.innerHTML = `<div class="item-img">
            <img src="${item.songCoverSrc}">
        </div>
        <div class="item-title">${item.songName}</div>
        <div class="item-author">${item.artistName}</div>

        <div class="item-play-btn"><i class="fas fa-play"></i></div>

        <div class="item-bookmark-btn"><i class="far fa-bookmark"></i>
        </div>`;
        newItem.setAttribute("data-id", count);
        musicResults.appendChild(newItem);

        count++;
        });

        const itemPlayBtns = document.querySelectorAll(".item-play-btn");
        itemPlayBtns.forEach(item => {
            item.addEventListener('click', function(){
                try{
                    changeSong(item.parentElement.getAttribute("data-id"));
                } catch(er){
                    console.log(er);
                    console.log(item.parentElement.getAttribute("data-id"));
                }
            })
        })
    }

    //event listeners
    searchForm.addEventListener('submit', searchWithQuery);
    playBtn.addEventListener('click', playAudioFunc);
    rightBtn.addEventListener('click', nextBtnFunc);
    leftBtn.addEventListener("click", prevBtnFunc);
    audioItem.addEventListener('timeupdate', setTimeProgress);

    progressWrapper.addEventListener('click', function(e){
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const { duration } = audioItem;
        audioItem.currentTime = (clickX / width) * duration;
        toPlay();
    })

