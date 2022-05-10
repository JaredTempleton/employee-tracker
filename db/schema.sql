-- Creates the database for the employee tracker and will drop it if one exists already --
DROP DATABASE IF EXISTS employeeTracker;
CREATE DATABASE employeeTracker;
USE employeeTracker;

-- Table creation --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    job_title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);