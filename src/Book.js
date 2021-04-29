import React, { useState, useRef, useEffect } from "react";
import Xarrow from "react-xarrows";
import axios from 'axios';
import Draggable from "react-draggable";
import {variables} from "./urls.js";

const noteStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
};


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
  width: "100%",
  height: "100%",
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
    const [dragging, setDragging] = useState(false);

    const openNote = (e) => {
        alert("ASD");
    }

    const onStop = () => {
        const d = dragging;
        setDragging(false);
        if (!d) {
            openNote();
        }
        forceRerender();
    }
    const onDrag = () => {
        setDragging(true);
        forceRerender();
    }

    const fetchLines = async () => {
        const url = variables.serverUrl + variables.fetchLinesEndpoint;
        const response = await axios.get(url, {crossDomain: false, params: {book_id: '1'}});
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

    const addNote = () => {
        const url = variables.serverUrl + variables.postNoteEndpoint;
        const res = axios.post(url, {
            book_id: 1,
            name: 'lksdjf',
            content: '',
            x: 50,
            y: 50,
            parent_id: 1,
        });
        fetchBook()

    }

  return (
    <React.Fragment>
      <button onClick={addNote}> Add note</button>
      <div style={canvasStyle} id="canvas" >
        <div style={noteContainerStyle} id="noteContainerConatinerStyle">
          <div style={noteContainerStyle} id="noteContainerStyle">
            {notes.map((note, i) => (
              <Draggable onStop={onStop} onDrag={onDrag} key={i}>
                <div
                  id={note.id}
                  style={{ ...noteStyle, left: note.x, top: note.y }}
                >
                  {note.title}
                </div>
              </Draggable>
            ))}
            {lines.map((line, i) => (
              <Xarrow key={i} {...line} />
            ))}
          </div>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
};

export default Book;
