import React, { useState } from 'react';
import {variables} from "./urls.js";

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


export default function Logout({ setToken }) {
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

    return(
        <div class="loginform">
        <h3>hello world  </h3>
        </div>
    );
}
