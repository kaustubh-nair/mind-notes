import React, { useState, useRef, useEffect } from "react";
import { useLocation, Redirect, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Xarrow from "react-xarrows";
import axios from 'axios';
import Draggable from "react-draggable";
import { useParams } from "react-router";
import {variables} from "../urls.js";

function useForceUpdate(){
  let [value, setState] = useState(true);
  return () => setState(!value);
}

const noteStyle = {
  position: "relative",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
}

const Book = ({getToken}) => {
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const bookId = useParams().id;
  const forceUpdate = useForceUpdate();

  const [notes, setNotes] = useState([]);
  const [book, setBook] = useState([]);
  const [lines, setLines] = useState([]);
  const [dragging, setDragging] = useState(false);

  const openNote = (e) => {
      prompt('Please enter your name','Poppy');
  }

  function isPublic(is_public) {
    if (is_public) 
      return "checked";
  }

  const onStop = (e, ui) => {
        setDragging(false);

        const d = dragging;
        const noteId = ui.node.id;
        const i = notes.findIndex((note) => note.id == noteId);
        const newX = notes[i].x + e.clientX - lastPoint.x,
            newY = notes[i].y + e.clientY - lastPoint.y;
        if (d) {
            updatePosition(newX, newY, noteId);
        }
        else {
            openNote();
        }
        //forceUpdate();
    }

    const onStart = (e) => {
        setLastPoint({ x: e.clientX, y: e.clientY })
    }

    const onDrag = (e) => {
        setDragging(true);
        forceUpdate();
    }

    const fetchLines = async () => {
        const url = variables.serverUrl + variables.fetchLinesEndpoint;
        const token = getToken();
        const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
        var l = Object.values(response.data)
        for (var i = 0; i < l.length; i++) {
            l[i].start = String(l[i].start);
            l[i].end = String(l[i].end);
        }
        setLines(l);
    }

    const fetchBook = async () => {
        const url = variables.serverUrl + variables.fetchBookEndpoint;
        const token = getToken();
        const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
        setBook(response.data);
        console.log(response.data);
    }

    const fetchNotes = async () => {
        const url = variables.serverUrl + variables.fetchNotesEndpoint;
        const token = getToken();
        const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
        setNotes(Object.values(response.data));
    }

    const addNote = () => {
        const url = variables.serverUrl + variables.postNoteEndpoint;
        const token = getToken();
        const res = axios.post(url, {
            book_id: bookId,
            name: 'lksdjf',
            content: '',
            x: 50,
            y: 50,
            parent_id: 1,
        }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
        fetchNotes();
    }

    const updatePosition = (x, y, noteId) => {
        const url = variables.serverUrl + variables.patchNoteEndpoint;
        const token = getToken();
        const res = axios.patch(url, {
            book_id: bookId,
            note_id: noteId,
            x: x,
            y: y,
        }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
    }

  function openEditDescription() {

  }


    useEffect(() => {
      fetchNotes();
      fetchBook();
      fetchLines();
	}, []);

  return (
    <div className="canvas-wrapper">
      <React.Fragment>
        <h3 className="note-heading">Book</h3>
        <div className="note-canvas">
          <div className="row">
            <div className="column">
              <div className="canvasStyle" id="canvas" >
                <div className="noteContainerStyle" id="noteContainerConatinerStyle">
                  <div className="noteContainerStyle" id="noteContainerStyle">
                    {notes.map((note, i) => (
                      <Draggable onStart={onStart} onStop={onStop} onDrag={onDrag} key={i}>
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
            </div>
          <div className="column-right">
                <p>{book.description}</p>
                <button onClick={openEditDescription} className="btn btn-primary">Edit description</button>
                <button onClick={addNote} className="btn btn-primary"> Add note</button>
                <div className="side-panel-public">
                    <h3>Public</h3>
                    <label className="switch">
                      <input type="checkbox" checked={isPublic(book.is_public)}></input>
                      <span className="slider round"></span>
                    </label>
                </div>
          </div>
          </div>
        </div>
        <br />
      </React.Fragment>
    
    </div>
  );
};

export default Book;