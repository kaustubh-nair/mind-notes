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

export default function Logout(props) {
  const res = logoutUser(props.getToken())
  props.setToken(null);
  props.history.push({
   pathname: '/',
 });
//reload page
 props.history.go(0)
}
