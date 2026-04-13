const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = (email, otp, type = "login") => {
  const subject = type === "login" ? "Your Login OTP - Kalles" : "Your Password Reset OTP - Kalles";
  const body = type === "login" 
    ? `Your OTP for login is: ${otp}. It will expire in 10 minutes.`
    : `Your OTP for password reset is: ${otp}. It will expire in 10 minutes. If you didn't request this, please ignore this email.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  };

  return transporter.sendMail(mailOptions);
};


const logActivity = async (userName, userEmail, action, details, req) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const device = req.headers["user-agent"] || "Unknown";
    const status = "Success"; // Assuming success for now

    await db
      .promise()
      .query(
        "INSERT INTO user_activities (user_name, user_email, action, details, device, ip, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
        [userName, userEmail, action, details, device, ip, status],
      );
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, password, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [name, email, hashedPassword, 1],
      );

    // Log Activity
    await logActivity(name, email, "Registration", "New user registered", req);

    // Create Notification
    try {
      await db
        .promise()
        .query(
          "INSERT INTO notifications (message, type, created_at) VALUES (?, ?, NOW())",
          [`New user registered: ${name} (${email})`, "info"],
        );
    } catch (notifErr) {
      console.error("Error creating notification:", notifErr);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    await db
      .promise()
      .query(
        "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
      res.status(201).json({
        message: "OTP sent to your email",
        otpSent: true,
        email: email
      });
    } catch (mailErr) {
      console.error("Error sending OTP email:", mailErr);
      res.status(500).json({ message: "Error sending OTP email" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1. Check if it's an ADMIN
    const [admins] = await db
      .promise()
      .query("SELECT * FROM admins WHERE email = ? AND status = 1", [email]);

    if (admins.length > 0) {
      const admin = admins[0];
      // Note: Admin password check (using plain text as per existing index.js logic)
      if (password === admin.password) {
        const token = jwt.sign({ id: admin.id, isAdmin: true }, "secretkey", { expiresIn: "24h" });
        
        // Set admin as online
        await db.promise().query("UPDATE admins SET is_online = 1 WHERE id = ?", [admin.id]);
        
        await logActivity(admin.name, admin.email, "Admin Login", "Admin logged in", req);

        return res.json({
          message: "Admin login successful",
          token,
          isAdmin: true,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            designation: admin.designation,
            bio: admin.bio,
            avatar: admin.avatar,
            isAdmin: true
          },
        });
      }
    }

    // 2. Check if it's a regular USER
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== 1) {
      return res
        .status(403)
        .json({ message: "Account is inactive. Please contact support." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, isAdmin: false }, "secretkey", { expiresIn: "24h" });

    // Log Activity
    await logActivity(user.name, user.email, "User Login", "User logged in", req);

    // Set user as online
    await db.promise().query("UPDATE users SET is_online = 1 WHERE id = ?", [user.id]);

    res.json({
      message: "User login successful",
      token,
      isAdmin: false,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: false
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Check if OTP is valid and not expired
    const [otps] = await db
      .promise()
      .query(
        "SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
        [email, otp]
      );

    if (otps.length === 0) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Get user or admin details
    let userRecord = null;
    let isAdmin = false;

    const [users] = await db
      .promise()
      .query("SELECT id, name, email FROM users WHERE email = ?", [email]);

    if (users.length > 0) {
      userRecord = users[0];
    } else {
      const [admins] = await db
        .promise()
        .query("SELECT id, name, email, phone, designation, bio, avatar, two_factor_enabled FROM admins WHERE email = ?", [email]);
      
      if (admins.length > 0) {
        userRecord = admins[0];
        isAdmin = true;
      }
    }

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRecord;

    // Generate token
    const token = jwt.sign({ id: user.id, isAdmin: isAdmin }, "secretkey", { expiresIn: "24h" });

    // Log Activity
    await logActivity(user.name, user.email, "Login", `Login successful${isAdmin ? ' (Admin)' : ''} with OTP`, req);

    // Set user/admin as online
    if (isAdmin) {
      await db.promise().query("UPDATE admins SET is_online = 1 WHERE id = ?", [user.id]);
    } else {
      await db.promise().query("UPDATE users SET is_online = 1 WHERE id = ?", [user.id]);
    }

    res.json({
      message: "Login successful",
      token,
      isAdmin: isAdmin,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        designation: user.designation || null,
        bio: user.bio || null,
        avatar: user.avatar || null,
        two_factor_enabled: !!user.two_factor_enabled,
        isAdmin: isAdmin
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

exports.logout = async (req, res) => {
  const { name, email } = req.body;

  try {
    if (name && email) {
      await logActivity(name, email, "Logout", "User logged out", req);
      
      // Set user/admin as offline
      await db.promise().query("UPDATE admins SET is_online = 0 WHERE email = ?", [email]);
      await db.promise().query("UPDATE users SET is_online = 0 WHERE email = ?", [email]);
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate NEW OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    await db
      .promise()
      .query(
        "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
      res.json({ message: "New OTP sent to your email" });
    } catch (mailErr) {
      console.error("Error sending OTP email:", mailErr);
      res.status(500).json({ message: "Error sending OTP email" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during resending OTP" });
  }
};
exports.toggleTwoFactor = async (req, res) => {
  const { adminId, enabled } = req.body;

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  try {
    await db
      .promise()
      .query("UPDATE admins SET two_factor_enabled = ? WHERE id = ?", [enabled ? 1 : 0, adminId]);

    const action = enabled ? "Enabled" : "Disabled";
    const [admin] = await db.promise().query("SELECT name, email FROM admins WHERE id = ?", [adminId]);
    
    if (admin.length > 0) {
      await logActivity(admin[0].name, admin[0].email, "2FA Update", `Two-factor authentication ${action}`, req);
    }

    res.json({ message: `Two-factor authentication ${action} successfully`, enabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during 2FA update" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user or admin exists
    const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    const [admins] = await db.promise().query("SELECT * FROM admins WHERE email = ?", [email]);

    if (users.length === 0 && admins.length === 0) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await db.promise().query("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)", [email, otp, expiresAt]);

    // Send OTP
    await sendOtpEmail(email, otp, "reset");

    res.json({ message: "OTP sent to your email for password reset", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, type } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Verify OTP
    const [otps] = await db.promise().query(
      "SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [email, otp]
    );

    if (otps.length === 0) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    let userAffected = 0;
    let adminAffected = 0;

    // Update based on Type
    if (type === 'admin') {
      const [adminUpdate] = await db.promise().query("UPDATE admins SET password = ?, updated_at = NOW() WHERE email = ?", [String(newPassword), email]);
      adminAffected = adminUpdate.affectedRows;
    } else if (type === 'user') {
      const [userUpdate] = await db.promise().query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
      userAffected = userUpdate.affectedRows;
    } else {
      // Default: Try both (backwards compatibility)
      const [uUp] = await db.promise().query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
      const [aUp] = await db.promise().query("UPDATE admins SET password = ?, updated_at = NOW() WHERE email = ?", [String(newPassword), email]);
      userAffected = uUp.affectedRows;
      adminAffected = aUp.affectedRows;
    }

    console.log(`[RESET_PASS] Email: ${email}, Type: ${type || 'both'}, UserAffected: ${userAffected}, AdminAffected: ${adminAffected}`);

    if (userAffected === 0 && adminAffected === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Log activity
    await logActivity("System", email, "Password Reset", `User reset their ${type || 'account'} password using OTP`, req);

    res.json({ message: "Password reset successful. Please login with your new password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
