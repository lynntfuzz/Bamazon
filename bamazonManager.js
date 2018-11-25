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
  runMgr();
});

function runMgr() {
    console.log("\n");
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Products",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Products":
        productSearch();
        break;

      case "View Low Inventory":
        lowInventorySearch();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        addNewProduct();
        break;
      
      case "Quit":
        process.exit();
      }
    });
}

// Print out a list of all products
function productSearch() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products p, departments d where p.department_id = d.department_id", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
          var item = res[i];
          console.log(res[i].item_id  + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
      }
      runMgr();
    });
    
}

function lowInventorySearch() {
    console.log("Selecting low quantity products...\n");
    connection.query("SELECT * FROM products p, departments d where p.department_id = d.department_id and stock_quantity < 5", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
          var item = res[i];
          console.log(res[i].item_id  + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
      }
      runMgr();
    });
}

function addInventory() {
    inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "Enter product ID: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter current inventory quantity: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: answer.quantity
          },
          {
            item_id: answer.productID
          }
        ],
        function(err, res) {
          runMgr();
        }
    )
    })
};

function addNewProduct() {
    inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message: "Enter product name: ",
        validate: function(value) {
          if (value === null || value == "") {
            return false;
          }
          return true;
        }
      },
      {
        name: "department",
        type: "input",
        message: "Enter department id: ",
        validate: function(value) {
          if (value === null || value == "") {
            return false;
          }
          return true;
        }
      },
      {
        name: "price",
        type: "input",
        message: "Enter price: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter current inventory quantity: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    var query = connection.query(
        "INSERT into products SET ?",
        {
            product_name: answer.productName,
            department_id: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
          },
        function(err, res) {
          runMgr();
        }
    )
    })
}

