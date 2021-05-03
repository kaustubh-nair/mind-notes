import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {variables} from "../urls.js";

export default function Navbar({setToken}) {
    return (
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to={"/"}>Mind Note</Link>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/feed"}>Feed</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/"}>My Books</Link>
                  </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/logout"}>Logout</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
    )
}
