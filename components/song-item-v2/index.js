import { playerStore } from '../../store/index';

// components/song-item-v2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: {},
      vlaue: Object
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
      // 跳转至播放页
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/index?id=${event.currentTarget.dataset.id}`,
      })
      // 提交播放列表
      playerStore.setState('currentSongList', this.properties.list);
      playerStore.setState('currentSongIndex', this.properties.index-1);
    }
  }
})
