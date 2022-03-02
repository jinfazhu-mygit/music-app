import { getTopMV } from '../../service/api-video';
import { playerStore } from '../../store/index';

Page({
    data: {
        topMvs: [],
        hasMore: true
    },
    // 初始页面加载
    onLoad: async function(option) {
        this.getTopMvData(0);
    },
    // 封装请求逻辑
    getTopMvData: async function(offset) {
        if(!this.data.hasMore) return;
        wx.showNavigationBarLoading();
        const res = await getTopMV(offset);
        let mvArr = this.data.topMvs;
        if(offset === 0 ) { // 初始加载或下拉加载
            mvArr = res.data;
        }else {
            mvArr = mvArr.concat(res.data);
        }
        this.setData({ topMvs: mvArr, hasMore: res.hasMore });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },
    // 点击处理
    handleVideoItemClick: function(event) {
        const id = event.currentTarget.dataset.item.id;
        wx.navigateTo({
          url: '/packageDetail/pages/detail-video/index?id=' + id,
        })
        playerStore.dispatch("controllMusicPlaying");
    },
    // 下拉刷新
    onPullDownRefresh: async function() {
        this.getTopMvData(0);
    },
    // 触底加载更多
    onReachBottom: async function() {
        this.getTopMvData(this.data.topMvs.length);
    }
})