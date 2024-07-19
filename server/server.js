const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
// const sendEmail = require('./emailService');
const crypto = require('crypto');
const { promisify } = require('util');
const fs = require('fs');
const { sendEmail } = require('./emailService');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.6',
  database: 'php_training',
  password: 'mawai123',
  port: 5432,
});

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Middleware to check if the user is an admin
const checkAdminRole = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  const decoded = jwt.verify(token, 'your_secret_key');
  const userId = decoded.userId;

  pool.query('SELECT role FROM aman.users WHERE id = $1', [userId])
    .then((result) => {
      if (result.rows.length > 0 && result.rows[0].role === 'admin') {
        next(); // User is admin, proceed to the next middleware/route handler
      } else {
        res.status(403).json({ message: 'Access forbidden: Admins only' });
      }
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send('Server error');
    });
};

// Example route that is protected by the admin role check middleware
app.get('/adminhome', checkAdminRole, (req, res) => {
  res.send('Welcome to the Admin Home Page');
});



// Other routes (signup, login, etc.) go here
app.post('/signup', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }

    const { username, password, email, fullName, role } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
      const existingUser = await pool.query('SELECT * FROM aman.users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).send({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO aman.users (username, password, email, full_name, image, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [username, hashedPassword, email, fullName, imagePath, role]
      );

      // Send HTML email to the new user
      const userHtmlTable = `
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr><th colspan="2">Registration Details</th></tr>
          </thead>
          <tbody>
            <tr><td>Username:</td><td>${username}</td></tr>
            <tr><td>Email:</td><td>${email}</td></tr>
            <tr><td>Full Name:</td><td>${fullName}</td></tr>
            <tr><td>Role:</td><td>${role}</td></tr>
          </tbody>
        </table>
      `;

      await sendEmail(
        email,
        'Registration Details',
        `Hello ${fullName},<br><br>You have successfully registered with the following details:<br>${userHtmlTable} <br> Please wait for login till the admin approves you.`
      );

      // Send email to the admin for approval
      const adminEmail = 'sardarkhan2428@gmail.com'; // Replace with the admin's email address
      await sendEmail(
        adminEmail,
        'New User Registration Approval Needed',
        `Hello Admin,<br><br>A new user has registered with the following details:<br>${userHtmlTable}<br>Please approve or reject this user.`
      );

      console.log('Registration email sent to:', email);
      console.log('Approval email sent to admin:', adminEmail);

      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
});

