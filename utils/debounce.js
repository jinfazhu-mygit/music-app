export default function _debounce(fn, delay = 500, immediate = false, resCallback) { 
  let timer = null;
  let isInvoke = false; 
  function debounce(...args) {
    return new Promise((resolve, reject) => {
      // 取消上一次的定时器
      if(timer) clearTimeout(timer);
      // 是否立即执行
      if (immediate && !isInvoke) {
        const result = fn.apply(this, args);
        resolve(result); // Promise方式返回值
        if (resCallback) resCallback(result); // 回调返回值
        isInvoke = true;
      } else {
        timer = setTimeout(() => {
          const result = fn.apply(this, args);
          resolve(result); // Promise方式返回值
          if (resCallback) resCallback(result); // 回调返回值
          isInvoke = false;
        }, delay);
      }
    })
  }
  // 取消功能(初始化)
  debounce.cancel = function() {
    if(timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
  }
  
  return debounce;
}