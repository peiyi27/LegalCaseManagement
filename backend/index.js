import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



// MySQL database connection setup
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'cmt322',
  port: '3306',
  password: '12345',
  database: 'legal',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});



app.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  // Check if the email already exists in the "user" table
  const userCheckQuery = "SELECT * FROM user WHERE email = ?";
  
  // Check if the email already exists in the "admin" table
  const adminCheckQuery = "SELECT * FROM admin WHERE email = ?";
  
  // Perform email checks before inserting
  connection.query(userCheckQuery, [email], (err, userResults) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    connection.query(adminCheckQuery, [email], (err, adminResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the email already exists in either "user" or "admin" table
      if (userResults.length > 0 || adminResults.length > 0) {
        return res.status(400).send('Email already exists. Please log in to the application.');
      }

      // Determine the appropriate table based on the chosen role
      let insertQuery = "";
      if (role === 'user') {
        insertQuery = "INSERT INTO user (email, password, role) VALUES (?, ?, ?)";
      } else if (role === 'admin') {
        insertQuery = "INSERT INTO admin (email, password, role) VALUES (?, ?, ?)";
      } else {
        return res.status(400).send('Invalid role. Please choose "user" or "admin" as the role.');
      }
    
      // Insert user details into the appropriate table with plain text password
      connection.query(insertQuery, [email, password, role], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        } else {
          return res.status(200).send('Registration successful!');
        }
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  // Create separate queries for user and admin
  const userQuery = "SELECT * FROM user WHERE email = ?";
  const adminQuery = "SELECT * FROM admin WHERE email = ?";

  // Function to handle the login results
  const handleLogin = (userResults, adminResults) => {
    if (userResults.length === 0 && adminResults.length === 0) {
      // User doesn't exist in both user and admin tables
      res.status(401).send('Login failed: User not found. If you do not have an account, please sign up!');
    } else {
      // Combine the results from both tables
      const combinedResults = [...userResults, ...adminResults];
      
      // Check if any user (user or admin) has a matching password
      const user = combinedResults.find((result) => result.password === password);
      
      if (user) {
        // Password matches for a user (user or admin)
        res.send('You are successfully logged in!');
      } else {
        // Password does not match for any user (user or admin)
        res.status(401).send('Login failed: Invalid password');
      }
    }
  };

  // Perform email checks in parallel for both user and admin tables
  connection.query(userQuery, [email], (err, userResults) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(adminQuery, [email], (err, adminResults) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      handleLogin(userResults, adminResults);
    });
  });
});





app.post('/check-email', (req, res) => {
  const { email } = req.body;
  const queryCheckEmailUser = "SELECT * FROM user WHERE email = ?";
  const queryCheckEmailAdmin = "SELECT * FROM admin WHERE email = ?";

  // Function to handle the results of email checks
  const handleEmailChecks = (userResults, adminResults) => {
    if (userResults.length === 0 && adminResults.length === 0) {
      // Email not found in both user and admin tables
      res.status(401).send('Email not found in our records.');
    } else {
      // Email found in at least one table, allow password reset
      res.status(200).send('Email found. You can reset your password now.');
    }
  };

  // Perform email checks in parallel for both user and admin tables
  connection.query(queryCheckEmailUser, [email], (err, userResults) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(queryCheckEmailAdmin, [email], (err, adminResults) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      handleEmailChecks(userResults, adminResults);
    });
  });
});

app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const queryUpdatePasswordUser = "UPDATE user SET password = ? WHERE email = ?";
  const queryUpdatePasswordAdmin = "UPDATE admin SET password = ? WHERE email = ?";

  // Function to handle the password update results
  const handlePasswordUpdate = (userUpdateResults, adminUpdateResults) => {
    if (userUpdateResults.affectedRows === 0 && adminUpdateResults.affectedRows === 0) {
      // Password update failed in both user and admin tables
      res.status(500).send('Password reset failed.');
    } else {
      // Password reset successfully in at least one table
      res.status(200).send('Password reset successfully!');
    }
  };

  // Update the password in both user and admin tables
  connection.query(queryUpdatePasswordUser, [newPassword, email], (err, userUpdateResults) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(queryUpdatePasswordAdmin, [newPassword, email], (err, adminUpdateResults) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      handlePasswordUpdate(userUpdateResults, adminUpdateResults);
    });
  });
});



// Logout route
app.get('/logout', (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect the user to the login page or any other appropriate page
      res.redirect('/login');
    }
  });
});



// Main page after login
app.get('/main', (req, res) => {
  res.send('Welcome to the main page!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
