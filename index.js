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

const mainMenuQuestions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "menu",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Update an employee manager",
      "Delete a department",
      "Delete a role",
      "Delete an employee",
      "Exit",
    ],
  },
];

function mainMenu() {
  inquirer.prompt(mainMenuQuestions).then((answer) => {
    switch (answer.menu) {
      case "View all departments":
        viewDepartments();

        break;
      case "View all roles":
        viewRoles();

        break;
      case "View all employees":
        viewEmployees();

        break;
      case "Add a department":
        addDepartment();

        break;
      case "Add a role":
        addRole();

        break;
      case "Add an employee":
        addEmployee();

        break;
      case "Update an employee role":
        updateRole();

        break;
      case "Update an employee manager":
        updateManager();

        break;
      case "Delete a department":
        deleteDepartment();

        break;
      case "Delete a role":
        deleteRole();

        break;
      case "Delete an employee":
        deleteEmployee();

        break;
      case "Exit":
      default:
        break;
    }
  });
}

function init() {
  console.log(`
  ----------------------
  |  EMPLOYEE MANAGER  |
  ----------------------
  `);
  mainMenu();
}

init();
