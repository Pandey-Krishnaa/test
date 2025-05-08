const Database = require("better-sqlite3");

// Create or open a database file
const db = new Database("sample.db");

// Create a table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`
).run();

// === CREATE ===
function createUser(name, email) {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const info = stmt.run(name, email);
  console.log("User created with ID:", info.lastInsertRowid);
}

// === READ ===
function getUsers() {
  const stmt = db.prepare("SELECT * FROM users");
  const users = stmt.all();
  console.log("All Users:", users);
}

// === UPDATE ===
function updateUser(id, newName) {
  const stmt = db.prepare("UPDATE users SET name = ? WHERE id = ?");
  const info = stmt.run(newName, id);
  console.log(`Updated ${info.changes} user(s)`);
}

// === DELETE ===
function deleteUser(id) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  const info = stmt.run(id);
  console.log(`Deleted ${info.changes} user(s)`);
}

// Example usage
createUser("Alice", "alice@example.com");
createUser("Bob", "bob@example.com");

getUsers();

updateUser(1, "Alice Updated");
deleteUser(2);

getUsers();
