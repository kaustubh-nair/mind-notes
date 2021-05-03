import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import Navbar from "./components/navbar.component";
import Book from "./components/Book.js";
import PublicApp from "./PublicApp.js";
import SignUp from "./components/signup.component";

export default function App() {
    const [token, setToken] = useState();

    if(!token) {
        return <PublicApp setToken={setToken}/>
    }

      return (<Router>
                <div className="App">
                  <Navbar/>
                  <div className="outer">
                      <Switch>
                            <Route exact path='/' >
                              <Book/>
                            </Route>
                      </Switch>
                  </div>
            </div>
          </Router>
      );
}
