import React from "react";
import "./App.css";
//import contact from './contact';
//import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function Contact() {
  return (
    <main>
      <section class="blank-banner-1">
        <div class="vartical-center">
          <div class="about-box">
            <h1>Toll-Interoperability Creators</h1>
            <p> You can contact us through our personal emails:</p>
            <p>
              {" "}
              <b>Αλέξανδρος Κουριδάκης:</b> el18008@mail.ntua.gr{" "}
            </p>
            <p>
              {" "}
              <b>Αλέξανδος Μαντζαφίνης:</b> el18057@mail.ntua.gr
            </p>
            <p>
              {" "}
              <b>Συμεών Ποργιώτης:</b> el18053@mail.ntua.gr
            </p>
            <p>
              {" "}
              <b>Βικέντιος Βιτάλης:</b> el18803@mail.ntua.gr
            </p>
            <p>
              {" "}
              <b>Στέφανος Τσώλος:</b> el18050@mail.ntua.gr
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
