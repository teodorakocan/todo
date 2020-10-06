const TASK_KEY = 'tasks';
const index = 0;
const buttonAll = document.getElementById("all");
const buttonCompleted = document.getElementById("completed");
const buttonActive = document.getElementById("active");
const tasksString = localStorage.getItem("tasks");
let tasks = [];
let numberOfActiveTasks = 0;

if(!tasksString){
    localStorage.setItem(TASK_KEY, tasks);
}else{
    tasks = JSON.parse(tasksString);
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    for(let i = 0; i< tasks.length; i++){
        addTask(tasks[i]);
        if(!tasks[i].completed){
            numberOfActiveTasks++;
        }
    }
}

let numb = document.createElement('label');
numb.setAttribute("id", "numberOfActiveTasks");
numb.innerText = numberOfActiveTasks + " items left";
document.querySelector("#number").appendChild(numb);

let input = document.getElementById('addTask');
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if(input.value !== ''){
            task = {name: input.value, completed: false}
            numberOfActiveTasks++;
            tasks.push(task);
            addTask(task);
            localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
            event.currentTarget.value = "";
            reloadNumberOfActiveTasks();
        }
    }
});


function reloadNumberOfActiveTasks(){
    numb.innerText = numberOfActiveTasks + " items left";
}

function addTask(value){
    let newTask = document.createElement('div');
    newTask.setAttribute("id", "div_"+ tasks.indexOf(value));
    newTask.style.backgroundColor="white";
    newTask.classList.add("task");
    document.querySelector("#tasks").appendChild(newTask);
    
    let input = document.createElement('input');
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", "input_"+ tasks.indexOf(value));
    input.classList.add("checkbox")
    input.onchange = function(){
        crossTask(value);
    };
    document.querySelector("#div_" + tasks.indexOf(value)).appendChild(input);

    let task = document.createElement('label');
    task.innerText = value.name;
    task.setAttribute("id", tasks.indexOf(value));
    task.classList.add("taskarea")
    document.querySelector("#div_" + tasks.indexOf(value)).appendChild(task);

    let deletebtn = document.createElement('button');
    deletebtn.innerHTML = '<i class = "fa fa-close"></i>';
    deletebtn.setAttribute("id", "deletebtn");
    deletebtn.onclick = function(){
        deleteTask(value);
    };
    document.querySelector("#div_" + tasks.indexOf(value)).appendChild(deletebtn);

    if(value.completed){
        task.style.textDecoration = "line-through"
        input.checked = true;
    }
}

function deleteTask(value){
    let deleted = [];
    let index = tasks.indexOf(value);
    for(let i = 0; i < tasks.length; i++){
        if(index != i){
            deleted.push(tasks[i]);
        }
    }

    tasks = deleted;
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    location.reload();
}

function crossTask(value){
    let number = document.getElementById("number");
    if(document.getElementById("input_" + tasks.indexOf(value)).checked){
        tasks[tasks.indexOf(value)].completed = document.getElementById("input_" + tasks.indexOf(value)).checked;
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
        numberOfActiveTasks--;
    }
    else{
        tasks[tasks.indexOf(value)].completed = document.getElementById("input_" + tasks.indexOf(value)).checked;;
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
        numberOfActiveTasks++;
    }

    
    number.innerText = numberOfActiveTasks + " items left"
    checkFilter();
}

function checkFilter(){
    if(buttonAll.classList.contains("active")){
        allTasks();
    }else if(buttonCompleted.classList.contains("active")){
        completedTasks();
    }else if(buttonActive.classList.contains("active")){
        activeTasks();
    }
}

function allTasks(){
    buttonAll.classList.add("active");
    buttonCompleted.classList.remove("active");
    buttonActive.classList.remove("active");

    let allTasks = document.getElementById("tasks");
    while(allTasks.children.length > 0){
        let obj = document.getElementById(allTasks.children[index].id);
        obj.remove();
    }

    for(let i = 0; i < tasks.length; i++){
        addTask(tasks[i]);
    }
}

function activeTasks(){
    buttonAll.classList.remove("active");
    buttonCompleted.classList.remove("active");
    buttonActive.classList.add("active");

    let allTasks = document.getElementById("tasks");
    while(allTasks.children.length > 0){
        let obj = document.getElementById(allTasks.children[index].id);
        obj.remove();
    }

    for(let i = 0; i < tasks.length; i++){
        if(!tasks[i].completed){
            addTask(tasks[i]);
        }
    }
}

function completedTasks(){
    buttonAll.classList.remove("active");
    buttonCompleted.classList.add("active");
    buttonActive.classList.remove("active");

    let allTasks = document.getElementById("tasks");
    while(allTasks.children.length > 0){
        let obj = document.getElementById(allTasks.children[index].id);
        obj.remove();
    }

    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].completed){
            addTask(tasks[i]);
        }
    }
}
