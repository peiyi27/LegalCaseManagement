import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser'
import multer from 'multer';

const app = express();
const port = 3001;

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET",'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 *60 *60 *24
  }
}))



// MySQL database connection setup
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  password: 'root',
  database: 'legal',
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

app.get("/", (req, res) => {
  res.json("Hello testing")
})

// index.js for alert system
app.get('/api/alert/events/upcoming', (req, res) => {
  const query = 'SELECT event_id, event_name, event_date, event_time_start FROM alert.events WHERE event_date >= CURDATE()';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

//get event details
app.get('/events', (req, res) => {
  const caseId = req.params.caseId;
  console.log('Case ID:', caseId);
  const query = 'SELECT * FROM `event` WHERE case_id = ?';

  connection.query(query, [caseId], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query: ', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });       
    } else {
      console.log('Fetched event details:', results[0]);
      return res.status(200).json({ success: true, caseData: results[0] });
    }
  });
});

app.post('/register', (req, res) => {
  const { email, password, name, role } = req.body;

  // Check if the email already exists in the "user" table
  const userCheckQuery = "SELECT * FROM user WHERE email = ?";
  
  // Check if the email already exists in the "admin" table
  const adminCheckQuery = "SELECT * FROM admin WHERE email = ?";
  
  // Check if the name already exists in the "user" table
  const userNameCheckQuery = "SELECT * FROM user WHERE name = ?";
  
  // Check if the name already exists in the "admin" table
  const adminNameCheckQuery = "SELECT * FROM admin WHERE name = ?";

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

      // Perform name checks before inserting
      connection.query(userNameCheckQuery, [name], (err, userNameResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        connection.query(adminNameCheckQuery, [name], (err, adminNameResults) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

          // Check if the name already exists in either "user" or "admin" table
          if (userNameResults.length > 0 || adminNameResults.length > 0) {
            return res.status(400).send('Name already exists. Please choose a different name.');
          }

          // Determine the appropriate table based on the chosen role
          let insertQuery = "";
          if (role === 'user') {
            insertQuery = "INSERT INTO user (email, password, role, name) VALUES (?, ?, ?, ?)";
          } else if (role === 'admin') {
            insertQuery = "INSERT INTO admin (email, password, role, name) VALUES (?, ?, ?, ?)";
          } else if (role === 'staff') {
            // Assuming you have a separate table for staff, adjust the table name accordingly
            insertQuery = "INSERT INTO admin (email, password, role, name) VALUES (?, ?, ?, ?)";
          } else {
            return res.status(400).send('Invalid role. Please choose "user," "admin," or "staff" as the role.');
          }
        
          // Insert user details into the appropriate table with plain text password
          connection.query(insertQuery, [email, password, role, name], (err, results) => {
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
  });
});



app.options('/login', cors());

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
    
        // Set the user ID as a session ID
        req.session.username = user.id;
        console.log(req.session.username)
        // Password matches for a user (user or admin)
        res.json({ success: true, message: 'You are successfully logged in!' });
      } else {
        // Password does not match for any user (user or admin)
        res.status(401).json({ success: false, message: 'Login failed: Invalid password' });
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


// Get client names
app.get('/get-client-names', (req, res) => {
  const query = "SELECT name FROM user";
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const clientNames = results.map(result => result.name);
    res.status(200).json({ success: true, clientNames });
  });
});

// Get staff names
app.get('/get-staff-names', (req, res) => {
  const query = "SELECT name FROM admin";
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const staffNames = results.map(result => result.name);
    res.status(200).json({ success: true, staffNames });
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


// Get email
app.get('/profile-get-admin-email', (req, res) => {
  const userid = req.session.username;
  console.log(userid);
  const query = "SELECT email FROM admin WHERE id = ?";

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      const adminEmail = results[0].email;
      res.status(200).json({ success: true, adminEmail });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  });
});

// Get name
app.get('/profile-get-admin-name', (req, res) => {
  const userid = req.session.username;
  console.log(userid);
  const query = "SELECT name FROM admin WHERE id = ?";

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      const adminName = results[0].name;
      res.status(200).json({ success: true, adminName });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  });
});


// Get email
app.get('/profile-get-client-email', (req, res) => {
  const userid = req.session.username;
  console.log(userid);
  const query = "SELECT email FROM user WHERE id = ?";

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      const adminEmail = results[0].email;
      res.status(200).json({ success: true, adminEmail });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  });
});

