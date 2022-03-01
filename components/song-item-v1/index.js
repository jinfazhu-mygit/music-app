// components/song-item-v1/index.js
import { playerStore } from '../../store/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    list: { // 当前歌曲播放列表
      type: Array,
      value: []
    },
    index: { // 当前播放歌曲所在列表下标
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick: function(event) {
      // 页面跳转
      const id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      })
      // 获取当前播放歌曲列表，以及index,提交这两个状态
      playerStore.setState('currentSongList', this.properties.list);
      playerStore.setState('currentSongIndex', this.properties.index);
    }
  }
})
