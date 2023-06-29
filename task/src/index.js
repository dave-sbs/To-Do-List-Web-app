//  * Name: Dave Boku
//  * Project: To Do List Project
//  * File: index.js
//  * Date: June, 2023

let taskList = document.getElementById("task-list");
let spanElement = document.createElement("span");
let checkbox = "<label><input type=\"checkbox\" onchange=\"checkboxFunction(this)\"></label>"
let deleteBtn = "<button class=\"delete-btn\" onclick=\"deleteTask(this)\">x</button>"

//Connecting Task List to the Local Storage
let taskListArray = [];
let taskListArrayParsed = [];
taskListArrayParsed = JSON.parse(localStorage.getItem("tasks")) || [];

//Since tasks can't be moved up or down an order. I can easily keep track of their names
let spanNamesArray = [];

// Render existing tasks from localStorage
for (let i = 0; i < taskListArrayParsed.length; i++) {
    const task = taskListArrayParsed[i];
    const taskName = Object.keys(task)[0];
    const taskDescription = task[taskName];
    taskList.insertAdjacentHTML("beforeend", taskDescription);
    spanNamesArray.push(taskName);
}

function checkboxFunction(checkbox) {
    let spanText = checkbox.parentNode.nextElementSibling.textContent;
    let initValue = "<li><label><input type=\"checkbox\" onchange=\"checkboxFunction(this)\"></label><span class=\"task\">" + spanText + "</span><button class=\"delete-btn\" onclick=\"deleteTask(this)\">x</button></li>"
    let completedValue = "<li class='completed'><label><input type=\"checkbox\" checked=true onchange=\"checkboxFunction(this)\"></label><span class=\"task\">" + spanText + "</span><button class=\"delete-btn\" onclick=\"deleteTask(this)\">x</button></li>"
    let taskIndex = spanNamesArray.indexOf(spanText);

    if (checkbox.checked) {
        const listItem = checkbox.closest('li');
        listItem.classList.add('completed');
        //Now gotta make that change in local storage too
        taskListArrayParsed[taskIndex][spanText] = completedValue;

    } else {
        const listItem = checkbox.closest('li');
        listItem.classList.remove('completed');
        //Now gotta make that change in local storage too
        taskListArrayParsed[taskIndex][spanText] = initValue;
    }
    localStorage.setItem("tasks", JSON.stringify(taskListArrayParsed))
}

function deleteTask(obj) {
    let spanText = obj.parentNode.children[1].textContent;
    let taskIndex = spanNamesArray.indexOf(spanText);
    taskListArrayParsed.splice(taskIndex, 1);
    spanNamesArray.splice(taskIndex, 1);
    obj.parentNode.remove();
    localStorage.setItem("tasks", JSON.stringify(taskListArrayParsed))
}

//Executed once the submit button is pressed. Starts creation of newTask HTML elements
function submitButton() {
    let newTaskName = document.getElementById("input-task").value;
    let newTask = document.createElement("li");
    spanElement.className = "task";
    spanElement.textContent = newTaskName;
    if (newTaskName !== "") {
        document.getElementById("input-task").value = "";
        createNewTask(newTask);
    }
}

//Handles combining the different HTML elements and creating a newTask HTML element with all the building nodes
function createNewTask(newTask) {
    newTask.insertAdjacentHTML("afterBegin", checkbox);
    newTask.append(spanElement);
    newTask.insertAdjacentHTML("beforeEnd", deleteBtn);
    let newTaskClone = newTask.cloneNode(true);
    handleMemory(newTaskClone);
}

//Handles addition of new Task/tasks to both Temporary storage and Local browser storage
function handleMemory(newTask) {
    let taskSpan = newTask.children[1].textContent;
    let taskDescription = newTask.outerHTML;
    let taskObj = {
        [taskSpan]: taskDescription
    }

    spanNamesArray.push(taskSpan);
    taskListArray.push(taskObj);
    taskListArrayParsed.push(taskListArray[taskListArray.length - 1]);
    localStorage.setItem("tasks", JSON.stringify(taskListArrayParsed));

    //ALSO GOTTA BE ABLE TO RE-RENDER EVERYTHING IF WEBSITE RELOADS USING DATA FROM LOCAL STORAGE
    taskList.append(newTask);
}
