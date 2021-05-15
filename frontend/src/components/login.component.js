import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from "react-router-dom";
import {variables} from "../urls.js";

async function loginUser(credentials) {
 return fetch(variables.serverUrl + variables.loginEndpoint, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}



export default function Login(props) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [message, setMessage] = useState("");
    const location = useLocation();

    const setMessages = () => {
      if ('state' in location) {
        if (location.state)
          setMessage(
                  <div className="alert alert-success">
            {location.state.message}
                  </div>
          );
      }
      else {
        setMessage("");
      }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
          username,
          password
        });
        if ('access' in response)
        {
            props.setToken({'access': response['access'], 'refresh': response['refresh']});
            props.history.push({
             pathname: '/home',
           });
          //reload page
           props.history.go(0)
        }
      }

      useEffect(() => {
        setMessages();
      }, []);

        return (
            <div className="inner">
            <form onSubmit={handleSubmit}>

                <h3>Log in</h3>
                  {message}

                <div className="form-group">
                    <label>Username</label>
                    <input onChange={e => setUserName(e.target.value)} type="username" className="form-control" placeholder="Enter username" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input onChange={e => setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter password" />
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
            </div>
        );
}
