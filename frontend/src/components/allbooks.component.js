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

function AllBooks(props) {
  const [books, setBooks] = useState(null);
  const [addBookForm, setaddBookForm] = useState("");
  const forceUpdate = useForceUpdate();


  const fetchBooks = async () => {
    const url = variables.serverUrl + variables.fetchBooksEndpoint;
    const token = props.getToken();
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


  function redirect (e) {
    console.log(e.target.id);
    props.history.push({
     pathname: '/book/' + e.target.id + '/notes',
   });
   props.history.go(0)

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
                    <Link className="title" onClick={redirect} id={books[i].id}>
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
      renderedBooks =renderedBooks.reverse();
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
    const tags = e.target[3].value;

    const url = variables.serverUrl + variables.postBookEndpoint;
    const token = props.getToken();
    // TODO: add wait
    const res = axios.post(url, {
        title: title,
        description: description,
        is_public: false,
        tags: tags,
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
                          <label for="title" className="text">Title</label>
                          <div className="">
                              <input className="form-control" id="title" placeholder="Title"/>
                          </div>
                      </div>
                      <div className="form-group">
                          <label for="description" className="text">Description</label>
                          <div className="">
                              <input className="form-control desc" id="description" placeholder="Description"/>
                          </div>
                      </div>
                      <div className="form-group">
                          <label for="tags" className="text">Tags</label>
                          <div className="">
                              <input className="form-control desc" id="tags" placeholder="Tags"/>
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
            <h3 className="booksheader">My Books</h3>
          {addBookForm}
            <div className="allbooks">
              <button onClick={addBook} className="btn btn-dark" >Create book</button>


          <div className="books">
            {renderedBooks}
          </div>
        </div>
      
      </Router>
    </>
  );
}

export default AllBooks
