const db = require("../config/db");

// Get all portfolios
exports.getAllPortfolios = (req, res) => {
  const sql = "SELECT * FROM portfolio ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching portfolios");
    } else {
      res.json(result);
    }
  });
};

// Create a new portfolio
exports.createPortfolio = (req, res) => {
  const { img, name, created_by, date, description, collection } = req.body;
  const sql =
    "INSERT INTO portfolio (img, name, created_by, date, description, collection) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [img, name, created_by, date, description, collection],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating portfolio item");
      } else {
        res.json({ message: "Portfolio item added", id: result.insertId });
      }
    },
  );
};

// Update a portfolio
exports.updatePortfolio = (req, res) => {
  const { id } = req.params;
  const { img, name, created_by, date, description, collection } = req.body;
  const sql =
    "UPDATE portfolio SET img=?, name=?, created_by=?, date=?, description=?, collection=? WHERE id=?";

  db.query(
    sql,
    [img, name, created_by, date, description, collection, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating portfolio item");
      } else {
        res.send("Portfolio item updated");
      }
    },
  );
};

// Delete a portfolio
exports.deletePortfolio = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM portfolio WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting portfolio item");
    } else {
      res.send("Portfolio item deleted");
    }
  });
};
