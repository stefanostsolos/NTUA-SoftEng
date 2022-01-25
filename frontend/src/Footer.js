import React from "react";
import "./App.css";
import youtube from "./images/youtube-icon.png";
import fb from "./images/facebook-icon.png";
import twitter from "./images/twitter-icon.png";
import instagram from "./images/instagram-icon.png";

function Footer() {
  return (
    <footer>
      <ul className="footer-links">
        < li >
          <a href="/contact">Project creators</a>
        </li>
        <li>
          <a target="_blank" rel='noopener noreferrer' href="https://webmail.ntua.gr">Contact us</a>
        </li>
        <li>
          <a target="_blank" rel='noopener noreferrer' href="https://github.com/ntua/TL21-18">Github repository</a>
        </li>
      </ul>
      <ul className="footer-social">
        <a target="_blank" rel='noopener noreferrer' href="https://www.youtube.com/">
          <img src={youtube} alt="youtube icon" />
        </a>
        <a target="_blank" rel='noopener noreferrer' href="https://www.facebook.com/">
          <img src={fb} alt="facebook icon" />
        </a>
        <a target="_blank" rel='noopener noreferrer' href="https://www.twitter.com/">
          <img src={twitter} alt="twitter icon" />
        </a>
        <a target="_blank" rel='noopener noreferrer' href="https://www.instagram.com/">
          <img src={instagram} alt="instagram icon" />
        </a>
      </ul>
    </footer>
  );
}

export default Footer;
