// 状态管理数据
import { rankingStore } from '../../store/index';

import { getBanners } from '../../service/api-music';
import queryRect from '../../utils/query-rect';
import throtto from '../../utils/throtto';

const throttoedFn = throtto(queryRect, 20); // 节流

Page({

    /**
     * 页面的初始数据
     */
    data: {
      bannerList: [],
      bannerImageHeight: 0,
      recommendSongs: [], // 推荐歌曲列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 获取页面数据
      this.getPageData();
      // 发起共享数据的请求
      rankingStore.dispatch('getRankingDataAction');
      // 从store获取共享的数据
      rankingStore.onState('hotRanking', (res) => {
        if(!res.tracks) return;
        const recommendSongs = res.tracks.slice(0, 6);
        this.setData({ recommendSongs });
      })
    },

    // 获取网络请求
    getPageData() {
      getBanners().then(res => {
        this.setData({
          bannerList: res.banners
        })
      })
    },

    // 事件处理
    handleSearchClick: function(event) {
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },
    // 轮播图组件加载完毕，获取图片高度，来设置轮播图高度
    handleSwiperImageLoaded: function() {
      // 获取图片高度(节流后的)
      throttoedFn('.swiper-image').then(res => {
        const rect = res[0].height;
        this.setData({
          bannerImageHeight: rect
        })
      })
    }
})