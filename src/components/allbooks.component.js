import React, { useState, useEffect } from 'react';
import { Redirect} from "react-router-dom";
import axios from 'axios';
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}
let renderedBooks = "";

function AllBooks({getToken}) {
  const [books, setBooks] = useState(null);
  const forceUpdate = useForceUpdate();


  const fetchBooks = async () => {
    const url = variables.serverUrl + variables.fetchBooksEndpoint;
    const token = getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setBooks(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    setRenderedBooks();
	}, [books]);

  useEffect(() => {
	  fetchBooks();
	}, []);


  function getTagCards(tags) {
    var t = [];
    for (var i in tags) {
      t.push(
        <div className="pill">
          {tags[i].name}
        </div>
      );
    }
    return t;
  }

  function isPublic(is_public) {
    if (is_public) 
      return "checked";
  }

  function openCard() {
    console.log("ADS");
  }

  function setRenderedBooks() {
    console.debug(books);
    if (books) {
      renderedBooks = [];
      for(var i = 0; i < books.length; i++) {
        renderedBooks.push(
          <div className="book-card row">
            <div className="column">
                <div className="title">
                  <a href={openCard}>
                      <h4>
                          {books[i].title}
                  
                      </h4>
                  </a>
                </div>
                <div className="description">
                  {books[i].description}
                </div>
              
            </div>
            <div className="column-right">
              <div className="book-card-public">
                  <label className="switch">
                    <input type="checkbox" checked={isPublic(books[i].is_public)}></input>
                    <span className="slider round"></span>
                  </label>
              </div>
              <div className="book-card-tags">
                  {getTagCards(books[i].tags)}
              </div>
            </div>
          </div>);
      }
      console.log(renderedBooks);
      console.log(typeof(renderedBooks));
      forceUpdate();
    }
    else {
      renderedBooks = "";
    }
  }


  return (
    <>
      <h3 className="header">My Books</h3>
      <div className="books">
      {renderedBooks}
      </div>
    </>
  );
}

export default AllBooks
