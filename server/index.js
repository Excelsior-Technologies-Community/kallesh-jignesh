require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db = require("./config/db");

// Migrate admins table
const adminCols = [
  { name: 'phone', type: 'TEXT' },
  { name: 'designation', type: 'TEXT' },
  { name: 'bio', type: 'TEXT' },
  { name: 'avatar', type: 'LONGTEXT' },
  { name: 'two_factor_enabled', type: 'BOOLEAN DEFAULT FALSE' },
  { name: 'two_factor_secret', type: 'TEXT' },
  { name: 'is_online', type: 'TINYINT(1) DEFAULT 0' }
];

adminCols.forEach(col => {
  const sql = `ALTER TABLE admins ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`;
  db.query(sql, (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.log(`Note: Field ${col.name} check complete (may already exist or error if IF NOT EXISTS not supported)`);
      // Fallback check
      db.query(`SELECT ${col.name} FROM admins LIMIT 1`, (checkErr) => {
        if (checkErr) { 
           db.query(`ALTER TABLE admins ADD COLUMN ${col.name} ${col.type}`, (addErr) => {
             if (!addErr) console.log(`Added missing column: ${col.name}`);
           });
        }
      });
    }
    
    // Explicitly modify the type for existing avatar column to LONGTEXT if it's already there
    if (col.name === 'avatar') {
      db.query(`ALTER TABLE admins MODIFY COLUMN avatar LONGTEXT`, (modifyErr) => {
        if (!modifyErr) console.log('Avatar column updated to LONGTEXT');
      });
    }
  });
});

// Migrate users table - add is_online column
db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online TINYINT(1) DEFAULT 0`, (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') {
    db.query(`SELECT is_online FROM users LIMIT 1`, (checkErr) => {
      if (checkErr) {
        db.query(`ALTER TABLE users ADD COLUMN is_online TINYINT(1) DEFAULT 0`, (addErr) => {
          if (!addErr) console.log('Added is_online column to users');
        });
      }
    });
  }
});

// Reset all users/admins to offline on server start
db.query(`UPDATE admins SET is_online = 0`, () => {});
db.query(`UPDATE users SET is_online = 0`, () => {});

const productRoutes = require("./routes/productsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const blogRoutes = require("./routes/blogRoutes");

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", contactRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));

// Test API
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users WHERE status = 1", (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});

// Get admins online status
app.get("/admins/online-status", (req, res) => {
  db.query("SELECT id, name, email, is_online FROM admins WHERE status = 1", (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result);
  });
});

app.get("/dashboard-stats", async (req, res) => {
  try {
    const query = (sql) => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    const [
      users,
      products,
      categories,
      messages,
      portfolio,
      orders,
      recentOrders,
      salesTrend,
      topProducts,
      lowStockProducts,
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM users WHERE status = 1"),
      query("SELECT COUNT(*) as count FROM products WHERE status != 0"),
      query("SELECT COUNT(*) as count FROM categories WHERE status = 1"),
      query(
        "SELECT COUNT(*) as count FROM contact_messages WHERE is_deleted = 0",
      ),
      query("SELECT COUNT(*) as count FROM portfolio"),
      query("SELECT COUNT(*) as count FROM orders"),
      query(
        "SELECT id, customer_name, status, total_amount, currency, created_at FROM orders ORDER BY created_at DESC LIMIT 5",
      ),
      query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, currency, SUM(total_amount) as revenue 
        FROM orders 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND status IN ('Pending', 'Confirmed', 'Delivered')
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), currency
        ORDER BY date ASC
      `),
      query(`
        SELECT p.name, SUM(oi.quantity) as total_sold, p.image1
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY oi.product_id
        ORDER BY total_sold DESC
        LIMIT 5
      `),
      query(
        "SELECT id, name, stock, image1 FROM products WHERE stock < 10 AND status != 0 ORDER BY stock ASC LIMIT 5",
      ),
    ]);

    res.json({
      totalUsers: users[0].count,
      totalProducts: products[0].count,
      totalCategories: categories[0].count,
      totalMessages: messages[0].count,
      totalPortfolio: portfolio[0].count,
      totalOrders: orders[0].count,
      recentOrders: recentOrders,
      salesTrend: salesTrend,
      topProducts: topProducts,
      lowStockProducts: lowStockProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching dashboard stats");
  }
});

