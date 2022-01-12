import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { withRouter } from "react-router";
import jwt_decode from "jwt-decode";
import login from "./Login";
//import { Redirect, useHistory } from "react-router-dom";

function Header({ token, setToken }) {
  const doLogout = async () => {
    try {
      const res = await fetch(
        `http://localhost:9103/interoperability/api/logout`,
        {
          method: "post",
          mode: "cors",
          headers: {
            "x-observatory-auth": token,
          },
        }
      );

      const status = await res.status;

      if (status === 200) {
        setToken(undefined);
        localStorage.removeItem("token");
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (token) {
    const decodedToken = jwt_decode(token);
    return (
      <header>
        <nav>
          <div className="something">
            <a href="/" className="header-brand">
              Toll-Interoperability Website
            </a>
          </div>
          <ul>
            <div className="username">
              <li>Welcome, {decodedToken.username}!</li>
            </div>
            <div className="logoutbutton">
              <li>
                <button
                  text="Log out"
                  onClick={() => {
                    console.log("logout")
                    doLogout();
                  }}
                />
              </li>
            </div>
          </ul>
        </nav>
      </header>
    );
  } else {
    return (
      <header>
        <nav>
          <div className="something">
            <a href="/" className="header-brand">
              Softeng 2021-2022-Team 18: Toll-Interoperability Website
            </a>
          </div>
          <div>
            <Link className="login-button" to="/login">
              Sign in
            </Link>
          </div>
        </nav>
      </header>
    );
  }
}

export default withRouter(Header);
