// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api-login';
import { TOKEN_KEY } from './constants/token-const';

App({
  onLaunch: async function() {
    // 1.获取设备信息
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.deviceRadio = info.screenHeight / info.screenWidth;
    // 2.让用户默认登录(获取用户openid,生成token)
    this.handleLogin();
    // 3.获取用户的信息
    wx.getUserProfile({
      desc: 'hello world',
      success: res => {
        console.log(res);
      }
    })
  },
  handleLogin: async function() {
    const token = wx.getStorageSync(TOKEN_KEY);
    if(token) { // 有token
      // 判断token是否错误或者过期
      const checkResult = await checkToken();
      // 判断session是否过期
      const isSessionExpire = await checkSession();
      if(checkResult.errCode || !isSessionExpire) {
        this.loginAction();
      }
    } else { // 无token
      this.loginAction();
    }
  },
  loginAction:async function() {
    // 1.获取登录code
    const code = await getLoginCode();
    console.log(code);
    // 2.发送code给服务器，获取token
    const result = await codeToToken(code);
    const token = result.token;
    wx.setStorageSync(TOKEN_KEY, token)
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  }
})
