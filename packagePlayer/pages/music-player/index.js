// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../service/api-player';
import { audioContext, playerStore } from '../../../store/player-store';
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
    isPlayingName: "pause",

    currentSongList: [], // 当前歌曲播放列表
    currentSongIndex: 0 // 当前播放歌曲所在列表下标
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
    // audioContext.pause();
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
  // 上一首下一首
  handlePrevClick: function() {
    playerStore.dispatch("playMusicAction", false);
  },
  handleNextClick: function() {
    playerStore.dispatch("playMusicAction");
  },
  // 请求数据
  getPageDataByStoreAction: function(id) {
    playerStore.dispatch("playMusicByIdAction", { id });
    // 获取网络请求相关数据
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleRequestCallback);
    // 获取audioContext相关数据
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], this.handleAudioContext);
    // 获取播放模式
    playerStore.onStates(['playModeIndex', 'isPlaying'], this.handlePlayMode);
    // 获取播放列表以及所在下标
    playerStore.onStates([ 'currentSongList', 'currentSongIndex' ], this.handlePlayList);
  },
  // 网络请求数据相关回调
  handleRequestCallback: function({ currentSong, durationTime, lyricInfos }) {
    if (currentSong) this.setData({ currentSong });
    if (durationTime) this.setData({ durationTime });
    if (lyricInfos) this.setData({ lyricInfos });
  },
  // audioContext相关回调
  handleAudioContext: function({ currentTime, currentLyricIndex, currentLyricText }) {
    if( currentLyricIndex ) {
      this.setData({ currentLyricIndex, scrollTop: currentLyricIndex * 35 })
    }
    if(currentLyricText) {
      console.log('1231')
      this.setData({ currentLyricText });
    }
    if(currentTime) {
      if(!this.data.isSliderChanging) {
        this.setData({ sliderValue: currentTime / this.data.durationTime * 100 });
      }
      this.setData({ currentTime });
    }
  },
  // 播放模式相关回调
  handlePlayMode: function({playModeIndex, isPlaying}) {
    if( playModeIndex !== undefined ) {
      this.setData({ playModeIndex: playModeIndex, playModeName: playModeNames[playModeIndex] });
    }
    if( isPlaying !== undefined ) {
      console.log(isPlaying);
      this.setData({ isPlaying, isPlayingName: isPlaying ? 'pause' : 'resume' });
    }
  },
  // 播放列表相关回调
  handlePlayList: function({ currentSongList, currentSongIndex }) {
    if(currentSongList !== undefined) { this.setData({ currentSongList }); }
    if(currentSongIndex !== undefined) { this.setData({ currentSongIndex }); }
  },

  onUnload: function () {
    playerStore.offStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleRequestCallback);
    playerStore.offStates(['playModeIndex', 'isPlaying'], this.handlePlayMode);
    playerStore.offStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], this.handleAudioContext);
    playerStore.offStates([ 'currentSongList', 'currentSongIndex' ], this.handlePlayList);
  },
})