const book = require("../models/bookModels");

async function getAllBooks(req, res) {
    try {
        const books = await book.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error retrieving books" });
    }
}

async function updateBookAvailability(req, res){
    try {
        const bookId = parseInt(req.params.id);
        const { availability } = req.body;
        const updateInfo = await book.updateBookAvailability(bookId, availability);
        res.json(updateInfo);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error updating book availability." });
    }
}

async function createBook(req, res) {
    try {
        const newBookData = req.body;
        const newBook = await book.createBook(newBookData);
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error creating book" });
    }
}

module.exports = {
    getAllBooks,
    updateBookAvailability,
    createBook
};
