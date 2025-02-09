class Note {
  todos: any[];
  toDo: Element;
  toDoBtn: Element;
  list: Element;
  listTotal: Element;
  theme: Element;
  constructor (toDo:Element,toDoBtn:Element,list:Element,listTotal:Element,theme:Element) {
    this.toDo = toDo;
    this.toDoBtn = toDoBtn;
    this.list = list;
    this.listTotal = listTotal;
    this.theme = theme;
    this.todos = [];
    this.initNote();
  }

  initNote () {
    this.setLocalStor('todolist', this.todos);
    this.render();
    this.addEvent(this.theme, 'change', this.toggleTheme);
  }

  // 添加todo
  addToDo (id: string,name: string,completed: boolean) {
    let noteInfo = {
      id,
      name,
      completed
    }
    if (this.todos.length === 0) {
      this.todos.push(noteInfo)
    } else {
      let isHas:boolean = false;
      this.todos.map(v => {
        if (name == v.name) {
          isHas = true;
        }
      });
      if (!isHas)  {
        this.todos.push(noteInfo);
      }
    }
    this.setLocalStor('todolist', this.todos);
    this.render();
  }

  // 修改todo
  editToDo (id:string, content:string) {
    this.todos.map(v => {
      if (id == v.id) {
        v.name = content;
      }
    });
    this.setLocalStor('todolist', this.todos);
    this.render();
  }

  // 删除todo
  delToDo (id:string) {
    this.todos.forEach((v,i) => {
      if (id == v.id) {
        this.todos.splice(i,1);
      }
    });
    this.setLocalStor('todolist', this.todos);
    this.render();
  }

  // 完成todo completed
  completeToDo (id:string, status: boolean) {
    this.todos.map(v => {
      if (id == v.id) {
        v.completed = status;
      }
    });
    this.setLocalStor('todolist', this.todos);
    this.render();
  }

  // 渲染todo
  render ():void {
    let str = '';
    let total = '';
    let completeTotal = 0;
    let arr = this.getLocalStor('todolist');
    if (arr) {
      for (const item of arr) {
        if (item.completed) {
          completeTotal++;
        }
        str += `<li><span class="todo-edit ${item.completed ? 'todo-completed' : ''}" contenteditable="true" onblur="javascript:editToDo(event,'${item.id}');">${item.name}</span>
          <button class="todo-complete" onclick="javascript: noteEg.completeToDo('${item.id}', true);">
            <i class="fa fa-check-circle"></i>
          </button>
          <button class="todo-cancel" onclick="javascript:noteEg.completeToDo('${item.id}', false);">
            <i class="fa fa-undo"></i>
          </button>
          <button class="todo-del" onclick="javascript:noteEg.delToDo('${item.id}');">
            <i class="fa fa-trash-alt"></i>
          </button>
        </li>
        `;
      }
      if (arr.length === 0) {
        str = `<li>暂无数据</li>`;
        total = '';
      } else {
        total =  `<li>总计<strong>${arr.length}</strong>个任务，已完成<strong>${completeTotal}</strong>个，未完成<strong>${arr.length-completeTotal}</strong>个。</li>`;
      }
      this.list.innerHTML = str;
      this.listTotal.innerHTML = total;
    }
  }
  
  // 切换主题
  toggleTheme (e) {
    var e = e || window.event;
    var colorVal = e.target.value;
    noteEg.setAttr(this.toDo, 'style', `border: 2px solid ${colorVal}`);
    noteEg.setAttr(this.toDoBtn, 'style', `border: 2px solid ${colorVal};background-color:${colorVal}`);
    noteEg.setAttr(this.list, 'style', `border: 2px solid ${colorVal}`);
    this.setAttr(this.listTotal, 'style', `border-left: 3px solid ${colorVal}`);
  }

  // 设置属性值
  setAttr (elem: Element, name:string, val:string) {
    elem.setAttribute(name,val);
  }

  //设置本地存储
  setLocalStor (key:string, value:any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // 获取本地存储
  getLocalStor (key:string) {
    return JSON.parse(localStorage.getItem(key));
  }

  // 添加事件
  addEvent (elem:Element, eventName:string, callback):void {
    if (elem === null) { return; }
    elem.addEventListener(eventName, callback, false);
  }

}

// 获取dom
function getElem (name:string):Element {
  return document.querySelector(name);
}

// 添加事件
function addEvent (elem:Element, eventName:string, callback):void {
  if (elem === null) { return; }
  elem.addEventListener(eventName, callback, false);
}


// 所有元素
let toDo = getElem('#todo');
let toDoBtn = getElem('#todo-btn');
let list = getElem('.todo-list');
let listTotal = getElem('.todo-total');
let theme = getElem('#theme');
let nameVal = '';
let noteEg = new Note(toDo,toDoBtn,list,listTotal,theme);

// 监听输入
addEvent(toDo, 'input', changeToDoVal);
addEvent(toDoBtn, 'click', addToDoVal);
function changeToDoVal (e) {
  var e = e || window.event;
  nameVal = e.target.value;
}
// 添加事项
function addToDoVal (e) {
  if (e.eventName == 'click' && name == '') {
    alert('请输入待办事项！');
    return false;
  }
  noteEg.addToDo(Math.random().toString(36).slice(3,16),nameVal,false);
}

// 编辑事项
function editToDo (e,id:string) {
  let content = e.target.innerText;
  noteEg.editToDo(id,content);
}
