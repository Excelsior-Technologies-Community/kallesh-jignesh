const db = require("../config/db");

exports.saveMessage = (req, res) => {
  const { name, email, phone, message } = req.body;

  const sql =
    "INSERT INTO contact_messages (name,email,phone,message) VALUES (?,?,?,?)";

  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

    res.json({ message: "Message saved" });
  });
};

exports.getMessages = (req, res) => {
  const sql =
    "SELECT * FROM contact_messages WHERE is_deleted = 0 ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }
    res.json(result);
  });
};

exports.deleteMessage = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE contact_messages SET is_deleted = 1 WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }
    res.json({ message: "Message deleted" });
  });
};
