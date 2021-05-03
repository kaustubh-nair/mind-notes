import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import Logout from "./components/logout.component";
import Navbar from "./components/navbar.component";
import Book from "./components/Book.js";
import PublicApp from "./PublicApp.js";
import SignUp from "./components/signup.component";

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken
}

export default function App() {

   //setToken(null);
    if(!getToken()) {
        return <PublicApp setToken={setToken}/>
    }

      return (<Router>
                <div className="App">
                  <Navbar/>
                  <div className="outer">
                      <Switch>
                            <Route exact path='/' >
                    <h3> hello world</h3>
                            </Route>
                            <Route path='/logout' >
                                  <Logout getToken={getToken} setToken={setToken}/>
                            </Route>
                      </Switch>
                  </div>
            </div>
          </Router>
      );
}
