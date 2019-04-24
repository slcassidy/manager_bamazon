// Calling the npm installed items
var mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();



// Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${process.env.SQLKEY}`,
    database: 'bamazon'
});

// function for the connection turn on
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    afterConnection();
});

let choiceList = [];

connection.query('SELECT id, product_name from products' , function (error, results, fields) {
    if (error) throw error;
    console.log('results');
    for(let i= 0; i < results.length; i++){
    choiceList.push(results[i].product_name);
    };
}); 

// console.log(choiceList);

// show selections
const showOpts = function () {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select which product to add more to stock.',
                choices: choiceList,
                // ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                // choices: idReturn(),
                name: 'opts'
            }
        ]).then(function (inquirerResponse) {

            if (inquirerResponse.confirm === true) {
                // Show the inventory
                connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
                    if (error) throw error;
                    console.table(results);


                })
            } else {
                // choice();
                console.log("exist out")


            };
        });
};


// functions
const addNew = function () {
    inquirer
        .prompt([
            {
                type: 'confirm',
                message: 'Would you like to add more to stock?:',
                name: 'confirm',
                default: true
            }
        ]).then(function (inquirerResponse) {

            if (inquirerResponse.confirm === true) {
                // Show the inventory
                // connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
                //     if (error) throw error;
                //     console.table(results);
                showOpts();

                // })
            } else {
                // choice();
                console.log("exist out")
                afterConnection(); 

            };
        });
};


// Main information
// choice();
// const choice = 

function afterConnection() {


    inquirer
        .prompt([
            {
                type: 'list',
                message: 'select from the menu options on what you would like to do?',
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                // choices: idReturn(),
                name: 'selection'
            }
        ]).then(function (inquirerResponse) {
            console.log(inquirerResponse.selection)


            switch (inquirerResponse.selection) {
                case "View Products for Sale":

                    console.log("View Products for Sale")

                    connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
                        if (error) throw error;
                        console.table(results);

                    });
                    break;
                case "View Low Inventory":
                    console.log("View Low Inventory")
                    connection.query('SELECT id, product_name, department_name, price, stock_quantity from products where stock_quantity < 5', function (error, results, fields) {
                        if (error) throw error;
                        console.table(results);

                    });
                    break;

                case "Add to Inventory":
                    console.log("Add to Inventory")
                    addNew();
                    break;

                case "Add New Product":
                    console.log("Add New Product")
                    break;
                default:
                    console.log("Not Available")
                    connection.end();
            };

        });  //End of Inquirer
}