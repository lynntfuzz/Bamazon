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
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: productID }, function(err, res) {
        if (err || res === null || res.length === 0) {console.log("Unrecognized stock number."); runPrompt(); return;}
        console.log("We have " + res[0].stock_quantity + " units of " + res[0].product_name + " in stock.");
        if (res[0].stock_quantity >= quantity) subtractInventory(res[0], quantity);
        else {
            console.log("Inventory insufficient: " + res[0].stock_quantity + "\n\n");
            runPrompt();
            }
    });
};

function subtractInventory(product, quantity) {
    console.log(product)
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: (product.stock_quantity - quantity),
            product_sales: product.product_sales + (product.price * quantity),
          },
          {
            item_id: product.item_id
          }
        ],
        function(err, res) {

            if (err) {console.log(err); throw err;} 
          //console.log(res.affectedRows + " products updated!\n");
          //console.log(res);
          //console.log(res[0]);
          printReceipt(product.item_id, quantity);
        }
    )
};

function printReceipt(productID, quantity) {
    console.log("Refresh product object with item_id = " + productID);
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