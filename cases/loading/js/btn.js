let datas = [],
current = 1,
pages = 0,
total = 0,
listElem = document.getElementById('list'),
loadMore = document.querySelector('.loadmore'),
moreBtn = document.getElementById('more');

showList(current);

// 显示列表
async function showList (current) {
    let data = null;
    loadMore.className = 'loadmore';
    if (datas && datas.length) {
        data = {
            code: 200,
            msg: 'get_succ',
            data: {
                list: datas[current-1],
                current: current,
                pages,
                total,
            }
        }
    } else {
        data = await getList(current);
    }
    if (data.code === 200) {
        let list = data.data.list;
        if (list && list.length) {
            let liStr = '',pageStr = '';
            for (const item of list) {
                liStr += `<li>
                    <h3>${item.title}</h3>
                    <p>${item.body}</p>
                </li>`;
            }

            listElem.innerHTML += liStr;

        } else {

            listElem.innerHTML = '<li class="nodata">暂无数据<li>';
        }

        
        setTimeout(() => {
            loadMore.className = 'loadmore hide';
        }, 1000);
    }
}

// 添加点击
moreBtn.addEventListener('click', addList, false);

// 切换页面
function addList () {
    if (current < pages) {
        current+=1;
        showList(current);
    } else {
        moreBtn.innerText = '没有更多了';
    }
}

// 获取列表
async function getList (page = 1) {
    let res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    if (res.status === 200) {
        let data = sliceData(res.data);
        pages = data.pages;
        total = res.data.length;
        datas = [...data.list];
        return {
            code: 200,
            msg: 'get_succ',
            data: {
                list: data.list[page-1],
                current: page,
                pages: data.pages,
                total: list.length,
            }
        }
    }
}

// 处理数据
function sliceData (list) {  
    let newArr = [],step = 10,pages = Math.ceil(list.length/10);
    for (let i = 0; i < list.length; i+=step) {
        let item = list.slice(i, i+step);
        newArr.push(item);
    }
    return {
        list: newArr,
        pages,
    };
}