// index.js

const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); 
// In-memory database (Array)
let todos = [
    { id: uuidv4(), task: 'Learn Node.js', priority: 'High' },
    { id: uuidv4(), task: 'Create a To-Do App', priority: 'Medium' },
    { id: uuidv4(), task: 'Go for a run', priority: 'Low' }
];

// --- ROUTES ---

// 1. View all todos with filtering
app.get('/todos', (req, res) => {
    let { priority } = req.query;
    if (priority && priority !== 'All') {
        let filteredTodos = todos.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
        res.render("index", { todos: filteredTodos, priority });
    } else {
        res.render("index", { todos, priority: 'All' });
    }
});

// 2. Render form to create a new todo
app.get('/todos/new', (req, res) => {
    res.render("new");
});

// 3. Create a new todo
app.post('/todos', (req, res) => {
    const { task, priority } = req.body;
    if (task && task.trim() !== '') {
        todos.push({ id: uuidv4(), task, priority });
        res.redirect("/todos");
    } else {
        // Simple alert mechanism via query parameter
        res.render("new", { error: "Task cannot be empty!" });
    }
});

// 4. Render form to edit a todo
app.get('/todos/:id/edit', (req, res) => {
    let { id } = req.params;
    let todo = todos.find(t => t.id === id);
    if (todo) {
        res.render("edit", { todo });
    } else {
        res.status(404).send("Todo not found");
    }
});

// 5. Update a todo
app.patch('/todos/:id', (req, res) => {
    let { id } = req.params;
    let { task, priority } = req.body;
    let todo = todos.find(t => t.id === id);
    if (todo) {
        if (task && task.trim() !== '') {
            todo.task = task;
            todo.priority = priority;
            res.redirect("/todos");
        } else {
            res.render("edit", { todo, error: "Task cannot be empty!" });
        }
    } else {
        res.status(404).send("Todo not found");
    }
});

// 6. Delete a todo
app.delete('/todos/:id', (req, res) => {
    let { id } = req.params;
    todos = todos.filter(t => t.id !== id);
    res.redirect("/todos");
});


// Redirect root to /todos
app.get('/', (req, res) => {
    res.redirect('/todos');
});


const port = 8080;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}/todos`);
});
