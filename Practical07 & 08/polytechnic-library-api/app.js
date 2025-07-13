const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookControllers");
const authController = require("./controllers/authControllers");
const { verifyJWT } = require("./middlewares/authMiddleware");


// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// Middleware for JWT authentication



app.get("/books", verifyJWT, bookController.getAllBooks); 
app.put("/books/:id/availability", verifyJWT, bookController.updateBookAvailability); 
app.post("/books", verifyJWT, bookController.createBook);
app.get("/getUser", authController.getUserByUsername);
app.post("/register", authController.registerUser);
app.post("/login", authController.loginUser);



// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});