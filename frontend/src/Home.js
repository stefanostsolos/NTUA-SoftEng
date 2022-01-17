import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import jwt_decode from "jwt-decode";

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
  width: '300px',
  height: '70px'
}));

function Home({ token }) {
  let decodedToken;
  if(token)
    decodedToken = jwt_decode(token)
  return (
    <main>
      <section className="index-banner">
        <h3>
          <b>Select the desired page!</b>
        </h3>
        <div className="list-container">
        <Stack spacing={10}>
          
              <Link to="/passesperstation">
              <StyledButton variant="contained">Stats for Passes Per Station</StyledButton>   
              </Link>
         
              <Link to="/passesanalysis">
              <StyledButton variant="contained">Stats for Passes Analysis</StyledButton>
              </Link>
         
              <Link to="/passescost">
              <StyledButton variant="contained">Stats for Passes Cost</StyledButton>
              </Link>
           
              <Link to="/charges">
              <StyledButton variant="contained">Stats for Charges</StyledButton>
              </Link>
            
              {decodedToken?.type === 'operator' ? (
                <Link to="/settlements">
                  <StyledButton variant="contained">My Settlements</StyledButton>
                </Link>
                ) : null}
            
          </Stack>
        </div>
      </section>
    </main>
  );
}

export default Home;
