//get dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");


// Starts App
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  startItUp();
});

// Starts prompts
function startItUp() {
  inquirer
    .prompt({
      type: "list",
      name: "selection",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Department",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "End",
      ],
    })
    .then(function ({ selection }) {
      switch (selection) {
        case "View Employees":
          viewEmployees();
          break;

        case "View Employees by Department":
          viewByDepartment();
          break;

        case "Add Employee":
          insertEmployee();
          break;

        case "Remove Employees":
          dropEmployees();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "End":
          connection.end();
          break;
      }
    });
}
//View all employees
function viewEmployees() {
  console.log("Currently viewing all employees\n");

  var query = 
  `SELECT e.id, e.first_name, e.last_name, r.job_title, r.salary, d.name AS department, CONCAT(m.first_name, " ", m.last_name) AS manager
  FROM employee e
  LEFT JOIN roles r
  ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
  ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    
    startItUp();
  });
}

//Employees by department
function viewByDepartment() {
  console.log("Currently viewing departments to choose from\n");

  var query = 
  `SELECT d.id, d.name
  FROM employee e
  LEFT JOIN roles r
  ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name`

  db.query(query, function (err, res) {
    if (err) throw err;

    const listDepartments = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);

    departmentChoiceList(listDepartments);
  });
}
function departmentChoiceList(listDepartments) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentList",
        message: "Which department's employees would you like to see?",
        choices: listDepartments
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentList);

      var query =
      `SELECT e.id, e.first_name, e.last_name, r.job_title, d.name AS department
      FROM employee e
      JOIN roles r
      ON e.role_id = r.id
      JOIN department d
      ON d.id = r.department_id
      WHERE d.id = ?`

      db.query(query, answer.departmentList, function (err, res) {
        if (err) throw err;

        console.table(res);

        startItUp();
      });
    });
}

//Add an employee