import React, { useState } from 'react';

export default function VolumeSlider(props) {
  const { handleVolume } = props;

  const [volume, setVolume] = useState(100);
  return (
    <input
      type="range"
      value={volume}
      step="0.0125"
      min="0"
      max="1"
      className="volume"
      onChange={(e) => {
        setVolume(e.target.value);
        handleVolume(e.target.value);
      }}
    ></input>
  );
}
