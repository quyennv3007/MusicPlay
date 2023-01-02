const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd =$('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn =$('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList =$('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom:false,
  isRepeat : false,
  settings:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
      {
        name: "Damn",
        singer: "Raftaar x kr$na",
        path:
          "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
        image:
          "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
      },
      {
        name: "Tu Phir Se Aana",
        singer: "Raftaar x Salim Merchant x Karma",
        path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
        image:
          "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
      },
      {
        name: "Naachne Ka Shaunq",
        singer: "Raftaar x Brobha V",
        path:
          "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
        image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
      },
      {
        name: "Mantoiyat",
        singer: "Raftaar x Nawazuddin Siddiqui",
        path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
        image:
          "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
      },
      {
        name: "Aage Chal",
        singer: "Raftaar",
        path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
        image:
          "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
      },  
      {
        name: "Aasssge Chal",
        singer: "Raftaar",
        path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
        image:
          "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
      }, 
      {
        name: "Feeling You",
        singer: "Raftaar x Harjas",
        path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
        image:
          "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
      }
    ],
    render:function(){
        const htmls = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperty: function(){
      Object.defineProperty(this, 'currentSong',{
        get: function(){
          return this.songs[this.currentIndex]
        }
      })
    },

    handlEvents: function(){

      const cdWidth = cd.offsetWidth


      //xu ly CD quay

      const cdThumbAnimation = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ],{
        duration:10000,
        interation: Infinity  // quay vo hang 
      })
      
      cdThumbAnimation.pause()

        //xử lý phóng to thu nhỏ
        document.onscroll = function(){
          const scollTop = window.scrollY || document.documentElement.scrollTop
          const newCdWidth = cdWidth - scollTop

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px':0
          cd.style.opacity = newCdWidth / cdWidth
        }

        //xử lý click play
        playBtn.onclick = function(){
         if(app.isPlaying){
          audio.pause()
         }else{
          audio.play()
         }

        }

        // khi song play  
        audio.onplay = function(){
          app.isPlaying = true
          player.classList.add('playing')
          cdThumbAnimation.play()
        }

        // khi song pause  
        audio.onpause = function(){
          app.isPlaying = false
          player.classList.remove('playing')
          cdThumbAnimation.pause()

        }

        // khi tiến dộ bài hát thay đổi
        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
            progress.value = progressPercent

          }
        }

        // xu lý khi tua
        progress.onchange = function(e){
          const seekTime = audio.duration /100 * e.target.value
          audio.currentTime = seekTime
        }
          // khi next song
          nextBtn.onclick = function(){
            if(app.isRandom){
              app.playRandom()
            }else{
              app.nextSong()
            }                     
            audio.play()
            app.render()   
            app.scrollToActiveSong()
          }
             // khi prev song
             prevBtn.onclick = function(){
               if(app.isRandom){
                 app.playRandom()
               }else{
                app.prevSong()
               }
              audio.play()
              app.render()   
              app.scrollToActiveSong()

            }

            //xu ly bat tac random song
            randomBtn.onclick = function(e){
              app.isRandom =  !app.isRandom
              randomBtn.classList.toggle('active', app.isRandom)
            }
            //xu lu khi phat het bai hat se chuyen bai

            audio.onended = function(){
              if(app.isRepeat){
                audio.play()
              }else{

                nextBtn.click()
              }
            }

            // xu ly lap lai mot bai hat

            repeatBtn.onclick = function(e){
              app.isRepeat =!app.isRepeat
              repeatBtn.classList.toggle('active', app.isRepeat)

            }
            // lang nghe hanh vi play Listen 
            playList.onclick = function(e){
              const songNode = e.target.closest('.song:not(.active')

              if( songNode || e.target.closest('.option')){
                //xử lý khi click vào bài hát
                if(songNode){
                  app.currentIndex = Number(songNode.dataset.index)
                  app.loadCurrentSong()
                  app.render()
                  audio.play()
                }
                if(e.target.closest('.option')){

                }
              }

            }
    },
    scrollToActiveSong: function() {
      setTimeout(() =>{
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block:'nearest',
        })
      },200)
    },

    loadCurrentSong: function(){


      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },
    nextSong: function(){
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      
      this.loadCurrentSong();

    },
   prevSong: function(){
      this.currentIndex--
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1
      }
      
      this.loadCurrentSong();

    },

    playRandom: function(){
      let newIndex
      do{
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while(newIndex === this.currentIndex)
      this.currentIndex = newIndex

      this.loadCurrentSong();
    },

    start: function(){
      // định nghĩa các thuộc tính cho object
        this.defineProperty()

        //lăng nghe / xử lý các sự kiện (DOM events)
        this.handlEvents()

        //Tải thông tin bài hác đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //render playlist
        this.render()
    }
}

app.start()