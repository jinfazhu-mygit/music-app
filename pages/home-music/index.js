// 状态管理数据
import { rankingStore, rankingMap, playerStore } from '../../store/index';

import { getBanners, getSongMenu } from '../../service/api-music';
import queryRect from '../../utils/query-rect';
import throtto from '../../utils/throtto';

const throttoedFn = throtto(queryRect, 1000, { trailing: true }); // 节流

Page({

    /**
     * 页面的初始数据
     */
    data: {
      bannerList: [],
      bannerImageHeight: 0,
      hotSongMenu: [],
      chineseSongMenu: [],
      recommendSongs: [], // 推荐歌曲列表
      rankings: { 0: {}, 2: {}, 3: {} }, // 歌曲榜单

      currentSong: {},
      isPlaying: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 获取页面数据
      this.getPageData();
      // 发起共享数据的请求(推荐歌曲列表)
      rankingStore.dispatch('getRankingDataAction');
      // 从store获取共享的数据
      
      this.setupPlayerStoreListener();
    },

    // 获取网络请求
    getPageData() {
      getBanners().then(res => {
        this.setData({
          bannerList: res.banners
        })
      })
      getSongMenu().then(res => {
        this.setData({
          hotSongMenu: res.playlists
        })
      })
      getSongMenu("华语").then(res => {
        this.setData({
          chineseSongMenu: res.playlists
        })
      })
    },

    // 事件处理
    handleSearchClick: function(event) {
        wx.navigateTo({
          url: '/packageDetail/pages/detail-search/index',
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
    },

    handleMoreClick: function() {
      this.navigateToDetailSongsPage("hotRanking");
    },

    handleRankingClick: function(event) {
      const index = event.currentTarget.dataset.idx;
      const rankingName = rankingMap[index];
      this.navigateToDetailSongsPage(rankingName);
    },

    handleBtnClick: function() {
      playerStore.dispatch("controllMusicPlaying");
    },
    playBarClick: function() {
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/index?id=${this.data.currentSong.id}`,
      })
    },

    // 下拉刷新
    onPullDownRefresh: function() {
      this.getPageData();
      rankingStore.dispatch('getRankingDataAction');
      this.setupPlayerStoreListener();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },

    navigateToDetailSongsPage: function(rankingName) {
      wx.navigateTo({
        url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
      })
    },

    onUnload: function() {
    },

    getRankingHandler: function(idx) {
      return (res) => {
        if(Object.keys(res).length <= 0) return;
        const rankingName = res.name;
        const coverUrl = res.coverImgUrl;
        const songList = res.tracks.slice(0, 3);
        const rankingObject = { rankingName, coverUrl, songList };
        const rankingList = { ...this.data.rankings, [idx]:rankingObject };
        this.setData({
          rankings: rankingList
        })
      }
    },

    setupPlayerStoreListener: function() {
      // 排行榜监听
      rankingStore.onState('hotRanking', (res) => {
        if(!res.tracks) return;
        const recommendSongs = res.tracks.slice(0, 6);
        this.setData({ recommendSongs });
      })
      rankingStore.onState('newRanking', this.getRankingHandler(0));
      rankingStore.onState('originRanking', this.getRankingHandler(2));
      rankingStore.onState('upRanking', this.getRankingHandler(3));
      // 播放器监听
      playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
        if(currentSong) this.setData({ currentSong });
        if(isPlaying !== undefined) this.setData({ isPlaying })
      })
    }
})