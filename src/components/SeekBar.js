import React, { useState, useRef, useEffect } from 'react';
let value = false;
export default function SeekBar(props) {
  const {
    trackProgress,
    totalDuration,
    seekBarScrub,
    audioRef,
    isMouseDownOnSeekBar,
  } = props;

  const [isMouseDown, setMouseDown] = useState(false);
  const [mouseMoveCaptureDelay, setMouseMoveCaptureDelay] = useState(false);
  const seekBarRef = useRef(null);
  const unsetMouseDownTimeoutRef = useRef(null);

  // useEffect(() => {
  //   document.body.addEventListener('mouseup', (e) => {
  //     e.preventDefault();
  //     console.log('mouse up');
  //     if (isMouseDown) {
  //       setMouseDown(false);
  //       setMouseMoveCaptureDelay(false);
  //       seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
  //       audioRef.current.muted = false;
  //     }
  //   });

  //   document.body.addEventListener('mousemove', (e) => {
  //     e.preventDefault();
  //     if (isMouseDown && mouseMoveCaptureDelay) {
  //       audioRef.current.muted = true;
  //       setTimeout(() => {
  //         console.log('moving');
  //         setMouseMoveCaptureDelay(true);
  //         seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
  //       }, 2000);
  //       setMouseMoveCaptureDelay(false);
  //     }
  //   });
  // }, [mouseMoveCaptureDelay, isMouseDown]);

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        if (e.buttons === 1) {
          e.preventDefault();
          value = true;
          setMouseDown(true);
          setMouseMoveCaptureDelay(true);
          seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
        }
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMouseDown && mouseMoveCaptureDelay) {
          audioRef.current.muted = true;
          setTimeout(() => {
            setMouseMoveCaptureDelay(true);
            seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
            clearTimeout(unsetMouseDownTimeoutRef.current);
          }, 50);
          unsetMouseDownTimeoutRef.current = setTimeout(() => {
            setMouseDown(false);
            audioRef.current.muted = false;
          }, 2000);
          //will be set true after 50ms
          setMouseMoveCaptureDelay(false);
        }
      }}
      onMouseUp={(e) => {
        console.log('mouseup');
        e.preventDefault();
        setMouseDown(false);
        setMouseMoveCaptureDelay(false);
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
        audioRef.current.muted = false;
      }}
    >
      <div
        className="seek-bar"
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
