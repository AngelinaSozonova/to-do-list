(function() {
  let todoListArray = [];
  let nameTodoList = '';

  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createToDoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.disabled = true;
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createToDoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createToDoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done) {
      item.classList.add('list-group-item-success');
    }

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');

      for (let elem of todoListArray) {
        if (elem.id === obj.id) {
          elem.done = !elem.done;
        }
      }
      saveListLocalStorage(nameTodoList, todoListArray);
    });

    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i=0; i < todoListArray.length; i++) {
          if(todoListArray[i].id === obj.id) {
            todoListArray.splice(i, 1);
          }
        }
        saveListLocalStorage(nameTodoList, todoListArray);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  function getNewId(array) {
    let max = 0;
    for(let item of array) {
      if(item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  function saveListLocalStorage(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
  }

  function createToDoApp(container, title = 'Список дел', nameList, todoArray = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createToDoItemForm();
    let todoList = createToDoList();
    nameTodoList = nameList;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(nameTodoList);

    if (todoArray.length > 0) {
      for (let elem of todoArray) {
        elem.id = getNewId(todoArray);
        todoListArray.push(elem);
      }
    }

    if(localData !== null && localData !== '') {
      todoListArray = JSON.parse(localData);
    }

    for (let el of todoListArray) {
      let todoItem = createToDoItem(el);
      todoList.append(todoItem.item);
    }

    todoItemForm.input.addEventListener('input', function() {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    })

    todoItemForm.form.addEventListener('submit', function(event) {
      //чтобы страница не перезагружалась
      event.preventDefault();

      let itemInArray = {
        name: todoItemForm.input.value,
        done: false,
        id: getNewId(todoListArray)
      };

      todoItemForm.button.disabled = true;

      //если пользователь ничего не ввел, то игнорируем создание элемента
      if(!todoItemForm.input.value) {
        return;
      }

      let todoItem = createToDoItem(itemInArray);

      todoListArray.push(itemInArray);

      todoList.append(todoItem.item);

      saveListLocalStorage(nameTodoList, todoListArray);

      todoItemForm.input.value = '';
    })
  }

  window.createToDoApp = createToDoApp;
})();
