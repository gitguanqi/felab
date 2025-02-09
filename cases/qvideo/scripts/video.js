/*
 * @Author: Mr.Mark  
 * @Date: 2019-08-03 13:55:30 
 * @Last Modified by: fed.Mr.Mark 
 * @Last Modified time: 2019-08-03 16:10:41
 */
/* qvideo视频播放器 */
/*
 * @Author: Mr.Mark  
 * @Date: 2019-08-03 12:21:38 
 * @Last Modified by: fed.Mr.Mark 
 * @Last Modified time: 2019-08-03 13:50:06
 */
// Qvideo播放器js
(function () {
    // 定义构造函数Qvideo
    function Qvideo (
        qVideoBox,
        progress,
        currentProgress,
        play,
        playIcon,
        reload,
        startTime,
        endTime,
        volumeBtn,
        volumeIcon,
        volumePro,
        volumeCur,
        fullscreenBtn,
        vloading,
    ) {
        this.qVideoBox = qVideoBox;
        this.progress = progress;
        this.currentProgress = currentProgress;
        this.play = play;
        this.playIcon = playIcon;
        this.reload = reload;
        this.startTime = startTime;
        this.endTime = endTime;
        this.volumeBtn = volumeBtn;
        this.volumeIcon = volumeIcon;
        this.volumePro = volumePro;
        this.volumeCur = volumeCur;
        this.fullscreenBtn = fullscreenBtn;
        this.vloading = vloading;
        this.total = 0;
        this.init();
    }

    //初始化
    Qvideo.prototype.init = function () {
        this.showLoad();
        this.showErrorLoad();
        this.showWait();
        this.showPlaying();
        this.videoPlay();
        this.videoLoad();
        this.changeProgress();
        this.videoMuted();
        this.changeVolProgress();
        this.videoUpdate();
        this.showFullScreen();
    }

    // 秒转换成时间格式
    Qvideo.prototype.secondToTime = function (second) {
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
        return res;
    }

    // dom操作
    Qvideo.prototype.getDom = function (name) {
        return document.querySelector(name);
    }

    // dom操作
    Qvideo.prototype.getDomAll = function (name) {
        return document.querySelectorAll(name);
    }

    // 添加事件
    Qvideo.prototype.addEvent = function (eventName, elem, callback) {
        elem.addEventListener(eventName, callback, false);
    }

    // 监听错误
    Qvideo.prototype.showLoad = function () {
        var _this = this;
        _this.qVideoBox.addEventListener('canplaythrough', function () {  
            _this.vloading.classList = 'qvideo-loading-box hide';
        }, false);
    }
    
    Qvideo.prototype.showErrorLoad = function () {
        var _this = this;
        _this.qVideoBox.addEventListener('error', function () {
            _this.vloading.classList = 'qvideo-loading-box show';
        }, false)
    }

    // 等待中
    Qvideo.prototype.showWait = function () {
        var _this = this;
        _this.qVideoBox.addEventListener('waiting', function () {
            _this.vloading.classList = 'qvideo-loading-box show';
            _this.videoPlay();
        }, false)
    }

    Qvideo.prototype.showPlaying = function () {
        var _this = this;
        _this.qVideoBox.addEventListener('playing', function () {
            _this.vloading.classList = 'qvideo-loading-box hide';
            _this.videoPlay();
        }, false)
    }
    

    //视频播放/暂停
    Qvideo.prototype.videoPlay = function () {
        var _this = this;
        _this.play.addEventListener('click', function () {  
            if (_this.qVideoBox.paused) {
                _this.playIcon.classList = 'fa fa-pause';
                _this.qVideoBox.play();
                _this.total = _this.qVideoBox.duration;
                _this.endTime.innerText = _this.secondToTime(_this.total);
            } else {
                _this.playIcon.classList = 'fa fa-play';
                _this.qVideoBox.pause();
            }
        }, false);
        
    }

    // 视频重载
    Qvideo.prototype.videoLoad = function () {
        var _this = this;
        _this.reload.addEventListener('click', function () {  
            _this.qVideoBox.load();
            _this.playIcon.classList = 'fa fa-play';
        }, false);
    }

    // // 点击切换进度
    Qvideo.prototype.changeProgress = function () {
        var _this = this;
        _this.progress.addEventListener('click', function (e) {  
            let percent = e.offsetX / e.target.offsetWidth;
            _this.currentProgress.style.width = percent * 100 + '%';
            _this.qVideoBox.currentTime = _this.total * percent;
            _this.startTime.innerText = _this.secondToTime(_this.qVideoBox.currentTime);
            _this.qVideoBox.play();
            _this.playIcon.classList = 'fa fa-pause';
        }, false);
    }

    // 音量/静音
    Qvideo.prototype.videoMuted = function () {
        var _this = this;
        _this.volumeBtn.addEventListener('click', function () {  
            _this.qVideoBox.muted = _this.qVideoBox.muted ? false : true;
            _this.volumeIcon.classList = _this.qVideoBox.muted ? 'fa fa-volume-mute' : 'fa fa-volume-up';
        }, false);
    }

    // 点击切换进度
    Qvideo.prototype.changeVolProgress = function () {
        var _this = this;
        _this.volumePro.addEventListener('click', function (e) {  
            let percent = e.offsetX / e.target.offsetWidth;
            _this.volumeCur.style.width = percent * 100 + '%';
            _this.qVideoBox.volume = percent;
            _this.volumeIcon.classList = Math.abs(_this.qVideoBox.volume) == 0 ? 'fa fa-volume-mute' : 'fa fa-volume-up';
        }, false);
    }

    //显示时间
    Qvideo.prototype.videoUpdate = function () {
        var _this = this;
        _this.qVideoBox.addEventListener('timeupdate', function () {
            _this.currentTime = _this.qVideoBox.currentTime;
            _this.currentProgress.style.width = (_this.currentTime / _this.total) * 100 + '%';
            _this.startTime.innerText = _this.secondToTime(_this.currentTime);
            if (_this.qVideoBox.ended) {
                _this.playIcon.classList = 'fa fa-play';
            }
        }, false);
    }

    // 全屏显示
    Qvideo.prototype.showFullScreen = function () {
        var _this = this;
        _this.fullscreenBtn.addEventListener('click', function () {   
            _this.qVideoBox.webkitRequestFullScreen();
        }, false);
    }

    window.$qvideo = window.$qv = Qvideo;

})()