let lrcList = document.querySelector('.lyric-ls'),
player = document.querySelector('#music-player'),
playBtn = document.querySelector('.qm-play'),
pauseBtn = document.querySelector('.qm-pause'),
startTime = document.querySelector('#startTime'),
endTime = document.querySelector('#endTime'),
progressBar = document.querySelector('#music-progress-bar i'),
playStatus = false;

getLyric();

// 获取歌词
async function getLyric () {  
    let data = await axios.get('../../../assets/data/music/lrh-mq.lrc');
    let lrcs = parseLyric(data.data);
    localStorage.setItem('lyrcis', JSON.stringify(lrcs));
    showLyric(lrcs);
}

// 解析歌词
function parseLyric(data) {
    let lrc = {
        ti: '', // 歌名
        ar: '', // 歌手
        al: '', // 专辑
        by: '', // 歌词作者
        offset: 0, // 时间毫秒，调整歌词位置
        ms: [] // 歌词{t:时间，c:歌词}
    }
    if (data.length === 0) return;
    let lrcs = data.split('\n');
    for (let key in lrcs) {
        lrcs[key] = lrcs[key].replace(/(^\s*)|(\s*$)/g, '');
        let t = lrcs[key].substring(lrcs[key].indexOf("[") + 1, lrcs[key].indexOf("]"));
        let s = t.split(":");
        if (isNaN(parseInt(s[0]))) { // 非数值
            for (const lKey in lrc) {
                if (lKey !== 'ms' &&
                    lKey == s[0].toLowerCase()) {
                    lrc[lKey] = s[1];
                }
            }
        } else {
            let arr = lrcs[key].match(/\[(\d+:.+?)\]/g); // 时间
            let start = 0;
            for (const k in arr) {
                start += arr[k].length; // 歌词位置
            }
            let content = lrcs[key].substring(start); // 歌词内容
            for (const k in arr) {
                let t = arr[k].substring(1, arr[k].length - 1);
                let s = t.split(":");
                lrc.ms.push({
                    t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                    c: content,
                })
            }
        }
    }
    lrc.ms.sort(function (a, b) {
        return a.t - b.t;
    })
    return lrc;
}

// 显示歌词
function showLyric (lrc) {
    let lrcStr = '';
    for (const item of lrc.ms) {
        lrcStr += `<li>${item.c}</li>`;
    }
    lrcList.innerHTML = lrcStr;
}

// 播放暂停
playBtn.addEventListener('click', playSong, false);
pauseBtn.addEventListener('click', playSong, false);
player.addEventListener('timeupdate', getTime, false);

// 播放歌曲
function playSong () {
    if (!playStatus) {
        player.play();
        playBtn.classList.remove('active');
        pauseBtn.classList.add('active');
    } else {
        player.pause();
        playBtn.classList.add('active');
        pauseBtn.classList.remove('active');
    }
    playStatus = !playStatus;
}

// 获取时间
function getTime (e) {  
    let currentTime = player.currentTime || e.timeStamp / 1000;
    startTime.innerText = calcTimeStr(currentTime).m;
    let precent = (currentTime / player.duration) * 100;
    progressBar.style.width = precent+'%';
    if (endTime && endTime.innerText === '00:00') {
        endTime.innerText = calcTimeStr(player.duration).m;
    }
    showLyricPos(currentTime);
}

// 计算时间
// 计算时间字符串
function calcTimeStr(second) {
    let s = 0;
    let m = 0;
    let h = 0;
    let sNum = second % 60;
    let res = '';
    if (second < 3600) {
        s = sNum;
        m = parseInt(second / 60);
        h = 0;
    } else {
        let mNum = second % 3600;
        if (mNum % 60 < 60) {
            s = mNum % 60;
            m = parseInt(mNum / 60)
        }
        m = parseInt(mNum / 60);
        h = parseInt(second / 3600);
    }
    s = s > 10 ? parseInt(s) : '0' + parseInt(s);
    m = m > 10 ? m : '0' + m;
    h = h > 10 ? h : '0' + h;
    res = h + ':' + m + ':' + s;
    return {
        h: res,
        m: m + ':' + s,
    };
}

// 歌词高亮
function showLyricPos (time) {
    let lyrcis = localStorage.getItem('lyrcis'), 
    lrcItem = document.querySelectorAll('.lyric-ls li');
    lyrcis = JSON.parse(lyrcis).ms;
    let index = 0;
    for (let i = 0; i < lyrcis.length; i++) {
        let item = lyrcis[i];
        let diff = time - item.t;
        if (diff >= 0 && diff < 1) {
            index = i;
            for (const item of lrcItem) {
                item.className = '';
            }
            lrcItem[i].className = 'active';
            let lyrTop = lrcItem[i].offsetTop;
            let midTop = lrcList.offsetHeight / 2;
            let allowLineNum = midTop / 36;
            let diffTop = lyrTop - midTop;
            if (i >= allowLineNum && diffTop > 0) {
                lrcList.scrollTop = diffTop;
            } else {
                lrcList.scrollTop = 0;
            }
        }
    }
}

