/* All the needed components for the page are imported */
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
import Box from "@mui/material/Box";
import { useLocation, useHistory } from "react-router-dom";

/* This is the login page which the non logged-in user is directed.
The Login Button is stated below */
const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
}));

/* Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child. */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/* The token is passed inside the function */
function Login({ setToken }) {
  /*  A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components. */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [buttonDisabled, setDisabled] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [communicationError, setCommunicationError] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const canSubmit = [username, password].every(Boolean);

  /* Event handlers determine what action is to be taken whenever an event is fired. This could be a button click or a change in a text input. Essentially, event handlers are what make it possible for users to interact with your React app. */
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

  /* Log in is performed */
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
      /* Status check and case handling */
      if (status === 200) {
        const data = await res.json();
        console.log(data);
        console.log(typeof (setToken))
        setToken(data.token);
        if (location.pathname === '/login')
          history.push('/')
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

  return (
    <main>
      <section className="index-banner">
        <div className="loginbox">
          <div className="form-container2">
            <form onSubmit={(event) => {
              event.preventDefault();
              doLogin(username, password);
            }}>
              
              <Stack spacing={3}>
                <FormControl fullWidth variant="outlined">
                  {/* In case of wrong credentials*/}
                  <TextField
                    error={wrongCredentials}
                    id="username"
                    label="Username"
                    variant="outlined"
                    onChange={handleUsernameChange}
                    value={username}
                  ></TextField>
                </FormControl>
                {/* Password is inserted here */}
                <FormControl fullWidth variant="outlined">
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
                {/* Login can be performed when the creadendtials are filled  */}
                {wrongCredentials ? (<p className="wrongcredentials">Wrong credentials</p>) : null}
                <ColorButton
                  variant="contained"
                  disabled={buttonDisabled || !canSubmit}
                  type="submit"
                  className="login"

                >
                  Login
                </ColorButton>
              </Stack>
            </form>
            {/* In case of internal server error or communication fail the according warning is shown */}
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
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
