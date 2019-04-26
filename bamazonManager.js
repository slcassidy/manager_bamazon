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

// Adding a new product
const newProd = function(){
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'Product name?:',
            name: 'prodn',
            // default: true
        },
        {
            type: 'input',
            message: 'Department name?:',
            name: 'prodd',
            // default: true
        }
        ,
        {
            type: 'input',
            message: 'Price?:',
            name: 'price1',
            // default: true
        },
        {
            type: 'input',
            message: 'Stock quantity?:',
            name: 'stock',
            // default: true
        }
    ]).then(function (inquirerResponse) {

  
            // Show the inventory
            connection.query(`Insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('${inquirerResponse.prodn}', '${inquirerResponse.prodd}', '${parseFloat(inquirerResponse.price1).toFixed(2)}', '${parseInt(inquirerResponse.stock)}',0)`, function (error, results, fields) {
                if (error) throw error;
          

            })

            connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
                if (error) throw error;
                console.table(results);

            });

    });
}




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
            ,
            {
                type: 'input',
                message:'How much inventory do you want to add?',
                name: 'moreInventory'
            }
        ]).then(function (inquirerResponse) {

                console.log(inquirerResponse.opts);

       
                connection.query(`Select id, product_name, department_name, price, stock_quantity from products where product_name = '${inquirerResponse.opts}'`, function (error, results, fields) {
                    if (error) throw error;
                    console.table(results);
                    console.log("************Change*************")
                    let quantity = results[0].stock_quantity + parseInt(inquirerResponse.moreInventory);

                    console.log(results[0].stock_quantity)

                    connection.query(`update products set stock_quantity = '${quantity}' where product_name = '${inquirerResponse.opts}'`, function (err, res) {
                        if (err) throw err;
                        // let qty = parseFloat(quantity)

                        // console.log(total);
                        console.log(`${inquirerResponse.opts} new Qty is ${quantity}`);
                     

                    });
                    
  
                })
             

                

            
        });
};


// Adding more stock
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
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Quit"],
                // choices: idReturn(),
                name: 'selection'
            }
        ]).then(function (inquirerResponse) {
            // console.log(inquirerResponse.selection)


            switch (inquirerResponse.selection) {
                case "View Products for Sale":

                    // console.log("View Products for Sale")

                    connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
                        if (error) throw error;
                        console.table(results);

                    });
                    // console.log("************************");
                    // afterConnection();
                    break;
                case "View Low Inventory":
                    console.log("View Low Inventory")
                    connection.query('SELECT id, product_name, department_name, price, stock_quantity from products where stock_quantity < 5', function (error, results, fields) {
                        if (error) throw error;
                        console.table(results);

                    });
                    break;

                case "Add to Inventory":
                    // console.log("Add to Inventory")
                    addNew();      

                    break;

                case "Add New Product":
                    // console.log("Add New Product")
                    newProd();
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