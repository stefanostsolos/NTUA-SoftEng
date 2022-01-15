//import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Login from "./Login";
import Home from "./Home";
import PassesPerStation from "./PassesPerStation";
import PassesAnalysis from "./PassesAnalysis";
import PassesCost from "./PassesCost";
import Charges from "./Charges";
import Settlements from "./Settlements"
import useToken from './useToken';
import jwt_decode from "jwt-decode";
import "./App.css";

function App() {
  const {token, setToken} = useToken();

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      const  now = new Date().getTime();
      const expiresIn = decodedToken.exp*1000 - now;
      const clearExpiredToken = () => {
        setToken(undefined);
        localStorage.removeItem("token");
      }
      console.log(expiresIn)
      setTimeout(clearExpiredToken, expiresIn);
    }
  }, [token, setToken]);

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
            <Route path="/settlements" render={(props) => (token ? (<Settlements token={token}/>) : (<Login setToken={setToken}/>))} />
          </Switch>
          <Footer />
      </Router>
    );
}

export default App;
