import "./Home.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Meeting from "./Meeting";

const Home = ({ accessToken, username }) => {
  const [isLogged, setIsLogged] = useState(false);

  const tokenValidation = async (token) => {
    const headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(import.meta.env.VITE_LOGIN_TOKEN_AUTH, {
        headers,
      });

      setIsLogged(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tokenValidation(accessToken);
  }, [accessToken]);

  return <div> { isLogged && <Meeting username={username}/> } </div>;
};

export default Home;
