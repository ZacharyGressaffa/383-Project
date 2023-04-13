import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dev_login.css";

function Login() {
  const nav = useNavigate();
  const [data, setData] = useState({ user: "", password: "" });
  const [error, setError] = useState({ error: "" });
  const Login = (data) => {
    axios
      .post("/api/authentication/login", {
        username: data.user,
        password: data.password,
      })
      .then(() => {
        nav("/");
        window.location.reload();
      })
      .catch((err) => {
        handleError();
      });
  };

  const handleError = () => {
    setError({ error: "Your Username or Password is Incorrect" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Login(data);
  };

  return (
    <body className="body__login">
      <div className="container__login">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="form__title">Login</h1>
          <div className="form__input-group">
            <input
              type="text"
              className="form__input"
              autofocus
              placeholder="Username"
              onChange={(e) => setData({ ...data, user: e.target.value })}
              value={data.user}
            />
          </div>
          <div className="form__input-group">
            <input
              type="password"
              className="form__input"
              autofocus
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
            />
          </div>
          {error && <div className="error"> {error.error} </div>}
          <br />
          <button className="form__button" type="submit">
            Login
          </button>
        </form>
      </div>
    </body>
  );
}

export default Login;


