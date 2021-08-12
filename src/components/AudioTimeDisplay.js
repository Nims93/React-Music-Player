import React from 'react';

export default function AudioTimeDisplay(props) {
  const { className, currentDuration, songLength } = props;

  return (
    <div className={className}>
      <span className="track-elapsed-duration">{currentDuration}</span>
      <span className="track-duration-separator"> / </span>
      <span className="track-total-duration">{songLength}</span>
    </div>
  );
}
