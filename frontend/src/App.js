//import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Footer from "./footer";
import Contact from "./contact";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import PassesPerStation from "./PassesPerStation";
import PassesAnalysis from "./PassesAnalysis";
import PassesCost from "./PassesCost";
import Charges from "./Charges";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            {/* <Route path="/header" component={Header} /> */}
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/passesperstation" component={PassesPerStation} />
            <Route path="/passesanalysis" component={PassesAnalysis} />
            <Route path="/passescost" component={PassesCost} />
            <Route path="/charges" component={Charges} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
