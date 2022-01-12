//import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Login from "./Login";
import Home from "./Home";
import PassesPerStation from "./PassesPerStation";
import PassesAnalysis from "./PassesAnalysis";
import PassesCost from "./PassesCost";
import Charges from "./Charges";
import useToken from './useToken';
import "./App.css";

function App() {
  const {token, setToken} = useToken();
    return (
      <Router>
          <Header token={token} setToken={setToken} />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" render={(props) => (<Login setToken={setToken}/>)} />
            <Route path="/passesperstation" render={(props) => (token ? (<PassesPerStation token={token}/>) : (<Login setToken={setToken}/>))} />
            <Route path="/passesanalysis"  render={(props) => (token ? (<PassesAnalysis token={token}/>) : (<Login setToken={setToken}/>))} />
            <Route path="/passescost"  render={(props) => (token ? (<PassesCost token={token}/>) : (<Login setToken={setToken}/>))} />
            <Route path="/charges"  render={(props) => (token ? (<Charges token={token}/>) : (<Login setToken={setToken}/>))} />
          </Switch>
          <Footer />
      </Router>
    );
}

export default App;
