const TASK_KEY = 'tasks';
const ACTIVE_CLASS = 'active';

let tasks = [];
let numberOfActiveTasks = 0;

const buttonAll = document.getElementById('all');
const buttonCompleted = document.getElementById('completed');
const buttonActive = document.getElementById(ACTIVE_CLASS);

const labelNumberOfActiveTasks = document.createElement('label');
document.querySelector('#number').appendChild(labelNumberOfActiveTasks);

const input = document.getElementById('addTask');
input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (input.value !== '') {
            addTask(input.value);
            event.currentTarget.value = '';
        }
    }
});

init();

function init() {
    const tasksString = localStorage.getItem('tasks');

    if (!tasksString) {
        localStorage.setItem(TASK_KEY, []);
    } else {
        tasks = JSON.parse(tasksString);
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
        for (let i = 0; i < tasks.length; i++) {
            renderTask(tasks[i]);
            if (!tasks[i].completed) {
                numberOfActiveTasks++;
            }
        }
    }
    renderNumberOfActiveTasks();
}

function addTask(name) {
    const task = { name: name, completed: false };
    numberOfActiveTasks++;
    tasks.push(task);
    renderTask(task);
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    renderNumberOfActiveTasks();
}

function deleteTask(value) {
    const deleted = [];
    const index = tasks.indexOf(value);

    if (!tasks[index].completed) {
        numberOfActiveTasks--;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (index != i) {
            deleted.push(tasks[i]);
        }
    }

    tasks = deleted;
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    renderTasks();
    renderNumberOfActiveTasks();
}

function crossTask(value) {
    const checked = document.getElementById('input_' + tasks.indexOf(value)).checked;
    if (checked) {
        numberOfActiveTasks--;
    } else {
        numberOfActiveTasks++;
    }

    tasks[tasks.indexOf(value)].completed = checked;
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));

    renderNumberOfActiveTasks();

    if (buttonAll.classList.contains(ACTIVE_CLASS)) {
        allTasks();
    } else if (buttonCompleted.classList.contains(ACTIVE_CLASS)) {
        completedTasks();
    } else if (buttonActive.classList.contains(ACTIVE_CLASS)) {
        activeTasks();
    }
}

function allTasks() {
    buttonAll.classList.add(ACTIVE_CLASS);
    buttonCompleted.classList.remove(ACTIVE_CLASS);
    buttonActive.classList.remove(ACTIVE_CLASS);

    clearTaskElements();
    for (let i = 0; i < tasks.length; i++) {
        renderTask(tasks[i]);
    }
}

function activeTasks() {
    buttonAll.classList.remove(ACTIVE_CLASS);
    buttonCompleted.classList.remove(ACTIVE_CLASS);
    buttonActive.classList.add(ACTIVE_CLASS);

    clearTaskElements();

    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            renderTask(tasks[i]);
        }
    }
}

function completedTasks() {
    buttonAll.classList.remove(ACTIVE_CLASS);
    buttonCompleted.classList.add(ACTIVE_CLASS);
    buttonActive.classList.remove(ACTIVE_CLASS);

    clearTaskElements();

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            renderTask(tasks[i]);
        }
    }
}

function clearTaskElements() {
    const allTaskElements = document.getElementById('tasks');
    while (allTaskElements.children.length > 0) {
        document.getElementById(allTaskElements.children[0].id).remove();
    }
}

function renderNumberOfActiveTasks() {
    labelNumberOfActiveTasks.innerText = numberOfActiveTasks + ' items left';
}

function renderTask(value) {
    const newTask = document.createElement('div');
    newTask.setAttribute('id', 'div_' + tasks.indexOf(value));
    newTask.style.backgroundColor = 'white';
    newTask.classList.add('task');
    document.querySelector('#tasks').appendChild(newTask);

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'input_' + tasks.indexOf(value));
    input.classList.add('checkbox')
    input.onchange = function () {
        crossTask(value);
    };
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(input);

    const task = document.createElement('label');
    task.innerText = value.name;
    task.setAttribute('id', tasks.indexOf(value));
    task.classList.add('taskarea')
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(task);

    const deletebtn = document.createElement('button');
    deletebtn.innerHTML = '<i class = "fa fa-close"></i>';
    deletebtn.setAttribute('id', 'deletebtn');
    deletebtn.onclick = function () {
        deleteTask(value);
    };
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(deletebtn);

    if (value.completed) {
        task.style.textDecoration = 'line-through'
        input.checked = true;
    }
}
