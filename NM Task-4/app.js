const mongoose = require("mongoose");
const Book = require("./models/Book");

// ------------------- DATABASE CONNECTION -------------------
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
.then(() => console.log("\n✅ MongoDB Connected Successfully\n"))
.catch(err => console.log("❌ Connection Error:", err));

// ------------------- CREATE OPERATIONS -------------------

async function insertBooks() {
  try {
    const existing = await Book.find();
    if (existing.length > 0) {
      console.log("📚 Books already exist. Skipping insertion.\n");
      return;
    }

    await Book.insertMany([
      { title: "Atomic Habits", author: "James Clear", category: "Self Help", publishedYear: 2018, availableCopies: 5 },
      { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", publishedYear: 2005, availableCopies: 3 },
      { title: "Clean Code", author: "Robert C Martin", category: "Programming", publishedYear: 2012, availableCopies: 4 },
      { title: "Deep Work", author: "Cal Newport", category: "Productivity", publishedYear: 2016, availableCopies: 6 },
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Finance", publishedYear: 2000, availableCopies: 2 },
      { title: "Think Like a Monk", author: "Jay Shetty", category: "Self Help", publishedYear: 2020, availableCopies: 5 },
      { title: "You Can Win", author: "Shiv Khera", category: "Motivation", publishedYear: 1998, availableCopies: 1 }
    ]);

    console.log("🟢 7 Books Inserted Successfully\n");
  } catch (error) {
    console.log("❌ Error Inserting Books:", error.message);
  }
}

// ------------------- READ OPERATIONS -------------------

async function displayAllBooks() {
  try {
    const books = await Book.find();
    console.log("📖 All Books:\n", books, "\n");
  } catch (error) {
    console.log("❌ Read Error:", error.message);
  }
}

async function displayBooksByCategory(category) {
  try {
    const books = await Book.find({ category });
    console.log(`📘 Books in Category '${category}':\n`, books, "\n");
  } catch (error) {
    console.log("❌ Category Read Error:", error.message);
  }
}

async function displayBooksAfterYear(year) {
  try {
    const books = await Book.find({ publishedYear: { $gt: year } });
    console.log(`📙 Books Published After ${year}:\n`, books, "\n");
  } catch (error) {
    console.log("❌ Year Filter Error:", error.message);
  }
}

// ------------------- UPDATE OPERATIONS -------------------

async function updateBookCopies(title, change) {
  try {
    const book = await Book.findOne({ title });

    if (!book) {
      console.log(`⚠️ Book '${title}' Not Found\n`);
      return;
    }

    if (book.availableCopies + change < 0) {
      console.log("🚫 Invalid Update: Stock cannot be negative\n");
      return;
    }

    book.availableCopies += change;
    await book.save();

    console.log(`🟡 Copies Updated for '${title}' → New Stock: ${book.availableCopies}\n`);
  } catch (error) {
    console.log("❌ Update Error:", error.message);
  }
}

async function updateBookCategory(title, newCategory) {
  try {
    const book = await Book.findOne({ title });

    if (!book) {
      console.log(`⚠️ Book '${title}' Not Found\n`);
      return;
    }

    book.category = newCategory;
    await book.save();

    console.log(`🟣 Category Updated for '${title}' → New Category: ${newCategory}\n`);
  } catch (error) {
    console.log("❌ Category Update Error:", error.message);
  }
}

// ------------------- DELETE OPERATIONS -------------------

async function deleteBookIfOutOfStock(title) {
  try {
    const book = await Book.findOne({ title });

    if (!book) {
      console.log(`⚠️ Book '${title}' Not Found\n`);
      return;
    }

    if (book.availableCopies === 0) {
      await Book.deleteOne({ title });
      console.log(`🔴 Book '${title}' Deleted (Out of Stock)\n`);
    } else {
      console.log(`🟢 '${title}' Still Has Stock → ${book.availableCopies}\n`);
    }
  } catch (error) {
    console.log("❌ Delete Error:", error.message);
  }
}

// ------------------- PROGRAM EXECUTION -------------------

async function main() {
  await insertBooks();

  await displayAllBooks();
  await displayBooksByCategory("Self Help");
  await displayBooksAfterYear(2015);

  await updateBookCopies("Atomic Habits", -2);
  await updateBookCategory("Clean Code", "Software Engineering");

  await deleteBookIfOutOfStock("You Can Win");

  console.log("🎉 Program Execution Completed\n");
}

main();
