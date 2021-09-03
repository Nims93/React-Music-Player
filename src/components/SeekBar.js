import React, { useState, useRef } from 'react';

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub, audioRef } = props;

  const [isMouseDown, setMouseDown] = useState(false);
  const [mouseMoveCaptureDelay, setMouseMoveCaptureDelay] = useState(false);
  const seekBarRef = useRef(null);
  const unsetMouseDownTimeoutRef = useRef(null);

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        if (e.buttons === 1) {
          e.preventDefault();
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
          setMouseMoveCaptureDelay(false);
        }
      }}
      onMouseUp={(e) => {
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
//       }, 200);
//       setMouseMoveCaptureDelay(false);
//     }
//   });
// }, [mouseMoveCaptureDelay, isMouseDown]);
