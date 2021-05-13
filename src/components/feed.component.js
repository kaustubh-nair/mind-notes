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

  const fetchFeed = async () => {
    const url = variables.serverUrl + variables.fetchFeedEndpoint;
    const token = getToken();
    const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {user_id: '1'}});
    setFeed(response.data);
    console.log(response.data);
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
    console.log("ASD");
    console.log(feed);
    if (feed) {
      renderedFeed = [];
      for(var i = 0; i < feed.length; i++) {
        console.log(feed[i]);
        renderedFeed.push(
          <div className="feed-card row">
            <div className="header">
              {feed[i].user.first_name}
              {feed[i].time_ago}
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

          <div className="column comments">
              <div className="comment">
                {feed[i].comments.map( 
                  comment => (
                    [
                      <div>{comment.user.first_name}</div>,
                      <div>{comment.time_ago}</div>,
                      <div>{comment.content}</div>,
                    ]
                  )
                )}
              </div>
          </div>

          </div>);
      }
      console.log(renderedFeed);
      console.log(typeof(renderedFeed));
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
