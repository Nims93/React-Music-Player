import React, { useState, useRef, useEffect } from 'react';

let seekBarLength = 300;

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub } = props;
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseMoveCaptureDelay, setMouseMoveCaptureDelay] = useState(null);
  const seekBarRef = useRef(null);
  const timeoutRef = useRef(null);

  document.addEventListener('mouseup', (e) => {
    e.preventDefault();
    setMouseDown(false);
    setMouseMoveCaptureDelay(null);
    if (e.target === seekBarRef) {
      seekBarScrub(e.nativeEvent.offsetX, seekBarRef.current.offsetWidth);
    }
  });

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        seekBarLength = seekBarRef.current.offsetWidth;
        if (e.buttons === 1) {
          e.preventDefault();
          setMouseDown(true);
          setMouseMoveCaptureDelay('can update length');
          seekBarScrub(e.nativeEvent.offsetX, e.currentTarget.offsetWidth);
        }
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mouseDown && mouseMoveCaptureDelay === 'can update length') {
          setTimeout(() => {
            setMouseMoveCaptureDelay('can update length');
            console.log(e.nativeEvent);
            seekBarScrub(e.nativeEvent.offsetX, seekBarRef.current.offsetWidth);
            clearTimeout(timeoutRef.current);
          }, 150);
          timeoutRef.current = setTimeout(() => {
            setMouseDown(false);
          }, 2000);
          setMouseMoveCaptureDelay(null);
        }
      }}
      // onMouseUp={(e) => {
      //   e.preventDefault();
      //   setMouseDown(false);
      //   seekBarScrub(e.nativeEvent.offsetX, e.currentTarget.offsetWidth);
      // }}
    >
      <div
        className="seek-bar"
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
