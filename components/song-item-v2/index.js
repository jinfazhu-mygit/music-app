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
    index: {
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
      wx.navigateTo({
        url: `/pages/music-player/index?id=${event.currentTarget.dataset.id}`,
      })
    }
  }
})
