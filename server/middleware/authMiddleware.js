const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    if (token)
      console.log("Received Token (snippet):", token.substring(0, 20) + "...");
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
