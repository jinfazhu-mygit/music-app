import { TOKEN_KEY } from '../constants/token-const'; // 'token'
const token = wx.getStorageSync(TOKEN_KEY);

const BASE_URL = 'http://123.207.32.32:9001';
// 用于获取登录的接口地址
const LOGIN_BASE_URL = "http://123.207.32.32:3000";

class JFRequest {
  constructor(baseUrl, authHeader = {}) {
    this.baseUrl = baseUrl;
    this.authHeader = authHeader;
  }
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header; // 合并token和header,一起加入至请求头

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        method: method,
        data: params,
        header: finalHeader,
        success: function(res) {
          resolve(res.data);
        },
        fail: reject
      })
    })
  }

  get(url, params, isAuth = false, header) {
    return this.request(url, 'GET', params, isAuth, header);
  }

  post(url, data, isAuth = false, header) {
    return this.request(url, 'POST', data, isAuth, header);
  }
}

const jfRequest = new JFRequest(BASE_URL);
const jfLoginRequest = new JFRequest(LOGIN_BASE_URL, { token }); // 取得的token放入类内
export default jfRequest;
export {
  jfLoginRequest
}