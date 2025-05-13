const express = require("express");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start DB connection
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Connected to database successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await sql.close();
  console.log("Database connection closed.");
  process.exit(0);
});


// GET all students
app.get("/students", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request().query("SELECT student_id, name, address FROM Students");
    res.json(result.recordset);
  } catch (error) {
    console.error("GET /students error:", error);
    res.status(500).send("Error retrieving students");
  } finally {
    if (connection) await connection.close();
  }
});

// GET student by ID
app.get("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) return res.status(400).send("Invalid student ID");

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request().input("id", studentId);
    const result = await request.query("SELECT student_id, name, address FROM Students WHERE student_id = @id");

    if (!result.recordset[0]) return res.status(404).send("Student not found");
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /students/:id error:", error);
    res.status(500).send("Error retrieving student");
  } finally {
    if (connection) await connection.close();
  }
});

// POST create new student
app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  if (!name) return res.status(400).send("Name is required");

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request()
      .input("name", name)
      .input("address", address || null);

    const result = await request.query(`
      INSERT INTO Students (name, address)
      VALUES (@name, @address);
      SELECT SCOPE_IDENTITY() AS student_id;
    `);

    const newId = result.recordset[0].student_id;

    const fetch = await connection.request()
      .input("id", newId)
      .query("SELECT student_id, name, address FROM Students WHERE student_id = @id");

    res.status(201).json(fetch.recordset[0]);
  } catch (error) {
    console.error("POST /students error:", error);
    res.status(500).send("Error creating student");
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update student
app.put("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, address } = req.body;

  if (isNaN(studentId)) return res.status(400).send("Invalid student ID");

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request()
      .input("id", studentId)
      .input("name", name)
      .input("address", address || null);

    const result = await request.query(`
      UPDATE Students
      SET name = @name, address = @address
      WHERE student_id = @id
    `);

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");

    const updated = await connection.request()
      .input("id", studentId)
      .query("SELECT student_id, name, address FROM Students WHERE student_id = @id");

    res.json(updated.recordset[0]);
  } catch (error) {
    console.error("PUT /students/:id error:", error);
    res.status(500).send("Error updating student");
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) return res.status(400).send("Invalid student ID");

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request().input("id", studentId);
    const result = await request.query("DELETE FROM Students WHERE student_id = @id");

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /students/:id error:", error);
    res.status(500).send("Error deleting student");
  } finally {
    if (connection) await connection.close();
  }
});