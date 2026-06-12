import { useState } from "react";
import "./App.css";

import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(
    localStorage.getItem("biometric") === "true"
  );

  const USER = "admin";
  const PASSWORD = "1234";

  // LOGIN
  const loginHandler = (e) => {
    e.preventDefault();

    if (username === USER && password === PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("UserName Or Password Is Not Correct :(");
    }
  };

  // LOGOUT
  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // ENABLE BIOMETRIC
  const enableBiometric = async () => {
  try {
    const publicKey = {
      challenge: Uint8Array.from(
        "randomChallenge123",
        (c) => c.charCodeAt(0)
      ),

      rp: {
        name: "Biometric Login App",
      },

      user: {
        id: Uint8Array.from(
          "user123",
          (c) => c.charCodeAt(0)
        ),
        name: username,
        displayName: username,
      },

      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7,
        },
      ],

      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },

      timeout: 60000,

      attestation: "none",
    };

    const credential =
      await navigator.credentials.create({
        publicKey,
      });

    console.log(credential);

    localStorage.setItem("biometric", "true");

    setBiometricEnabled(true);

    alert("Biometric Enabled ✅");
  } catch (err) {
    console.log(err);

    alert(err.message);
  }
};

  // LOGIN WITH BIOMETRIC
  const biometricLogin = async () => {
  try {
    const publicKey = {
      challenge: Uint8Array.from(
        "loginChallenge123",
        (c) => c.charCodeAt(0)
      ),

      userVerification: "required",

      timeout: 60000,
    };

    const assertion =
      await navigator.credentials.get({
        publicKey,
      });

    console.log(assertion);

    setIsLoggedIn(true);

    alert("Login Success ✅");
  } catch (err) {
    console.log(err);

    alert(err.message);
  }
};

  // DASHBOARD
  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="card">

          <p>Welcome {username}</p>

          {!biometricEnabled && (
            <button onClick={enableBiometric}>
              Enable Biometric
            </button>
          )}

          {biometricEnabled && (
            <button onClick={biometricLogin}>
              Login With Fingerprint
            </button>
          )}

          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={loginHandler}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          {biometricEnabled && (
            <button
              type="button"
              onClick={biometricLogin}
            >
              Login With Fingerprint
            </button>
          )}

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}