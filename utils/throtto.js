export default function _throttle(fn, interval, options = { leading: true, trailing: false }) { // 默认第一次触发，最后一次不触发
  let lastTime = 0;
  const { leading, trailing } = options;
  let timer = null;
  
  function throttle(...args) {
    return new Promise((resolve, reject) => {
      // 获取当前事件触发的时间
      const nowTime = new Date().getTime();
      if(!leading && lastTime === 0) lastTime = nowTime; // 如果第一次不触发
      // 计算还要多长时间触发执行函数
      const remainTime = interval - (nowTime - lastTime);
      if(remainTime <= 0) {
        if(timer) {
          clearTimeout(timer);
          timer = null;
        }

        const result = fn.apply(this, args);
        resolve(result);
        lastTime = nowTime; // 重置初始时间(保留上次触发时间)
        return;
      }

      // 最后触发
      if(trailing && !timer) {
        timer = setTimeout(() => {
          timer = null;
          lastTime = !leading? 0 : new Date().getTime();
          const result = fn.apply(this, args);
          resolve(result);
        }, remainTime);
      }
    })
  }
  
  throttle.cancel = function() {
    if(timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  }
  return throttle;
}