// public/students.js

const tableBody = document.querySelector("#students-table tbody");

async function fetchStudents() {
  try {
    const res = await fetch("/students");
    if (!res.ok) throw new Error("Failed to fetch students");
    const students = await res.json();

    tableBody.innerHTML = "";

    students.forEach(student => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${student.student_id}</td>
        <td>${student.name}</td>
        <td>${student.address || ""}</td>
        <td>
          <a href="edit-student.html?id=${student.student_id}">Edit</a> |
          <button data-id="${student.student_id}" class="delete-btn">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Add delete event listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        const id = btn.getAttribute("data-id");
        try {
          const res = await fetch(`/students/${id}`, { method: "DELETE" });
          if (res.status === 204) {
            alert("Student deleted");
            fetchStudents(); // Refresh list
          } else {
            alert("Failed to delete student");
          }
        } catch (err) {
          alert("Error deleting student");
          console.error(err);
        }
      });
    });
  } catch (err) {
    console.error(err);
    alert("Could not load students");
  }
}

fetchStudents();
