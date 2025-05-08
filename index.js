const express = require("express");
const knexLib = require("knex");
const os = require("os");

const app = express();
app.use(express.json());

// Initialize knex with SQLite
const db = knexLib({
  client: "sqlite3",
  connection: {
    filename: "./data.sqlite",
  },
  useNullAsDefault: true,
});

// Create users table if not exists
db.schema.hasTable("users").then((exists) => {
  if (!exists) {
    return db.schema.createTable("users", (table) => {
      table.increments("id");
      table.string("name");
      table.string("email");
    });
  }
});

// Routes
app.get("/users", async (req, res) => {
  const users = await db("users").select("*");
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const [id] = await db("users").insert({ name, email });
  res.json({ id, name, email });
});

app.get("/users/:id", async (req, res) => {
  const user = await db("users").where({ id: req.params.id }).first();
  if (user) res.json(user);
  else res.status(404).json({ message: "User not found" });
});

app.delete("/users/:id", async (req, res) => {
  const deleted = await db("users").where({ id: req.params.id }).del();
  if (deleted) res.json({ message: "User deleted" });
  else res.status(404).json({ message: "User not found" });
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log(`API running at:`);
  console.log(`→ Local:   http://localhost:${PORT}`);
  console.log(`→ Network: http://${ip}:${PORT}`);
});
