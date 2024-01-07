const db = require('../db');

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            onlineState BOOLEAN DEFAULT FALSE,
            typingState BOOLEAN DEFAULT FALSE
          );`);
});


// Express route to update user states
const onlineState= (req, res) => {
    const { username } = req.params;
    const { onlineState } = req.body;

    // Use database queries to update the user's online state
    // Example SQL query (assuming you're using SQLite3):
    db.run('UPDATE user_states SET onlineState = ? WHERE username = ?', [onlineState, username], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating online state' });
        }
        return res.status(200).json({ message: 'Online state updated successfully' });
    });
};

const typeState = (req, res) => {
    const { username } = req.params;
    const { typingState } = req.body;

    // Use database queries to update the user's typing state
    // Example SQL query (assuming you're using SQLite3):
    db.run('UPDATE user_states SET typingState = ? WHERE username = ?', [typingState, username], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating typing state' });
        }
        return res.status(200).json({ message: 'Typing state updated successfully' });
    });
};


const SelectStates = (req,res)=>{
    
    // Use database queries to update the user's typing state
    // Example SQL query (assuming you're using SQLite3):
    db.all('SELECT * FROM user_states', (err,rows) => { 
        if (err) {
            return res.status(500).json({ error: 'Error updating typing state' });
        }
        res.status(200).json( rows );
    });
};

module.exports = { onlineState, typeState, SelectStates };