// Node class for LinkedList
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// LinkedList class
class LinkedList {
  constructor() {
    this.head = null;
  }

  add(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  reverse() {
    let prev = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  clear() {
    this.head = null;
  }
}

// Student data
const studentData = `Ortiz, Natalia Gabrielle A. : 89
Rodil, Gee Ann M. : 88
Perez, Gabriel Red Ray R. : 78
Saddi, Denielle Nicole D. : 88
Medina, Jerylson B. : 89
Reazon, Tristan S. : 85
Rizo, Janelle Rane M. : 74
Velasco, Crisglynver G. : 82
Lumawag, Mark Aeron A. : 88
Villamor, Wayne Andy Y. : 87
Fontilla, Raicel N. : 80
Jacob, Vincent Jerome S. : 89
Manilag, Sebastian Andrew N. : 80
Layupan, Zirk Eins B. : 87
Carlos, Jonathan Cornelio S. : 80
Zúñiga, Clark Kent P. : 87
Ticbobolan, Rhyian Joshua M. : 88
Gandeza, John Timothy M. : 81
Guerrero, Daniella M. : 86
Alberto, Ashley Dennise B. : 78
Pulgo, Princess C. : 83
Escal, Hazel Joy F. : 98
Agawa, James Francis E. : 90
Facto, Cristina Mae F. : 90
Sahipa, Aqlus Salim A. : 84
Maningas, Joshua A. : 88
Guinto, Kent Airhon A. : 81
Leocario, Christian C. : 98
Cuatriz, Zymon M. : 85
Brecia, Precious Dianne V. : 86
Abellana, Roldan S. Jr. : 80
Limjuco, Kathleen Eunice M. : 85
Pilar, Keithzylene S. : 86
Lorenzo, Bernard T. : 82
Gonzales, Ini Chris A. : 86
Alfanta, Ice Rino R. : 88
Bachiller, Ranezet Vhon A. : 86
Galamiton, Lars Ulrich S. : 84
Santiago, Michael E. : 90
Dablo, Faith A. : 87`;

let students = [];
let linkedList = new LinkedList();
let queue = [];
let stack = [];
let currentView = [];
let isReversed = false;

// Parse student data
function parseStudentData() {
  const lines = studentData.trim().split("\n");
  students = lines.map((line) => {
    const parts = line.split(":");
    return {
      name: parts[0].trim(),
      grade: parseInt(parts[1].trim()),
    };
  });
  currentView = [...students];
  populateLinkedList();
  displayStudents(currentView);
}

// Populate LinkedList
function populateLinkedList() {
  linkedList.clear();
  students.forEach((student) => {
    linkedList.add(student);
  });
}

// Quick Sort implementation
function quickSort(arr, order = "asc") {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];

  for (let student of arr) {
    if (order === "asc") {
      if (student.grade < pivot.grade) left.push(student);
      else if (student.grade === pivot.grade) middle.push(student);
      else right.push(student);
    } else if (order === "desc") {
      if (student.grade > pivot.grade) left.push(student);
      else if (student.grade === pivot.grade) middle.push(student);
      else right.push(student);
    } else if (order === "name") {
      if (student.name < pivot.name) left.push(student);
      else if (student.name === pivot.name) middle.push(student);
      else right.push(student);
    }
  }

  return [...quickSort(left, order), ...middle, ...quickSort(right, order)];
}

// Binary Search (requires sorted array)
function binarySearch(arr, searchName) {
  const sortedArr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midName = sortedArr[mid].name.toLowerCase();
    const search = searchName.toLowerCase();

    if (midName.includes(search)) {
      return sortedArr[mid];
    } else if (midName < search) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  for (let student of sortedArr) {
    if (student.name.toLowerCase().includes(searchName.toLowerCase())) {
      return student;
    }
  }

  return null;
}

// Display students
function displayStudents(studentList, highlightName = null) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (studentList.length === 0) {
    container.innerHTML = '<div class="no-results">No students found</div>';
    return;
  }

