import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import Note from "./Note.js";

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

  const notes = [
    { id: "note1", x: 50, y: 20, ref: useRef(null) },
    { id: "note2", x: 20, y: 250, ref: useRef(null) },
    { id: "note3", x: 350, y: 80, ref: useRef(null) },
  ];

  const [lines] = useState([
    {
      start: "note1",
      end: "note2",
      headSize: 14,
      label: { end: "endLabel" },
    },
    {
      start: "note2",
      end: "note3",
      color: "red",
      label: {
        middle: (
          <div
            contentEditable
            suppressContentEditableWarning={true}
            style={{ font: "italic 1.5em serif", color: "purple" }}
          >
            Editable label
          </div>
        ),
      },
      headSize: 0,
      strokeWidth: 15,
    },
    {
      start: "note3",
      end: "note1",
      color: "green",
      path: "grid",
      // endAnchor: ["right", {position: "left", offset: {bottomness: -10}}],
      dashness: { animation: 1 },
    },
  ]);

  return (
    <React.Fragment>
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
