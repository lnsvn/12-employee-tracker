const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to employee_db.`)
);

// ROUTE TESTING IN INSOMNIA⬇

// view all departments
app.get('/api/departments', (req, res) => {

    const sql = `SELECT name, id FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        };
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// view all roles
app.get('/api/roles', (req, res) => {

    // const sql = `SELECT department.name AS department, role.title, role.id, role.salary FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department.name`;

    const sql = `SELECT title, role.id, department.name AS department, salary FROM role INNER JOIN department ON department_id = department.id ORDER BY department.name`;

    db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        };
        res.json({
          message: 'success',
          data: rows
        });
    });
});

// view all employees
app.get('/api/employees', (req, res) => {

    const sql = `SELECT first_name, last_name, department.name AS department, role.title AS role, role.salary, manager_id FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id;`

    db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          console.log(err);
           return;
        };
        res.json({
          message: 'success',
          data: rows
        });
    });
});

// add a department
app.post('/api/new-department', ({ body }, res) => {
    
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        };
        res.json({
            message: 'success',
            data: body
        });
    });
});

// add a role
app.post('/api/new-role', ({ body }, res) => {

    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // console.log(err);
            return;
        };
        res.json({
            message: 'success',
            data: body
        });
    }); 
});

// add an employee 
app.post('/api/new-employee', ({ body }, res) => {

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message }); 
            return;
        }
        res.json({
            message: "success",
            data: body
        });
    });
});

// update an employee role
app.put('/api/employee/:id', (req, res) => {

    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [req.body.role_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
              message: 'Employee not found'
            });
        } else {
            res.json({
              message: 'success',
              data: req.body,
              changes: result.affectedRows
            });
        };
    });
});

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
