import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import './bootstrap.css';
import Logout from './Logout.js';
import Login from './Login.js';
import Book from './Book.js';

function App() {
  const [token, setToken] = useState();

    /*
  if(!token) {
    return <Login setToken={setToken} />
  }
  */

  return (
    <div class="wrapper">
    <div class="body">

  <nav class="navbar navbar-expand-lg navbar-light bg-navbar">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Feed <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="book">My books</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout">Logout</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
    </ul>
  </div>
</nav>

      <h3> EHLLKJASD </h3>

      </div>

        
      <BrowserRouter>
        <Switch>
          <Route path="/logout" component={Logout}/>
          <Route path="/book" component={Book}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
