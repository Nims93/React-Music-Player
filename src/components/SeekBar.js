import React, { useState, useRef, useEffect } from 'react';

let isMouseDown = false;
let mouseMoveDelay = false;

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub, audioRef } = props;
  const [userIsSeeking, setSeeking] = useState(false);
  const seekBarRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);
  });

  const handleMouseUp = (e) => {
    e.preventDefault();
    if (isMouseDown) {
      setSeeking((isSeeking) => !isSeeking);
      isMouseDown = false;
      mouseMoveDelay = false;
      seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      audioRef.current.muted = false;
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isMouseDown && mouseMoveDelay) {
      audioRef.current.muted = true;
      setTimeout(() => {
        mouseMoveDelay = true;
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      }, 60);
      mouseMoveDelay = false;
    }
  };

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        if (e.buttons === 1) {
          e.preventDefault();
          setSeeking((userIsSeeking) => !userIsSeeking);
          isMouseDown = true;
          mouseMoveDelay = true;
          seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
        }
      }}
    >
      <div
        className={userIsSeeking ? 'seek-bar currently-seeking' : 'seek-bar'}
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
//redundant code that doesn't allow seeking outside of "seek-bar-wrapper"
//container div
//
// onMouseMove={(e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   if (isMouseDown && mouseMoveCaptureDelay) {
//     audioRef.current.muted = true;
//     setTimeout(() => {
//       setMouseMoveCaptureDelay(true);
//       seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
//       clearTimeout(unsetMouseDownTimeoutRef.current);
//     }, 50);
//     unsetMouseDownTimeoutRef.current = setTimeout(() => {
//       setMouseDown(false);
//       audioRef.current.muted = false;
//     }, 2000);
//     //will be set true after 50ms
//     setMouseMoveCaptureDelay(false);
//   }
// }}
// onMouseUp={(e) => {
//   console.log('mouseup');
//   e.preventDefault();
//   setMouseDown(false);
//   setMouseMoveCaptureDelay(false);
//   seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
//   audioRef.current.muted = false;
// }}
