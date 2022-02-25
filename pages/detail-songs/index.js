// pages/detail-songs/index.js
import { rankingStore } from '../../store/index';
import { getPlayListDetail } from '../../service/api-music';

Page({

  data: {
    ranking: "",
    songInfo: {},
    type: ""
  },

  onLoad: function (options) {
    const type = options.type;
    this.setData({ type });
    if(type === "menu") {
      const menuId = options.id;
      getPlayListDetail(menuId).then(res => {
        this.setData({ songInfo: res.playlist });
      })
    }else if(type === "rank") {
      const ranking = options.ranking;
      this.setData({ ranking });
      // 获取状态管理的榜单列表
      rankingStore.onState(this.data.ranking, this.handleRankingList);
    }
  },

  onUnload: function () {
    if(this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.handleRankingList)
    }
  },

  handleRankingList: function(res) {
    this.setData({ songInfo: res });
  }
})