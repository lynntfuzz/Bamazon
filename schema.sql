DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 500 ), ("groceries", 200), ("clothing", 300), ("toys", 150);

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (item_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO products (product_name, department_id, price,  stock_quantity)
VALUES  ("Ear Buds", 1, 29.99, 15),  ("Headphones", 1, 19.99, 16),  ("Speakers", 1, 55.00, 2),
("Dark Roast Coffee", 2, 12.00, 14),  ("Chocolate", 2, 5.00, 8),  ("Low Fat Milk", 2, 4.00, 3),
("Shirt", 3, 35.00, 30),  ("Jeans", 3, 39.00, 25),  ("Pajamas", 3, 39.00, 5),
("Doll", 4, 29.99, 4),  ("Drone", 4, 19.99, 6),  ("Bug Catcher", 4, 9.99, 3);
