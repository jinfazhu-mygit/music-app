import jfRequest from './index';

export function getSearchHot() {
  return jfRequest.get('/search/hot');
}

export function getSearchSuggest(keywords) {
  return jfRequest.get('/search/suggest',{ keywords, type: 'mobile' });
}