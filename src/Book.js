import React, { useState, useRef, useEffect } from "react";
import Xarrow from "react-xarrows";
import axios from 'axios';
import Draggable from "react-draggable";
import Note from "./Note.js";
import {variables} from "./urls.js";

const noteContainerStyle = {
  position: "relative",
  //overflow: "auto",
  width: "120%",
  height: "120%",
  background: "white",
  color: "black",
  border: "black solid 1px",
};
const canvasStyle = {
  width: "10000%",
  height: "10000%",
  background: "white",
  border: "none",
  //overflow: "auto",
  display: "flex",
};

const Book = () => {
    const [, setState] = useState({});
    const forceRerender = () => setState({});
    const [notes, setNotes] = useState([]);
    const [lines, setLines] = useState([]);

    const fetchLines = async () => {
        const url = variables.serverUrl + variables.fetchLinesEndpoint;
        const response = await axios.get(url, {crossDomain: false, params: {book_id: '1'}});
        console.debug("DEBUG");
        var l = Object.values(response.data)
        for (var i = 0; i < l.length; i++) {
            l[i].start = String(l[i].start);
            l[i].end = String(l[i].end);
        }
        setLines(l);
    }

    const fetchBook = async () => {
        const url = variables.serverUrl + variables.fetchNotesEndpoint;
        const response = await axios.get(url, {crossDomain: false, params: {book_id: '1'}});
        setNotes(Object.values(response.data));
    }

    useEffect(() => {
	  fetchBook();
	  fetchLines();
	}, []);

  return (
    <React.Fragment>
      {console.debug(lines)}
      {console.debug("BO")}
      <div style={canvasStyle} id="canvas">
        <div style={noteContainerStyle} id="noteContainerConatinerStyle">
          <Note notes={notes} lines={lines}/>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
};

export default Book;
