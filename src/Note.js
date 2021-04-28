import React from 'react';
import Draggable from "react-draggable";

const noteStyle = {
  position: "relative",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
  color: "black",
};



const Note = (props) => {
  return (
      <Draggable onStop={forceRerender} onDrag={forceRerender} key={i}>
                <div
                  id={box.id}
                  style={{ ...boxStyle, left: box.x, top: box.y }}
                >
                  {box.id}
                </div>
      </Draggable>
  );
};

export default Note;
