import "./Signup.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const userSignup = async () => {
    if (validateUsername() && comparePassword()) {
      try {
        const response = await axios.post(import.meta.env.VITE_SIGNUP, {
          login: username,
          password: password,
        });
        setMessage(response.data.message);
      } catch (error) {
        console.log(error);
      }
    } else;
    console.log(false);
  };
  
  const validateUsername = () => {
    if (username.length > 0) {
      return true;
    } else {
      setMessage("Username is required");
      return false;
    }
  };
  const comparePassword = () => {
    if (
      password === confirmPassword &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      return true;
    } else {
      setMessage("Passwords must be equal");
      return false;
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-content">
        <label>Username:</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <label>Confirm password:</label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        {message}

        <label>
          Already have an account?{" "}
          <span>
            <Link to="/">Login</Link>
          </span>
        </label>

        <button onClick={() => userSignup()}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
