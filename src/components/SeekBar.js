import React, { useState, useRef, useEffect } from 'react';

// let isMouseDown = false;
// let mouseMoveSeekDelay = false;
// let mouseUpSeekDelay = false;

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub, audioRef } = props;
  const [userIsSeeking, setSeeking] = useState(false);
  const seekBarRef = useRef(null);
  const mouseUpSeekDelayTimeoutRef = useRef(null);
  const isMouseDown = useRef(false);
  const mouseMoveSeekDelay = useRef(false);
  const mouseUpSeekDelay = useRef(false);

  useEffect(() => {
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  });

  const handleMouseUp = (e) => {
    e.preventDefault();
    if (isMouseDown.current) {
      setSeeking((isSeeking) => !isSeeking);
      isMouseDown.current = false;
      mouseMoveSeekDelay.current = false;
      audioRef.current.muted = false;
      if (!mouseUpSeekDelay.current) {
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      }
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isMouseDown.current && mouseMoveSeekDelay.current) {
      audioRef.current.muted = true;
      setTimeout(() => {
        mouseMoveSeekDelay.current = true;
        seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      }, 60);
      mouseMoveSeekDelay.current = false;
    }
  };

  const handleMouseDown = (e) => {
    if (e.buttons === 1) {
      e.preventDefault();
      setSeeking((userIsSeeking) => !userIsSeeking);
      isMouseDown.current = true;
      mouseMoveSeekDelay.current = true;
      seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
      mouseUpSeekDelay.current = true;
      mouseUpSeekDelayTimeoutRef.current = setTimeout(
        () => (mouseUpSeekDelay.current = false),
        100
      );
    }
  };

  return (
    <div ref={seekBarRef} className="seek-bar-wrapper" onMouseDown={handleMouseDown}>
      <div
        className={userIsSeeking ? 'seek-bar currently-seeking' : 'seek-bar'}
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
