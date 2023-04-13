import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Register() {
  const nav = useNavigate();
  const [data, setData] = useState({ user: "", password: "", confirm: "", roles: [] });
  const [error, setError] = useState({ error: "" });
  const [roles, setRoles] = useState(['user'])

  const reg= (data) => {
    axios
      .post("/api/users", {
        userName: data.user,
        password: data.password,
        roles: roles
      })
      .then(() => {
        Login();
      })
        .catch((err) => {
        handleError();
      });
  };

  const Login = () => {
      axios.post("/api/authentication/login", {
          username: data.user,
          password: data.password,
        })
        .then(() => {
          nav("/");
          window.location.reload();
        })
  }

  const handleError = () => {
    setError({ error: "Your passwords are not matching" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      reg(data);
  };

  return (
      <body className="body__login">
          <div class="container__login">
              <form action="" class="form form--hidden" id="createAccount" onSubmit={handleSubmit}>
                  <h1 class="form__title">Create Account</h1>
                  <div class="form__message form__message--error"></div>
                  <div class="form__input-grpup">
                      <input
                          type="text"
                          class="form__input"
                          autofocus
                          placeholder="Username"
                          id="signupUsername"
                          onChange={e => setData({ ...data, user: e.target.value })} value={data.user}
                      />
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-grpup">
                      <input
                          type="password"
                          class="form__input"
                          autofocus
                          placeholder="Password"
                          onChange={e => setData({ ...data, password: e.target.value })} value={data.password}
                      />
                      <div class="form__input-error-message"></div>
                  </div>
                  <div class="form__input-grpup">
                      <input
                          type="password"
                          class="form__input"
                          autofocus
                          placeholder="Confirm password"
                          onChange={e => setData({ ...data, confirm: e.target.value })} value={data.confirm}
                      />
                      <div class="form__input-error-message">{error.error}</div>
                      <br />
                  </div>
                  <div>
                      <select name="accountType" id="accountType" onChange={(e) => setRoles([e.target.value])}>
                          <option>Select Account Type</option>
                          <option value="User">Standard User</option>
                          <option value="Developer">Publisher</option>
                      </select>
                  </div>
                  <br />
                  <button class="form__button" type="submit">
                      Create Account
                  </button>
              </form>
          </div>
      </body>
  );
}

export default Register;
