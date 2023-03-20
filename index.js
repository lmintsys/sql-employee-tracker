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

async function addDepartment() {
  inquirer.prompt(addDepartmentQuestions).then(async (answers) => {
    await new EmployeesDb().addDepartment(answers.name);

    console.log(`The department ${answers.name} was added`);
    mainMenu();
  });
}

async function addRole() {
  const employeesDb = new EmployeesDb();

  const [departmentRows] = await employeesDb.getDepartments();

  const departmentChoices = departmentRows.map((departmentRow) => ({
    value: departmentRow.id,
    name: departmentRow.name,
  }));

  const addRoleQuestions = getAddRoleQuestions(departmentChoices);

  inquirer.prompt(addRoleQuestions).then(async (answers) => {
    await employeesDb.addRole(answers.name, answers.salary, answers.department);
    console.log(answers.department);
    console.log(`The role ${answers.name} was added`);
    mainMenu();
  });
}

async function addEmployee() {
  const employeesDb = new EmployeesDb();

  const [roleRows] = await employeesDb.getRoles();

  const roleChoices = roleRows.map((roleRow) => ({
    value: roleRow.id,
    name: roleRow.title,
  }));

  const [managerRows] = await employeesDb.getEmployees();

  const managerChoices = managerRows.map((managerRow) => ({
    value: managerRow.id,
    name: managerRow.first_name + " " + managerRow.last_name,
  }));

  const addEmployeeQuestions = getAddEmployeeQuestions(roleChoices, [
    { value: null, name: "None" },
    ...managerChoices,
  ]);

  inquirer.prompt(addEmployeeQuestions).then(async (answers) => {
    await employeesDb.addEmployee(
      answers.first_name,
      answers.last_name,
      answers.role,
      answers.manager
    );

    console.log(
      `The employee ${answers.first_name} ${answers.last_name} was added`
    );
    mainMenu();
  });
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

const addDepartmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "name",
  },
];

const getAddRoleQuestions = (departmentChoices) => [
  {
    type: "input",
    message: "What is the name of the role?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "salary",
  },
  {
    type: "list",
    message: "Which department does the role belong to?",
    name: "department",
    choices: departmentChoices,
  },
];

const getAddEmployeeQuestions = (roleChoices, managerChoices) => [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "first_name",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "last_name",
  },
  {
    type: "list",
    message: "What is the employee's role?",
    name: "role",
    choices: roleChoices,
  },
  {
    type: "list",
    message: "Who is the employee's manager?",
    name: "manager",
    choices: managerChoices,
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
