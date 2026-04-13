const db = require("../config/db");

// Get all blogs
exports.getAllBlogs = (req, res) => {
  const sql = "SELECT * FROM blogs ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching blogs");
    } else {
      res.json(result);
    }
  });
};

// Get single blog by ID
exports.getBlogById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM blogs WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching blog details");
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send("Blog not found");
      }
    }
  });
};
