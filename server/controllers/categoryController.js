

const db = require("../config/db");

// Get all active categories
// Get all active categories with product count and one image
exports.getAllCategories = (req, res) => {
  const sql = `
        SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE FIND_IN_SET(c.id, p.category_id) AND p.status != 0) as product_count,
        (SELECT image1 FROM products p WHERE FIND_IN_SET(c.id, p.category_id) AND p.status != 0 LIMIT 1) as category_image
        FROM categories c 
        WHERE c.status = 1 
        ORDER BY c.id DESC
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
};

// Create a new category
exports.createCategory = (req, res) => {
  const { name, parent_id } = req.body;
  const sql =
    "INSERT INTO categories (name, parent_id, status) VALUES (?, ?, 1)";

  db.query(sql, [name, parent_id || null], (err, result) => {
    if (err) {
      console.error("Error creating category:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ id: result.insertId, message: "Category created successfully" });
  });
};

// Update a category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, parent_id, status } = req.body;

  const sql =
    "UPDATE categories SET name = ?, parent_id = ?, status = ? WHERE id = ?";

  db.query(
    sql,
    [name, parent_id || null, status !== undefined ? status : 1, id],
    (err, result) => {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Category updated successfully" });
    },
  );
};

// Delete (Soft Delete) a category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  // Soft delete: set status = 0
  const sql = "UPDATE categories SET status = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Category deleted successfully" });
  });
};
