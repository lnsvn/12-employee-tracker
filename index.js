const mysql = require('mysql2/promise');
const fs = require('fs');
const { prompt } = require('inquirer');
const cTable = require('console.table');

function application() {
    prompt([
        {
            type: 'list',
            name: 'db_nav',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees'
                // 'add a department',
                // 'add a role',
                // 'add an employee',
                // 'update an employee role'
            ],
        }
    // ]).then(() => {
    //     fs.readFile('logo.txt', 'utf8', (err, data) => {
    //         console.log(data)
    //         console.error(err)
    //     })
    ]).then((data, err) => {
        switch (data.db_nav) {
            case 'view all departments':
                viewAllDepartments();
                break;
            case 'view all roles':
                viewAllRoles();
                break;
            case 'view all employees':
                viewAllEmployees();
                break;
        }
    
        console.error(err);
    })
}

// view all departments
const viewAllDepartments = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    ); 

    const data = await db.query(`SELECT name, id FROM department`);

    console.table([...data[0]]);

    application();
};

// view all roles
const viewAllRoles = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    ); 

    const data = await db.query(`SELECT title, role.id, department.name AS department, salary FROM role INNER JOIN department ON department_id = department.id ORDER BY department.name`);

    console.table([...data[0]]);

    application();
};

// view all employees
const viewAllEmployees = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    );

    const data = await db.query(`SELECT first_name, last_name, department.name AS department, role.title AS role, role.salary, manager_id FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id;`);

    console.table([...data[0]]);

    application();
};

// add department
// const addDepartment = async () => {

// }

// add role
// add employee
// update employee role





application();