// Get name
app.get('/profile-get-client-name', (req, res) => {
  const userid = req.session.username;
  console.log(userid);
  const query = "SELECT name FROM user WHERE id = ?";

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      const adminName = results[0].name;
      res.status(200).json({ success: true, adminName });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  });
});


// Update email endpoint
app.post('/update-admin-email', (req, res) => {
  const userid = req.session.username;
  const newEmail = req.body.newEmail; // Assuming the new email is sent in the request body

  // Check if the new email already exists in the database
  const checkEmailQuery = "SELECT id FROM admin WHERE email = ?";
  connection.query(checkEmailQuery, [newEmail], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(checkErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // The new email already exists in the database
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // If the new email doesn't exist, proceed with the update
    const updateEmailQuery = "UPDATE admin SET email = ? WHERE id = ?";
    connection.query(updateEmailQuery, [newEmail, userid], (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      return res.status(200).json({ success: true, message: 'Email updated successfully' });
    });
  });
});


// Update name endpoint
app.post('/update-admin-name', (req, res) => {
  const userId = req.session.username;
  const newName = req.body.newName;

  // Check if the new name already exists
  const checkNameQuery = "SELECT id FROM admin WHERE name = ? AND id != ?";
  connection.query(checkNameQuery, [newName, userId], (checkNameErr, checkNameResults) => {
    if (checkNameErr) {
      console.error(checkNameErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (checkNameResults.length > 0) {
      // Name already exists
      return res.status(400).json({ success: false, message: 'Name already in use. Please choose a different name.' });
    }

    // If the new name doesn't exist, proceed with the update
    const updateNameQuery = "UPDATE admin SET name = ? WHERE id = ?";
    connection.query(updateNameQuery, [newName, userId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      console.log('User ID:', userId);
      return res.status(200).json({ success: true, message: 'Name updated successfully' });
    });
  });
});



// Update email endpoint
app.post('/update-client-email', (req, res) => {
  const userid = req.session.username;
  const newEmail = req.body.newEmail; // Assuming the new email is sent in the request body

  // Check if the new email already exists in the database
  const checkEmailQuery = "SELECT id FROM user WHERE email = ?";
  connection.query(checkEmailQuery, [newEmail], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(checkErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // The new email already exists in the database
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // If the new email doesn't exist, proceed with the update
    const updateEmailQuery = "UPDATE user SET email = ? WHERE id = ?";
    connection.query(updateEmailQuery, [newEmail, userid], (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      return res.status(200).json({ success: true, message: 'Email updated successfully' });
    });
  });
});


// Update name endpoint
app.post('/update-client-name', (req, res) => {
  const userId = req.session.username;
  const newName = req.body.newName;

  // Check if the new name already exists
  const checkNameQuery = "SELECT id FROM user WHERE name = ? AND id != ?";
  connection.query(checkNameQuery, [newName, userId], (checkNameErr, checkNameResults) => {
    if (checkNameErr) {
      console.error(checkNameErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (checkNameResults.length > 0) {
      // Name already exists
      return res.status(400).json({ success: false, message: 'Name already in use. Please choose a different name.' });
    }

    // If the new name doesn't exist, proceed with the update
    const updateNameQuery = "UPDATE user SET name = ? WHERE id = ?";
    connection.query(updateNameQuery, [newName, userId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      console.log('User ID:', userId);
      return res.status(200).json({ success: true, message: 'Name updated successfully' });
    });
  });
});

app.get('/get-cases-staff', (req, res) => {
  const staffId = req.session.username;
  
  // Log staffId to console for debugging
  console.log('Staff ID:', staffId);

  // Fetch specific columns from the database
  const selectQuery = "SELECT * FROM `case` WHERE staff_id = ?";

  connection.query(selectQuery, [staffId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      // Log the fetched data in the console
      console.log('Fetched cases:', results);

      // Send the retrieved cases as a JSON response
      return res.status(200).json({ success: true, cases: results });
    }
  });
});

app.get('/get-cases-client', (req, res) => {
  const clientId = req.session.username;
  
  // Log staffId to console for debugging
  console.log('Client ID:', clientId);

  // Fetch specific columns from the database
  const selectQuery = "SELECT * FROM `case` WHERE client_id = ?";

  connection.query(selectQuery, [clientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      // Log the fetched data in the console
      console.log('Fetched cases:', results);

      // Send the retrieved cases as a JSON response
      return res.status(200).json({ success: true, cases: results });
    }
  });
});



app.get('/get-all-cases-admin', (req, res) => {
 
  // Fetch specific columns from the database
  const selectQuery = "SELECT * FROM `case` ";

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      // Log the fetched data in the console
      console.log('Fetched cases:', results);

      // Send the retrieved cases as a JSON response
      return res.status(200).json({ success: true, cases: results });
    }
  });
});

