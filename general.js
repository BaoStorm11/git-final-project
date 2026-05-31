const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the list of books available in the shop using Async/Await syntax
// This function handles the root route and asynchronously returns the complete list of available books.
public_users.get('/', async function (req, res) {
  try {
    // Return the list of books with a success status of 200 OK
    return res.status(200).json({ books: books });
  } catch (error) {
    // Error handling in case something goes wrong during fetching data
    return res.status(500).json({ message: "Error fetching books data" });
  }
});

// Task 11: Get book details based on ISBN using native Promise callbacks
// This route searches for a specific book details using its unique ISBN number via Promises.
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Initiating a new promise to resolve book searching logic asynchronously
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]); // Resolve if book exists
    } else {
      reject({ status: 404, message: "The specified book was not found" }); // Reject if book not found
    }
  })
  .then((book) => res.status(200).json(book)) // Handling success state
  .catch((err) => res.status(err.status).json({ message: err.message })); // Handling failure state
});
  
// Task 12: Get book details based on author using Async/Await syntax
// Asynchronously filters and returns all the books written by a specified author.
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Filtering books database array to match the requested author name
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error while searching author" });
  }
});

// Task 13: Get all books based on title using Async/Await syntax
// Asynchronously searches the book inventory and matches the exact given book title.
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Filtering the books database object by comparing the title property
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error while searching title" });
  }
});

module.exports = public_users;
