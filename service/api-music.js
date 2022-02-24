import jfRequest from './index';

export function getBanners() {
  return jfRequest.get('/banner', {
    type: 2
  })
}

export function getRankings(idx) {
  return jfRequest.get('/top/list', {
    idx
  })
}