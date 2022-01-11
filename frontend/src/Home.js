import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
/* import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import login from './login';
import Signup from './signup';
import { Link } from 'react-router-dom';
import HomeNavButton from './HomeNavButton';
import { Bar } from "react-chartjs-2"; //this line is for chart */

function Home() {
  return (
    <main>
      <section className="index-banner">
        <h3>
          <b>Select the desired page!</b>
        </h3>
        <div className="list-container">
          <ul>
            <li>
              <Link className="navigation-button" to="/passesperstation">
                Stats for Passes Per Station
              </Link>
            </li>

            <li>
              <Link className="navigation-button" to="/passesanalysis">
                Stats for Passes Analysis
              </Link>
            </li>

            <li>
              <Link className="navigation-button" to="/passescost">
                Stats for Passes Cost
              </Link>
            </li>

            <li>
              <Link className="navigation-button" to="/charges">
                Stats for Charges
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Home;
