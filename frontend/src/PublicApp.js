import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import PublicNavbar from "./components/publicnavbar.component";
import SignUp from "./components/signup.component";

export default function PublicApp({setToken}) {
  return (<Router>
        <div class="App">
          <PublicNavbar/>
          <div className="outer">
              <Switch>
                <Route exact path="/" render={(props) => <Login {...props} setToken={setToken} />} />
                <Route path="/sign-up" render={(props) => <SignUp {...props} />} />
              </Switch>
          </div>
        </div></Router>
  );
}

