INSERT INTO department (name) VALUES
('Sales'),
('Marketing'),
('Security');

INSERT INTO role (title, salary, department) VALUES
('Sales Associate', 1200.00, 1),
('Marketing Senior', 2200.00, 2),
('Marketing Intern', 100.00, 2),
('Head of Security', 1300.00, 3),
('Security Gaurd', 1000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Bob', 'Dylan', 2, NULL),
('Robert', 'Plant', 3, 1),
('Keith', 'Richards', 4, NULL),
('Angus', 'Young', 5, 3);


