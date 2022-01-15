import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { withRouter } from "react-router";
import jwt_decode from "jwt-decode";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import useWindowDimensions from './useWindowDimensions'
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
//import { Redirect, useHistory } from "react-router-dom";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
  width: '100px',
  height: '40px',
}));

const ColorHomeIcon = styled(HomeIcon)(({ theme }) => ({
  color: "#000000",
  "&:hover": {
    color: grey[700],
  },
  width: '60px',
  height: '30px',
}));

function Header({ token, setToken }) {
  const { height, width } = useWindowDimensions();

  console.log(width)

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
        console.log("remove from storage")
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
            <Stack direction="row" spacing={0.124*width - 50}>
              <Link to="/">
                <IconButton aria-label="delete" color="primary">
                  <ColorHomeIcon />
                </IconButton> 
              </Link>
              <Stack direction="row" spacing={2}>
                <div className="username">
                  Welcome,{decodedToken.username}!
                </div>
                <Link to="/">
                  <ColorButton variant="contained" onClick={() => {
                    console.log("logout")
                    doLogout();
                    }}>
                    Log-out
                  </ColorButton>
                </Link>
              </Stack>
            </Stack>
          </div>
        </nav>
      </header>
    );
  } else {
    return (
      <header>
        <nav>
        <div className="something">
        <Stack direction="row" spacing={0.124*width - 28}>
            <Link to="/">
              <IconButton aria-label="delete" color="primary">
                <ColorHomeIcon />
              </IconButton> 
            </Link>
            <Link to="/login">
            <ColorButton variant="contained">Log-in</ColorButton>
            </Link>
          </Stack>
          </div>
        </nav>
      </header>
    );
  }
}

export default withRouter(Header);
