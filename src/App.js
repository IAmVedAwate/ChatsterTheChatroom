import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ChatShow from './components/ChatShow';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const gm = localStorage.getItem('email');

  return (
    <div className="App">
    <Router>
      <Routes>
      <Route exact path="/chatshow" element={loggedIn || gm ? <ChatShow /> : <Login />} />
      
      <Route path="/" element={loggedIn ? <SignUp /> : <Login />} />
      <Route path="/login" element={<Login />} />
      </Routes>
  </Router>
    
  </div>
  );
}

export default App;
