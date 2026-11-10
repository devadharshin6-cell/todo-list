// ---------- 1. Getting elements from the HTML ----------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");
const emptyMsg = document.getElementById("emptyMsg");
const taskCount = document.getElementById("taskCount");


let tasks = [];

// Used only to animate the newest task
let newTaskId = null;



function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("show");

  // restart the shake animation
  taskInput.classList.remove("shake");
  void taskInput.offsetWidth;
  taskInput.classList.add("shake");
}

function hideError() {
  errorMsg.classList.remove("show");
  taskInput.classList.remove("shake");
}

function addTask() {
  const text = taskInput.value.trim(); // trim() removes extra spaces
  if (text === "") {
    showError("Please enter a task before adding.");
    return; // stop here, don't add anything
  } else {
    hideError();
  }

  const task = {
    id: Date.now(),   // unique number based on the time
    text: text,
    done: false
  };

  tasks.push(task);
  newTaskId = task.id;

  taskInput.value = "";
  taskInput.focus();
  renderTasks();
}

// Mark a task as done / not done
function toggleTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
    }
  }
  renderTasks();
}

// Delete one task (with a small slide-out animation)
function deleteTask(id, listItem) {
  listItem.classList.add("removing");

  // wait for the animation to finish, then remove from the array
  setTimeout(function () {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    renderTasks();
  }, 350);
}

// Remove every task
function clearAll() {
  if (tasks.length === 0) {
    showError("The list is already empty.");
    return;
  }
  tasks = [];
  hideError();
  renderTasks();
}

// Draw the whole list on the page from the tasks array
function renderTasks() {
  taskList.innerHTML = ""; // clear old list first

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // create the elements
    const li = document.createElement("li");
    li.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    // style changes
    if (task.done) {
      li.classList.add("completed");
    }
    if (task.id === newTaskId) {
      li.classList.add("new");
    }

    // events for this task
    checkbox.addEventListener("click", function () {
      toggleTask(task.id);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id, li);
    });

    // put everything together
    li.append(checkbox, span, deleteBtn);
    taskList.append(li);
  }

  newTaskId = null; // so old tasks don't animate again
  updateInfo();
}

// Update the counter text and show/hide the empty message
function updateInfo() {
  const total = tasks.length;
  let doneCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].done) {
      doneCount++;
    }
  }

  if (total === 0) {
    taskCount.textContent = "No tasks yet";
    emptyMsg.classList.remove("hidden");
    clearBtn.classList.add("hidden");
  } else {
    taskCount.textContent = doneCount + " of " + total + " tasks completed";
    emptyMsg.classList.add("hidden");
    clearBtn.classList.remove("hidden");
  }
}


// ---------- 4. Event listeners ----------
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearAll);

// Pressing Enter also adds the task
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Hide the error as soon as the user starts typing
taskInput.addEventListener("input", hideError);

// Show the empty state when the page first loads
renderTasks();
