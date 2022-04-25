//get dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

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
          viewEmployeesByDepartment();
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
