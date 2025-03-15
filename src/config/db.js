const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10, // Max connections in pool
  multipleStatements: true, // Allows multiple queries
});

// Database Name
const databaseName = "clothing_store";

// Function to Initialize Database & Tables
const initializeDatabase = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection failed:", err);
      return;
    }
    console.log("✅ Connected to MySQL");

    // Create Database
    connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
      if (err) throw err;
      console.log(`✅ Database "${databaseName}" created or already exists.`);

      // Switch to the database
      connection.changeUser({ database: databaseName }, (err) => {
        if (err) throw err;

        // Create Tables
        const createTablesQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    category VARCHAR(250) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discountPercentage DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    brand VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    width DECIMAL(10, 2) NOT NULL,
    height DECIMAL(10, 2) NOT NULL,
    depth DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


        `;

        connection.query(createTablesQuery, (err) => {
          if (err) throw err;
          console.log("✅ Tables created or already exist.");
          connection.release();
        });
      });
    });
  });
};

// Run Initialization
initializeDatabase();

module.exports = pool.promise(); // Export promise-based connection
