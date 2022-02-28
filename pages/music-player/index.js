// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../service/api-player';
import { audioContext, playerStore } from '../../store/player-store';
// import stringToLyric from '../../utils/string-to-lyric';

const playModeNames = ["order", "repeat", "random"];

const globalData = getApp().globalData;

Page({
  data: {
    id: 0,
    currentSong: {},
    lyricInfos: [], // 歌词数组
    durationTime: 0,

    currentTime: 0,
    currentLyricIndex: 0, 
    currentLyricText: "", // 当前歌词

    currentPage: 0,
    contentHeight: 0,
    showLyric: true,
    sliderValue: 0, // 滑块值
    isSliderChanging: false, // 滑块默认不在滑动
    scrollTop: 0, // 歌词scrolltop

    playModeIndex: 0,
    playModeName: "order",

    isPlaying: true,
    isPlayingName: "pause"
  },

  onLoad: function (options) {
    const id = options.id;
    this.setData({ id });
    // 获取页面信息
    // this.getPageData(id);
    this.getPageDataByStoreAction(id);
    // 获取内容高度
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    this.setData({ contentHeight, showLyric: deviceRadio >= 2 });

    // 播放器
    // audioContext.stop(); // 暂停上一首
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // // audioContext.play(); // 立即播放
    // audioContext.autoplay = true; // 自动播放

    // 当解码完成
    // this.setupAudioContextListener();
  },

  // 获取页面数据
  // getPageData: function(id) {
  //   getSongDetail(id).then(res => {
  //     this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
  //   })
  //   getSongLyric(id).then(res => {
  //     const lyricArr = stringToLyric(res.lrc.lyric);
  //     console.log(lyricArr);
  //     this.setData({ lyricInfos: lyricArr });
  //   })
  // },

  // =============== 事件监听 ===============
  // setupAudioContextListener: function() {
  //   audioContext.onCanplay(() => {
  //     console.log('可以开始播放了');
  //     audioContext.play();
  //   })

  //   audioContext.onTimeUpdate(() => {
  //     const currentTime = audioContext.currentTime * 1000;
  //     const sliderValue = (currentTime / this.data.durationTime) * 100;
  //     // console.log(sliderValue)
  //     // 滑动过程中不更新滑块位置，不改currentTime,不滑动才更新
  //     if(!this.data.isSliderChanging) { 
  //       this.setData({ currentTime, sliderValue });
  //     }
  //     // 根据当前时间匹配歌词
  //     for(let i = 0; i < this.data.lyricInfos.length; i++ ) {
  //       if(currentTime < this.data.lyricInfos[i].time) {
  //         if(this.data.currentLyricIndex !== i-1) {
  //           this.setData({ 
  //             currentLyricText: this.data.lyricInfos[i-1].lyric, 
  //             currentLyricIndex: i-1,
  //             scrollTop: (i-1) * 35
  //           })
  //         }
  //         break;
  //       }
  //     }
  //   })
  // },

  // =============== 事件处理 ===============
  handleSwiperChange: function(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },
  // =============== 滑块 ===============
  handleSliderChange: function(event) {
    const occupy = event.detail.value;
    const currentTime = this.data.durationTime * occupy / 100;
    audioContext.stop();
    audioContext.seek(currentTime / 1000);
    this.setData({ currentTime, sliderValue: occupy, isSliderChanging: false });
  },
  handleSliderChanging: function(event) {
    const occupy = event.detail.value;
    const currentTime = (occupy / 100) * this.data.durationTime;
    this.setData({ isSliderChanging: true, currentTime });
  },

  handleLeftClick: function() {
    wx.navigateBack();
  },

  handleModeClick: function() {
    let playIndex = this.data.playModeIndex + 1;
    if(playIndex === 3) playIndex = 0;
    playerStore.setState("playModeIndex", playIndex);
  },
  // 暂停播放按钮
  handlePauseClick: function() {
    // this.setData({ isPlaying: !this.data.isPlaying });
    // this.data.isPlayingName === "pause" ? this.setData({ isPlayingName: "resume" }) : this.setData({ isPlayingName: "pause" });
    // playerStore.setState('isPlaying', !this.data.isPlaying);
    playerStore.dispatch("controllMusicPlaying");
  },
  // 请求数据
  getPageDataByStoreAction: function(id) {
    playerStore.dispatch("playMusicByIdAction", { id });
    // 获取网络请求相关数据
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], ({ currentSong, durationTime, lyricInfos }) => {
      if (currentSong) this.setData({ currentSong });
      if (durationTime) this.setData({ durationTime });
      if (lyricInfos) this.setData({ lyricInfos });
    })
    // 获取audioContext相关数据
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"],({ currentTime, currentLyricIndex, currentLyricText }) => {
      if( currentLyricIndex ) {
        this.setData({ currentLyricIndex, scrollTop: currentLyricIndex * 35 })
      }
      if(currentLyricText) {
        this.setData({ currentLyricText });
      }
      if(currentTime) {
        if(!this.data.isSliderChanging) {
          this.setData({ sliderValue: currentTime / this.data.durationTime * 100 });
        }
        this.setData({ currentTime });
      }
    })
    // 获取播放模式
    playerStore.onState('playModeIndex', (playModeIndex) => {
      if( playModeIndex !== undefined ) {
        this.setData({ playModeIndex: playModeIndex, playModeName: playModeNames[playModeIndex] });
      }
      
    })
    playerStore.onState('isPlaying', this.handleIsPlaying)
  },
  handleIsPlaying: function(isPlaying) {
    if( isPlaying !== undefined ) {
      console.log(isPlaying);
      this.setData({ isPlaying, isPlayingName: isPlaying ? 'pause' : 'resume' });
    }
  },

  onUnload: function () {
    playerStore.offState('isPlaying', this.handleIsPlaying);
  },
})