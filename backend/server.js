const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Parsing for JSON bodies

// Set up MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todolist",
});

// Connect to the db
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

// GET all TODOs
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.json(results);
    }
  });
});

// ADD TODO
app.post("/tasks", (req, res) => {
  const { text } = req.body;
  const newTodo = { text, completed: false };

  db.query("INSERT INTO tasks SET ?", newTodo, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to add task" });
    } else {
      res.status(201).json({ id: results.insertId, ...newTodo });
    }
  });
});

// DELETE TODO
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete task" });
    } else {
      res.status(200).json({ message: "Task deleted" });
    }
  });
});

// UPDATE TODO -> SET AS COMPLETED
app.put("/tasks/update/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to update task" });
      } else {
        res.status(200).json({ message: "Task updated" });
      }
    }
  );
});

// UPDATE TODO -> EDIT TEXT
app.put("/tasks/rename/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  db.query(
    "UPDATE tasks SET text = ? WHERE id = ?",
    [text, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to update task" });
      } else {
        res.status(200).json({ message: "Task updated" });
      }
    }
  );
});

// ===================   Now the dashboard notes ======================= //

// GET all DASHNOTES
app.get("/dashnotes", (req, res) => {
  db.query("SELECT * FROM dashnotes", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch notes" });
    } else {
      res.json(results);
    }
  });
});

// ADD DASHNOTE
app.post("/dashnotes", (req, res) => {
  const { i, content, x, y, w, h, image, backgroundColor, color } = req.body;

  const newNote = {
    i,
    content,
    x,
    y,
    w,
    h,
    image,
    backgroundColor,
    color,
  };

  db.query("INSERT INTO dashnotes SET ?", newNote, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add note" });
    }
    res.status(201).json({
      message: "Note added successfully",
      ...newNote,
    });
  });
});

// DELETE DASHNOTE
app.delete("/dashnotes/:i", (req, res) => {
  const { i } = req.params;
  db.query("DELETE FROM dashnotes WHERE i = ?", [i], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete note" });
    } else {
      res.status(200).json({ message: "Note deleted" });
    }
  });
});

// UPDATE DASHNOTE -> Only text edit
app.put("/dashnotes/updateText/:i", (req, res) => {
  const { i } = req.params;
  const { content } = req.body;

  db.query(
    "UPDATE dashnotes SET content = ? WHERE i = ?",
    [content, i],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to update note" });
      } else {
        res.status(200).json({ message: "Note updated" });
      }
    }
  );
});

// UPDATE DASHNOTE -> Only for position and size
app.put("/dashnotes/updatePos/:i", (req, res) => {
  const { i } = req.params;
  const { x, y, w, h } = req.body;

  db.query(
    "UPDATE dashnotes SET x = ? , y = ? , w = ? , h = ? WHERE i = ?",
    [x, y, w, h, i],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to update note" });
      } else {
        res.status(200).json({ message: "Note updated" });
      }
    }
  );
});

// UPDATE DASHNOTE -> Only for colors
app.put("/dashnotes/updateColors/:i", (req, res) => {
  const { i } = req.params;
  const { backgroundColor, color } = req.body;

  db.query(
    "UPDATE dashnotes SET backgroundColor = ? , color = ?  WHERE i = ?",
    [backgroundColor, color, i],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to update note" });
      } else {
        res.status(200).json({ message: "Note updated" });
      }
    }
  );
});

// ========================== Start server ============================ //
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
