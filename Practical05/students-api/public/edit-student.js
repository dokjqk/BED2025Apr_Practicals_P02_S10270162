// public/edit-student.js

const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get("id");
const form = document.getElementById("edit-form");
const message = document.getElementById("message");

if (!studentId) {
  alert("No student ID provided");
  window.location.href = "students.html";
}

async function loadStudent() {
  try {
    const res = await fetch(`/students/${studentId}`);
    if (!res.ok) throw new Error("Student not found");
    const student = await res.json();

    form.name.value = student.name;
    form.address.value = student.address || "";
  } catch (err) {
    alert("Failed to load student data");
    window.location.href = "students.html";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    address: form.address.value.trim(),
  };

  try {
    const res = await fetch(`/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      message.textContent = "Student updated successfully!";
    } else {
      const err = await res.text();
      message.textContent = "Failed to update student: " + err;
    }
  } catch (err) {
    message.textContent = "Error updating student";
    console.error(err);
  }
});

loadStudent();
