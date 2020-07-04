const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://control-panel-efe71.firebaseio.com",
});

const db = admin.firestore();

exports.getBooks = async (req, res) => {
  try {
    const booksCollection = db
      .collection("books")
      .orderBy("lastUpdated")
      .limit(30);
    const books = await booksCollection.get();
    if (books.empty) {
      res.status(404).send("No documents found");
    } else {
      const bookList = [];
      books.forEach((book) => {
        bookList.push({
          id: book.id,
          title: book.data().title,
          author: book.data().author,
          lastUpdated: book.data().lastUpdated,
        });
      });
      res.status(200).send(bookList);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getBook = async (req, res) => {
  try {
    const bookRef = db.collection("books").doc(req.params.id);
    const quotesRef = bookRef.collection("quotes");
    const book = await bookRef.get();
    const quotes = await quotesRef.get();
    const quotesList = [];
    quotes.forEach((quote) => {
      const fetchedQuote = {
        id: quote.id,
        quote: quote.data().quote,
        location: quote.data().location,
      };
      quotesList.push(fetchedQuote);
    });
    res.status(200).send({
      id: book.id,
      title: book.data().title,
      author: book.data().author,
      lastUpdated: book.data().lastUpdated.seconds,
      quotes: quotesList,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createBook = async (req, res) => {
  try {
    let bookRef = db.collection("books").doc();
    const book = {
      title: req.body.title,
      author: req.body.author,
      format: req.body.format,
      lastUpdated: Date.now(),
    };
    await bookRef.create(book);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateBook = async (req, res) => {
  try {
    let bookRef = db.collection("books").doc(req.params.id);
    let update = req.body;
    await bookRef.set(update, { merge: true });
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = req.params.id;
    if (!deletedBook) throw new Error("ID is blank");
    await db.collection("books").doc(req.params.id).delete();
    res.status(200).json({ id: deletedBook });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createQuote = async (req, res) => {
  try {
    const book = req.params.id;
    let bookRef = db.collection("books").doc(book);
    let subCollection = bookRef.collection("quotes").doc();
    await subCollection.set({
      quote: req.body.quote,
      location: req.body.location,
    });
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
};
