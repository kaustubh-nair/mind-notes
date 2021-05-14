import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link} from "react-router-dom";
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}

let renderedFeed = "";

function Feed({getToken, setBookId}) {
  const [feed, setFeed] = useState(null);
  const forceUpdate = useForceUpdate();

  const addNewComment = async (e, data) => {
    e.preventDefault();
    const commentContent = e.target[0].value;
    const bookId = e.target.id

    const url = variables.serverUrl + variables.postCommentEndpoint;
    const token = getToken();
    const res = axios.post(url, {
        content: commentContent,
        book_id: bookId,
        user_id: 1,
    }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false });

    e.target.reset();
    fetchFeed();
  }

  const fetchFeed = async () => {
    const url = variables.serverUrl + variables.fetchFeedEndpoint;
    const token = getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setFeed(response.data);
  }


  useEffect(() => {
    fetchFeed();
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

  function renderFeed() {
    if (feed) {
      renderedFeed = [];
      for(var i = 0; i < feed.length; i++) {
        console.log(feed[i]);
        renderedFeed.push(
          <div className="feed-card ">
          <div className="book row">
            <div className="header">
             <img className="profile-picture" src={require('../static/pf.png')} alt="profile picture"/> 
              <div className="username">
                {feed[i].user.first_name}
              </div>
              <div className="timestamp">
                {feed[i].time_ago}
              </div>
            </div>
            <div className="column">
                <div>
                    <Link className="title" to={"/feed/" + feed[i].id + "/notes"} >
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
                        <div className="username">{comment.user.first_name}</div>
                        <div className="timestamp">{comment.time_ago}</div>
                    </div>
                      <div className="">{comment.content}</div>
                    </div>
                  )
                )}
          </div>
          <div className="new-comment">
            <form onSubmit={addNewComment} id={feed[i].id}>
              <input placeholder="Add new comment" />
            </form>
          </div>
          </div>
        );
      }
      forceUpdate();
    }
    else {
      renderedFeed = "";
    }

  }
  return (
    <>
          <div className="feed">
            {renderedFeed}
          </div>
    </>

  )

}

export default Feed;