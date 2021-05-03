import React, { useState } from 'react';
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



export default function Login({setToken}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
          username,
          password
        });
        if ('access' in response)
            setToken(response['access']);
  }
        return (
            <div className="inner">
            <form onSubmit={handleSubmit}>

                <h3>Log in</h3>

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
