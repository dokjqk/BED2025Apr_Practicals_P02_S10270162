const sql = require("mssql");
const dbConfig = require("../db/dbConfig");

// Get user by username
async function getUserByUsername(username) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Users WHERE username = @username`;
        const request = connection.request();
        request.input("username", username);
        const result = await request.query(sqlQuery);
        return result.recordset[0]; // Return the first user found
    } catch (error) {
        console.error("Error in getUserByUsername:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error in closing connection.", closeError);
            }
        }
    }
}

async function createUser(user) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)`;
        const request = connection.request();
        request.input("username", user.username);
        request.input("passwordHash", user.password);
        request.input("role", user.role);
        await request.query(sqlQuery);
        return { message: "User created successfully" };
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error in closing connection.", closeError);
            }
        }
    }
}

module.exports = {
    getUserByUsername,
    createUser
};