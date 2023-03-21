const mysql = require("mysql2/promise");

// Class that contains and manages sql queries
class EmployeesDb {
  async getConnection() {
    if (this.connection) {
      return this.connection;
    }
    // Info for connection with MySQL
    this.connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "A23b$C32#",
      database: "employees_db",
    });

    return this.connection;
  }
  //View the contents of each table
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
  //Add entries to any of the tables
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
  //Update role
  async updateRole(employee, role) {
    const connection = await this.getConnection();

    return await connection.query(
      `UPDATE employees SET role_id = ${role} WHERE id = ${employee};`
    );
  }
  //Update manager
  async updateManager(employee, manager) {
    const connection = await this.getConnection();

    return await connection.query(
      `UPDATE employees SET manager_id = ${manager} WHERE id = ${employee};`
    );
  }
  //Delete entries from each of the tables
  async deleteDepartment(department) {
    const connection = await this.getConnection();

    return await this.connection.query(
      `DELETE FROM departments WHERE id = ${department};`
    );
  }

  async deleteRole(role) {
    const connection = await this.getConnection();

    return await this.connection.query(`DELETE FROM roles WHERE id = ${role};`);
  }

  async deleteEmployee(employee) {
    const connection = await this.getConnection();

    return await this.connection.query(
      `DELETE FROM employees WHERE id = ${employee};`
    );
  }
}

module.exports = EmployeesDb;
