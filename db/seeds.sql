INSERT INTO department (name) 
VALUES  ('Human Resources'),
        ('IT'),
        ('Marketing'),
        ('Accountants');

INSERT INTO role (title, salary, department_id)
VALUES  ('HR Manager', 50000, 1),
        ('HR Staff', 35000, 1),
        ('IT Manager', 60000, 2),
        ('IT Staff', 48000, 2),
        ('Marketing Manager', 80000, 3),
        ('Marketing Staff', 65000, 3),
        ('Lead Accountant', 72000, 4),
        ('Accountant Staff', 62000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Ron', 'Swanson', 1, null),
        ('April', 'Ludgate', 2, 1),
        ('Andy', 'Dwyer', 2, 1),
        ('Ben', 'Wyatt', 3, null),
        ('Tom', 'Haverford', 4, 4),
        ('Ann', 'Perkins', 5, null),
        ('Leslie', 'Knope', 6, 6),
        ('Chris', 'Traeger', 6, 6),
        ('Jerry', 'Gergich', 7, null),
        ('Donna', 'Meagle', 8, 9),
        ('Bobby', 'Newport', 8, 9);
