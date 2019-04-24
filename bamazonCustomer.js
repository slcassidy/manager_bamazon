// Using sequelize
// const db = require('./models');

// db.sequelize.sync().then(function(){
//   db.Products.findAll({}).then(function(data){
//     console.log('------------PRINTING DB DATA-----------------');
//     console.log(JSON.stringify(data, null, 2));
//   });
// });

// Calling the npm installed items
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
    console.log("connected as id " + connection.threadId);
    afterConnection();
});




function afterConnection() {

    connection.query('SELECT id, product_name, department_name, price, stock_quantity from products', function (error, results, fields) {
        if (error) throw error;
        console.table(results)

        // *******************Inquire********************

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Please choose which item you would like to buy?',
                    choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    // choices: idReturn(),
                    name: 'type'
                },
                {
                    type: 'confirm',
                    message: 'Are you sure:',
                    name: 'confirm',
                    default: true
                },
                {
                    type: 'input',
                    message: 'How many units of the product they would like to buy?',
                    name: 'units'
                }


            ])
            .then(function (inquirerResponse) {
                console.log(inquirerResponse.type)

                // connection.connect()
                connection.query(`SELECT id, product_name, department_name, price, stock_quantity from products where id = '${inquirerResponse.type}'`, function (error, results, fields) {
                    if (error) throw error;
                    console.table(results);

                    console.log("************Cart Checkout*************")
                    let quantity = results[0].stock_quantity - inquirerResponse.units;
                    let total = inquirerResponse.units * results[0].price;
                    // console.log(quantity);
                    if (quantity < 0) {
                        console.log("Insufficient quantity!")
                    } else {

                        connection.query(`update products set stock_quantity = '${quantity}' where id = ${inquirerResponse.type}`, function (err, res) {
                            if (err) throw err;
                            let test = parseFloat(total).toFixed(2)

                            // console.log(total);
                            console.log(`               Total $ ${test}`);
                            console.log("Thank you for shopping!!  Please come again 🙂");

                        });


                    }
                    connection.end();
                });

            });




        //*******************Variables*********************** 
        // let select = "";
        // view = inquirerResponse.search
        // console.log(inquirerResponse.units)



        // end;


        // Case switch to identify which response to remove from inventory


        //   switch(inquirerResponse.type){
        //     case 1:
        //     // select = queryOmdb;
        //     console.log("1 is Chosen")
        //     break;
        //     case 2:
        //     console.log("2 is Chosen")
        //     break;
        //       case 3:
        //       console.log("3 is Chosen")
        //       break;
        //     default:
        //     console.log ("Not Available")
        //   };



    }); //End of Inquirer
} //end of the query connection


