import React, { useState, useEffect } from 'react';
import { Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}
let renderedBooks = "";
let addBookForm = "";

function AllBooks({getToken, setBookId}) {
  const [books, setBooks] = useState(null);
  const [addBookForm, setaddBookForm] = useState("");
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


  function setRenderedBooks() {
    // TODO renderedBOOks save to state
    console.debug(books);
    if (books) {
      renderedBooks = [];
      for(var i = 0; i < books.length; i++) {
        renderedBooks.push(
          <div className="book-card row">
            <div className="column">
                <div>
                    <Link className="title" to={"/book/" + books[i].id + "/notes"} >
                      <h4 id={books[i].id}>
                          {books[i].title}
                  
                      </h4>
                    </Link> 
                </div>
                <div className="description">
                  {books[i].description}
                </div>
              
            </div>
            <div className="column-right">
              <div className="book-card-tags">
                  {getTagCards(books[i].tags)}
              </div>
            </div>
          </div>);
      }
      forceUpdate();
    }
    else {
      renderedBooks = "";
    }
  }

  const saveBook = async (e) => {
    e.preventDefault();
    const title = e.target[1].value;
    const description = e.target[2].value;

    const url = variables.serverUrl + variables.postBookEndpoint;
    const token = getToken();
    // TODO: add wait
    const res = axios.post(url, {
        title: title,
        description: description,
        is_public: false,
        tags: 'tech, gaming',
        user_id: 1,
    }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false });

    setaddBookForm("");
    fetchBooks();
  }

  function closeForm() {
    setaddBookForm("");
  }
  function addBook() {
    setaddBookForm([
          <div className="formbk" id="contact_form">
              <div className="panel-body">
                  <form onSubmit={saveBook} className="form-horizontal" role="form">
                      <button onClick={closeForm} className="btn btn-danger">X</button>
                      <div className="form-group">
                          <label for="title" className="">Title</label>
                          <div className="">
                              <input className="form-control" id="title" placeholder="Title"/>
                          </div>
                      </div>
                      <div className="form-group">
                          <label for="description" className="">Description</label>
                          <div className="">
                              <input className="form-control" id="description" placeholder="Description"/>
                          </div>
                      </div>

                      <div className="form-group">
                          <div className="">
                              <button type="submit" className="btn btn-dark">Save</button>
                          </div>
                      </div>
                  </form>
              </div>
            </div>
    ]);
  }
  return (
    <>
      <Router>
      
      <div className="allbooks-wrapper">
        <h3 className="header">My Books</h3>
          <button onClick={addBook} className="btn btn-dark" >Create book</button>

          {addBookForm}

          <div className="books">
            {renderedBooks}
          </div>
      </div>
      
      </Router>
    </>
  );
}

export default AllBooks