app.get('/get-case-details/:caseId', (req, res) => {
  const caseId = req.params.caseId;

  // Log caseId to console for debugging
  console.log('Case ID:', caseId);

  // Fetch specific columns from the database for a particular case
  const selectQuery = "SELECT * FROM `case` WHERE case_id = ?";

  connection.query(selectQuery, [caseId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.length === 0) {
      // If no case is found with the given caseId, return a 404
      return res.status(404).json({ success: false, message: 'Case not found' });
    } else {
      // Log the fetched data in the console
      console.log('Fetched case details:', result[0]);

      // Send the retrieved case details as a JSON response
      return res.status(200).json({ success: true, caseData: result[0] });
    }
  });
});

app.post('/edit-case/:caseId', (req, res) => {
  const caseId = req.params.caseId;
  const {
    caseName,
    caseType,
    caseStatus,
    staffName,
    client,
    caseDetails,
  } = req.body;

  const updateQuery = `
    UPDATE \`case\`
    SET
      case_name = ?,
      case_type = ?,
      case_status = ?,
      staff_name = ?,
      client_name = ?,
      case_detail = ?
    WHERE case_id = ?
  `;

  connection.query(
    updateQuery,
    [caseName, caseType, caseStatus, staffName, client, caseDetails, caseId],
    (err, results) => {
      if (err) {
        console.error('Error updating case:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
      }

      console.log('Case updated:', results);
      return res.status(200).json({ success: true, message: 'Case updated successfully' });
    }
  );
});


// Delete a case by ID
app.delete('/delete-case/:caseId', (req, res) => {
  const { caseId } = req.params;

  // Replace this with your database delete operation
  // Example using MySQL
  const deleteQuery = "DELETE FROM `case` WHERE case_id = ?";

  connection.query(deleteQuery, [caseId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      // Check if any rows were affected
      if (results.affectedRows > 0) {
        return res.status(200).json({ success: true, message: 'Case deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'Case not found' });
      }
    }
  });
});




app.post('/create-case', (req, res) => {
  const staffId = req.session.username;
  const { caseName, caseType, caseStatus, staffName, client, caseDetails } = req.body;

  // Insert the case details into the database
  const insertQuery = "INSERT INTO `case` (case_name, case_type, case_status,staff_id, staff_name, client_name, case_detail) VALUES (?, ? , ?, ?, ?, ?, ?)";

  connection.query(insertQuery, [caseName, caseType, caseStatus,staffId, staffName, client, caseDetails], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      // Assuming success, you can send a response with the case_id
      const caseId = results.insertId; // The auto-incremented case_id
      return res.status(200).json({ success: true, caseId, message: 'Case created successfully!' });
    }
  });
});

app.get('/get-case-documents/:caseId', (req, res) => {
  const caseId = req.params.caseId;

  // Replace this with your database query to fetch documents for the given caseId
  // Assume you have a 'documents' table with columns 'name', 'url', 'content', and 'case_id'
  const sql = 'SELECT id, title, content,type FROM document WHERE case_id = ?';

  connection.query(sql, [caseId], (err, results) => {
    if (err) {
      console.error('Error fetching documents:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const documents = results.map(result => ({
      documentId: result.id,
      name: result.title,
      documentType: result.type,
      // Sending content as base64 encoded string for simplicity
      content: result.content.toString('base64'),
    }));

    res.json({ documents });
  });
});




// Multer storage configuration
const storage = multer.memoryStorage(); // Use memory storage for storing file content in the database

const upload = multer({ storage });

