INSERT INTO department (department_name)
VALUES 
    ("Administration"),
    ("Sales"),
    ("Human Resources"),
    ("Customer Service");

INSERT INTO roles (job_title, salary, department_id)
VALUES 
    ("CEO", 1000000, 1),
    ("Office Administrator", 50000, 1),
    ("Sales Lead", 50000, 2),
    ("Salesman", 40000, 2),
    ("HR Lead", 50000, 3),
    ("HR Rep", 40000, 3),
    ("Service Lead", 50000, 4),
    ("Service Rep", 30000.99, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Smith", ),
    ("Jane", "Doe", ),
    ("Bob", "Brown", ),
    ("Charlie", "Cruise", ),
    ("Daniel", "David", ),
    ("Eddie", "Easter", ),
    ("Francis", "Feather", ),
    ("Georgina", "Grettle", );