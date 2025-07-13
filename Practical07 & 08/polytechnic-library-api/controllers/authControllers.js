const bcrypt = require("bcryptjs");
const auth = require("../models/authModels");
const jwt = require("jsonwebtoken");

async function getUserByUsername(req, res) {
    try {
        const username = req.body.username;
        const user = await auth.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error retrieving user" });
    }
}

async function registerUser(req, res) {
    const { username, password, role } = req.body;
    try {

        const existingUser = await auth.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            password: hashedPassword,
            role
        };
        const createdUser = await auth.createUser(newUser);
        res.status(201).json({message: "User registered successfully", user: createdUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await auth.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    getUserByUsername,
    registerUser,
    loginUser
};
