const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');

const application = () => {
    console.log('\u2554\u2550\u2557\u250C\u252C\u2510\u250C\u2500\u2510\u252C  \u250C\u2500\u2510\u252C \u252C\u250C\u2500\u2510\u250C\u2500\u2510  \r\n\u2551\u2563 \u2502\u2502\u2502\u251C\u2500\u2518\u2502  \u2502 \u2502\u2514\u252C\u2518\u251C\u2524 \u251C\u2524   \r\n\u255A\u2550\u255D\u2534 \u2534\u2534  \u2534\u2500\u2518\u2514\u2500\u2518 \u2534 \u2514\u2500\u2518\u2514\u2500\u2518  \r\n\u2554\u2566\u2557\u250C\u2500\u2510\u250C\u2510\u250C\u250C\u2500\u2510\u250C\u2500\u2510\u250C\u2500\u2510\u252C\u2500\u2510     \r\n\u2551\u2551\u2551\u251C\u2500\u2524\u2502\u2502\u2502\u251C\u2500\u2524\u2502 \u252C\u251C\u2524 \u251C\u252C\u2518     \r\n\u2569 \u2569\u2534 \u2534\u2518\u2514\u2518\u2534 \u2534\u2514\u2500\u2518\u2514\u2500\u2518\u2534\u2514\u2500    ')
    inquirer.prompt([
        {
            type: 'list',
            name: 'db_nav',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ],
        }
    ]).then((data) => {
        switch (data.db_nav) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
        }
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

    const sql = `SELECT name, id FROM department`;
    const data = await db.query(sql);

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

    const sql = `SELECT title, role.id, department.name AS department, salary FROM role INNER JOIN department ON department_id = department.id ORDER BY department.name`;
    const data = await db.query(sql);

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

    const sql = `SELECT first_name, last_name, department.name AS department, role.title AS role, role.salary, manager_id FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id;`;
    const data = await db.query(sql);

    console.table([...data[0]]);

    application();
};

// add department
const addDepartment = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    );

    const question = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ];

    const department = await inquirer.prompt(question);

    const sql = `INSERT INTO department (name)
    VALUES (?)`
    const params = [department.name];

    await db.query(sql, params);

    console.log(`${department.name} added to employee_db`);

    application();
};

// add role
const addRole = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    );

    const sqlDepts = await db.query('SELECT id, name FROM department');
    const listDepts = await sqlDepts[0].map(({ id, name }) => ({ name: name, value: id }));

    const questions = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does this role belong to?',
            choices: listDepts,
        },
    ]

    const role = await inquirer.prompt(questions);

    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`
    const params = [role.title, role.salary, role.department];

    await db.query(sql, params);
    
    console.log(`${role.title} added to employee_db`);

    application();
};

// add employee
const addEmployee = async () => {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    );

    const sqlRole = await db.query('SELECT id, title FROM role');
    const listRoles = await sqlRole[0].map(({ id, title }) => ({ name: title, value: id }));

    const sqlManager = await db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');
    const listManagers = await sqlManager[0].map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

    const questions = [
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee\'s first name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee\'s last name?',
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is this employee\'s role?',
            choices: listRoles,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is this employee\'s manager?',
            choices: listManagers,
        },
    ]

    const employee = await inquirer.prompt(questions);

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [employee.first_name, employee.last_name, employee.role, employee.manager];

    await db.query(sql, params);
    
    console.log(`${employee.first_name} ${employee.last_name} added to employee_db`);

    application();
};

// update employee role

application();