const inquirer = require('inquirer');

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
    .then(answer => {
        console.log(answer);
        if(answer.userAction != 'Quit'){
            promptUserForAction();
        }
    })
    .catch(error => {
        console.log(error);
    })

}

promptUserForAction();