// Handle file upload
app.post('/upload-document', upload.single('file'), (req, res) => {
  const caseId = req.body.caseId;
  const title = req.body.title;
  const content = req.file.buffer; // Use req.file.buffer to get the file content
  const fileType = req.body.fileType; // Retrieve the file type from the request body

  // Store file information in the database
  const insertQuery = 'INSERT INTO document (title, content, case_id, type) VALUES (?, ?, ?, ?)';
  connection.query(insertQuery, [title, content, caseId, fileType], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'File uploaded successfully' });
  });
});


// Handle document deletion
app.delete('/delete-document/:documentId', (req, res) => {
  const documentId = req.params.documentId;

  // Delete the document from the database
  const deleteQuery = 'DELETE FROM document WHERE id = ?';
  connection.query(deleteQuery, [documentId], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error(deleteErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, message: 'Document deleted successfully' });
  });
});

app.get('/api/count-for-client', (req, res) => {
  const query = 'SELECT COUNT(*) AS clientCount FROM user';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const clientCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ clientCount });
  });
});

app.get('/api/count-for-admin', (req, res) => {
  const query = 'SELECT COUNT(*) AS adminCount FROM admin WHERE role = "admin"';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const adminCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ adminCount });
  });
});

app.get('/api/count-for-staff', (req, res) => {
  const query = 'SELECT COUNT(*) AS staffCount FROM admin WHERE role = "staff"';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const staffCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ staffCount });
  });
});

app.get('/api/count-for-case', (req, res) => {
  const query = 'SELECT COUNT(*) AS caseCount FROM `case`'; // Use backticks for the table name

  connection.query(query, (err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const caseCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ caseCount });
  });
});


app.get('/api/client-count-for-case', (req, res) => {

  const userId = req.session.username;
  const query = 'SELECT COUNT(*) AS caseCount FROM `case` WHERE client_id = ?'; // Use backticks for the table name

  connection.query(query, [userId],(err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const caseCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ caseCount });
  });
});


app.get('/api/staff-count-for-case', (req, res) => {

  const userId = req.session.username;
  const query = 'SELECT COUNT(*) AS caseCount FROM `case` WHERE staff_id = ?'; // Use backticks for the table name

  connection.query(query, [userId],(err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const caseCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ caseCount });
  });
});


app.get('/api/staff-count-for-client', (req, res) => {

  const userId = req.session.username;
  const query = 'SELECT COUNT(DISTINCT(client_id)) AS clientCount FROM `case` WHERE staff_id = ? '; // Use backticks for the table name

  connection.query(query, [userId],(err, result) => {
    if (err) {
      console.error('MySQL query error: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const clientCount = result[0][Object.keys(result[0])[0]];
    return res.status(200).json({ clientCount });
  });
});


app.get('/admin-get-external-user', (req, res) => {
  const selectQuery = "SELECT * FROM user ";

  connection.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      // Modify the data structure before sending it as a JSON response
      const userData = result.map(user => ({
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role,
        // Add more properties as needed
      }));

      console.log('Fetched External Users:', userData);

      return res.status(200).json({ success: true, userData });
    }
  });
});

app.get('/admin-get-internal-user', (req, res) => {
  const selectQuery = "SELECT * FROM admin ";

  connection.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin and staff not found' });
    } else {
      // Modify the data structure before sending it as a JSON response
      const adminData = result.map(admin => ({
        userId: admin.id,
        userName: admin.name,
        email: admin.email,
        role: admin.role,
        // Add more properties as needed
      }));

      console.log('Fetched Internal Users:', adminData);

      return res.status(200).json({ success: true, adminData });
    }
  });
});

// Import necessary modules and set up your app

// ... (your existing code)

// Endpoint to delete an external user
app.delete('/admin-delete-external-user/:userId', (req, res) => {
  const userId = req.params.userId;

  const deleteQuery = 'DELETE FROM user WHERE id = ?';

  connection.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
  });
});

// Endpoint to delete an internal user
app.delete('/admin-delete-internal-user/:userId', (req, res) => {
  const userId = req.params.userId;

  const deleteQuery = 'DELETE FROM admin WHERE id = ?';

  connection.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    } else {
      return res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    }
  });
});




/*
app.get('/', (req, res) => {
  if (req.session.username) {
    return res.json({ valid:true, username: req.session.username});
  }else{
    return res.json({valid:false})
  };
});*/


// Main page after login
app.get('/main', (req, res) => {
  res.send('Welcome to the main page!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});