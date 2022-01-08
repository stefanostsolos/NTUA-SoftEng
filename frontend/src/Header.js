import "./App.css";
import React from "react";
import SubmitButton from "./SubmitButton";
import { BrowserRouter as Link } from "react-router-dom";
import { withRouter } from "react-router";
import jwt_decode from "jwt-decode";
/* import login from './login';
import Signup from './signup';
import { Redirect, useHistory } from "react-router-dom"; */

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async doLogout() {
    document.cookie = "token=";
    document.cookie = "flag=false";
    this.props.history.push("/");
    window.location.reload(false);
  }

  render() {
    let x = document.cookie.split(";").reduce((res, c) => {
      const [key, val] = c.trim().split("=").map(decodeURIComponent);
      const allNumbers = (str) => /^\d+$/.test(str);
      try {
        return Object.assign(res, {
          [key]: allNumbers(val) ? val : JSON.parse(val),
        });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});

    if (x.flag === true) {
      let decodedToken = jwt_decode(x.token);
      console.log("ne");
      console.log(decodedToken);
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
                  <SubmitButton
                    text="Log out"
                    onClick={() => {
                      this.doLogout();
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
            <ul>
              <div className="signinbutton">
                <Link to="/login">
                  <li>
                    <button href={"/login.js"}>Sign in</button>
                  </li>
                </Link>
              </div>
              <div className="signupbutton">
                <Link to="/signup">
                  <li>
                    <button href={"/signup.js"}>Sign up</button>
                  </li>
                </Link>
              </div>
            </ul>
          </nav>
        </header>
      );
    }
  }
}

export default withRouter(Header);
