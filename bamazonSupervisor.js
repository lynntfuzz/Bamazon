var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

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
  runSupervisor();
});

function runSupervisor() {
    console.log("\n");
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Add New Department",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Product Sales by Department":
        viewProductSalesByDepartment();
        break;

      case "Add New Department":
        addNewDepartment();
        break;
      
      case "Quit":
        process.exit();
      }
    });
}

// Print out a report of sales by department
function viewProductSalesByDepartment() {
    console.log("Generating sales report...\n");
    connection.query("select departments.department_id, departments.department_name, sum(products.product_sales) as sales, departments.over_head_costs, (sum(products.product_sales)  - over_head_costs) as profit  from products right join departments on products.department_id = departments.department_id group by departments.department_id order by profit desc", function(err, res) {
      if (err) throw err;
      //console.log("Department Id | Department Name| Sales | Overhead Costs | Profit");

     

 
    var t = new Table;
 

        


      for (var i = 0; i < res.length; i++) {
          var item = res[i];
          t.cell("Department Id", res[i].department_id);
          t.cell("Department Name", res[i].department_name);
          t.cell("Sales", res[i].sales == null ? 0.00 : res[i].sales, Table.number(2));
          t.cell("Overhead Costs", res[i].over_head_costs, Table.number(2));
    
          t.cell("Profit", res[i].profit == null ? 0-res[i].over_head_costs : res[i].profit, Table.number(2));
          t.newRow();
          //console.log(res[i].department_id  + " | " + res[i].department_name  + " | " + res[i].sales + " | " + res[i].over_head_costs + " | " + res[i].sales + " | " + res[i].profit)
      }
      console.log(t.toString());
      runSupervisor();
    });
    
}

function addNewDepartment() {
    inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter department name: ",
        validate: function(value) {
          if (value != null && value != '') return true;
          else return false;
        }
      },
      {
        name: "overhead",
        type: "input",
        message: "Enter overhead costs: ",
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
        "INSERT INTO departments SET ?",
          {
            department_name: answer.departmentName,
            over_head_costs: answer.overhead
          },
        function(err, res) {
            if (err) {console.log(err); throw(err);}
            runSupervisor();
        }
    )
    })
};