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
            console.log(nameOfDepartmentToAdd);
            try {
                const { rows } = await pool.query("INSERT INTO department (name) VALUES ($1);", [nameOfDepartmentToAdd]);
                console.log("");
                console.table(rows);
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
    console.log("123");
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
promptUserForAction();
