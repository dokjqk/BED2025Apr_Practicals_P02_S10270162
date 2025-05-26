const userModel = require("../models/userModel");

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = req.body;
        const createdUser = await userModel.createUser(user);
        res.status(201).json({ success: true, user: createdUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating user", error: err.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error retrieving users", error: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await userModel.getUserById(id);
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error retrieving user", error: err.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedUser = req.body;
        const user = await userModel.updateUser(id, updatedUser);
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating user", error: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await userModel.deleteUser(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
    }
};


async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({ success: false, message: "Search term is required" });
  }

  try {
    const users = await userModel.searchUsers(searchTerm); // FIXED: use userModel
    if (users && users.length > 0) {
      res.status(200).json({ success: true, users });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ success: false, message: "Error searching users" });
  }
}


async function getUsersWithBooks(req, res) {
  try {
    const users = await userModel.getUsersWithBooks(); // FIXED: use userModel
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
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
