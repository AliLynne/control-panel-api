const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  createQuote,
} = require("./handlers");

const app = express();

app.use(cors({ origin: true }));

// Routes
app.get("/hello", (req, res) => {
  return res.status(200).send("Hello!!");
});

// Create
app.post("/api/books", createBook);
app.post("/api/books/:id/quotes", createQuote);
// Read

app.get("/api/books", getBooks);
app.get("/api/books/:id", getBook);

// Update
// app.put
app.put("/api/books/:id", updateBook);

// Delete
// app.delete
app.delete("/api/books/:id", deleteBook);

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
