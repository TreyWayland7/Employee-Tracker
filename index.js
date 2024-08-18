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
        }


        if(answer.userAction != 'Quit'){
            promptUserForAction();
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

promptUserForAction();
