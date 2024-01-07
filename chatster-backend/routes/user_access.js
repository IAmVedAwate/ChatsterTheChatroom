const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const session = require('express-session');

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);
  });

const userDetails= (req,res)=>{
    const email = req.query.email;
  
    const sql = 'SELECT * FROM user WHERE email=?';
    const values = [email];
  
    db.all(sql, values, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching chat history', error: err.message });
      }
      res.status(200).json( rows );
    });
}  

const loginInAccess = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }  
      const { email, password } = req.body;
      const query = 'SELECT * FROM user WHERE email = ?';
      let user;
      db.all(query, [email], (err, rows) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching chat history', error: err.message });
        }
        user = rows;
        console.log(user[0].password);
      // Check if the email exists in the database
      if (!user) {
        return res.status(400).json({ error: 'Email not found' });
      }
      // Compare the provided password with the stored hashed password
      const passwordCompare = (user[0].password === password);
  
      if (!passwordCompare) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      if (passwordCompare && user) {
        // Here Adding Session step
        req.session.email = user[0].email;
        return res.status(200).json( req.session.email );
      }
  
      res.status(200).json({ message: 'Login successful' });
    });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };


async function signUpAccess(req, res) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }  
    const name  =  req.body.name;
    const email = req.body.email;
    const secPass = req.body.password;
    const password = secPass;

    const sql = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
    const sql2 = `INSERT INTO user_states (username) VALUES (?)`;
    const values = [name,email,password];
  
    db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
        }
        res.status(200).json({ message: 'User saved Successfully!', id: this.lastID });
      });
      db.run(sql2, [name], function (err) {
        if (err) {
          console.error(err);
        }
        res.status(200).json({ message: 'User saved Successfully!', id: this.lastID });
      });  
  }

  module.exports = { loginInAccess, signUpAccess , userDetails};