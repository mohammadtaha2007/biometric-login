import { useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const USER = "admin";
  const PASSWORD = "1234";

  const loginHandler = (e) => {
    e.preventDefault();

    if (username === USER && password === PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("UserName Of Password Is Not Fetch:(");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };



  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h1>Login Compeleted</h1>
          <p>Welcome {username}</p>
          <button onClick={logout}>logout</button>
        </div>
      </div>
    );
  }



  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={loginHandler}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}