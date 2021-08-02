import React from 'react';

export default function AudioTimeDisplay(props) {
  const { className, currentDuration, songLength} = props;

  return (
    <div className={className}>
      <span>{currentDuration}</span>
      <span> / </span>
      <span>{songLength}</span>
    </div>
  )
} 