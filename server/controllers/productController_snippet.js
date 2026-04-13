const db = require("../config/db");

// ... existing code ...

exports.getProductById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  });
};
