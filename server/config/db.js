const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "kalles",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
    // Create otps table if not exists
    const sql = `
        CREATE TABLE IF NOT EXISTS otps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(sql, (err) => {
      if (err) console.error("Error creating otps table:", err);
      else console.log("OTPs table check/creation complete");
    });
  }
});

module.exports = db;
