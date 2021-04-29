import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

const canvasStyle = {
  width: "10000%",
  height: "10000%",
  background: "white",
  border: "none",
  //overflow: "auto",
  display: "flex",
};

const boxContainerStyle = {
  position: "relative",
  //overflow: "auto",
  width: "120%",
  height: "120%",
  background: "white",
  color: "black",
  border: "black solid 1px",
};

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
};

const FewArrows = () => {
    const [, setState] = useState({});
    const [dragging, setDragging] = useState(false);
    const forceRerender = () => setState({});

  const boxes = [
    { id: "box1", x: 50, y: 20, ref: useRef(null) },
    { id: "box2", x: 20, y: 250, ref: useRef(null) },
    { id: "box3", x: 350, y: 80, ref: useRef(null) },
  ];

  const [lines] = useState([
    {
      start: "box1",
      end: "box2",
      headSize: 14,
      label: { end: "endLabel" },
    },
    {
      start: "box2",
      end: "box3",
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
      start: "box3",
      end: "box1",
      color: "green",
      path: "grid",
      // endAnchor: ["right", {position: "left", offset: {bottomness: -10}}],
      dashness: { animation: 1 },
    },
  ]);

    const openNote = (e) => {
        alert("ASD");
        forceRerender();
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
    <React.Fragment>
      <div style={canvasStyle} id="canvas">
        <div style={boxContainerStyle} id="boxContainerConatinerStyle">
          <div style={boxContainerStyle} id="boxContainerStyle">
            {boxes.map((box, i) => (
              <Draggable onStop={onStop} onDrag={onDrag} key={i}>
                <div
                  id={box.id}
                  style={{ ...boxStyle, left: box.x, top: box.y }}
                >
                  {box.id}
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

export default FewArrows;
