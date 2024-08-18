const inquirer = require('inquirer');
const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',
    password: 'Madmax!23123',
    host: 'localhost',
    database: 'employee_db'
},
console.log('Connected to the employee_db database!')
);

pool.connect();


const questions = {
    type: 'list',
    name: 'userAction',
    message: "What would you like to do?",
    choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'   
    ]
};


function promptUserForAction(){
    inquirer.prompt([questions])
    .then(async answer => {
        console.log(answer.userAction);
        if(answer.userAction == 'View All Departments'){
            try {
                const { rows } = await pool.query("SELECT * FROM department");
                console.log("");
                console.table(rows);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
            
        }else if(answer.userAction == 'View All Roles'){
            try {
                const { rows } = await pool.query("SELECT * FROM role");
                console.log("");
                console.table(rows);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }else if(answer.userAction == 'View All Employees'){
            try {
                const { rows } = await pool.query("SELECT * FROM employee");
                console.log("");
                console.table(rows);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }else if(answer.userAction == 'Add Department'){
            const nameOfDepartmentToAdd = await promptUserForNameOfDepartment();
            try {
                const { rows } = await pool.query("INSERT INTO department (name) VALUES ($1);", [nameOfDepartmentToAdd]);
                console.log("");
                console.log(`New Department Created ${nameOfDepartmentToAdd}`);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }else if(answer.userAction == 'Add Role'){
            const userRoleData = await promptUserForRole();
            try {
                const { rows } = await pool.query("INSERT INTO role (title, salary, department) VALUES ($1, $2, $3);", [userRoleData[0], userRoleData[1], userRoleData[2]]);
                console.log("");
                console.log(`New Role Created ${userRoleData[0]}`);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }else if(answer.userAction == 'Add Employee'){
            const userEmployeeData = await promptUserForEmployee();
            console.log(userEmployeeData);
            try {
                const { rows } = await pool.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);", [userEmployeeData[0], userEmployeeData[1], userEmployeeData[2], userEmployeeData[3]]);
                console.log("");
                console.log(`New employee Created ${userEmployeeData[0]} ${userEmployeeData[1]}`);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }else if(answer.userAction == 'Update Employee Role'){
            const userEmployeeData = await promptUserForUpdateEmployeeRole();
            console.log(userEmployeeData);
            try {
                const { rows } = await pool.query("UPDATE employee SET first_name = $1, last_name = $2, role_id = $3, manager_id = $4 WHERE id = $5;", [userEmployeeData[1], userEmployeeData[2], userEmployeeData[3], userEmployeeData[4], userEmployeeData[0]]);
                console.log("");
                console.log(`Employee role updated ${userEmployeeData[1]} ${userEmployeeData[2]}`);
                console.log("");
            } catch (err) {
                console.error('Error executing query', err.stack);
            }
        }
        if(answer.userAction != 'Quit'){
            promptUserForAction();
        }else{
            process.exit(0);
        }
    })
    .catch(error => {
        console.log(error);
    })

}

async function promptUserForNameOfDepartment(){
    try{
        const {departmentName} = await inquirer.prompt([
            {
            type: 'input',
            name: 'departmentName',
            message: "What is the name of the department?"
            }
    
        ]);
        return departmentName;
    }catch(error){
        console.log(error);
    };
}
async function promptUserForRole() {
    try{

        const { rows } = await pool.query("SELECT * FROM department");
        const departmentNames = rows.map(item => item.name);
      
        const {roleName, roleSalary, roleDepartment} = await inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: "What is the name of the role?"
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: "What is the salary of the role?"
                
            },
            {
                type: 'list',
                name: 'roleDepartment',
                message: "Which department does this role belong to?",
                choices: departmentNames
            }
        ]);

        let departmentID = "";
        for (let i=0;i<rows.length; i++){
            if (roleDepartment == rows[i].name){
                departmentID = rows[i].id;
                break;
            }
        }

        const returnArray = [roleName, roleSalary, departmentID];
        return returnArray;
    }catch(error){
        console.log(error);
    }
}



async function promptUserForEmployee() {
    try{
        let { rows } = await pool.query("SELECT * FROM role");
        const role_rows = rows;
        const roles = rows.map(item => item.title);

        ({ rows } = await pool.query("SELECT * FROM employee"));
        const employee_rows = rows;
        const managerNames = rows.map(item => (item.first_name + " " + item.last_name));

        const {firstName, lastName, role, manager} = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the last name?"
            },
            {
                type: 'list',
                name: 'role',
                message: "What is this employee's role?",
                choices: roles
            },
            {
                type: 'list',
                name: 'manager',
                message: "What is this employee's manager?",
                choices: managerNames
            }

        ]);
        
        let managerID = "";
        for (let i=0;i<employee_rows.length; i++){
            if (manager == (employee_rows[i].first_name + " " + employee_rows[i].last_name)){
                managerID = employee_rows[i].id;
                break;
            }
        }

        let roleID = "";
        for (let i=0;i<role_rows.length; i++){
            if (role == role_rows[i].title){
                roleID = role_rows[i].id;
                break;
            }
        }

        const returnArray = [firstName, lastName, roleID, managerID];
        return returnArray;
    }catch(error){
        console.log(error);
    }
}


async function promptUserForUpdateEmployeeRole() {

    let { rows } = await pool.query("SELECT * FROM role");
    const role_rows = rows;
    const roles = rows.map(item => item.title);

    ({ rows } = await pool.query("SELECT * FROM employee"));
    const user_rows = rows;
    const userNames = rows.map(item => (item.first_name + " " + item.last_name));

    const {userName, role} = await inquirer.prompt([
        {
            type: 'list',
            name: 'userName',
            message: "Which employee's role do you want to update?",
            choices: userNames
        },
        {
            type: 'list',
            name: 'role',
            message: "Which role do you want to assign?",
            choices: roles
        }
    ]);

    let roleID = "";
    for (let i=0;i<role_rows.length; i++){
        if (role == role_rows[i].title){
            roleID = role_rows[i].id;
            break;
        }
    }


    let userID = "";
    let firstName = "";
    let lastName = "";
    let managerID = "";
    for (let i=0;i<user_rows.length; i++){
        if (userName == (user_rows[i].first_name + " " + user_rows[i].last_name)){
            userID = user_rows[i].id;
            firstName = user_rows[i].first_name;
            lastName = user_rows[i].last_name;
            managerID = user_rows[i].manager_id;
            break;
        }
    }

    const returnArray = [userID, firstName, lastName, roleID, managerID]
    return returnArray;
}



promptUserForAction();
