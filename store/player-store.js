import { HYEventStore } from 'hy-event-store';
import { getSongDetail, getSongLyric } from '../service/api-player';
import stringToLyric from '../utils/string-to-lyric';

// const audioContext = wx.createInnerAudioContext(); // 前台播放，一旦退出则停止播放
const audioContext = wx.getBackgroundAudioManager(); // 背景播放，可以在后台播放，控制栏也可看到相应的信息

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],
    currentId: 0, // 当前正在播放的歌曲id

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "", // 当前需要显示的歌词

    playModeIndex: 0, // 播放模式
    isPlaying: false,

    currentSongList: [], // 当前歌曲播放列表
    currentSongIndex: 0 // 当前播放歌曲所在列表下标
  },
  actions: {
    // 根据id播放相应的歌曲
    playMusicByIdAction(ctx, { id, isRefresh = false }) {
      if(id == ctx.currentId && !isRefresh ) {
        this.dispatch('audioContextListenerAction');
        return;
      }
      ctx.currentId = id;
      // 修改播放状态
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";
      ctx.isPlaying = true;
      
      // 播放歌曲
      audioContext.stop(); // 暂停上一首
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id;
      // audioContext.play(); // 立即播放
      audioContext.autoplay = true; // 自动播放
      // 获取歌曲数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      })
      getSongLyric(id).then(res => {
        const lyricArr = stringToLyric(res.lrc.lyric);
        console.log(lyricArr);
        // this.setData({ lyricInfos: lyricArr });
        ctx.lyricInfos = lyricArr;
      })
      if(ctx.isFirstPlay) {
        this.dispatch('audioContextListenerAction');
        ctx.isFirstPlay = false;
      }
    },
    // audioContext相关
    audioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        console.log('可以开始播放了');
        audioContext.play();
      })
  
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000;
        ctx.currentTime = currentTime;
        // 根据当前时间匹配歌词
        for(let i = 0; i < ctx.lyricInfos.length; i++ ) {
          if(currentTime < ctx.lyricInfos[i].time) {
            if(ctx.currentLyricIndex !== i-1) {
              ctx.currentLyricText = ctx.lyricInfos[i-1].lyric;
              ctx.currentLyricIndex = i-1;
            }
            break;
          }
        }
      })

      audioContext.onEnded(() => {
        this.dispatch("playMusicAction", true);
      })

      // 播放状态控制
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false;
      })
    },

    // 播放 暂停功能
    controllMusicPlaying(ctx) {
      ctx.isPlaying = !ctx.isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },
    // 切换音乐
    playMusicAction(ctx, isNext = true) {
      let index = ctx.currentSongIndex;
      switch(ctx.playModeIndex) {
        case 0: // 循环播放
          isNext ? index += 1 :index -= 1;
          if(index === ctx.currentSongList.length) index = 0;
          if(index === -1) index = ctx.currentSongList.length-1;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          const randomNumber = Math.floor(Math.random() * ctx.currentSongList.length)
          index = randomNumber;
          break;
      }
      // 随机到相同歌曲
      if(ctx.playModeIndex === 2 && index === ctx.currentSongIndex) this.dispatch("playNextMusicAction");
      // 获取相应歌曲进行播放
      ctx.currentSongIndex = index;
      const nextSong = ctx.currentSongList[index];
      this.dispatch("playMusicByIdAction", { id: nextSong.id, isRefresh: true });
    },
  }
})

export {
  audioContext,
  playerStore
}