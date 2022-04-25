//connect to mysql database
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
      host: "localhost",
      // Your MySQL username,
      user: "root",
      // Your MySQL password
      password: "642593MySQL!",
      database: "employeeTracker_db",
    },
    console.log("Connected to the employee tracking database.")
  );

  module.exports = db;