import "./App.css";
import React from "react";
import { observer } from "mobx-react";
import UserStore from "./UserStore";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
//import { Redirect, useHistory } from "react-router-dom";
//import { withCookies, Cookies } from 'react-cookie';

class Login extends React.Component {
  constructor(props) {
    console.log(UserStore.isLoggedIn);
    console.log(UserStore.username);
    console.log(document.cookie);
    super(props);
    this.state = {
      username: "",
      password: "",
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
      buttonDisabled: false,
    });
  }

  async doLogin() {
    console.log(this.state.username);
    if (!this.state.username) return;
    if (!this.state.password) return;

    this.setState({
      buttonDisabled: true,
    });

    try {
      let res = await fetch(`http://localhost:3004/signin`, {
        method: "post",
        body: new URLSearchParams({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log(res);
      console.log(this.state.password);

      let result = await res.json();
      let status = await res.status;
      console.log(result);
      console.log(status);
      if (status === 200) {
        console.log("yaaass");
        document.cookie = `token = ${result.token}`;
        document.cookie = "flag=true";
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
        console.log(x);
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

  async componentDidMount() {
    try {
      let res = await fetch("/isLoggedIn", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    } catch (e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  }

  async doLogout() {
    try {
      let res = await fetch("https://localhost:8765/evcharge/api/logout", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = "";
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <main>
        <section className="index-banner">
          <div className="loginbox">
            <form>
              <p className="email">User name:</p>
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

              <br />
              <SubmitButton
                text="Log in"
                disabled={this.state.buttonDisabled}
                onClick={() => this.doLogin()}
              />
            </form>
          </div>
        </section>
      </main>
    );
  }
}

export default observer(Login);
