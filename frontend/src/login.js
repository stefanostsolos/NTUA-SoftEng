import "./App.css";
import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { white, grey } from "@mui/material/colors";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FormGroup from '@mui/material/FormGroup';
//import { Redirect, useHistory } from "react-router-dom";
//import { withCookies, Cookies } from 'react-cookie';

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [buttonDisabled, setDisabled] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [communicationError, setCommunicationError] = useState(false);

  const canSubmit = [username, password].every(Boolean);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const doLogin = async (username, password) => {
    setDisabled(true);

    try {
      const res = await fetch(
        `http://localhost:9103/interoperability/api/login`,
        {
          method: "post",
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const status = await res.status;

      if (status === 200) {
        const data = await res.json();
        console.log(data);
        console.log(typeof(setToken))
        setToken(data.token);
      } else if (status === 401) {
        console.log("Unauthorized")
        setWrongCredentials(true);
        setDisabled(false);
      } else {
        setInternalError(true);
        setDisabled(false);
      }
    } catch (e) {
      console.log(e)
      setCommunicationError(true);
      setDisabled(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setInternalError(false);
    setCommunicationError(false);
  };
  /*
  async doLogin() {
      let status = await res.status;

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
  }*/
  /*
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
  }*/
  /*
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
  }*/

  return (
    <main>
      <section className="index-banner">
        <div className="loginbox">
          <Stack spacing={3}>
            <form onSubmit={(event) => {
              event.preventDefault();
                doLogin(username, password);
              }}>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <TextField
                error={wrongCredentials}
                id="username"
                label="Username"
                variant="outlined"
                onChange={handleUsernameChange}
                value={username}
              ></TextField>
            </FormControl>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
              error={wrongCredentials}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {wrongCredentials ? (<p  style={{color:"red"}}>Wrong credentials</p>) : null}
            <ColorButton
              variant="contained"
              disabled={buttonDisabled || !canSubmit}
              type="submit"
            >
              Login
            </ColorButton>
            </form>
            <Snackbar
              open={internalError}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Interal Server error
              </Alert>
            </Snackbar>
            <Snackbar open={communicationError} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Communication with server failed
              </Alert>
            </Snackbar>
          </Stack>
        </div>
      </section>
    </main>
  );
}

export default Login;
