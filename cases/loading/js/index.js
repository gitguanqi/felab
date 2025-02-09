let datas = [], // 总数据
  current = 1, // 当前页
  pages = 0, // 总页数
  total = 0, // 总数
  listElem = document.getElementById("list"), // 列表内容
  pageElem = document.getElementById("pages"); // 页数内容

// 获取列表
getList();

// 获取列表
async function getList() {
  if (datas.length) return;
  let res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  if (res.status === 200) {
    let data = sliceData(res.data);
    datas = [...data.list];
    pages = data.pages;
    total = res.data.length;
    // 显示数据
    showList();
    // 显示页数
    showPages();
  }
}

// 处理数据
function sliceData(arr, per = 10, step = 10) {
  let newArr = [],
    pages = Math.ceil(arr.length / per);
  for (let i = 0; i < arr.length; i += step) {
    let item = arr.slice(i, i + step);
    newArr.push(item);
  }
  return {
    list: newArr,
    pages,
  };
}

// 显示列表
async function showList() {
  let list = datas[current - 1];
  listElem.innerHTML = "";
  listElem.innerHTML = '<li class="loading">加载中...</li>';
  if (list && list.length) {
    let liStr = "";
    for (const item of list) {
      liStr += `
        <li>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </li>`;
    }
    setTimeout(() => {
      listElem.innerHTML = liStr;
    }, 1000);
  } else {
    listElem.innerHTML = '<li class="nodata">暂无数据</li>';
  }
}

// 显示页数
function showPages() {
  let pages = getPages(),
    pageStr = "";
  for (let i = 0; i < pages.length; i++) {
    let page = pages[i];
    pageStr += `<li><button class="page" data-id="${
      page == "..." ? "" : page
    }">${page}</button></li>`;
  }
  pageElem.innerHTML = `
    <li><button id="start" data-id="1">首页</button></li>
    <li><button id="prev">上一页</button></li>
    ${pageStr}
    <li><button id="next">下一页</button></li>
    <li><button id="end" data-id="${pages}">尾页</button></li>`;
  // 点击事件
  addClick();
}

// 获取页数
function getPages() {
  if (pages <= 7) {
    return pages;
  }
  if (current < 5) {
    return [1, 2, 3, 4, 5, "...", pages];
  } else if (current > pages - 5) {
    return [1, "...", pages - 5, pages - 4, pages - 3, pages - 2, pages - 1, pages];
  } else {
    return [1, "...", current - 2, current - 1, current, current + 1, current + 2, "...", pages];
  }
}

// 添加点击
function addClick() {
  let btns = document.querySelectorAll("#pages li button");
  for (const item of btns) {
    item.addEventListener("click", toggleList, false);
  }
}

// 切换页面
function toggleList(event) {
  let id = event.target.dataset.id,
    bid = event.target.id;
  if (id) {
    current = Number(id);
  }
  if (bid == "prev") {
    if (current <= 1) {
      current = 1;
    } else {
      current--;
    }
  } else if (bid == "next") {
    if (current >= pages) {
      current = pages;
    } else {
      current++;
    }
  }
  showPages();
  showHighLight();
  showList();
}

// 显示高亮
function showHighLight() {
  let btns = document.querySelectorAll(".page"),
    startBtn = document.getElementById("start"),
    endBtn = document.getElementById("end");
  for (const item of btns) {
    item.className = "page";
  }
  if (current == 1 && startBtn.innerText == "首页") {
    startBtn.className = "active dis";
  } else {
    startBtn.className = "";
  }
  if (current == pages && endBtn.innerText == "尾页") {
    endBtn.className = "active dis";
  } else {
    endBtn.className = "";
  }
  for (const item of btns) {
    item.className = "";
  }
  btns.forEach((v) => {
    let id = v.dataset.id;
    if (id == current) {
      v.className = "active";
    }
    if (current != 1) {
      startBtn.className = "";
    }
    if (current != pages) {
      endBtn.className = "";
    }
  });
}
