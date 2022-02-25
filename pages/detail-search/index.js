// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from '../../service/api.search';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotTags: [],
    suggestSongs: [],
    searchValue: ""
  },

  onLoad: function (options) {
    this.getPageData();
  },
  // 数据请求
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({
        hotTags: res.result.hots
      })
    })
  },

  onUnload: function () {

  },
  // 事件处理
  handleSearchChange: function(event) {
    const detail = event.detail;
    this.setData({ searchValue: detail });
    if(!detail.length) { // 关键字为空
      this.setData({ suggestSongs: [] });
      return
    }
    getSearchSuggest(detail).then(res => {
      this.setData({
        suggestSongs: res.result.allMatch
      })
    })
  }
})