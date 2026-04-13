const db = require("../config/db");

exports.getNotifications = (req, res) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching notifications");
    } else {
      res.json(result);
    }
  });
};

exports.markAsRead = (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating notification");
    } else {
      res.send("Notification marked as read");
    }
  });
};

exports.markAllAsRead = (req, res) => {
  const sql = "UPDATE notifications SET is_read = TRUE";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating notifications");
    } else {
      res.send("All notifications marked as read");
    }
  });
};
