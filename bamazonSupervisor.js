var mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();



// Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${process.env.SQLKEY}`,
    // password: `MySQL2019!!`,
    database: 'bamazon'
});

// function for the connection turn on
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {


    inquirer
        .prompt([
            {
                type: 'list',
                message: 'select from the menu options on what you would like to do?',
                choices: ["View Product Sales by Department", "Create New Department","Quit"],
                // choices: idReturn(),
                name: 'selection'
            }
        ]).then(function (inquirerResponse) {
            // console.log(inquirerResponse.selection)


            switch (inquirerResponse.selection) {
                case "View Product Sales by Department":

                    // console.log("View Products for Sale")

                    connection.query('select a.department_id, a.department_name, a.over_head_costs, b.product_sales, (b.product_sales - a.over_head_costs) as total_profit from departments a left join products b on a.department_name = b.department_name', function (error, results, fields) {
                        if (error) throw error;
                        console.table(results);

                    });
                    // console.log("************************");
                    // afterConnection();
                    break;
                case "Create New Department":
                    console.log("Create New Department")
                    // newProd();
                    break;
                case "Quit":
                    // console.log("Add New Product")
                    connection.end();
                    break;
                default:
                    console.log("Not Available")
                // afterConnection()
            };
       
           
        });  //End of Inquirer
}