app.put("/api/admin/:id/profile", (req, res) => {
  const id = req.params.id;
  const { name, email, phone, designation, bio, avatar } = req.body;
  
  const sql = "UPDATE admins SET name = ?, email = ?, phone = ?, designation = ?, bio = ?, avatar = ? WHERE id = ?";
  db.query(sql, [name, email, phone, designation, bio, avatar, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating admin profile");
    }
    res.send("Admin profile updated successfully");
  });
});

app.put("/api/admin/:id/password", (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;

  if (!id || id === 'undefined' || id === 'null') {
    console.error("[PASS_CHANGE] Invalid ID received:", id);
    return res.status(400).send("Invalid Admin ID. Please logout and login again.");
  }

  console.log(`[PASS_CHANGE] Attempting change for Admin ID: ${id}`);

  db.query("SELECT id, password FROM admins WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("[PASS_CHANGE] DB Select Error:", err);
      return res.status(500).send("Database error while checking password");
    }
    
    if (result.length === 0) {
      console.log(`[PASS_CHANGE] Admin with ID ${id} not found in database.`);
      return res.status(404).send("Admin account not found");
    }

    const dbPassword = result[0].password;
    console.log(`[PASS_CHANGE] Comparing: DB('${dbPassword}') vs Input('${currentPassword}')`);

    // Use trim() and String() for safest comparison
    if (String(dbPassword).trim() !== String(currentPassword).trim()) {
      console.log(`[PASS_CHANGE] Mismatch: Passwords do not match.`);
      return res.status(400).send("Current password is incorrect");
    }

    db.query("UPDATE admins SET password = ?, updated_at = NOW() WHERE id = ?", [newPassword, id], (err, updateResult) => {
      if (err) {
        console.error("[PASS_CHANGE] DB Update Error:", err);
        return res.status(500).send("Database error while updating password");
      }
      
      if (updateResult.affectedRows === 0) {
        console.log(`[PASS_CHANGE] No rows updated for ID ${id}. This shouldn't happen.`);
        return res.status(400).send("Update failed: No changes made to the database.");
      }

      console.log(`[PASS_CHANGE] SUCCESS: Password updated for ID ${id}`);
      res.send("Password updated successfully");
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email=? AND status=1",
    [email],
    async (err, result) => {
      if (err) return res.send(err);

      if (result.length === 0) return res.status(401).send("Admin not found");

      const admin = result[0];

      // temporary plain password check
      if (password !== admin.password)
        return res.status(401).send("Wrong password");

      // Set admin as online
      db.query("UPDATE admins SET is_online = 1 WHERE id = ?", [admin.id]);

      const token = jwt.sign({ id: admin.id }, "secretkey", {
        expiresIn: "8h",
      });

      res.json({
        token,
        adminId: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        designation: admin.designation,
        bio: admin.bio,
        avatar: admin.avatar,
      });
    },
  );
});

// Admin logout - set offline
app.post("/admin/logout", (req, res) => {
  const { adminId } = req.body;
  if (adminId) {
    db.query("UPDATE admins SET is_online = 0 WHERE id = ?", [adminId]);
  }
  res.json({ message: "Logged out successfully" });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE users SET status = 0, updated_by = ? WHERE id = ?",
    [1, id],
    (err) => {
      if (err) return res.send(err);

      res.send("User deactivated");
    },
  );
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  const sql = `
    UPDATE users
    SET name=?, email=?, updated_by=?
    WHERE id=?
  `;

  db.query(sql, [name, email, 1, id], (err) => {
    if (err) return res.send(err);

    res.send("User updated");
  });
});

app.put("/users/:id/status", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE users SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating status");
    }
    res.send("User status updated");
  });
});

app.get("/user-activities", (req, res) => {
  db.query(
    "SELECT * FROM user_activities ORDER BY created_at DESC",
    (err, result) => {
      if (err) res.status(500).send(err);
      else res.json(result);
    },
  );
});

app.delete("/user-activities/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM user_activities WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting activity");
    } else {
      res.send("Activity deleted");
    }
  });
});
