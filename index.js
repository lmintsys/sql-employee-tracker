const inquirer = require("inquirer");
const cTable = require("console.table");
const EmployeesDb = require("./lib/EmployeesDb");

//View the tables
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

//Add to the tables
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

  //Departments from mysql table to go into inquirer list choices
  const departmentChoices = departmentRows.map((departmentRow) => ({
    value: departmentRow.id, //goes into the app
    name: departmentRow.name, //appears to user
  }));

  const addRoleQuestions = getAddRoleQuestions(departmentChoices);

  inquirer.prompt(addRoleQuestions).then(async (answers) => {
    await employeesDb.addRole(answers.name, answers.salary, answers.department);
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
    name: managerRow.first_name + " " + managerRow.last_name, //full name
  }));

  const addEmployeeQuestions = getAddEmployeeQuestions(roleChoices, [
    { value: null, name: "None" }, //add "None" option to the inquirer list choices before manager choices
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

//Update employee's role
async function updateRole() {
  const employeesDb = new EmployeesDb();

  const [roleRows] = await employeesDb.getRoles();

  const roleChoices = roleRows.map((roleRow) => ({
    value: roleRow.id,
    name: roleRow.title,
  }));

  const [employeeRows] = await employeesDb.getEmployees();

  const employeeChoices = employeeRows.map((employeeRow) => ({
    value: employeeRow.id,
    name: employeeRow.first_name + " " + employeeRow.last_name,
  }));

  const updateRoleQuestions = getUpdateRoleQuestions(
    employeeChoices,
    roleChoices
  );

  inquirer.prompt(updateRoleQuestions).then(async (answers) => {
    await employeesDb.updateRole(answers.employee, answers.role);

    console.log(`Updated employee's role`);
    mainMenu();
  });
}

//Update employee's manager
async function updateManager() {
  const employeesDb = new EmployeesDb();

  const [managerRows] = await employeesDb.getEmployees();

  const managerChoices = managerRows.map((managerRow) => ({
    value: managerRow.id,
    name: managerRow.first_name + " " + managerRow.last_name,
  }));

  const [employeeRows] = await employeesDb.getEmployees();

  const employeeChoices = employeeRows.map((employeeRow) => ({
    value: employeeRow.id,
    name: employeeRow.first_name + " " + employeeRow.last_name,
  }));

  const updateManagerQuestions = getUpdateManagerQuestions(employeeChoices, [
    { value: null, name: "None" },
    ...managerChoices,
  ]);

  inquirer.prompt(updateManagerQuestions).then(async (answers) => {
    await employeesDb.updateManager(answers.employee, answers.manager);
    console.log(`Updated employee's manager`);
    mainMenu();
  });
}
//Delete entries from tables
async function deleteDepartment() {
  const employeesDb = new EmployeesDb();

  const [departmentRows] = await employeesDb.getDepartments();

  const departmentChoices = departmentRows.map((departmentRow) => ({
    value: departmentRow.id,
    name: departmentRow.name,
  }));

  const deleteDepartmentQuestion =
    getDeleteDepartmentQuestion(departmentChoices);

  inquirer.prompt(deleteDepartmentQuestion).then(async (answers) => {
    await employeesDb.deleteDepartment(answers.department);
    console.log(`The department was deleted`);
    mainMenu();
  });
}

async function deleteRole() {
  const employeesDb = new EmployeesDb();

  const [roleRows] = await employeesDb.getRoles();

  const roleChoices = roleRows.map((roleRow) => ({
    value: roleRow.id,
    name: roleRow.title,
  }));

  const deleteRoleQuestion = getDeleteRoleQuestion(roleChoices);

  inquirer.prompt(deleteRoleQuestion).then(async (answers) => {
    await employeesDb.deleteRole(answers.role);
    console.log(`The role was deleted`);
    mainMenu();
  });
}

async function deleteEmployee() {
  const employeesDb = new EmployeesDb();

  const [employeeRows] = await employeesDb.getEmployees();

  const employeeChoices = employeeRows.map((employeeRow) => ({
    value: employeeRow.id,
    name: employeeRow.first_name + " " + employeeRow.last_name,
  }));

  const deleteEmployeeQuestion = getDeleteEmployeeQuestion(employeeChoices);

  inquirer.prompt(deleteEmployeeQuestion).then(async (answers) => {
    await employeesDb.deleteEmployee(answers.employee);
    console.log(`The employee was deleted`);
    mainMenu();
  });
}

//Main menu to appear after each choice
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

//Get questions with choices from the database tables included
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

const getUpdateRoleQuestions = (employeeChoices, roleChoices) => [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "employee",
    choices: employeeChoices,
  },
  {
    type: "list",
    message: "Which role do you want to assign to the selected employee?",
    name: "role",
    choices: roleChoices,
  },
];

const getUpdateManagerQuestions = (employeeChoices, managerChoices) => [
  {
    type: "list",
    message: "Which employee's manager do you want to update?",
    name: "employee",
    choices: employeeChoices,
  },
  {
    type: "list",
    message: "Which manager do you want to assign to the selected employee?",
    name: "manager",
    choices: managerChoices,
  },
];

const getDeleteDepartmentQuestion = (departmentChoices) => [
  {
    type: "list",
    message: "Which department do you want to delete?",
    name: "department",
    choices: departmentChoices,
  },
];

const getDeleteRoleQuestion = (roleChoices) => [
  {
    type: "list",
    message: "Which role do you want to delete?",
    name: "role",
    choices: roleChoices,
  },
];

const getDeleteEmployeeQuestion = (employeeChoices) => [
  {
    type: "list",
    message: "Which employee do you want to delete?",
    name: "employee",
    choices: employeeChoices,
  },
];

//Call a relevant function after each choice
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
        process.exit(0);

      default:
        break;
    }
  });
}

//Initiate app with the title
function init() {
  console.log(`
  ----------------------
  |  EMPLOYEE MANAGER  |
  ----------------------
  `);
  mainMenu();
}

init();
