import "./Signup.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BubbleGradient from "../components/BubbleGradient";
import Loader from "../components/Loader";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  const userSignup = async () => {
    if (validateUsername() && comparePassword()) {
      try {
        setLoading("loading");
        const response = await axios.post(import.meta.env.VITE_SIGNUP, {
          login: username,
          password: password,
        });
        setMessage(response.data.message);
        setLoading("loaded");
      } catch (error) {
        console.log(error);
        setLoading("loaded");
      }
    } else;
    console.log(false);
    setLoading("loaded");
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
    <BubbleGradient>
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-content-title">
            <label>Signup</label>
          </div>
          <div className="signup-content-username">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>

          <div className="signup-content-password">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div className="signup-content-confirm-password">
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </div>
          <div className="signup-content-message">
            {loading === "loading" ? (
              <Loader />
            ) : loading === "loaded" ? (
              <p>{message}</p>
            ) : (
              <p></p>
            )}
          </div>

          <button onClick={() => userSignup()}>Signup</button>

          <div className="signup-content-login">
            <label>
              Already have an account?{" "}
              <span>
                <Link to="/">Login</Link>
              </span>
            </label>
          </div>
        </div>
      </div>
    </BubbleGradient>
  );
};

export default Signup;
