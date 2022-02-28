// pages/music-player/index.js
import { getSongDetail, getSongLyric } from '../../service/api-player';
import { audioContext } from '../../store/player-store';
import stringToLyric from '../../utils/string-to-lyric';

const globalData = getApp().globalData;

Page({
  data: {
    id: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    showLyric: true,
    durationTime: 0,
    currentTime: 0,
    currentLyricText: "", // 当前歌词
    currentLyricIndex: 0, 
    sliderValue: 0, // 滑块值
    isSliderChanging: false, // 滑块默认不在滑动
    lyricInfos: [], // 歌词数组
  },

  onLoad: function (options) {
    const id = options.id;
    this.setData({ id });
    // 获取页面信息
    this.getPageData(id);
    // 获取内容高度
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    this.setData({ contentHeight, showLyric: deviceRadio >= 2 });
    // 播放器
    audioContext.stop(); // 暂停上一首
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // audioContext.play(); // 立即播放
    audioContext.autoplay = true; // 自动播放
    // 当解码完成
    this.setupAudioContextListener();
  },

  getPageData: function(id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
    getSongLyric(id).then(res => {
      const lyricArr = stringToLyric(res.lrc.lyric);
      console.log(lyricArr);
      this.setData({ lyricInfos: lyricArr });
    })
  },
  // =============== 事件监听 ===============
  setupAudioContextListener: function() {
    audioContext.onCanplay(() => {
      console.log('可以开始播放了');
      audioContext.play();
    })

    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000;
      const sliderValue = (currentTime / this.data.durationTime) * 100;
      // console.log(sliderValue)
      // 滑动过程中不更新滑块位置，不改currentTime,不滑动才更新
      if(!this.data.isSliderChanging) { 
        this.setData({ currentTime, sliderValue });
      }
      // 根据当前时间匹配歌词
      for(let i = 0; i < this.data.lyricInfos.length; i++ ) {
        if(currentTime < this.data.lyricInfos[i].time) {
          if(this.data.currentLyricIndex !== i-1) {
            console.log(this.data.lyricInfos[i-1].lyric);
            this.setData({ currentLyricText: this.data.lyricInfos[i-1].lyric, currentLyricIndex: i-1 })
          }
          break;
        }
      }
    })
  },

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

  onUnload: function () {

  },
})