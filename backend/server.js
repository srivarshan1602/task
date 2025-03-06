const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sri2002',
  database: 'dailytask'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/init', (req, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
  )`;
  db.query(sql, err => {
    if (err) throw err;
    res.send('Tasks table created');
  });
});

app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, completed: false });
  });
});

app.delete('/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], err => {
    if (err) throw err;
    res.json({ message: 'Task deleted' });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, req.params.id], err => {
    if (err) throw err;
    res.json({ message: 'Task updated' });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
