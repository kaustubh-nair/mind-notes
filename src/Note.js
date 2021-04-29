import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

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


const Note = (props) => {
    const [, setState] = useState({});
    const forceRerender = () => setState({});
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
  return (
          <div style={noteContainerStyle} id="noteContainerStyle">
            {props.notes.map((note, i) => (
              <Draggable onStop={onStop} onDrag={onDrag} key={i}>
                <div
                  id={note.id}
                  style={{ ...noteStyle, left: note.x, top: note.y }}
                >
                  {note.id}
                </div>
              </Draggable>
            ))}
            {props.lines.map((line, i) => (
              <Xarrow key={i} {...line} />
            ))}
          </div>
  );
};

export default Note;
