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

// Insertion Sort implementation
function insertionSort(arr, order = "asc") {
  const sortedArr = [...arr];

  for (let i = 1; i < sortedArr.length; i++) {
    let current = sortedArr[i];
    let j = i - 1;
    while (j >= 0) {
      let shouldMove = false;

      if (order === "asc") {
        shouldMove = sortedArr[j].grade > current.grade;
      } else if (order === "desc") {
        shouldMove = sortedArr[j].grade < current.grade;
      } else if (order === "name") {
        shouldMove = sortedArr[j].name > current.name;
      }

      if (shouldMove) {
        sortedArr[j + 1] = sortedArr[j];
        j--;
      } else {
        break;
      }
    }

    sortedArr[j + 1] = current;
  }

  return sortedArr;
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
    card.dataset.studentName = student.name;
    card.dataset.studentGrade = student.grade;
    card.dataset.studentMidterm = student.midterm || "";
    card.dataset.studentFinals = student.finals || "";

    if (highlightName && student.name === highlightName) {
      card.classList.add("highlight");
    }

    card.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div class="student-grade">${student.grade}</div>
        `;

    // Click to open modal
    card.addEventListener("click", function () {
      openStudentModal(student);
    });

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

let currentFilter = "all";

function sortStudents(order) {
  currentFilter = order;
  currentView = insertionSort([...students], order);
  displayStudents(currentView);

  let orderText =
    order === "asc"
      ? "Ascending (Grade)"
      : order === "desc"
      ? "Descending (Grade)"
      : "Alphabetically";
  let text = `Sorted using Insertion Sort - Order: ${orderText}`;
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

  let listArray = linkedList.toArray();

  if (
    currentFilter === "asc" ||
    currentFilter === "desc" ||
    currentFilter === "name"
  ) {
    listArray = insertionSort(listArray, currentFilter);
  }

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

  let listArray = linkedList.toArray();

  // Apply current filter/sort using Insertion Sort
  if (
    currentFilter === "asc" ||
    currentFilter === "desc" ||
    currentFilter === "name"
  ) {
    listArray = insertionSort(listArray, currentFilter);
  }

  currentView = listArray;
  displayStudents(currentView);

  let text = `LinkedList ${
    isReversed ? "reversed" : "restored"
  }! Now displaying ${isReversed ? "in reverse order" : "in original order"} (${
    listArray.length
  } students)`;
  notif(text);
}

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

// Remove or comment out these lines since the elements don't exist
/*
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
*/

// Filter change handler - Keep this
document.getElementById("filter").addEventListener("change", function (event) {
  const filterValue = event.target.value;
  
  if (filterValue === "all") {
    currentFilter = "all";
    displayLinkedList();
    notif("Displaying all students");
  } else if (filterValue === "asc" || filterValue === "desc" || filterValue === "name") {
    sortStudents(filterValue);
  }
});



// Add Student Functions
function toggleAddForm() {
    const form = document.getElementById('addStudentForm');
    const btn = document.querySelector('.btn-toggle');
    
    form.classList.toggle('show');
    btn.classList.toggle('active');
}

function calculateFinalGrade() {
    const midterm = parseFloat(document.getElementById('midterm').value) || 0;
    const finals = parseFloat(document.getElementById('finals').value) || 0;
    
    const finalGrade =  (midterm * 0.50) + (finals * 0.50);
    
    document.getElementById('calculatedGrade').textContent = finalGrade.toFixed(2);
    
    return Math.round(finalGrade);
}

// Add event listeners for real-time calculation

document.getElementById('midterm').addEventListener('input', calculateFinalGrade);
document.getElementById('finals').addEventListener('input', calculateFinalGrade);

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const midterm = parseFloat(document.getElementById('midterm').value);
    const finals = parseFloat(document.getElementById('finals').value);
    
    // Validation
    if (!name) {
        alert('Please enter student name');
        return;
    }
    
    if (isNaN(midterm) || isNaN(finals)) {
        alert('Please enter all grade components (Midterm, Finals)');
        return;
    }
    
    if ( midterm < 0 || midterm > 100 || finals < 0 || finals > 100) {
        alert('Grades must be between 0 and 100');
        return;
    }
    
    // Check if student already exists
    if (students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('Student already exists!');
        return;
    }
    
    // Calculate final grade
    const finalGrade = Math.round( (midterm * 0.50) + (finals * 0.50));
    
    // Create new student object
    const newStudent = {
        name: name,
        grade: finalGrade,
        midterm: midterm,
        finals: finals
    };
    
    // Add to students array
    students.push(newStudent);
    
    // Update LinkedList
    linkedList.clear();
    students.forEach(student => {
        linkedList.add(student);
    });
    
    // Refresh display based on current filter
    if (currentFilter === 'all') {
        displayLinkedList();
    } else {
        sortStudents(currentFilter);
    }
    
    // Clear form and close
    clearForm();
    toggleAddForm();
    
    // Show notification
    notif(`Added "${name}" with final grade: ${finalGrade}`);
}

function clearForm() {
  document.getElementById("studentName").value = "";
  document.getElementById("midterm").value = "";
  document.getElementById("finals").value = "";
  document.getElementById("calculatedGrade").textContent = "--";

  // Reset editing state
  editingStudentName = null;
  const addButton = document.querySelector(".form-actions .btn-success");
  addButton.textContent = "Add Student";
  addButton.onclick = addStudent;
}

// Add these variables at the top with other global variables
let editingStudentName = null;

// Add these functions anywhere in your script.js

function editStudent(studentName) {
    const student = students.find(s => s.name === studentName);
    if (!student) {
        alert('Student not found!');
        return;
    }
    
    // Store the original name for updating
    editingStudentName = studentName;
    
    // Populate the form with student data
    document.getElementById('studentName').value = student.name;
    document.getElementById('midterm').value = student.midterm || '';
    document.getElementById('finals').value = student.finals || '';
    
    // Calculate and show the grade
    calculateFinalGrade();
    
    // Show the form
    const form = document.getElementById('addStudentForm');
    const btn = document.querySelector('.btn-toggle');
    if (!form.classList.contains('show')) {
        form.classList.add('show');
        btn.classList.add('active');
    }
    
    // Change button text to "Update"
    const addButton = document.querySelector('.form-actions .btn-success');
    addButton.textContent = 'Update Student';
    addButton.onclick = updateStudent;
    
    notif(`Editing "${studentName}"`);
}

function updateStudent() {
    const name = document.getElementById('studentName').value.trim();
    const midterm = parseFloat(document.getElementById('midterm').value);
    const finals = parseFloat(document.getElementById('finals').value);
    
    // Validation
    if (!name) {
        alert('Please enter student name');
        return;
    }
    
    if (isNaN(midterm) || isNaN(finals)) {
        alert('Please enter all grade components (Midterm, Finals)');
        return;
    }
    
    if (midterm < 0 || midterm > 100 || finals < 0 || finals > 100) {
        alert('Grades must be between 0 and 100');
        return;
    }
    
    // Check if new name already exists (but not if it's the same student)
    if (name !== editingStudentName && students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('A student with this name already exists!');
        return;
    }
    
    // Calculate final grade
    const finalGrade = Math.round((midterm * 0.50) + (finals * 0.50));
    
    // Find and update the student
    const studentIndex = students.findIndex(s => s.name === editingStudentName);
    if (studentIndex !== -1) {
        students[studentIndex] = {
            name: name,
            grade: finalGrade,
            midterm: midterm,
            finals: finals
        };
        
        // Update LinkedList
        linkedList.clear();
        students.forEach(student => {
            linkedList.add(student);
        });
        
        // Refresh display
        if (currentFilter === 'all') {
            displayLinkedList();
        } else {
            sortStudents(currentFilter);
        }
        
        // Reset form
        clearForm();
        toggleAddForm();
        editingStudentName = null;
        
        // Reset button back to "Add Student"
        const addButton = document.querySelector('.form-actions .btn-success');
        addButton.textContent = 'Add Student';
        addButton.onclick = addStudent;
        
        notif(`Updated "${name}" with final grade: ${finalGrade}`);
    }
}

function deleteStudent(studentName) {
    if (!confirm(`Are you sure you want to delete "${studentName}"?`)) {
        return;
    }
    
    // Check if student is in queue or stack
    if (queue.some(s => s.name === studentName)) {
        alert(`Cannot delete "${studentName}" - student is currently in the Queue!`);
        return;
    }
    
    if (stack.some(s => s.name === studentName)) {
        alert(`Cannot delete "${studentName}" - student is currently in the Stack!`);
        return;
    }
    
    // Remove student from array
    students = students.filter(s => s.name !== studentName);
    
    // Update LinkedList
    linkedList.clear();
    students.forEach(student => {
        linkedList.add(student);
    });
    
    // Refresh display
    if (currentFilter === 'all') {
        displayLinkedList();
    } else {
        sortStudents(currentFilter);
    }
    
    notif(`Deleted "${studentName}" from records`);
}

let currentEditingStudent = null;

function openStudentModal(student) {
  currentEditingStudent = student;

  // Populate modal
  document.getElementById("modalStudentName").textContent = student.name;
  document.getElementById("modalStudentNameInput").value = student.name;
  document.getElementById("modalMidterm").value = student.midterm || "";
  document.getElementById("modalFinals").value = student.finals || "";

  // Calculate grade
  calculateModalGrade();

  // Show modal
  document.getElementById("studentModal").style.display = "block";
}

function closeModal() {
  document.getElementById("studentModal").style.display = "none";
  currentEditingStudent = null;
}

function calculateModalGrade() {
  const midterm =
    parseFloat(document.getElementById("modalMidterm").value) || 0;
  const finals = parseFloat(document.getElementById("modalFinals").value) || 0;

  const finalGrade = midterm * 0.5 + finals * 0.5;

  document.getElementById("modalCalculatedGrade").textContent =
    finalGrade.toFixed(2);

  return Math.round(finalGrade);
}

// Add event listeners for real-time calculation in modal
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("modalMidterm")
    .addEventListener("input", calculateModalGrade);
  document
    .getElementById("modalFinals")
    .addEventListener("input", calculateModalGrade);
});

function saveStudentFromModal() {
  if (!currentEditingStudent) return;

  const originalName = currentEditingStudent.name;
  const newName = document.getElementById("modalStudentNameInput").value.trim();
  const midterm = parseFloat(document.getElementById("modalMidterm").value);
  const finals = parseFloat(document.getElementById("modalFinals").value);

  // Validation
  if (!newName) {
    alert("Please enter student name");
    return;
  }

  if (isNaN(midterm) || isNaN(finals)) {
    alert("Please enter all grade components");
    return;
  }

  if (midterm < 0 || midterm > 100 || finals < 0 || finals > 100) {
    alert("Grades must be between 0 and 100");
    return;
  }

  // Check if new name already exists
  if (
    newName !== originalName &&
    students.some((s) => s.name.toLowerCase() === newName.toLowerCase())
  ) {
    alert("A student with this name already exists!");
    return;
  }

  // Calculate final grade
  const finalGrade = Math.round(midterm * 0.5 + finals * 0.5);

  // Find and update
  const studentIndex = students.findIndex((s) => s.name === originalName);
  if (studentIndex !== -1) {
    students[studentIndex] = {
      name: newName,
      grade: finalGrade,
      midterm: midterm,
      finals: finals,
    };

    // Update LinkedList
    linkedList.clear();
    students.forEach((student) => {
      linkedList.add(student);
    });

    // Refresh display
    if (currentFilter === "all") {
      displayLinkedList();
    } else {
      sortStudents(currentFilter);
    }

    closeModal();
    notif(`Updated "${newName}" with final grade: ${finalGrade}`);
  }
}

function deleteStudentFromModal() {
  if (!currentEditingStudent) return;

  const studentName = currentEditingStudent.name;

  if (!confirm(`Are you sure you want to delete "${studentName}"?`)) {
    return;
  }

  // Check if student is in queue or stack
  if (queue.some((s) => s.name === studentName)) {
    alert(
      `Cannot delete "${studentName}" - student is currently in the Queue!`
    );
    return;
  }

  if (stack.some((s) => s.name === studentName)) {
    alert(
      `Cannot delete "${studentName}" - student is currently in the Stack!`
    );
    return;
  }

  // Remove student
  students = students.filter((s) => s.name !== studentName);

  // Update LinkedList
  linkedList.clear();
  students.forEach((student) => {
    linkedList.add(student);
  });

  // Refresh display
  if (currentFilter === "all") {
    displayLinkedList();
  } else {
    sortStudents(currentFilter);
  }

  closeModal();
  notif(`Deleted "${studentName}" from records`);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("studentModal");
  if (event.target == modal) {
    closeModal();
  }
};

// Close modal with close button
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.querySelector(".close-modal");
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }
});