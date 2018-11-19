var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "anything",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runPrompt();
});

// Ask user for product id an quantity to purchase.
function runPrompt() {
  inquirer
    .prompt([
    {
      name: "productID",
      type: "input",
      message: "What is the product ID you wish to purchase?",
    },
    {
        name: "quantity",
        type: "input",
        message: "Quantity?",
      }
    ])
    .then(function(answer) {
        console.log("\n\nPurchase " + answer.quantity + " units of product ID: " + answer.productID);
        processPurchase(answer.productID, answer.quantity);
    });
}


// Checks if sufficient inventory, and if so, processes the purchase
function processPurchase(productID, quantity) {
    var query = "SELECT product_name,stock_quantity as num FROM products WHERE ?";
    connection.query(query, { item_id: productID }, function(err, res) {
        console.log("We have " + res[0].num + " units of " + res[0].product_name + " in stock.");
        if (res[0].num >= quantity) subtractInventory(productID, quantity, res[0].num);
        else {
            console.log("Inventory insufficient: " + res[0].num + "\n\n");
            runPrompt();
            }
    });
};

function subtractInventory(productID, quantity, currentQuantity) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: (currentQuantity - quantity)
          },
          {
            item_id: productID
          }
        ],
        function(err, res) {
          //console.log(res.affectedRows + " products updated!\n");
          printReceipt(productID, quantity);
        }
    )
};

function printReceipt(productID, quantity) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: productID }, function(err, res) {
        var product = res[0];
        console.log("==================\nYou Purchased " + quantity + " units of " + product.product_name + " at $" + Number(product.price).toFixed(2) + " per unit." );
        console.log("Quantity remaining in stock: " + product.stock_quantity);
        console.log("FINAL AMOUNT DUE: $" + Number(quantity * product.price).toFixed(2) + "\n==================\n\n");
        runPrompt();
    });
   
}

function productSearch(productID) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: productID }, function(err, res) {
        console.log(query);
        return res[0];
    });
};




