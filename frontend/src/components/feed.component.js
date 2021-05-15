import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link} from "react-router-dom";
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}

let renderedFeed = "";
let tag_filter = "";

function Feed(props) {
  const [feed, setFeed] = useState(null);
  const [tags, setTags] = useState(null);
  const forceUpdate = useForceUpdate();

  const addNewComment = async (e, data) => {
    e.preventDefault();
    const commentContent = e.target[0].value;
    const bookId = e.target.id

    const url = variables.serverUrl + variables.postCommentEndpoint;
    const token = props.getToken();
    const res = axios.post(url, {
        content: commentContent,
        book_id: bookId,
        user_id: 1,
    }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false });

    e.target.reset();
    fetchFeed();
  }

  const likeBook = async () => {
  }
  const fetchTags = async () => {
    const url = variables.serverUrl + variables.fetchTagsEndpoint;
    const token = props.getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setTags(response.data);
  }
  const fetchFeed = async () => {
    const url = variables.serverUrl + variables.fetchFeedEndpoint;
    const token = props.getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setFeed(response.data);
  }


  useEffect(() => {
    fetchFeed();
    fetchTags();
	}, []);

  useEffect(() => {
    renderFeed();
	}, [feed]);

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

  function bookmatchesTag(book) {
    console.log(tag_filter);
    if (tag_filter == "")
      return true;
    for(var i in book.tags)
    {
      console.log(book.tags[i].name);
      if (tag_filter == book.tags[i].name)
        return true;
    }
    return false;
  }
  function renderFeed() {
    if (feed) {
      renderedFeed = [];
      for(var i = 0; i < feed.length; i++) {
        if (bookmatchesTag(feed[i])) {
        renderedFeed.push(
          <div className="feed-card ">
          <div className="book row">
            <div className="header">
             <img className="profile-picture" src={require('../static/pf.png')} alt="profile picture"/> 
              <div className="username">
                {feed[i].user.username}
              </div>
              <div className="timestamp">
                {feed[i].time_ago}
              </div>
            </div>
            <div className="column">
                <div>
                    <Link className="title" to={"/book/" + feed[i].id + "/notes"} >
                      <h4 id={feed[i].id}>
                          {feed[i].title}
                  
                      </h4>
                    </Link> 
                </div>
                <div className="description">
                  {feed[i].description}
                </div>
              
            </div>
            <div className="column-right">
              <div className="feed-card-tags">
                  {getTagCards(feed[i].tags)}
              </div>
            </div>
          
          </div>
        <div className="comments">
                {feed[i].comments.map( 
                  comment => (
                    <div className="comment">
                    <div className="header">
                         <img className="profile-picture" src={require('../static/pf.png')} alt="profile picture"/> 
                        <div className="username">{comment.user.username}</div>
                        <div className="timestamp">{comment.time_ago}</div>
                    </div>
                      <div className="">{comment.content}</div>
                    </div>
                  )
                )}
          </div>
          <div className="container">
          <div className="row">
              <div className="column-sm new-comment">
                <form onSubmit={addNewComment} id={feed[i].id}>
                  <input placeholder="Add new comment" />
                </form>
              </div>
          
          </div>
          
          </div>
          </div>
        );
        }
      }
      renderedFeed = renderedFeed.reverse();
      forceUpdate();
    }
    else {
      renderedFeed = "";
    }

  }
  const sortByTag = (e) => {
    const tag = e.target.value;
    if (tag == "Sort by tag"){
      tag_filter = ""
    }
    else {
      tag_filter = tag;
    }
    renderFeed();

  }
  function getTags() {
    var tagnames = []
    for (var i in tags) {
      tagnames.push(
        <option value={tags[i].name}>
        {tags[i].name}
        </option>
      );
    }
    return tagnames
  }
  return (
    <>
          <div className="feed">
      <select className="form-select" onChange={sortByTag} name="pets" id="pet-select">
        <option value="">Sort by tag</option>
          {getTags()}
        </select>

            {renderedFeed}
          </div>
    </>

  )

}

export default Feed;
