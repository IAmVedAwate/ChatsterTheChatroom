// chat_history.js

const db = require('../db');

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user TEXT NOT NULL,
      to_user TEXT NOT NULL,
      chat_text TEXT NOT NULL,
      datetime DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });


function handleChatHistoryPost(req, res) {
    const from  =  req.body.from_user;
    const to = req.body.to_user;
    const chatText = req.body.chat_text;
    const sql = `INSERT INTO chat_history (from_user, to_user, chat_text) VALUES (?, ?, ?)`;
    const values = [from, to, chatText];
  
    db.run(sql, values, function (err) {
        if (err) {
          return res.status(500).json({ message: 'Error saving chat history', error: err.message });
        }
        res.status(200).json({ message: 'Chat history saved successfully', id: this.lastID });
      });
  }

const chatShowcase = (req, res) => {
    const fromUser = req.query.user_from;
    const toUser = req.query.user_to;
  
    const sql = 'SELECT * FROM chat_history WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)';
    const values = [fromUser, toUser, toUser, fromUser];
  
    db.all(sql, values, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching chat history', error: err.message });
      }
      res.status(200).json( rows );
    });
  };
  

module.exports = { handleChatHistoryPost, chatShowcase };
