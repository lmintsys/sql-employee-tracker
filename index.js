const inquirer = require("inquirer");
const cTable = require("console.table");
const EmployeesDb = require("./lib/EmployeesDb");

async function viewDepartments() {
  const [rows] = await new EmployeesDb().getDepartments();

  console.table(rows);
  mainMenu();
}

async function viewRoles() {
  const [rows] = await new EmployeesDb().getRoles();

  console.table(rows);
  mainMenu();
}

async function viewEmployees() {
  const [rows] = await new EmployeesDb().getEmployees();

  console.table(rows);
  mainMenu();
}
