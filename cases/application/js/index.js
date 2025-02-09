// 离线检测
function getOnLine (status) {
    var info = {
        status: status || navigator.onLine,
    };
    info.statusText = info.status ? '网络已连接' : '网络未连接',

    console.log('游览器网络信息：', info);

    return info;
}

window.ononline = function () {  
    getOnLine(true);
}

window.onoffline = function () {  
    getOnLine(false);
}

getOnLine();

if (window.applicationCache) {
    console.log('支持离线缓存！');
    var appCache = window.applicationCache,
        status = appCache.status,
        statusTexts = [
            '未缓存',
            '空闲（缓存为最新状态）',
            '检查中',
            '下载中',
            '更新就绪',
            '缓存过期',
        ],
        statusText;
    statusText = statusTexts.find(function (item, index) { return index == status;  });

    console.log(appCache, statusText);

    appCache.onchecking = function () {  
        console.log('缓存配置文件检测！');
    }

    appCache.ondownloading = function () {  
        console.log('缓存下载中...');
    }
        
    appCache.oncached = function () {  
        console.log('缓存下载成功！');
    }

    appCache.addEventListener('progress', function (event) {  
        console.log('缓存更新进度：', event.loaded + '/' + event.total);
        console.log('缓存更新状态：', statusText);
    });

    appCache.onupdate = function () {  
        console.log('缓存更新中...');
    }

    appCache.addEventListener('updateready', function () {
        if (confirm('是否重新载入已更新文件？')) {
            appCache.swapCache();
            location.reload();
        }
        console.log('缓存更新完成！');
    });

    appCache.onobsolete = function () {  
        console.log('未知道文件!');
    };

    appCache.onerror = function () {  
        console.log('缓存更新失败！');
    }

    setInterval(function () {  
        appCache.update();
    })

} else {
    console.log('不支持离线缓存！');
}