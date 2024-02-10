import "./Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [accessToken, setAccessToken] = useState();
  const [isLogged, setIsLogged] = useState(false);

  const userLogin = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN, {
        login: username,
        password: password,
      });

      setAccessToken(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    accessToken ? setIsLogged(true) : setIsLogged(false);
  }, [accessToken]);

  return (
    <div className="login-container">
      {!isLogged && (
        <div className="login-content">
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

          <label>
            Don't have an account?{" "}
            <span>
              <Link to="/signup">Signup</Link>
            </span>
          </label>

          <button onClick={() => userLogin()}>Login</button>
        </div>
      )}
      {accessToken && <Home accessToken={accessToken} />}
    </div>
  );
};

export default Login;
