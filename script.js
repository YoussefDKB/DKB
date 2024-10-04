let grades = [];
let editIndex = -1;

// Function to show login form
function showLogin() {
    document.getElementById('studentView').style.display = 'none'; // Hide student view
    document.getElementById('loginForm').style.display = 'block'; // Show login form
    document.getElementById('dashboard').style.display = 'none'; // Hide dashboard
}

// Function to log in and show the dashboard
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Updated credentials
    if (username === 'youssef sakr' && password === '309310') {
        document.getElementById('dashboard').style.display = 'block'; // Show the dashboard
        document.getElementById('loginForm').style.display = 'none'; // Hide login form
        fetchGrades(); // Fetch grades from local storage
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid username or password!';
    }
}

// Function to view grades for a specific student
function viewGrade() {
    const studentCode = document.getElementById("studentCode").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const gradesTable = document.getElementById("gradesTable");
    const tableBody = document.querySelector('#gradesTable tbody');

    // Clear any previous error message
    errorMessage.textContent = '';

    // Check if the student code is entered
    if (!studentCode) {
        errorMessage.textContent = 'Please enter a student code.';
        gradesTable.style.display = 'none';
        return;
    }

    // Check if input is a valid number
    if (isNaN(studentCode)) {
        errorMessage.textContent = 'Student code must be a number.';
        gradesTable.style.display = 'none';
        return;
    }

    // Find the student by code
    const student = grades.find(g => g.code.toString() === studentCode); // Ensure type consistency

    if (student) {
        gradesTable.style.display = 'table';
        tableBody.innerHTML = `
            <tr>
                <td>${student.name}</td>
                <td>${student.code}</td>
                <td>${formatScore(student.homework, student.totalHomework)}</td>
                <td>${formatScore(student.classwork, student.totalClasswork)}</td>
                <td>${formatScore(student.exam, student.totalExam)}</td>
                <td>${student.absent ? 'Absent' : 'Present'}</td>
            </tr>
        `;
    } else {
        gradesTable.style.display = 'none';
        errorMessage.textContent = 'No grade found for the provided student code.';
    }
}

// Function to format the score as "score/total" or "Not Done"
function formatScore(score, total) {
    if (score === "Not Done" || total === "Not Done") {
        return "Not Done";
    }
    return `${score}/${total}`;
}

// Function to fetch grades from local storage
function fetchGrades() {
    const savedGrades = localStorage.getItem('grades');
    grades = savedGrades ? JSON.parse(savedGrades) : [];
    renderTable();
}

// Function to add a grade
function addGrade() {
    const name = document.getElementById('studentName').value;
    const code = document.getElementById('studentCodeInput').value; // Corrected to use a different ID for the input
    const homework = document.getElementById('homeworkScore').value || "Not Done";
    const totalHomework = document.getElementById('totalHomeworkScore').value || "Not Done";
    const classwork = document.getElementById('classworkScore').value || "Not Done";
    const totalClasswork = document.getElementById('totalClassworkScore').value || "Not Done";
    const exam = document.getElementById('examScore').value || "Not Done";
    const totalExam = document.getElementById('totalExamScore').value || "Not Done";
    const absent = document.getElementById('absentCheckbox').checked;

    // Check for duplicate student codes
    if (grades.some(grade => grade.code === code && editIndex === -1)) {
        alert('Student code must be unique.');
        return;
    }

    const newGrade = { name, code, homework, totalHomework, classwork, totalClasswork, exam, totalExam, absent };

    if (editIndex > -1) {
        // Update existing grade
        grades[editIndex] = newGrade;
        document.getElementById('updateButton').style.display = 'none';
        document.getElementById('addButton').style.display = 'inline';
        editIndex = -1; // Reset edit index
    } else {
        // Add new grade
        grades.push(newGrade);
    }

    localStorage.setItem('grades', JSON.stringify(grades));
    clearInputs();
    renderTable();
}

// Function to edit grade
function editGrade(index) {
    const grade = grades[index];
    document.getElementById('studentName').value = grade.name;
    document.getElementById('studentCodeInput').value = grade.code; // Corrected to use a different ID for the input
    document.getElementById('homeworkScore').value = grade.homework !== "Not Done" ? grade.homework : '';
    document.getElementById('totalHomeworkScore').value = grade.totalHomework !== "Not Done" ? grade.totalHomework : '';
    document.getElementById('classworkScore').value = grade.classwork !== "Not Done" ? grade.classwork : '';
    document.getElementById('totalClassworkScore').value = grade.totalClasswork !== "Not Done" ? grade.totalClasswork : '';
    document.getElementById('examScore').value = grade.exam !== "Not Done" ? grade.exam : '';
    document.getElementById('totalExamScore').value = grade.totalExam !== "Not Done" ? grade.totalExam : '';
    document.getElementById('absentCheckbox').checked = grade.absent;

    editIndex = index;
    document.getElementById('updateButton').style.display = 'inline';
    document.getElementById('addButton').style.display = 'none';
}

// Function to delete grade
function deleteGrade(index) {
    grades.splice(index, 1);
    localStorage.setItem('grades', JSON.stringify(grades)); // Save updated grades to local storage
    renderTable();
}

// Function to render grades table
function renderTable() {
    const tableBody = document.querySelector('#gradesTableDashboard tbody');
    tableBody.innerHTML = '';

    grades.forEach((grade, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.name}</td>
            <td>${grade.code}</td>
            <td>${grade.homework}</td>
            <td>${grade.totalHomework}</td>
            <td>${grade.classwork}</td>
            <td>${grade.totalClasswork}</td>
            <td>${grade.exam}</td>
            <td>${grade.totalExam}</td>
            <td>${grade.absent ? 'Absent' : 'Present'}</td>
            <td>
                <button onclick="editGrade(${index})">Edit</button>
                <button onclick="deleteGrade(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to clear input fields
function clearInputs() {
    document.getElementById('studentName').value = '';
    document.getElementById('studentCodeInput').value = '';
    document.getElementById('homeworkScore').value = '';
    document.getElementById('totalHomeworkScore').value = '';
    document.getElementById('classworkScore').value = '';
    document.getElementById('totalClassworkScore').value = '';
    document.getElementById('examScore').value = '';
    document.getElementById('totalExamScore').value = '';
    document.getElementById('absentCheckbox').checked = false;
    editIndex = -1;  // Reset edit index
}

// Initial load
window.onload = function() {
    fetchGrades(); // Fetch grades on page load
};
