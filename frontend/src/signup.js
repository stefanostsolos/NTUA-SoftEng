import "./App.css";
import React from "react";
import { observer } from "mobx-react";
//import Home from './home';
import UserStore from "./UserStore";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
//import { Redirect, useHistory } from "react-router-dom";
//import { withCookies, Cookies } from 'react-cookie';

class Signup extends React.Component {
  constructor(props) {
    console.log(UserStore.isLoggedIn);
    console.log(UserStore.username);
    console.log(document.cookie);
    super(props);
    this.state = {
      username: "",
      password: "",
      reenter: "",
      buttonDisabled: false,
    };
  }

  setInputValue(property, val) {
    this.setState({
      [property]: val,
    });
  }

  resetForm() {
    this.setState({
      username: "",
      password: "",
      reenter: "",
      buttonDisabled: false,
    });
  }

  async doSignup() {
    console.log(this.state.username);
    if (!this.state.username) return;
    if (!this.state.password) return;
    if (!this.state.password) return;

    this.setState({
      buttonDisabled: true,
    });

    try {
      let res = await fetch(`http://localhost:3004/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: this.state.username,
          password: this.state.password,
        }),
      });

      console.log(res);
      console.log(this.state.password);

      let result = await res.json();
      let status = await res.status;
      console.log(result);
      console.log(status);
      if (status === 200) {
        console.log("yaaass");
        this.props.history.push("/");
        window.location.reload(false);
      } else {
        this.resetForm();
        alert(result.msg);
      }
    } catch (e) {
      console.log(e);
      this.resetForm();
    }
  }

  render() {
    return (
      <main>
        <section className="index-banner">
          <div className="loginbox">
            <form>
              <p className="email">Email (user name):</p>
              <InputField
                className="input-box"
                type="text"
                value={this.state.username ? this.state.username : ""}
                onChange={(val) => this.setInputValue("username", val)}
              />

              <p className="email">Password:</p>
              <InputField
                className="input-box"
                type="password"
                value={this.state.password ? this.state.password : ""}
                onChange={(val) => this.setInputValue("password", val)}
              />

              <p className="email">Re-enter Password:</p>
              <InputField
                className="input-box"
                type="password"
                value={this.state.reenter ? this.state.reenter : ""}
                onChange={(val) => this.setInputValue("reenter", val)}
              />

              <br />
              {this.state.password !== this.state.reenter ? (
                <div className="notmatching">Passwords don't match!</div>
              ) : null}
              <SubmitButton
                text="Sign up"
                disabled={
                  this.state.buttonDisabled ||
                  this.state.password !== this.state.reenter
                }
                onClick={() => this.doSignup()}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                Cancel
              </button>
              <br />
            </form>
          </div>
        </section>
      </main>
    );
  }
}

export default observer(Signup);
