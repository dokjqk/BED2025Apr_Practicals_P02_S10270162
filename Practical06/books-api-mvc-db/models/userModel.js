const sql = require("mssql");
const dbConfig = require("../dbConfig");


const createUser = async (user) => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('username', sql.NVarChar, user.username)
            .input('email', sql.NVarChar, user.email)
            .query(`
                INSERT INTO Users (username, email)
                OUTPUT INSERTED.*
                VALUES (@username, @email)
            `);
        return result.recordset[0];
    } catch (err) {
        throw err;
    } finally {
        if (pool) await pool.close();
    }
};

const getAllUsers = async () => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .query('SELECT * FROM Users');
        return result.recordset;
    } catch (err) {
        throw err;
    } finally {
        if (pool) await pool.close();
    }
};

const getUserById = async (id) => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE id = @id');
        return result.recordset[0] || null;
    } catch (err) {
        throw err;
    } finally {
        if (pool) await pool.close();
    }
};

const updateUser = async (id, updatedUser) => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('username', sql.NVarChar, updatedUser.username)
            .input('email', sql.NVarChar, updatedUser.email)
            .query(`
                UPDATE Users
                SET username = @username, email = @email
                WHERE id = @id;
                SELECT * FROM Users WHERE id = @id;
            `);
        return result.recordset[0];
    } catch (err) {
        throw err;
    } finally {
        if (pool) await pool.close();
    }
};

const deleteUser = async (id) => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Users WHERE id = @id');
        return { message: 'User deleted successfully' };
    } catch (err) {
        throw err;
    } finally {
        if (pool) await pool.close();
    }
};

async function searchUsers(searchTerm) {
  let connection; // Declare connection outside try for finally access
  try {
    connection = await sql.connect(dbConfig);

    // Use parameterized query to prevent SQL injection
    const query = `
    SELECT *
    FROM Users
    WHERE username LIKE '%' + @searchTerm + '%'
        OR email LIKE '%' + @searchTerm + '%'
    `;

    const request = connection.request();
    request.input("searchTerm", sql.NVarChar, searchTerm); // Explicitly define type
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error in searchUsers:", error); // More specific error logging
    throw error; // Re-throw the error for the controller to handle
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection after searchUsers:", err);
      }
    }
  }
}

async function getUsersWithBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    const query = `
    SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
    FROM Users u
    LEFT JOIN UserBooks ub ON ub.user_id = u.id
    LEFT JOIN Books b ON ub.book_id = b.id
    ORDER BY u.username;
    `;

    const result = await connection.request().query(query);

    // Explanation of 'result' object and 'result.recordset':
    // The mssql package returns query results in a 'result' object.
    // 'result.recordset' is an array of JavaScript objects.
    // Each object in 'result.recordset' represents a row from the SQL query's output.
    // The keys of these objects correspond to the column aliases (e.g., 'user_id', 'username', 'book_id', 'title', 'author')
    // defined in the SQL SELECT statement.
    // For example, multiple rows from the SQL query like:
    // user_id | username | email             | book_id | title                         | author
    // --------|----------|-------------------|---------|-------------------------------|-----------------
    // 1       | user1    | user1@example.com | 1       | To Kill a Mockingbird       | Harper Lee
    // 1       | user1    | user1@example.com | 2       | The Hitchhiker's Guide to the Galaxy | Douglas Adams
    //
    // would be represented in 'result.recordset' as an array of objects:
    // [
    //   {
    //     user_id: 1,
    //     username: 'user1',
    //     email: 'user1@example.com',
    //     book_id: 1,
    //     title: 'To Kill a Mockingbird',
    //     author: 'Harper Lee'
    //   },
    //   {
    //     user_id: 1,
    //     username: 'user1',
    //     email: 'user1@example.com',
    //     book_id: 2,
    //     title: 'The Hitchhiker\'s Guide to the Galaxy',
    //     author: 'Douglas Adams'
    //   }
    // ]
    //
    // If a user has multiple books, there will be multiple rows for that user,
    // each with the same user information but different book information.
    // The subsequent JavaScript code then groups these rows by user.

    // Group users and their books
    const usersWithBooks = {};
    for (const row of result.recordset) {
      const userId = row.user_id;
      if (!usersWithBooks[userId]) {
        usersWithBooks[userId] = {
          id: userId,
          username: row.username,
          email: row.email,
          books: [],
        };
      }
      // Only add book if book_id is not null (for users with no books)
      if (row.book_id !== null) {
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }
    }

    return Object.values(usersWithBooks);
  } catch (error) {
    console.error("Database error in getUsersWithBooks:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(
          "Error closing connection after getUsersWithBooks:",
          err
        );
      }
    }
  }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks,
};