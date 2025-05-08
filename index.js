const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { eq } = require("drizzle-orm");

// Initialize DB
const sqlite = new Database("drizzle-example.db");
const db = drizzle(sqlite);

// Define schema
const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

// Create table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`);

// === CREATE ===
async function createUser(name, email) {
  await db.insert(users).values({ name, email });
  console.log(`User '${name}' created`);
}

// === READ ===
async function getUsers() {
  const result = await db.select().from(users);
  console.log("Users:", result);
}

// === UPDATE ===
async function updateUser(id, newName) {
  await db.update(users).set({ name: newName }).where(eq(users.id, id));
  console.log(`User ID ${id} updated`);
}

// === DELETE ===
async function deleteUser(id) {
  await db.delete(users).where(eq(users.id, id));
  console.log(`User ID ${id} deleted`);
}

// Usage Example
(async () => {
  await createUser("Alice", "alice@demo.com");
  await createUser("Bob", "bob@demo.com");
  await getUsers();

  await updateUser(1, "Alice Updated");
  await deleteUser(2);
  await getUsers();
})();
