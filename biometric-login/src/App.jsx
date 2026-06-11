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
}