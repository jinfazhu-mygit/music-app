// [00:03.456]
const RegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export default function stringToLyric(lyricString) {
  const lyricStrings = lyricString.split('\n');
  const lyricArr = [];
  for(let lyricStr of lyricStrings) {
    const time = RegExp.exec(lyricStr);
    if(!time) continue;
    let minute = time[1] * 60 * 1000;
    let second = time[2] * 1000;
    let millSecond = time[3].length === 2? time[3] * 10 : time[3] * 1;
    const totalTime = minute + second + millSecond;
    const lyric = lyricStr.replace(time[0], ""); // 替换正则匹配到的[00:03.456]为空，拿到歌词

    lyricArr.push({ time: totalTime, lyric }) // 每句歌词以对象形式放入数组内返回
  }
  return lyricArr;
}