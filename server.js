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
          addEmployeeSetup();
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
          db.end();
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
function addEmployeeSetup() {
  console.log("Adding employee")

  var query =
    `SELECT r.id, r.job_title, r.salary
    FROM roles r`

  db.query(query, function (err, res) {
    if (err) throw err;

    const jobChoice = res.map(({ id, title, salary }) => ({ 
      value: id, title: `${title}`, salary: `${salary}`
  }));
  console.table(res);

  addEmployee(jobChoice)
  });
}
function addEmployee(jobChoice) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is this employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is this employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role will this employee be doing?",
        choices: jobChoice
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the ID of this employees manager?"
      },
    ])
    .then(function (answer) {
      var query = `INSERT INTO employee SET ?`

      db.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log("Employee added successfully\n");

          startItUp();
        });
    });
}

//Delete an employee
function dropEmployees() {
  console.log("Select an employee to remove");

  var query =
  `SELECT e.id, e.first_name, e.last_name
  FROM employee e`

  db.query(query, function (err, res) {
    if (err) throw err;

    const dropChoice = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));
    console.table(res);

    dropSelection(dropChoice);
  });
}

function dropSelection(dropChoice) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "What employee would you like to delete?",
        choices: dropChoice
      }
    ])
    .then(function (answer) {
      var query = `DELETE FROM employee WHERE ?`;

      db.query(query, { id: answer.employeeId },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("All gone");

          startItUp();
        });
    });
}

//Update an employee's role
function updateRole() {
  console.log("Updating a role");

  var query = `SELECT e.id, e.first_name, e.last_name, r.job_title, d.name AS department, CONCAT(m.first_name, " ", m.last_name) AS manager
  FROM employee e
  JOIN roles r ON e.role_id = r.id
  JOIN department d ON d.id = r.department_id
  JOIN employee m ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;

    const selectEmployee = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`
    }));
    console.table(res);

    updateSelection(selectEmployee);
  });
}

function updateSelection(selectEmployee) {
  var query = `SELECT r.id, r.job_title, r.salary
  FROM roles r`
  let roleChoice;

  db.query(query, function (err, res) {
    if (err) throw err;

    roleChoice = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);

    updateRoleInq(selectEmployee, roleChoice);
  });
}

function updateRoleInq(selectEmployee, roleChoice) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select an employee to update their role",
        choices: selectEmployee
      },
      {
        type: "list",
        name: "roleId",
        message: "Select which role this employee will now be fulfilling",
        choices: roleChoice
      },
    ])
    .then(function (answer) {
      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      db.query(query, [
        answer.roleId,
        answer.employeeId
      ], function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employee successfully updated");

        startItUp();
      });
    });
}