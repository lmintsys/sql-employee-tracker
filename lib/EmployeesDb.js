const mysql = require("mysql2/promise");

// Class that contains and manages sql queries
class EmployeesDb {
  async getConnection() {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "A23b$C32#",
      database: "employees_db",
    });

    return this.connection;
  }

  async getDepartments() {
    const connection = await this.getConnection();

    return await connection.query("SELECT * FROM departments;");
  }

  async getRoles() {
    const connection = await this.getConnection();

    return await connection.query(
      "SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON departments.id = roles.department_id;"
    );
  }

  async getEmployees() {
    const connection = await this.getConnection();

    return await connection.query(
      "SELECT e1.id, e1.first_name, e1.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employees e1 LEFT JOIN roles ON e1.role_id = roles.id LEFT JOIN departments ON departments.id = roles.department_id LEFT JOIN employees e2 ON e1.manager_id = e2.id;"
    );
  }

  async addDepartment(name) {
    const connection = await this.getConnection();

    return await connection.query(
      `INSERT INTO departments (name) VALUES ("${name}");`
    );
  }

  async addRole(name, salary, department) {
    const connection = await this.getConnection();

    return await connection.query(
      `INSERT INTO roles (title, salary, department_id) VALUES ("${name}", ${salary}, ${department});`
    );
  }

  async addEmployee(first_name, last_name, role, manager) {
    const connection = await this.getConnection();

    return await connection.query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role}, ${manager});`
    );
  }

}

module.exports = EmployeesDb;
