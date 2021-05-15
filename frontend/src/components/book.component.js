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
  const [formName, setFormName] = useState("");
  const [formContent, setFormContent] = useState("");
  const [addNoteForm, setaddNoteForm] = useState("");
  const [connectionMode, setConnectionMode] = useState(null); // 0 for selecting start, 1 for selecting end, null for opening note.
  const [disConnectionMode, setDisconnectionMode] = useState(null); // 0 for selecting start, 1 for selecting end, null for opening note.
  const [book, setBook] = useState([]);
  const [lines, setLines] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [disconnectionStart, setDisconnectionStart] = useState(null);

  const togglePublic = async (e) => {
    const url = variables.serverUrl + variables.patchBookEndpoint;
    const token = getToken();
    const res = await axios.patch(url, {
        book_id: bookId,
        is_public: !book.is_public,
    }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false});
  }

  const saveNote = (e) => {
    closeForm();
    const url = variables.serverUrl + variables.postNoteEndpoint;
    const token = getToken();
    let name = e.target[1].value;
    let content = e.target[2].value;
    let note_id = e.target[1].id;
    const res = axios.patch(url, {
      book_id: bookId,
      note_id: note_id,
      name: name,
      content: content,
      parent_id: 1,
    }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false});
  }

  const createArrow = async (startingNote, endingNote) => {
        const url = variables.serverUrl + variables.postLinesEndpoint;
        const token = getToken();
        const res = await axios.post(url, {
            book_id: bookId,
            start_id: startingNote,
            end_id: endingNote,
        }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false});
        fetchLines();
  }

  const deleteArrow = async (startingNote, endingNote) => {
        const url = variables.serverUrl + variables.deleteLinesEndpoint;
        const token = getToken();
        const res = await axios.patch(url, {
            book_id: bookId,
            start_id: startingNote,
            end_id: endingNote,
        }, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false});
      fetchLines();
  }

  const clickOnNote = (e, noteId) => {
    if (connectionMode == 0)
    {
      setConnectionStart(noteId);
      setConnectionMode(1);
    }
    else if(connectionMode == 1)
    {
      createArrow(connectionStart, noteId);
      setConnectionMode(null);
      setConnectionStart(null);
    }
    else if(disConnectionMode==0)
    {
      setDisconnectionStart(noteId);
      setDisconnectionMode(1);
    }
    else if(disConnectionMode == 1)
    {
      deleteArrow(disconnectionStart, noteId)
      setDisconnectionMode(null);
      setDisconnectionStart(null);
    }
    else {
        addNotePopup(noteId)
    }
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
            clickOnNote(e, noteId);
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
    }

    const fetchNotes = async () => {
        const url = variables.serverUrl + variables.fetchNotesEndpoint;
        const token = getToken();
        const response = await axios.get(url, { headers: { Authorization: 'Bearer ' + token.access }, crossDomain: false, params: {book_id: bookId}});
        setNotes(Object.values(response.data));
    }

    const addNote = async () => {
        const url = variables.serverUrl + variables.postNoteEndpoint;
        const token = getToken();
        const res = await axios.post(url, {
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

  function connectNotes() {
    setConnectionMode(0);
  }

  function disconnectNotes() {
    setDisconnectionMode(0);
  }


    useEffect(() => {
      fetchNotes();
      fetchBook();
      fetchLines();
	}, []);

  function closeForm() {
    setaddNoteForm("");
    forceUpdate();
  }

  function addNotePopup(noteId) {
    for (var i in notes) {
      if (notes[i].id == noteId){
        setFormName(notes[i].name);
        setFormContent(notes[i].content);
      }
    }
    console.log(formName);
    console.log(formContent);
    setaddNoteForm( [
          <div className="formbk" id="contact_form">
              <div className="panel-body">
                  <form id={noteId} onSubmit={saveNote} className="form-horizontal" role="form">
                      <button onClick={closeForm} className="btn btn-danger">X</button>
                      <div className="form-group">
                          <label for="title" className="">Title</label>
                          <div className="">
                              <input className="form-control" defaultValue={formName} id={noteId} />
                          </div>
                      </div>
                      <div className="form-group">
                          <label for="content" className="">Content</label>
                          <div className="">
                              <input className="form-control" id="content" defaultValue={formContent} />
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
    forceUpdate();
  }
  return (
    <div className="canvas-wrapper">
      <React.Fragment>
        <h3 className="note-heading">Book</h3>
        <div className="note-canvas">
          {addNoteForm}
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
          <div className="sidebar column-right">
                <button onClick={addNote} className="btn btn-dark"> Add note</button>
                <button onClick={connectNotes} className="btn btn-dark">Connect two notes</button>
                <button onClick={disconnectNotes} className="btn btn-dark">Disconnect two notes</button>
                <h5 className="desc" >Description:</h5>
                <p>{book.description}</p>
                <button onClick={openEditDescription} className="btn btn-dark">Edit description</button>
                <div className="side-panel-public">
                    <h5 className="desc" >Set public</h5>
                    <label className="switch">
                      <input onChange={togglePublic} type="checkbox" checked={isPublic(book.is_public)}></input>
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
