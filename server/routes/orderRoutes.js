const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all orders with customer info
router.get("/", (req, res) => {
  const sql = `
    SELECT * FROM orders 
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching orders");
    }
    res.json(result);
  });
});

// Get specific order items
router.get("/:id/items", (req, res) => {
  const orderId = req.params.id;
  const sql = `
    SELECT oi.*, p.image1 AS fallback_image 
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching order items");
    }
    res.json(result);
  });
});

// Check if user has any previous orders (for first-order discount)
router.get("/check-first-order/:email", (req, res) => {
  const email = req.params.email ? req.params.email.trim() : "";
  const userId = req.query.userId;
  
  // Use TRIM and LOWER for a more resilient comparison
  let sql = "SELECT COUNT(*) as orderCount FROM orders WHERE TRIM(LOWER(customer_email)) = LOWER(?)";
  let params = [email];
  
  if (userId && userId !== 'null' && userId !== 'undefined') {
    sql += " OR user_id = ?";
    params.push(userId);
  }
  
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Order check error:", err);
      return res.status(500).json({ error: "Error checking order history" });
    }
    
    const count = result[0]?.orderCount || 0;
    const isFirstOrder = count === 0;
    
    res.json({ isFirstOrder, orderCount: count });
  });
});

const nodemailer = require("nodemailer");

