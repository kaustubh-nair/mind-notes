import React, { useState, useEffect } from 'react';
import { Redirect} from "react-router-dom";
import axios from 'axios';
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}

default function AllBooks({getToken}) {
  const [books, setBooks] = useState([{title: "ASD"}]);
  const forceUpdate = useForceUpdate();


  const fetchBooks = async () => {
    const url = variables.serverUrl + variables.fetchBooksEndpoint;
    const token = getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setBooks(response.data);
  }

  useEffect(() => {
    setRenderedBooks();
	}, [books]);

  useEffect(() => {
	  fetchBooks();
	}, []);

  var renderedBooks = "ASD"

  function setRenderedBooks() {
    console.debug(books);
    if (books) {
      renderedBooks = books[0].title;
      console.log(renderedBooks);
      forceUpdate();
    }
    else {
      renderedBooks = "UPDATED";
    }
  }

  let count = 0;

  return (
    <>
      <h3 class="header">My Books</h3>
      <div>
    Asd
      </div>
      <div>
        <h1>{count++} times clicked</h1>

        <button onClick={forceUpdate}>Refresh</button>
    </div>
    </>
  );
}
