const db = require('./db');
const { loginInAccess, signUpAccess , userDetails } = require('./routes/user_access');
const express = require('express')
var cors = require('cors'); 
const { body, validationResult } = require('express-validator');
const { handleChatHistoryPost, chatShowcase } = require('./routes/chat_history');
const { onlineState, typeState, SelectStates } = require('./routes/user_states');
const bodyParser = require('body-parser');
const session = require('express-session');
const { selectFields } = require('express-validator/src/field-selection');

const app = express()
const port = 5000

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 2 * 60 * 1000, // Cookie expiration time (in milliseconds)
    },
  })
);
app.use(cors())
app.use(bodyParser.json());
app.use(express.json())

// Available Routes
app.post('/chat_history', handleChatHistoryPost);

app.get("/api/v1/chat_history",chatShowcase);

app.get("/session",(req,res)=>{
 // Assuming the email is stored in the session

  // Send the session-related data back to the client
  res.json(req.session);
});

app.get("/user",userDetails);

app.post('/update-online-state/:username',onlineState);
app.post('/update-typing-state/:username',typeState);
app.get('/stateinfo',SelectStates);


app.post('/login',[
  body('email','Enter a Valid Email').isEmail(),
  body('password','Password cannot be blank').exists(),
],loginInAccess);

app.post("/signup",[
  body('email','Enter a Valid Email').isEmail(),
  body('password','Password cannot be blank').exists(),
],signUpAccess);

app.listen(port, () => {
  console.log(`Chatster backend listening at http://localhost:${port}`)
})

