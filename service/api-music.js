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

export function getSongMenu(cat="全部", limit=6, offset=0) {
  return jfRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

export function getPlayListDetail(id) {
  return jfRequest.get("/playlist/detail/dynamic", {
    id
  })
}