import React, { useState, useRef, useEffect } from 'react';

let isMouseDown = false;
let mouseMoveSeekDelay = false;
let mouseUpSeekDelay = false;

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub, audioRef } = props;
  const [userIsSeeking, setSeeking] = useState(false);
  const seekBarRef = useRef(null);
  const mouseUpSeekDelayTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);
  });

  const handleMouseUp = (e) => {
    e.preventDefault();
    if (isMouseDown) {
      setSeeking((isSeeking) => !isSeeking);
      isMouseDown = false;
      mouseMoveSeekDelay = false;
      audioRef.current.muted = false;
      if (!mouseUpSeekDelay) {
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      }
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isMouseDown && mouseMoveSeekDelay) {
      audioRef.current.muted = true;
      setTimeout(() => {
        mouseMoveSeekDelay = true;
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      }, 60);
      mouseMoveSeekDelay = false;
    }
  };

  const handleMouseDown = (e) => {
    if (e.buttons === 1) {
      e.preventDefault();
      setSeeking((userIsSeeking) => !userIsSeeking);
      isMouseDown = true;
      mouseMoveSeekDelay = true;
      seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      mouseUpSeekDelay = true;
      mouseUpSeekDelayTimeoutRef.current = setTimeout(
        () => (mouseUpSeekDelay = false),
        100
      );
    }
  };

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={handleMouseDown}
    >
      <div
        className={userIsSeeking ? 'seek-bar currently-seeking' : 'seek-bar'}
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
