import { useState } from "react";
import "./App.css";

export default function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [error, setError] = useState("");

  const [biometricEnabled, setBiometricEnabled] =
    useState(
      localStorage.getItem("biometric") === "true"
    );

  const USER = "admin";
  const PASSWORD = "1234";

  // LOGIN
  const loginHandler = (e) => {

    e.preventDefault();

    if (
      username === USER &&
      password === PASSWORD
    ) {

      setIsLoggedIn(true);

      setError("");

    } else {

      setError(
        "UserName Or Password Is Not Correct :("
      );
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

        challenge: crypto.getRandomValues(
          new Uint8Array(32)
        ),

        rp: {
          name: "Biometric Login App",
        },

        user: {

          id: crypto.getRandomValues(
            new Uint8Array(16)
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

      console.log("Credential:", credential);

      // SAVE BIOMETRIC STATUS
      localStorage.setItem(
        "biometric",
        "true"
      );

      // SAVE CREDENTIAL ID
      localStorage.setItem(
        "credentialId",
        credential.id
      );

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

      const credentialId =
        localStorage.getItem("credentialId");

      if (!credentialId) {

        alert(
          "No Biometric Credential Found"
        );

        return;
      }

      const publicKey = {

        challenge: crypto.getRandomValues(
          new Uint8Array(32)
        ),

        userVerification: "required",

        timeout: 60000,
      };

      const assertion =
        await navigator.credentials.get({
          publicKey,
        });

      console.log("Assertion:", assertion);

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

          <h1>Dashboard</h1>

          <p>Welcome {username}</p>

          {!biometricEnabled && (

            <button
              onClick={enableBiometric}
            >
              Enable Biometric
            </button>
          )}

          {biometricEnabled && (

            <button
              onClick={biometricLogin}
            >
              Login With Fingerprint
            </button>
          )}

          <button onClick={logout}>
            Logout
          </button>

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
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

          {biometricEnabled && (

            <button
              type="button"
              onClick={biometricLogin}
            >
              Login With Fingerprint
            </button>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}