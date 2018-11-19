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
    connection.query("SELECT * FROM products", function(err, res) {
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
    connection.query("SELECT * FROM products where stock_quantity < 5", function(err, res) {
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
        message: "Enter department name: ",
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
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
          },
        function(err, res) {
          runMgr();
        }
    )
    })
}





function artistSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function(answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, { artist: answer.artist }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
        }
        runSearch();
      });
    });
}

function multiSearch() {
  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    runSearch();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Artist: " +
              res[i].artist +
              " || Year: " +
              res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
        console.log(
          "Position: " +
            res[0].position +
            " || Song: " +
            res[0].song +
            " || Artist: " +
            res[0].artist +
            " || Year: " +
            res[0].year
        );
        runSearch();
      });
    });
}
