// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideos } from '../../../service/api-video';
import { playerStore } from '../../../store/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrl: {},
    mvDetail: {},
    relatedMv: {},
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.getPageData(id);
  },

  // 获取页面数据
  getPageData(id) {
    // 获取mvurl
    getMVURL(id).then(res => {
      this.setData({
        mvUrl: res.data
      })
    });
    // 获取mv信息
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    });
    // 获取mv相关视频
    getRelatedVideos(id).then(res => {
      this.setData({
        relatedMv: res.data
      })
    })
  },

  onUnload: function() {
    playerStore.dispatch("controllMusicPlaying");
  }
})