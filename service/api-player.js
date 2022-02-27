import jfRequest from './index';

export function getSongDetail(ids) {
  return jfRequest.get('/song/detail',{ ids });
}

export function getSongLyric(id) {
  return jfRequest.get('/lyric', { id });
}