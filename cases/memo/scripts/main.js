/*
 * @Author: Mr.Mark  
 * @Date: 2019-08-13 20:37:40 
 * @Last Modified by: fed.Mr.Mark 
 * @Last Modified time: 2019-08-18 18:12:25
 */
// memo
// 获取dom
function getElem(name) {
    return document.querySelector(name);
}

// 添加事件
function addEvent(elem, eventName, callback) {
    if (elem === null) {
        return;
    }
    elem.addEventListener(eventName, callback, false);
}

// 存入本地存储
function setLocalStor(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStor(key) {
    return JSON.parse(localStorage.getItem(key));
}

// 所有元素
let toDo = getElem('#todo');
let toDoBtn = getElem('#todo-btn');
let list = getElem('.todo-list');
let listTotal = getElem('.todo-total');
let theme = getElem('#theme');
let todos = [];
let todosStor = getLocalStor('todolist');
if (todosStor === null || todosStor.length===0) {
  setLocalStor('todolist', todos);
} else {
  todos = todosStor; 
}
let themeColor = getLocalStor('theme');
if (themeColor) {
    toggleColor(themeColor);
} else {
    toggleColor('#000');
}


// 初始化
render();

// 监听输入
addEvent(toDoBtn, 'click', addToDo);

// 添加事项
function addToDo(e) {
    let nameVal = '';
    if (e.type == 'click') {
        nameVal = toDo.value;
    }
    if (nameVal == '') {
        alert('请输入待办事项！');
        return false;
    }
    let isHas = false;
    if (todos.length == 0) {
        todos.push({
            id: Date.parse(new Date()),
            name: nameVal,
            completed: false,
        });
    } else {
        todos.map(v => {
            if (nameVal == v.name) {
                isHas = true;
            }
        });
        if (!isHas) {
            todos.push({
                id: Date.parse(new Date()),
                name: nameVal,
                completed: false,
            });
        }
    }
    console.log('add');
    setLocalStor('todolist', todos);
    toDo.value = '';
    render();
}

// 编辑事项
function editToDo(e, id) {
    let content = e.target.innerText;
    todos.map(v => {
        if (id == v.id) {
            v.name = content;
        }
    });
    console.log('edit');
    setLocalStor('todolist', todos);
    render();
}

function delToDo(id) {
    todos.forEach((v, i) => {
        if (id == v.id) {
            todos.splice(i, 1);
        }
    });
    console.log('del');
    setLocalStor('todolist', todos);
    render();
}

// 完成事项
function completeToDo(id, status) {
    todos.map(v => {
        if (id == v.id) {
            v.completed = status;
        }
    });
    console.log('com');
    setLocalStor('todolist', todos);
    render();
}

// 渲染列表
function render() {
    let str = '';
    let total = '';
    let completeTotal = 0;
    let arr = getLocalStor('todolist');
    if (arr) {
        for (const item of arr) {
            if (item.completed) {
                completeTotal++;
            }
            str += `<li><span class="todo-edit ${item.completed ? 'todo-completed' : ''}" contenteditable="true" onblur="javascript:editToDo(event,'${item.id}');">${item.name}</span><button class="todo-complete" onclick="javascript:completeToDo('${item.id}', true);"><i class="fa fa-check-circle"></i></button><button class="todo-cancel" onclick="javascript:completeToDo('${item.id}', false);"><i class="fa fa-undo"></i></button><button class="todo-del" onclick="javascript:delToDo('${item.id}');"><i class="fa fa-trash-alt"></i></button></li>`;
        }
        if (arr.length === 0) {
            str = `<li>暂无数据</li>`;
            total = '';
        } else {
            total = `<li>总计<strong>${arr.length}</strong>个任务，已完成<strong>${completeTotal}</strong>个，未完成<strong>${arr.length-completeTotal}</strong>个。</li>`;
        }
        list.innerHTML = str;
        listTotal.innerHTML = total;
    }
}

// 切换主题
addEvent(theme, 'change', changeTheme);

function changeTheme(e) {
    let val = e.target.value;
    if (val) {
        setLocalStor('theme', val);
        toggleColor(val);
    }
}
function toggleColor (color) {
    theme.value = color;
    toDo.style.border = `2px solid ${color}`;
    toDoBtn.style.border = `2px solid ${color}`;
    toDoBtn.style.backgroundColor = `${color}`;
    list.style.border = `1px solid ${color}`;
    listTotal.style.borderLeft = `3px solid ${color}`;
}