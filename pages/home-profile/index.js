// pages/home-profile/index.js
import { getUserInfo } from '../../service/api-login';

Page({
  data: {

  },

  onLoad: function (options) {

  },
  handleGetUserInfo: async function(event) {
    const res = await getUserInfo();
    console.log(res);
  }
})