// Fetch pending user registrations
app.get('/pending-registrations', checkAdminRole, async (req, res) => {
  try {
    const pendingUsers = await pool.query('SELECT id, username, email, full_name, image, role FROM aman.users WHERE approved = false');
    res.json(pendingUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  const { name, email, food, message } = req.body;

  try {
    // Insert contact form data into the database
    const query = 'INSERT INTO aman.contacts (name, email, food, message) VALUES ($1, $2, $3, $4)';
    const values = [name, email, food, message];
    await pool.query(query, values);

    // Send an email to the admin
    await sendEmail(
      'sardarkhan2428@gmail.com', // Admin email address
      'New Contact Form Submission',
      `<h2>Contact Form Submission</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Food:</strong> ${food}</p>
       <p><strong>Message:</strong> ${message}</p>`
    );

    res.status(200).json({ message: 'Contact information saved successfully!' });
  } catch (error) {
    console.error('Error saving contact information:', error);
    res.status(500).json({ message: 'Failed to save contact information' });
  }
});

// Approve user registration by Admin
app.post('/approve-user', checkAdminRole, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await pool.query('SELECT email, full_name FROM aman.users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.query('UPDATE aman.users SET approved = true WHERE id = $1', [userId]);

    // Send HTML email to the user about approval
     sendEmail(
      user.rows[0].email,
      'Registration Approved',
      `Hello ${user.rows[0].full_name},<br><br>Your registration has been approved by the admin. You can now log in to your account.`
    );

    res.json({ message: 'User approved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Admin reject the user request
app.post('/reject-user', checkAdminRole, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await pool.query('SELECT email, full_name FROM aman.users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.query('DELETE FROM aman.users WHERE id = $1', [userId]);

    // Send HTML email to the user about rejection
     sendEmail(
      user.rows[0].email,
      'Registration Rejected',
      `Hello ${user.rows[0].full_name},<br><br>Your registration has been rejected by the admin. For further details, please contact support.`
    );

    res.json({ message: 'User rejected and deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM aman.users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (!user.rows[0].approved) {
      return res.status(403).json({ message: 'Your registration has not been approved by the admin yet.' });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, 'your_secret_key');

    return res.json({
      id: user.rows[0].id,
      token,
      userImage: user.rows[0].image,
      role: user.rows[0].role,
      email: user.rows[0].email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Get user details route
app.get('/user-details', async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    const userId = decoded.userId;

    const user = await pool.query('SELECT username, email, full_name, image FROM aman.users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update profile route
app.post('/update-profile', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).send({ message: err });
    }

    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = jwt.verify(token, 'your_secret_key');
      const userId = decoded.userId;

      const { username, email, fullName } = req.body;
      let imagePath = req.file ? req.file.path : null;

      // If no new image is provided, fetch the current image path from the database
      if (!imagePath) {
        const user = await pool.query('SELECT image FROM aman.users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        imagePath = user.rows[0].image;
      }

      const updateQuery = `
        UPDATE aman.users 
        SET username = $1, email = $2, full_name = $3, image = $4
        WHERE id = $5 
        RETURNING *`;
      const queryParams = [username, email, fullName, imagePath, userId];

      const updatedUser = await pool.query(updateQuery, queryParams);

      sendEmail(
        email,
        'Profile Updated',
        `Hello ${fullName},\n\nYour profile has been updated successfully. Here are your new details:\n\nUsername: ${username}\nEmail: ${email}\nFull Name: ${fullName}`
      );

      console.log('Profile update email sent to:', email);
      res.json(updatedUser.rows[0]);
    } catch (err) {
      console.error('Database update error:', err.message);
      res.status(500).send('Server error');
    }
  });
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM aman.users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60000); // OTP expires in 15 minutes

    await pool.query(
      'UPDATE aman.users SET otp = $1, otp_expires_at = $2 WHERE email = $3',
      [otp, expiresAt, email]
    );
    console.log(otp, expiresAt, email);

    sendEmail(
      email,
      'Password Reset OTP',
      `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
    );

    res.status(200).json({ message: 'OTP sent to your email', otp }); // Return the OTP to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Verify OTP route
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await pool.query(
      'SELECT * FROM aman.users WHERE email = $1 AND otp = $2 AND otp_expires_at > NOW()',
      [email, otp]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // await pool.query('UPDATE aman.users SET otp = NULL, otp_expires_at = NULL WHERE email = $1', [email]);

    const token = jwt.sign({ userId: user.rows[0].id }, 'your_secret_key');

    res.status(200).json({ message: 'OTP verified', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset password route
app.post('/reset-password', async (req, res) => {
  const { otp, newPassword } = req.body;
  const otp_val = otp;
  console.log(otp_val); // Check if the OTP value is logged correctly

  try {
    // Fetch the user based on the provided OTP
    const user = await pool.query('SELECT * FROM aman.users WHERE otp = $1', [otp_val]);
    console.log(user.rows); // Log the user data to check if it's fetched correctly

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await pool.query('UPDATE aman.users SET password = $1 WHERE otp = $2', [hashedPassword, otp_val]);

    // Clear OTP and expiry in the database
    await pool.query('UPDATE aman.users SET otp = NULL, otp_expires_at = NULL WHERE otp = $1', [otp_val]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const uploads = multer({ storage: storage });

//create new product by admin
app.post('/create-product', uploads.single('photo'), async (req, res) => {
  const { name, price, description, category, discount } = req.body; // Added discount
  const photo = req.file ? req.file.filename : null;

  // Input validation
  if (!name || !price || !description || !category || !discount) { // Added discount validation
    return res.status(400).send('Please provide all required fields');
  }

  try {
    const newProduct = await pool.query(
      'INSERT INTO aman.products (name, price, photo, description, category, discount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, photo, description, category, discount] // Added discount to query
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server error');
  }
});

// // fetch all products on All Products page
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, description, photo, category FROM aman.products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server error');
  }
});

// fetch product at updated page
// server.js or routes/products.js
app.get('/productsuser', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, description, photo, category, discount FROM aman.products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server error');
  }
});



// Fetch all categories
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM aman.products');
    // console.log('Fetched categories:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// // Fetch all categories
// app.get('/categories', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT DISTINCT category FROM aman.products');
//     // console.log('Fetched categories:', result.rows);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching categories:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// Fetch products by category
app.get('/products/category/:category', async (req, res) => {
  const { category } = req.params;
  // console.log(category);
  try {
    const result = await pool.query('SELECT * FROM aman.products WHERE category = $1', [category]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch a product by ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const query = 'SELECT * FROM aman.products WHERE id = $1';
    const { rows } = await pool.query(query, [productId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a product by ID
// Update a product by ID with image upload
app.put('/products/:id', (req, res) => {
  upload(req, res, async (err) => {
    const { id } = req.params;
    const { name, price, description, category, discount } = req.body; // Include discount in destructuring
    let photo = req.file ? req.file.path : null;

    if (!name || !price || !description || !category || !discount) {
      return res.status(400).send({ message: 'Name, price, description, category, and discount are required' });
    }

    try {
      let updateQuery = 'UPDATE aman.products SET name = $1, price = $2, description = $3, category = $4, discount = $5';
      let queryParams = [name, price, description, category, discount]; // Include discount in queryParams

      if (photo) {
        updateQuery += ', photo = $6 WHERE id = $7';
        queryParams.push(photo, id);
      } else {
        updateQuery += ' WHERE id = $6';
        queryParams.push(id);
      }

      const result = await pool.query(updateQuery, queryParams);

      if (result.rowCount === 0) {
        return res.status(404).send({ message: 'Product not found' });
      }

      res.send({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).send({ message: 'Error updating product' });
    }
  });
});



// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM aman.products WHERE id = $1', [id]);
    res.status(200).send('Product deleted successfully!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to add an item to the cart
app.post('/add-to-cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Input validation
  if (!userId || !productId) {
    return res.status(400).send('Please provide user ID and product ID');
  }

  try {
    // Check if the product already exists in the cart for the user
    const existingCartItem = await pool.query(
      'SELECT * FROM aman.cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingCartItem.rows.length > 0) {
      // Update the quantity if the product already exists in the cart
      const newQuantity = existingCartItem.rows[0].quantity + (quantity || 1);
      const updatedCartItem = await pool.query(
        'UPDATE aman.cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, userId, productId]
      );
      res.json(updatedCartItem.rows[0]);
    } else {
      // Insert the product if it doesn't exist in the cart
      const newCartItem = await pool.query(
        'INSERT INTO aman.cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity || 1]
      );
      res.json(newCartItem.rows[0]);
    }
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server error');
  }
});




// Endpoint to fetch cart items for a user
app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await pool.query(
      `SELECT aman.cart.id, aman.products.name, aman.products.price, aman.products.photo, aman.products.discount, aman.cart.quantity, aman.cart.added_at 
      FROM aman.cart 
      JOIN aman.products ON aman.cart.product_id = aman.products.id 
      WHERE aman.cart.user_id = $1`,
      [userId]
    );
    res.json(cartItems.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server error');
  }
});


// Endpoint to update the quantity of a cart item
app.put('/cart/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).send('Quantity must be at least 1');
  }

  try {
    const updatedCartItem = await pool.query(
      'UPDATE aman.cart SET quantity = $1 WHERE user_id = $2 AND id = $3 RETURNING *',
      [quantity, userId, itemId]
    );
    if (updatedCartItem.rows.length === 0) {
      return res.status(404).send('Cart item not found');
    }
    res.json(updatedCartItem.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to remove a cart item
app.delete('/cart/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const deletedCartItem = await pool.query(
      'DELETE FROM aman.cart WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, itemId]
    );
    if (deletedCartItem.rows.length === 0) {
      return res.status(404).send('Cart item not found');
    }
    res.json(deletedCartItem.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server error');
  }
});





// Function to generate a random order ID
function generateRandomOrderId() {
  return Math.floor(Math.random() * 1000000); // Example: Generates a random number between 0 and 999999
}

// Example usage:
const uniqueOrderId = generateRandomOrderId();
console.log(uniqueOrderId); // Output: Example random order ID


const readFileAsync = promisify(fs.readFile);

// Endpoint to place an order and update order history
app.post('/place-order/:userId', async (req, res) => {
  const userId = req.params.userId;
  const uniqueOrderId = generateRandomOrderId(); // Generate a random order ID for the entire order

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Get all cart items for the user with product details
    const cartItemsResult = await pool.query(`
      SELECT cart.id, cart.product_id, cart.quantity, products.name as product_name, products.price
      FROM aman.cart cart
      JOIN aman.products products ON cart.product_id = products.id
      WHERE cart.user_id = $1
    `, [userId]);
    const cartItems = cartItemsResult.rows;

    // Insert cart items into order_history with the same unique order ID
    for (let item of cartItems) {
      await pool.query(
        'INSERT INTO aman.order_history (order_id, user_id, quantity, status, created_at, product_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [uniqueOrderId, userId, item.quantity, 'pending', new Date(), item.product_id]
      );
    }

    // Update delivered column to false for the user's cart items
    await pool.query('UPDATE aman.cart SET delivered = false WHERE user_id = $1', [userId]);

     // Delete cart items after placing the order
     await pool.query('DELETE FROM aman.cart WHERE user_id = $1', [userId]);

    // Commit transaction
    await pool.query('COMMIT');

    // Get user email and full name
    const userResult = await pool.query('SELECT email, full_name FROM aman.users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // Create HTML table for order details
    const orderDetailsTable = `
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems.map(item => `
            <tr>
              <td>${item.product_name}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`
    ;

    // Read HTML template
    let htmlTemplate = await readFileAsync('./order.html', 'utf-8');

    // Replace placeholders in HTML template
    htmlTemplate = htmlTemplate.replace('[Recipient]', user.full_name)
                               .replace('[OrderID]', uniqueOrderId)
                               .replace('[OrderDetailsTable]', orderDetailsTable);

    // Send email to the user
      sendEmail(
      user.email,
      'Order Placed Successfully',
      htmlTemplate
    );

    // Send email to the admin
    const adminEmail = 'sardarkhan2428@gmail.com'; // Replace with the admin's email address
      sendEmail(
      adminEmail,
      'New Order Placed',
      `
      <p>Hello Admin,</p>
      <p>A new order has been placed with the following details:</p>
      <p><strong>Order ID:</strong> ${uniqueOrderId}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>User Name:</strong> ${user.full_name}</p>
      ${orderDetailsTable}
      `
    );

    res.status(200).json({ message: 'Order placed successfully', orderId: uniqueOrderId });
  } catch (err) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Endpoint to fetch pending orders for a user
app.get('/pending-orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await pool.query(`
          SELECT 
              o.order_id,
              o.user_id,
              o.product_id,
              o.quantity,
              p.photo AS photo,
              p.name,
              p.price
          FROM aman.order_history o
          JOIN aman.products p ON o.product_id = p.id
          WHERE o.user_id = $1 AND o.status = 'pending'
      `, [userId]);
      res.json(result.rows);
  } catch (err) {
      console.error('Error fetching pending orders:', err);
      res.status(500).send('Server error');
  }
});

/// fetch pedning order for admin
app.get('/pending-orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.product_id,
        o.quantity,
        p.photo AS photo,
        p.name,
        p.price
      FROM aman.order_history o
      JOIN aman.products p ON o.product_id = p.id
      WHERE o.status = 'pending'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending orders:', err);
    res.status(500).send('Server error');
  }
});



// Endpoint to delete a specific order from a user
app.delete('/orders/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Fetch the specific order to be cancelled
    const orderResult = await pool.query('SELECT product_id, quantity FROM aman.order_history WHERE user_id = $1 AND order_id = $2 AND status = $3', 
      [userId, orderId, 'pending']);
    const orderToCancel = orderResult.rows[0];

    if (!orderToCancel) {
      await pool.query('ROLLBACK'); // Rollback if no pending order found
      return res.status(404).json({ success: false, message: 'No pending order found for the user' });
    }

    // Get product details for the order to be cancelled
    const productDetailsResult = await pool.query('SELECT id, name, price FROM aman.products WHERE id = $1', [orderToCancel.product_id]);
    const productDetails = productDetailsResult.rows[0];

    // Create HTML table for order details
    const orderDetailsTable = `
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${orderId}</td>
            <td>${productDetails.name}</td>
            <td>${orderToCancel.quantity}</td>
            <td>${productDetails.price}</td>
          </tr>
        </tbody>
      </table>
    `;

    // Delete order from aman.cart for the user
    await pool.query('DELETE FROM aman.cart WHERE user_id = $1 AND product_id = $2', [userId, orderToCancel.product_id]);

    // Update order history to mark order as user cancelled
    await pool.query('UPDATE aman.order_history SET status = $1 WHERE user_id = $2 AND order_id = $3 AND status = $4',
      ['user cancelled', userId, orderId, 'pending']
    );

    // Commit transaction
    await pool.query('COMMIT');

    // Send email to admin about the cancellation
    const adminEmail = 'admin@example.com'; // Replace with admin email address
    await sendEmail(
      adminEmail,
      'User Order Cancellation',
      `
      <p>Dear Admin,</p>
      <p>The user with ID ${userId} has cancelled their pending order. Below are the details:</p>
      ${orderDetailsTable}
      `
    );

    res.status(200).json({ success: true, message: 'Order deleted and marked as user cancelled successfully' });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Error deleting order' });
  }
});




// Endpoint to update the status of all orders for a user to 'user cancelled'
// app.put('/orders/cancel/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     await pool.query('UPDATE aman.order_history SET status = $1 WHERE user_id = $2', ['user cancelled', userId]);
//     res.status(200).send('All orders cancelled successfully');
//   } catch (error) {
//     console.error('Error cancelling orders:', error);
//     res.status(500).send('Error cancelling orders');
//   }
// });



// Accept orders route by Admin
app.put('/orders/:orderId/accept', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Update order_history to mark orders as accepted
    const updateResult = await pool.query(
      'UPDATE aman.order_history SET status = $1 WHERE order_id = $2 AND status = $3 RETURNING id, user_id, product_id, quantity',
      ['accepted', orderId, 'pending']
    );

    const updatedOrders = updateResult.rows;

    if (updatedOrders.length === 0) {
      await pool.query('ROLLBACK'); // Rollback if no pending orders found
      return res.status(404).json({ success: false, message: 'No pending orders found for the order' });
    }


    // Get product details for the accepted orders
    const productIds = updatedOrders.map(order => order.product_id);
    const productDetailsResult = await pool.query('SELECT id, name, price FROM aman.products WHERE id = ANY($1)', [productIds]);
    const productDetails = productDetailsResult.rows;

    // Create a map of productId to productDetails
    const productMap = productDetails.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});


    // Create HTML table for order details
    const orderDetailsTable = `
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${updatedOrders.map(order => `
            <tr>
              <td>${productMap[order.product_id].name}</td>
              <td>${order.quantity}</td>
              <td>${productMap[order.product_id].price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Get user email and full name (assuming all orders belong to the same user)
    const userId = updatedOrders[0].user_id;
    const userResult = await pool.query('SELECT email, full_name FROM aman.users WHERE id = $1', [userId]);
    const user = userResult.rows[0];


    // Delete orders from aman.cart for the user
    await pool.query('DELETE FROM aman.cart WHERE user_id = $1 ', [userId]);


    // Commit transaction
    await pool.query('COMMIT');

    // Send email to the user
    await sendEmail(
      user.email,
      'Order Accepted',
      `
      <p>Hello ${user.full_name},</p>
      <p>Your order with Order ID: ${orderId} has been delivered with the following details:</p>
      ${orderDetailsTable}
      `
    );

    res.json({ success: true });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error updating orders' });
  }
});




//Admin cancel the order
// Route to cancel orders for a user
// Endpoint to cancel orders for a use
app.put('/orders/:orderId/cancel', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Update order_history to mark orders as admin rejected
    const updateResult = await pool.query(
      'UPDATE aman.order_history SET status = $1 WHERE order_id = $2 AND status = $3 RETURNING id, user_id, product_id, quantity',
      ['admin rejected', orderId, 'pending']
    );

    const updatedOrders = updateResult.rows;

    if (updatedOrders.length === 0) {
      await pool.query('ROLLBACK'); // Rollback if no pending orders found
      return res.status(404).json({ success: false, message: 'No pending orders found for the order' });
    }

    // Get product details for the canceled orders
    const productIds = updatedOrders.map(order => order.product_id);
    const productDetailsResult = await pool.query('SELECT id, name, price FROM aman.products WHERE id = ANY($1)', [productIds]);
    const productDetails = productDetailsResult.rows;

    // Create a map of productId to productDetails
    const productMap = productDetails.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    // Create HTML table for order details
    const orderDetailsTable = `
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${updatedOrders.map(order => `
            <tr>
              <td>${productMap[order.product_id].name}</td>
              <td>${order.quantity}</td>
              <td>${productMap[order.product_id].price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Get user email and full name (assuming all orders belong to the same user)
    const userId = updatedOrders[0].user_id;
    const userResult = await pool.query('SELECT email, full_name FROM aman.users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // Delete orders from aman.cart for the user
    await pool.query('DELETE FROM aman.cart WHERE user_id = $1', [userId]);

    // Commit transaction
    await pool.query('COMMIT');

    // Send email to the user
    await sendEmail(
      user.email,
      'Order Canceled',
      `
      <p>Hello ${user.full_name},</p>
      <p>We regret to inform you that your order with Order ID: ${orderId} has been canceled by the admin with the following details:</p>
      ${orderDetailsTable}
      `
    );

    res.json({ success: true });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error canceling orders' });
  }
});




// Endpoint to fetch order history for a specific user with pagination
app.get('/order-history/:userId', async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Fetch total count of orders for the user
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM aman.order_history WHERE user_id = $1`,
      [userId]
    );
    const totalOrders = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch paginated order history for the user with product images
    const ordersResult = await pool.query(
      `SELECT oh.*, p.photo 
       FROM aman.order_history oh
       JOIN aman.products p ON oh.product_id = p.id
       WHERE oh.user_id = $1
       ORDER BY oh.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const orders = ordersResult.rows;

    res.json({ orders, totalPages });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ success: false, error: 'Error fetching order history' });
  }
});




// Submit a rating for a product
app.post('/submit-rating', async (req, res) => {
  const { userId, orderId, rating } = req.body;
  
  try {
    // Fetch product_id from the order
    const orderResult = await pool.query('SELECT product_id FROM aman.order_history WHERE id = $1 AND user_id = $2', [orderId, userId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    const { product_id } = orderResult.rows[0];

    // Insert rating into aman.order_history table
    await pool.query('UPDATE aman.order_history SET rating = $1 WHERE id = $2', [rating, orderId]);

    // Fetch current rating and rating count from aman.products
    const productResult = await pool.query('SELECT rating, rating_count FROM aman.products WHERE id = $1', [product_id]);
    const { rating: currentRating, rating_count: ratingCount } = productResult.rows[0];

    // Calculate new rating and increment count
    const newRating = currentRating + rating;
    const newRatingCount = ratingCount + 1;

    // Update product rating and rating count in the aman.products table
    await pool.query('UPDATE aman.products SET rating = $1, rating_count = $2 WHERE id = $3', [newRating, newRatingCount, product_id]);

    res.send('Rating submitted successfully');
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).send('Server error');
  }
});



// Fetch product rating endpoint
app.get('/product-rating/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Fetch rating and rating count from aman.products
    const queryText = `
      SELECT 
        rating, 
        rating_count 
      FROM 
        aman.products 
      WHERE 
        id = $1`;
    
    const { rows } = await pool.query(queryText, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Extract rating and rating count
    const { rating, rating_count } = rows[0];

    // Calculate average rating per your requirement
    let averageRating = 0;
    if (rating_count !== 0) {
      averageRating = rating / rating_count;
    }

    res.json({ average_rating: averageRating, rating_count });
  } catch (error) {
    console.error('Error fetching product rating:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// // Fetch rating for a specific order ID
// app.get('/fetch-rating/:userId', async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     // Fetch rating and rating count from aman.order_history based on user_id
//     const result = await pool.query('SELECT rating FROM aman.order_history WHERE user_id = $1', [userId]);
//     console.log(result);
//     // return;
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Rating not found' });
//     }

//     const { rating, rating_count: ratingCount } = result.rows[0];
//     res.json({ rating, rating_count: ratingCount });
//   } catch (error) {
//     console.error('Error fetching rating:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// submit contact form from user to admin
// Endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, food, message } = req.body;
  try {
    const query = 'INSERT INTO aman.contacts (name, email, food, message) VALUES ($1, $2, $3, $4)';
    const values = [name, email, food, message];
    await pool.query(query, values);
    res.status(200).json({ message: 'Contact information saved successfully!' });
  } catch (error) {
    console.error('Error saving contact information:', error);
    res.status(500).json({ message: 'Failed to save contact information' });
  }
});



// fetch data for pdf table 
// server.js or a similar backend file
app.get('/api/orders', async (req, res) => {
  const { userId, date, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT oh.*, u.username
    FROM aman.order_history oh
    LEFT JOIN aman.users u ON oh.user_id = u.id
    WHERE 1=1
  `;
  if (userId) query += ` AND oh.user_id = ${userId}`;
  if (date) query += ` AND DATE(oh.created_at) = '${date}'`;
  query += ` ORDER BY oh.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  try {
    const { rows } = await pool.query(query);
    const total = await pool.query(`
      SELECT COUNT(*) 
      FROM aman.order_history 
      WHERE 1=1 
      ${userId ? `AND user_id = ${userId}` : ''} 
      ${date ? `AND DATE(created_at) = '${date}'` : ''}
    `);
    const totalOrders = total.rows[0].count;

    res.json({ orders: rows, totalOrders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Server Error');
  }
});



// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT DISTINCT user_id FROM aman.order_history');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });

// fetch data for pdf search bar 
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT u.id, u.username 
      FROM aman.users u
      JOIN aman.order_history oh ON u.id = oh.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// Endpoint to fetch messages from aman.contact table
app.get('/api/getMessages', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM aman.contacts order by id desc');
    const messages = result.rows;
    client.release();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});



// Route to fetch order history for graph
// Example route to fetch order history grouped by month
app.get('/api/order-history', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        to_char(created_at, 'Month') AS month,
        COUNT(*) AS total_orders
      FROM 
        aman.order_history
      GROUP BY 
        to_char(created_at, 'Month')
      ORDER BY 
        MIN(EXTRACT(MONTH FROM created_at));
    `);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/', (req, res) => {
  console.log('Home page');
  res.send('Home page');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
