import React, { useState } from 'react';
import { Redirect} from "react-router-dom";
import {variables} from "../urls.js";

function logoutUser(token) {
  return fetch(variables.serverUrl + variables.logoutEndpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + token.access,
       },
        body: JSON.stringify({'refresh_token': token.refresh})
     })
}

export default function Logout({getToken, setToken}) {
  const res = logoutUser(getToken())
  setToken(null);
  return <Redirect to={{pathname: "/",}} />
}
