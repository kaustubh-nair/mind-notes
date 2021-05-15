import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link} from "react-router-dom";
import {variables} from "../urls.js";

async function signupUser(credentials) {
 return fetch(variables.serverUrl + variables.signinEndpoint, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function SignUp(props) {
      const handleSubmit = async (e) => {
        e.preventDefault();

        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const password2 = password;
        const first_name = 'User';

        const response = await signupUser({
          username,
          password,
          password2,
          first_name,
          email,
        });
        if (email == response.email) {
          props.history.push({
           pathname: '/',
           state: { message: 'Signup successful!'}
         });
        }
      }

        return (
            <div className="inner">
            <form onSubmit={handleSubmit}>
                <h3>Register</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" placeholder="Username" />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">log in?</a>
                </p>
            </form>
            </div>
        );
}
