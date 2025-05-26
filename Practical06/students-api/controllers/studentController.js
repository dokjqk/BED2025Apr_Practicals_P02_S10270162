const studentModel = require("../models/student");

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error (getAllStudents):", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

// Get student by ID
async function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const student = await studentModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Controller error (getStudentById):", error);
    res.status(500).json({ error: "Error retrieving student" });
  }
}

// Create new student
async function createStudent(req, res) {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newStudent = await studentModel.createStudent(name, address);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Controller error (createStudent):", error);
    res.status(500).json({ error: "Error creating student" });
  }
}

// Update student
async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { name, address } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const updatedStudent = await studentModel.updateStudent(id, name, address);
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Controller error (updateStudent):", error);
    res.status(500).json({ error: "Error updating student" });
  }
}

// Delete student
async function deleteStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const deleted = await studentModel.deleteStudent(id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Controller error (deleteStudent):", error);
    res.status(500).json({ error: "Error deleting student" });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
