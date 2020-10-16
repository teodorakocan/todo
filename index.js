const TASK_KEY = 'tasks';
const ACTIVE_CLASS = 'active';

let tasks = [];
let numberOfActiveTasks = 0;

const buttonAll = document.getElementById('all');
const buttonCompleted = document.getElementById('completed');
const buttonActive = document.getElementById('active');
const allTaskElements = document.getElementById('tasks');

const labelNumberOfActiveTasks = document.createElement('label');
document.querySelector('#number').appendChild(labelNumberOfActiveTasks);

const input = document.getElementById('addTask');
input.addEventListener('keyup', (event) => {
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
    const tasksString = localStorage.getItem('tasks') || '[]';
    tasks = JSON.parse(tasksString);
    tasks
        .forEach((currentTask) => {
            if (!currentTask.completed) {
                numberOfActiveTasks++;
            };
            renderTask(currentTask);
        });

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
    const deletedIndex = tasks.indexOf(value);

    if (!tasks[deletedIndex].completed) {
        numberOfActiveTasks--;
    }

    tasks = tasks.filter((currentTask, currentIndex) =>
        currentIndex !== deletedIndex
    );

    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    renderNumberOfActiveTasks();
    reloadPage();
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
    reloadTasks();
}

function reloadTasks() {
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
    tasks.forEach(renderTask);
}

function activeTasks() {
    buttonAll.classList.remove(ACTIVE_CLASS);
    buttonCompleted.classList.remove(ACTIVE_CLASS);
    buttonActive.classList.add(ACTIVE_CLASS);

    clearTaskElements();

    tasks
        .filter((task) => !task.completed)
        .forEach(renderTask);
}

function completedTasks() {
    buttonAll.classList.remove(ACTIVE_CLASS);
    buttonCompleted.classList.add(ACTIVE_CLASS);
    buttonActive.classList.remove(ACTIVE_CLASS);

    clearTaskElements();

    tasks
        .filter((task) => task.completed)
        .forEach(renderTask);
}

function clearTaskElements() {
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
    newTask.classList.add('flex-tasks')
    document.querySelector('#tasks').prepend(newTask);

    const inputDiv = document.createElement('div');
    inputDiv.setAttribute('id', 'input_div_' + tasks.indexOf(value));
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(inputDiv);

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'input_' + tasks.indexOf(value));
    input.onchange = function() {
        crossTask(value);
    };
    document.querySelector('#input_div_' + tasks.indexOf(value)).appendChild(input);

    const labelDiv = document.createElement('div');
    labelDiv.setAttribute('id', 'label_div_' + tasks.indexOf(value));
    labelDiv.classList.add('taskName');
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(labelDiv);

    const task = document.createElement('label');
    task.innerText = value.name;
    task.setAttribute('id', tasks.indexOf(value));
    task.classList.add('trimText');
    document.querySelector('#label_div_' + tasks.indexOf(value)).appendChild(task);

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id', 'button_div_' + tasks.indexOf(value));
    document.querySelector('#div_' + tasks.indexOf(value)).appendChild(buttonDiv);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class = "fa fa-close"></i>';
    deleteButton.setAttribute('id', 'deleteButton');
    deleteButton.onclick = function() {
        deleteTask(value);
    };
    document.querySelector('#button_div_' + tasks.indexOf(value)).appendChild(deleteButton);

    if (value.completed) {
        task.style.textDecoration = 'line-through'
        input.checked = true;
    }
}