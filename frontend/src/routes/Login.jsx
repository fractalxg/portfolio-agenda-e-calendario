import "./Login.css";
import { useState } from "react";
import axios from "axios";
import Home from "./Home";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [accessToken, setAccessToken] = useState();

  const userLogin = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN, {
        login: username,
        password: password,
      });

      console.log(response.data);
      setAccessToken(response.data);

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="login-container">
      <div className="login-content">
        <label>Login:</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <button onClick={() => userLogin()}>Login</button>

      </div>
			{accessToken && <Home accessToken={accessToken} />}
    </div>
  );
};

export default Login;
