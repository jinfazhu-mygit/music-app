import { HYEventStore } from 'hy-event-store';
import { getSongDetail, getSongLyric } from '../service/api-player';
import stringToLyric from '../utils/string-to-lyric';

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    currentSong: {},
    lyricInfos: [],
    durationTime: 0,
    currentId: 0, // 当前正在播放的歌曲id

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "", // 当前需要显示的歌词

    playModeIndex: 0, // 播放模式
    isPlaying: true
  },
  actions: {
    playMusicByIdAction(ctx, { id }) {
      if(id !== ctx.currentId) {

        ctx.currentId = id;
        // 获取歌曲数据
        getSongDetail(id).then(res => {
          ctx.currentSong = res.songs[0];
          ctx.durationTime = res.songs[0].dt;
        })
        getSongLyric(id).then(res => {
          const lyricArr = stringToLyric(res.lrc.lyric);
          console.log(lyricArr);
          // this.setData({ lyricInfos: lyricArr });
          ctx.lyricInfos = lyricArr;
        })
  
        // 播放歌曲
        audioContext.stop(); // 暂停上一首
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        // audioContext.play(); // 立即播放
        audioContext.autoplay = true; // 自动播放
      }
      this.dispatch('audioContextListenerAction');
    },

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
    },
    // 播放 暂停功能
    controllMusicPlaying(ctx) {
      ctx.isPlaying = !ctx.isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    }
  }
})

export {
  audioContext,
  playerStore
}