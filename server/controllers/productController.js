const db = require("../config/db");

// Get all products (active only)
exports.getAllProducts = (req, res) => {
  const { search, category, min_price, max_price, stock_status } = req.query;

  let sql = "SELECT * FROM products WHERE status != 0";
  const params = [];

  // Search by name
  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  // Filter by Category
  if (category) {
    // Check if category_id column contains the specific category ID
    // Since we store as "1,2,3", we use FIND_IN_SET for exact match if it was normalized,
    // but likely we need LIKE for comma-separated strings if not normalized properly,
    // or better yet, use robust string checking.
    // However, given the current "1,2,3" string storage:
    sql += " AND FIND_IN_SET(?, category_id)";
    params.push(category);
  }

  // Filter by Price Range
  if (min_price) {
    sql += " AND price >= ?";
    params.push(min_price);
  }
  if (max_price) {
    sql += " AND price <= ?";
    params.push(max_price);
  }

  // Filter by Stock Status
  if (stock_status) {
    if (stock_status === "in_stock") {
      sql += " AND stock >= 10";
    } else if (stock_status === "low_stock") {
      sql += " AND stock > 0 AND stock < 10";
    } else if (stock_status === "out_of_stock") {
      sql += " AND stock = 0";
    }
  }

  // Filter by Size
  if (req.query.size) {
    sql += " AND FIND_IN_SET(?, size)";
    params.push(req.query.size);
  }

  sql += " ORDER BY created_at DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Get product by ID
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

// Create a new product
exports.createProduct = (req, res) => {
  const {
    name,
    price,
    stock,
    discount_percent,
    is_preorder,
    image1,
    image2,
    image3,
    image4,
    image5,
    category_id,
    is_new,
    description,
    size, // Add size
  } = req.body;

  const userId = req.user.id;

  // Handle category_id which can be an array or string
  let categoryIdsString = null;
  if (Array.isArray(category_id)) {
    categoryIdsString = category_id.join(",");
  } else if (category_id) {
    categoryIdsString = String(category_id);
  }

  // Handle size which can be an array
  let sizeString = null;
  if (Array.isArray(size)) {
    sizeString = size.join(",");
  } else if (size) {
    sizeString = String(size);
  }

  // Adjusted SQL to remove category.
  const sqlInsert = `
    INSERT INTO products 
    (name, price, stock, status, discount_percent, is_preorder, image1, image2, image3, image4, image5, category_id, is_new, description, size, created_by, updated_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertValues = [
    name,
    price,
    stock,
    1, // Active
    discount_percent || 0,
    is_preorder || 0,
    image1,
    image2,
    image3,
    image4,
    image5,
    categoryIdsString, // Store as string
    is_new ? 1 : 0,
    description || "",
    sizeString, // Store size
    userId,
    userId,
  ];

  db.query(sqlInsert, insertValues, (err, result) => {
    if (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ id: result.insertId, message: "Product created successfully" });
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    stock,
    discount_percent,
    is_preorder,
    image1,
    image2,
    image3,
    image4,
    image5,
    category_id,
    is_new,
    description,
    size, // Add size
  } = req.body;
  const userId = req.user.id;

  // Handle category_id which can be an array or string
  let categoryIdsString = null;
  if (Array.isArray(category_id)) {
    categoryIdsString = category_id.join(",");
  } else if (category_id) {
    categoryIdsString = String(category_id);
  }

  // Handle size which can be an array
  let sizeString = null;
  if (Array.isArray(size)) {
    sizeString = size.join(",");
  } else if (size) {
    sizeString = String(size);
  }

  const sql = `
    UPDATE products 
    SET name=?, price=?, stock=?, discount_percent=?, is_preorder=?, image1=?, image2=?, image3=?, image4=?, image5=?, category_id=?, is_new=?, description=?, size=?, updated_by=?
    WHERE id=?
  `;

  const values = [
    name,
    price,
    stock,
    discount_percent || 0,
    is_preorder || 0,
    image1,
    image2,
    image3,
    image4,
    image5,
    categoryIdsString, // Store as string
    is_new ? 1 : 0,
    description || "",
    sizeString, // Store size
    userId,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Product updated successfully" });
  });
};

// Soft delete a product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Soft delete: set status = 0 and update updated_by
  const sql = "UPDATE products SET status = 0, updated_by = ? WHERE id = ?";

  db.query(sql, [userId, id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Product deleted successfully" });
  });
};
