// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api.search';
import debounce from '../../../utils/debounce';
import stringToNodes from '../../../utils/string-to-nodes';

const debounceGetSuggest = debounce(getSearchSuggest, 450);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotTags: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    searchValue: "",
    resultSongs: []
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
    const searchValue = event.detail;
    console.log(searchValue);
    this.setData({ searchValue: searchValue });
    if(!searchValue.length) { // 关键字为空
      this.setData({ suggestSongs: [] });
      // debounceGetSuggest.cancel();
      return
    }
    debounceGetSuggest(searchValue).then(res => {
      if(!this.data.searchValue) return;
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch;
      this.setData({ suggestSongs });
      if(!suggestSongs) return;
      // 2.转成node节点
      const suggestKeyWords = suggestSongs.map(item => item.keyword);
      const suggestSongsNodes = [];
      for( const keyword of suggestKeyWords ) { // 单行关键字
        const node = stringToNodes(keyword, searchValue);
        suggestSongsNodes.push(node);
      }
      this.setData({ suggestSongsNodes });
    })
  },
  // tag或推荐歌曲点击
  handleKeywordItemClick: function(event) {
    this.setData({
      searchValue: event.currentTarget.dataset.keyword,
      suggestSongs: []
    })
    this.handleSearchAction();
  },
  // 搜索
  handleSearchAction: function() {
    this.setData({ resultSongs: [] });
    getSearchResult(this.data.searchValue).then(res => {
      this.setData({
        resultSongs: res.result.songs
      })
    })
  },
})