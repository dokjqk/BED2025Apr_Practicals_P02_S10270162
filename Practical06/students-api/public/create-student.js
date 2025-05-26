// public/create-student.js

const form = document.getElementById("create-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    name: formData.get("name").trim(),
    address: formData.get("address").trim(),
  };

  try {
    const res = await fetch("/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 201) {
      message.textContent = "Student created successfully!";
      form.reset();
    } else {
      const err = await res.text();
      message.textContent = "Failed to create student: " + err;
    }
  } catch (err) {
    message.textContent = "Error creating student";
    console.error(err);
  }
});
