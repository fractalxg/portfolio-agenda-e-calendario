import "./Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";
import { Link } from "react-router-dom";
import BubbleGradient from "../components/BubbleGradient.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState();
  const [message, setMessage] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const userLogin = async () => {
    if (validateUsername() && validatePassword()) {
      try {
        const response = await axios.post(import.meta.env.VITE_LOGIN, {
          login: username,
          password: password,
        });
        if (response.data.message) {
          setMessage(response.data.message);
        } else {
          setAccessToken(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateUsername = () => {
    if (username.length > 0) {
      return true;
    } else {
      setMessage("Username is required");
      return false;
    }
  };
  const validatePassword = () => {
    if (password.length > 0) {
      return true;
    } else {
      setMessage("Password is required");
      return false;
    }
  };

  useEffect(() => {
    accessToken ? setIsLogged(true) : setIsLogged(false);
  }, [accessToken]);

  return (
    <BubbleGradient>
      <div className="login-container">
        {!isLogged && (
          <div className="login-content">
            <div className="login-content-title">
              <label>Meetings</label>
            </div>
            <div className="login-content-username">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>

            <div className="login-content-password">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div className="login-content-message">{message}</div>

            <button onClick={() => userLogin()}>LOGIN</button>

            <div className="login-content-signup">
              <label>
                Don't have an account?{" "}
                <span>
                  <Link to="/signup">Signup</Link>
                </span>
              </label>
            </div>
          </div>
        )}
        {accessToken && <Home accessToken={accessToken} />}
      </div>
    </BubbleGradient>
  );
};

export default Login;