// Update order status
router.put("/:id/status", (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  
  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating order status");
    }

    // Attempt to send email if status is marked as 'Delivered', 'Confirmed', or 'Cancelled'
    if (status === 'Delivered' || status === 'Confirmed' || status === 'Cancelled') {
      const getOrderSql = "SELECT * FROM orders WHERE id = ?";
      const getItemsSql = "SELECT * FROM order_items WHERE order_id = ?";
      
      db.query(getOrderSql, [orderId], (err, orderResult) => {
        if (!err && orderResult.length > 0) {
          db.query(getItemsSql, [orderId], (err, itemsResult) => {
            const { customer_email, customer_name, total_amount, currency } = orderResult[0];
            const items = itemsResult || [];

            const transporter = nodemailer.createTransport({
              service: 'gmail', // You can change this to your email provider
              auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
                pass: process.env.EMAIL_PASS || 'your-app-password'     // Replace with your email app password
              }
            });

            // Customize email based on status
            let subject = "";
            let heading = "";
            let message = "";
            let color = "#222";
            
            if (status === 'Delivered') {
              subject = 'Order Delivered Successfully!';
              heading = 'Order Delivered! 🎉';
              message = `We are happy to inform you that your order <strong>#ORD-${orderId}</strong> has been successfully delivered.`;
              color = "#10b981"; // Emerald green
            } else if (status === 'Confirmed') {
              subject = 'Order Success - Your Order is Confirmed!';
              heading = 'Order Confirmed! ✨';
              message = `Great news! Your order <strong>#ORD-${orderId}</strong> has been successfully confirmed by our team and is now being processed. We will let you know once it ships.`;
              color = "#43D1F0"; // Brand cyan
            } else if (status === 'Cancelled') {
              subject = 'Order Cancelled - Kalles';
              heading = 'Order Cancelled ❌';
              message = `We are writing to inform you that your order <strong>#ORD-${orderId}</strong> has been cancelled. If you have been charged, a refund will be issued to your original payment method shortly.`;
              color = "#ef4444"; // Red
            }

            const htmlTemplate = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    @media only screen and (max-width: 600px) {
                      .container { width: 100% !important; padding: 10px !important; }
                      .content { padding: 20px !important; }
                      .header-title { font-size: 24px !important; }
                      .summary-table th, .summary-table td { padding: 8px 5px !important; font-size: 12px !important; }
                      .total-text { font-size: 14px !important; }
                      .total-amount { font-size: 16px !important; }
                    }
                  </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f5f7;">
                  <div class="container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div class="content" style="background-color: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); text-align: center;">
                      <h1 class="header-title" style="color: #222; font-size: 32px; margin-bottom: 5px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">KALLES</h1>
                      <p style="color: #999; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">Fashion Store</p>
                      
                      <h2 style="color: ${color}; font-size: 22px; margin-bottom: 20px; font-weight: 800;">${heading}</h2>
                      
                      <p style="color: #444; font-size: 14px; line-height: 1.6; margin-bottom: 25px; text-align: left;">
                        Hi <strong>${customer_name}</strong>,<br><br>
                        ${message}
                      </p>
                      
                      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${color}; margin-bottom: 15px; text-align: left;">
                        <p style="margin: 0; color: #222; font-weight: bold; font-size: 14px;">Order Reference: <span style="color: ${color};">#ORD-${orderId}</span></p>
                      </div>
                      
                      <div style="margin-top: 25px; text-align: left; width: 100%; overflow-x: auto;">
                        <h3 style="color: #222; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 15px;">Order Summary</h3>
                        <table class="summary-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; min-width: 250px;">
                          <thead>
                            <tr>
                              <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: left; color: #666; font-size: 12px;">Product</th>
                              <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">Qty</th>
                              <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-size: 12px;">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${items.map(item => `
                              <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; color: #222; font-size: 13px;">
                                  ${item.product_name} <br>
                                  <span style="font-size: 11px; color: #888;">${item.selected_size ? 'Size: ' + item.selected_size : ''}</span>
                                </td>
                                <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; text-align: center; color: #444; font-size: 13px;">${item.quantity}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; text-align: right; color: #222; font-weight: bold; font-size: 13px;">${currency || 'ILS'} ${parseFloat(item.price).toFixed(2)}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colspan="2" class="total-text" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #222; font-size: 14px;">Total Amount:</td>
                              <td class="total-amount" style="padding: 15px 10px; text-align: right; font-weight: bold; color: ${color}; font-size: 16px;">${currency || 'ILS'} ${parseFloat(total_amount).toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <p style="color: #666; font-size: 14px; margin-bottom: 30px; margin-top: 25px;">Thank you for shopping with us!</p>
                      
                      <a href="http://localhost:5173" style="background-color: #222; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">Shop Again</a>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #999; font-size: 11px;">
                      &copy; ${new Date().getFullYear()} Kalles. All rights reserved.
                    </div>
                  </div>
                </body>
              </html>
            `;

          const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: customer_email,
            subject: subject,
            html: htmlTemplate
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending status email:", error);
            } else {
              console.log(`${status} email sent: ` + info.response);
            }
          });
          });
        }
      });
    }

    res.send("Order status updated");
  });
});

// Create new order
router.post("/", (req, res) => {
  const {
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    city,
    state,
    zip_code,
    country,
    total_amount,
    currency,
    items,
  } = req.body;

  // 1. First, validate stock for all items
  const productIds = items.map(item => item.id);
  const stockCheckSql = "SELECT id, name, stock FROM products WHERE id IN (?)";
  
  db.query(stockCheckSql, [productIds], (err, products) => {
    if (err) {
      console.error("Stock check error:", err);
      return res.status(500).send("Internal Server Error during stock validation");
    }

    // Map current stock for easy lookup
    const stockMap = {};
    products.forEach(p => {
      stockMap[p.id] = p.stock;
    });

    // Check if any item exceeds available stock
    const outOfStockItems = [];
    items.forEach(item => {
      const availableStock = stockMap[item.id] || 0;
      if (availableStock < item.quantity) {
        outOfStockItems.push(item.name);
      }
    });

    if (outOfStockItems.length > 0) {
      return res.status(400).send(`Insufficient stock for: ${outOfStockItems.join(', ')}`);
    }

    // 2. Proceed with transaction if stock is sufficient
    db.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Transaction Error");
      }

    const orderSql = `
      INSERT INTO orders 
      (user_id, customer_name, customer_email, customer_phone, shipping_address, city, state, zip_code, country, total_amount, currency, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(
      orderSql,
      [
        user_id || null,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        city,
        state,
        zip_code,
        country,
        total_amount,
        currency,
      ],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).send("Error creating order");
          });
        }

        const orderId = result.insertId;
        const itemSql = `
          INSERT INTO order_items 
          (order_id, product_id, product_name, product_image, quantity, price, selected_size)
          VALUES ?
        `;

        const itemValues = items.map((item) => [
          orderId,
          item.id,
          item.name,
          item.image,
          item.quantity,
          item.price,
          item.selectedSize,
        ]);

        db.query(itemSql, [itemValues], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).send("Error creating order items");
            });
          }

          // Reduce stock for each item
          const stockUpdatePromises = items.map((item) => {
            return new Promise((resolve, reject) => {
              const updateStockSql =
                "UPDATE products SET stock = stock - ? WHERE id = ?";
              db.query(
                updateStockSql,
                [item.quantity, item.id],
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                },
              );
            });
          });

          Promise.all(stockUpdatePromises)
            .then(() => {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res.status(500).send("Commit Error");
                  });
                }
                
                // Send email
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.EMAIL_USER || 'your-email@gmail.com',
                    pass: process.env.EMAIL_PASS || 'your-app-password'
                  }
                });

                const htmlTemplate = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        @media only screen and (max-width: 600px) {
                          .container { width: 100% !important; padding: 10px !important; }
                          .content { padding: 20px !important; }
                          .header-title { font-size: 24px !important; }
                          .summary-table th, .summary-table td { padding: 8px 5px !important; font-size: 12px !important; }
                          .total-text { font-size: 14px !important; }
                          .total-amount { font-size: 16px !important; }
                        }
                      </style>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f4f5f7;">
                      <div class="container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div class="content" style="background-color: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); text-align: center;">
                          <h1 class="header-title" style="color: #222; font-size: 32px; margin-bottom: 5px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">KALLES</h1>
                          <p style="color: #999; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">Fashion Store</p>
                          
                          <h2 style="color: #ff4e00; font-size: 22px; margin-bottom: 20px; font-weight: 800;">Order Received! 🎁</h2>
                          
                          <p style="color: #444; font-size: 14px; line-height: 1.6; margin-bottom: 25px; text-align: left;">
                            Hi <strong>${customer_name}</strong>,<br><br>
                            Thank you for your order! We have received your order <strong>#ORD-${orderId}</strong> and we're getting it ready for you.
                          </p>
                          
                          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4e00; margin-bottom: 15px; text-align: left;">
                            <p style="margin: 0; color: #222; font-weight: bold; font-size: 14px;">Order Reference: <span style="color: #ff4e00;">#ORD-${orderId}</span></p>
                          </div>
                          
                          <div style="margin-top: 25px; text-align: left; width: 100%; overflow-x: auto;">
                            <h3 style="color: #222; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 15px;">Order Summary</h3>
                            <table class="summary-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; min-width: 250px;">
                              <thead>
                                <tr>
                                  <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: left; color: #666; font-size: 12px;">Product</th>
                                  <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">Qty</th>
                                  <th style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-size: 12px;">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${items.map(item => `
                                  <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; color: #222; font-size: 13px;">
                                      ${item.name} <br>
                                      <span style="font-size: 11px; color: #888;">${item.selectedSize ? 'Size: ' + item.selectedSize : ''}</span>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; text-align: center; color: #444; font-size: 13px;">${item.quantity}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #f9f9f9; text-align: right; color: #222; font-weight: bold; font-size: 13px;">${currency} ${parseFloat(item.price).toFixed(2)}</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colspan="2" class="total-text" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #222; font-size: 14px;">Total Amount:</td>
                                  <td class="total-amount" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #ff4e00; font-size: 16px;">${currency} ${parseFloat(total_amount).toFixed(2)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                          
                          <p style="color: #666; font-size: 14px; margin-bottom: 30px; margin-top: 25px;">Thank you for shopping with us!</p>
                          
                          <a href="http://localhost:5173" style="background-color: #222; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">View Store</a>
                        </div>
                        <div style="text-align: center; padding: 20px; color: #999; font-size: 11px;">
                          &copy; ${new Date().getFullYear()} Kalles. All rights reserved.
                        </div>
                      </div>
                    </body>
                  </html>
                `;

                if (customer_email) {
                  transporter.sendMail({
                    from: process.env.EMAIL_USER || 'your-email@gmail.com',
                    to: customer_email,
                    subject: 'Order Received - Kalles',
                    html: htmlTemplate
                  }).catch(console.error);
                }

                res.status(201).json({ success: true, orderId });
              });
            })
            .catch((stockErr) => {
              return db.rollback(() => {
                console.error("Stock Update Error:", stockErr);
                res.status(500).send("Error updating product stock");
              });
            });
        });
      });
    });
  });
});

module.exports = router;
