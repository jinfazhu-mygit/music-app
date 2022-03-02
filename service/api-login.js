import { jfLoginRequest } from './index';

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: (res) => {
        resolve(res.code);
      },
      fail: reject
    })
  })
}

export function codeToToken(code) {
  return jfLoginRequest.post('/login', { code });
}

export function checkToken() {
  return jfLoginRequest.post('/auth', {}, true);
}

export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: 'hello world',
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}