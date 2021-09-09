import React from 'react';

export default function AudioTimeDisplay(props) {
  const { className, currentTimeElapsed, songLength } = props;

  return (
    <div className={className}>
      <span className="track-elapsed-duration">{currentTimeElapsed}</span>
      <span className="track-duration-separator"> / </span>
      <span className="track-total-duration">{songLength}</span>
    </div>
  );
}
