import jfRequest from './index';

export function getTopMV(offset, limit = 10) {
  return jfRequest.get('/top/mv', { offset, limit })
}

/** 获取mv播放
 * @param {number} id
 */
export function getMVURL(id) {
  return jfRequest.get('/mv/url', {id});
}
// 获取mv相关信息
export function getMVDetail(mvid) {
  return jfRequest.get('/mv/detail', {
    mvid
  })
}
// 获取mv相关视频
export function getRelatedVideos(id) {
  return jfRequest.get('/related/allvideo', { id })
}