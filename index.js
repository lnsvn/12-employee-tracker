// imports
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');

// function to prompt application navigation
const startApplication = () => {
    // logo
    console.log('\r\n\u2554\u2550\u2557\u250C\u252C\u2510\u250C\u2500\u2510\u252C  \u250C\u2500\u2510\u252C \u252C\u250C\u2500\u2510\u250C\u2500\u2510\r\n\u2551\u2563 \u2502\u2502\u2502\u251C\u2500\u2518\u2502  \u2502 \u2502\u2514\u252C\u2518\u251C\u2524 \u251C\u2524 \r\n\u255A\u2550\u255D\u2534 \u2534\u2534  \u2534\u2500\u2518\u2514\u2500\u2518 \u2534 \u2514\u2500\u2518\u2514\u2500\u2518\r\n\u2554\u2566\u2557\u252C\u2500\u2510\u250C\u2500\u2510\u250C\u2500\u2510\u252C\u250C\u2500\u250C\u2500\u2510\u252C\u2500\u2510   \r\n \u2551 \u251C\u252C\u2518\u251C\u2500\u2524\u2502  \u251C\u2534\u2510\u251C\u2524 \u251C\u252C\u2518   \r\n \u2569 \u2534\u2514\u2500\u2534 \u2534\u2514\u2500\u2518\u2534 \u2534\u2514\u2500\u2518\u2534\u2514\u2500   \r\n')
    // navigation prompt
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
                'Update an employee\'s role',
                'Quit'
            ],
        }
    ]).then((data) => {
        // uses switch statment to select one of many functions to be executed
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
            case 'Update an employee\'s role':
                updateEmployee();
                break;
            case 'Quit':
                quitApplication();
                break;
        }
    })
}

// view all departments
const viewAllDepartments = async () => {
    // database connection
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    ); 

    // query
    const sql = `SELECT name, id FROM department`;
    const data = await db.query(sql);

    // prints data using console.table package
    console.table([...data[0]]);

    // call start function to reprompt nav
    startApplication();
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

    const sql = `SELECT title, role.id, department.name AS department, salary FROM role INNER JOIN department ON department_id = department.id`;
    const data = await db.query(sql);

    console.table([...data[0]]);

    startApplication();
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

    const sql = `SELECT e1.id, e1.first_name, e1.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id INNER JOIN employee e1 ON employee.id = e1.id LEFT JOIN employee e2 ON employee.manager_id = e2.id ORDER BY employee.id;`;
    const data = await db.query(sql);

    console.table([...data[0]]);

    startApplication();
};

// add department
const addDepartment = async () => {
    // db connection
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
    // prompt to get value for query
    const department = await inquirer.prompt(question);

    // insert into query
    const sql = `INSERT INTO department (name)
    VALUES (?)`
    const params = [department.name];
    await db.query(sql, params);

    // prints new department name in terminal
    console.log(`${department.name} added to employee_db`);

    // call start function to reprompt nav
    startApplication();
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

    startApplication();
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

    startApplication();
};

// update employee role
const updateEmployee = async () => {
    // db connection
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        }
    );

    // queries db to get employee names for list choices
    const sqlEmployee = await db.query(`SELECT id, first_name, last_name FROM employee`);
    const listEmployees = await sqlEmployee[0].map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

    // queries db to get role titles for list choices
    const sqlRole = await db.query('SELECT id, title FROM role');
    const listRoles = await sqlRole[0].map(({ id, title }) => ({ name: title, value: id }));

    const questions = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: listEmployees
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is this employee\'s new role?',
            choices: listRoles
        },
    ]
    // prompt to get values for query
    const updateEmployee = await inquirer.prompt(questions);

    // update query
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [updateEmployee.role, updateEmployee.employee];
    await db.query(sql, params);
    
    // prints updated employees id in the terminal
    console.log(`Employee ${updateEmployee.employee}'s role updated`);

    // call start function to reprompt nav
    startApplication();
};

// function to quit application
const quitApplication = async () => {
    console.log('You have exited Employee Tracker.');
    process.exit();
};

// calls start function when application is initiated
startApplication();