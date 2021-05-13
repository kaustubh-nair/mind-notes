import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import Feed from "./components/feed.component";
import Logout from "./components/logout.component";
import Book from "./components/book.component.js";
import Navbar from "./components/navbar.component";
import AllBooks from "./components/allbooks.component";
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

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}

let renderedBooks = "";
export default function App() {
  const [mainPage, setMainPage] = useState(null);
  const [bookId, setBookId] = useState(null);
  let forceUpdate = useForceUpdate();

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
                            <AllBooks getToken={getToken} setBookId={setBookId}/>
                          </Route>
                          <Route path='/feed' >
                            <Feed getToken={getToken} setToken={setToken}/>
                          </Route>
                          <Route path='/logout' >
                            <Logout getToken={getToken} setToken={setToken}/>
                          </Route>
                          <Route exact path='/book/:id/notes'>
                            <Book getToken={getToken}/>
                          </Route>
                    </Switch>
                </div>
          </div>
        </Router>
    );
}