  studentList.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.draggable = true;
    card.dataset.studentName = student.name;
    card.dataset.studentGrade = student.grade;

    if (highlightName && student.name === highlightName) {
      card.classList.add("highlight");
    }

    card.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div class="student-grade">${student.grade}</div>
        `;

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    container.appendChild(card);
  });
}

// Binary Search
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      binarySearchStudent();
    }
  });

function binarySearchStudent() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (!searchTerm) {
    displayLinkedList();
    return;
  }

  const result = binarySearch(students, searchTerm);
  if (result) {
    currentView = [result];
    displayStudents(currentView, result.name);
    let text = `Binary Search Result: Found "${result.name}" with grade ${result.grade}`;
    notif(text);
  } else {
    currentView = [];
    displayStudents(currentView);
    let text = `Binary Search Result: No student found matching "${searchTerm}"`;
    notif(text);
  }
}

function sortStudents(order) {
  currentView = quickSort([...students], order);
  displayStudents(currentView);

  let orderText =
    order === "asc"
      ? "Ascending (Grade)"
      : order === "desc"
      ? "Descending (Grade)"
      : "Alphabetically";
  let text = `Sorted using Quick Sort - Order: ${orderText}`;
  notif(text);
}

function notif(text) {
  document.getElementById("infoText").textContent = text;
  var x = document.getElementById("info-section");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 1700);
}

// Queue operations
function addToQueue() {
  if (currentView.length === 0) {
    alert("No students in current view to add to queue");
    return;
  }
  const student = currentView[0];

  if (queue.some((s) => s.name === student.name)) {
    alert(`${student.name} is already in the Queue!`);
    return;
  }
  if (stack.some((s) => s.name === student.name)) {
    alert(`${student.name} is already in the Stack!`);
    return;
  }

  queue.push(student);
  students = students.filter((s) => s.name !== student.name);

  updateQueueDisplay();
  displayLinkedList();

  let text = `Added "${student.name}" to Queue (removed from list)`;
  notif(text);
}

function removeFromQueue() {
  if (queue.length === 0) {
    alert("Queue is empty");
    return;
  }
  const student = queue.shift();
  students.push(student);

  updateQueueDisplay();
  displayLinkedList();

  let text = `Removed "${student.name}" from Queue (added back to list)`;
  notif(text);
}

function updateQueueDisplay() {
  const container = document.getElementById("queueDisplay");
  container.innerHTML = "";
  if (queue.length === 0) {
    container.innerHTML = '<p style="color: #6c757d;">Queue is empty</p>';
    return;
  }
  queue.forEach((student, index) => {
    const item = document.createElement("div");
    item.className = "queue-item";
    item.textContent = `${index + 1}. ${student.name} (${student.grade})`;
    container.appendChild(item);
  });
}

// Stack operations
function pushToStack() {
  if (currentView.length === 0) {
    alert("No students in current view to add to stack");
    return;
  }
  const student = currentView[0];

  if (queue.some((s) => s.name === student.name)) {
    alert(`${student.name} is already in the Queue!`);
    return;
  }
  if (stack.some((s) => s.name === student.name)) {
    alert(`${student.name} is already in the Stack!`);
    return;
  }

  stack.push(student);
  students = students.filter((s) => s.name !== student.name);

  updateStackDisplay();
  displayLinkedList();

  let text = `Pushed "${student.name}" to Stack (removed from list)`;
  notif(text);
}

function popFromStack() {
  if (stack.length === 0) {
    alert("Stack is empty");
    return;
  }
  const student = stack.pop();
  students.push(student);

  updateStackDisplay();
  displayLinkedList();

  let text = `Popped "${student.name}" from Stack (added back to list)`;
  notif(text);
}

function updateStackDisplay() {
  const container = document.getElementById("stackDisplay");
  container.innerHTML = "";
  if (stack.length === 0) {
    container.innerHTML = '<p style="color: #6c757d;">Stack is empty</p>';
    return;
  }
  stack
    .slice()
    .reverse()
    .forEach((student, index) => {
      const item = document.createElement("div");
      item.className = "stack-item";
      item.textContent = `${stack.length - index}. ${student.name} (${
        student.grade
      })`;
      container.appendChild(item);
    });
}

// LinkedList operations
function displayLinkedList() {
  linkedList.clear();
  students.forEach((student) => {
    linkedList.add(student);
  });

  if (isReversed) {
    linkedList.reverse();
  }

  const listArray = linkedList.toArray();
  currentView = listArray;
  displayStudents(currentView);
}

function reverseLinkedList() {
  isReversed = !isReversed;

  linkedList.clear();
  students.forEach((student) => {
    linkedList.add(student);
  });

  if (isReversed) {
    linkedList.reverse();
  }

  const listArray = linkedList.toArray();
  currentView = listArray;
  displayStudents(currentView);

  let text = `LinkedList ${
    isReversed ? "reversed" : "restored"
  }! Now displaying ${isReversed ? "in reverse order" : "in original order"} (${
    listArray.length
  } students)`;
  notif(text);
}

// Drag and drop handlers
let draggedStudent = null;

function handleDragStart(e) {
  draggedStudent = {
    name: e.target.dataset.studentName,
    grade: parseInt(e.target.dataset.studentGrade),
  };
  e.target.classList.add("dragging");
  e.dataTransfer.effectAllowed = "copy";
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function handleDragEnter(e) {
  if (e.target.classList.contains("queue-stack-display")) {
    e.target.classList.add("drag-over");
  }
}

function handleDragLeave(e) {
  if (e.target.classList.contains("queue-stack-display")) {
    e.target.classList.remove("drag-over");
  }
}

function handleDropQueue(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  if (draggedStudent) {
    if (queue.some((s) => s.name === draggedStudent.name)) {
      alert(`${draggedStudent.name} is already in the Queue!`);
      draggedStudent = null;
      return;
    }
    if (stack.some((s) => s.name === draggedStudent.name)) {
      alert(`${draggedStudent.name} is already in the Stack!`);
      draggedStudent = null;
      return;
    }

    queue.push(draggedStudent);
    students = students.filter((s) => s.name !== draggedStudent.name);

    updateQueueDisplay();
    displayLinkedList();

    let text = `Dragged "${draggedStudent.name}" to Queue (removed from list)`;
    notif(text);
    draggedStudent = null;
  }
}

function handleDropStack(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  if (draggedStudent) {
    if (queue.some((s) => s.name === draggedStudent.name)) {
      alert(`${draggedStudent.name} is already in the Queue!`);
      draggedStudent = null;
      return;
    }
    if (stack.some((s) => s.name === draggedStudent.name)) {
      alert(`${draggedStudent.name} is already in the Stack!`);
      draggedStudent = null;
      return;
    }

    stack.push(draggedStudent);
    students = students.filter((s) => s.name !== draggedStudent.name);

    updateStackDisplay();
    displayLinkedList();

    let text = `Dragged "${draggedStudent.name}" to Stack (removed from list)`;
    notif(text);
    draggedStudent = null;
  }
}

// Initialize
parseStudentData();
updateQueueDisplay();
updateStackDisplay();

const queueDisplay = document.getElementById("queueDisplay").parentElement;
const stackDisplay = document.getElementById("stackDisplay").parentElement;

queueDisplay.addEventListener("dragover", handleDragOver);
queueDisplay.addEventListener("dragenter", handleDragEnter);
queueDisplay.addEventListener("dragleave", handleDragLeave);
queueDisplay.addEventListener("drop", handleDropQueue);

stackDisplay.addEventListener("dragover", handleDragOver);
stackDisplay.addEventListener("dragenter", handleDragEnter);
stackDisplay.addEventListener("dragleave", handleDragLeave);
stackDisplay.addEventListener("drop", handleDropStack);
