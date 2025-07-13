const sql = require("mssql");
const dbConfig = require("../db/dbConfig");

// GET /books
async function getAllBooks(){
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Books`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        return result.recordset;
    } catch (error) {
        console.error("Error in GET /books:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error in closing connection.", closeError)
            }
        }
    }

}

// POST /books
async function createBook(bookData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Books (title, author, availability) 
            OUTPUT INSERTED.* 
            VALUES (@title, @author, @availability)
        `;
        const request = connection.request();
        request.input("title", bookData.title);
        request.input("author", bookData.author);
        request.input("availability", bookData.availability);
        const result = await request.query(sqlQuery);
        return result.recordset[0];
    } catch (error) {
        console.error("Error in POST /books:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error in closing connection.", closeError)
            }
        }
    }
}

// PUT /books
async function updateBookAvailability(id, availability) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @id`;
        const request = connection.request();
        request.input("id", id);
        request.input("availability", availability);
        await request.query(sqlQuery);
        return { message: "Book availability updated successfully." };
    } catch (error) {
        console.error(`Error in PUT /books/${id}:`, error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error in closing connection.", closeError)
            }
        }
    }

}

module.exports = {
    getAllBooks,
    createBook,
    updateBookAvailability
}
