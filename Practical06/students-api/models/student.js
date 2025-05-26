const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllStudents() {
  const connection = await sql.connect(dbConfig);
  try {
    const result = await connection.request().query("SELECT student_id, name, address FROM Students");
    return result.recordset;
  } finally {
    await connection.close();
  }
}

async function getStudentById(studentId) {
  const connection = await sql.connect(dbConfig);
  try {
    const request = connection.request().input("id", studentId);
    const result = await request.query("SELECT student_id, name, address FROM Students WHERE student_id = @id");
    return result.recordset[0];
  } finally {
    await connection.close();
  }
}

async function createStudent(name, address) {
  const connection = await sql.connect(dbConfig);
  try {
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

    return fetch.recordset[0];
  } finally {
    await connection.close();
  }
}

async function updateStudent(studentId, name, address) {
  const connection = await sql.connect(dbConfig);
  try {
    const request = connection.request()
      .input("id", studentId)
      .input("name", name)
      .input("address", address || null);

    const result = await request.query(`
      UPDATE Students
      SET name = @name, address = @address
      WHERE student_id = @id
    `);

    if (result.rowsAffected[0] === 0) return null;

    const updated = await connection.request()
      .input("id", studentId)
      .query("SELECT student_id, name, address FROM Students WHERE student_id = @id");

    return updated.recordset[0];
  } finally {
    await connection.close();
  }
}

async function deleteStudent(studentId) {
  const connection = await sql.connect(dbConfig);
  try {
    const request = connection.request().input("id", studentId);
    const result = await request.query("DELETE FROM Students WHERE student_id = @id");
    return result.rowsAffected[0] > 0;
  } finally {
    await connection.close();
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
