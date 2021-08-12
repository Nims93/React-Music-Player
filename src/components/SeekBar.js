import React from 'react';

export default function SeekBar(props) {
  const { trackProgress, totalDuration, onMouseDown } = props;

  return (
    <div
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        e.preventDefault();
        return onMouseDown(e.nativeEvent.offsetX, e.target.offsetWidth);
      }}
    >
      <div
        className="seek-bar"
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      >
        {/* <div className="seek-bar-knob"></div> */}
      </div>
    </div>
  );
}
