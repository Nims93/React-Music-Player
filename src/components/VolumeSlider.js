import React, { useState } from 'react';
import InputRange from 'react-input-range';
// import 'react-input-range/lib/css/index.css';

export default function VolumeSlider({ handleVolume }) {
  const [volume, setVolume] = useState(1);
  return (
    <InputRange
      className="volume"
      maxValue={1}
      minValue={0}
      step={0.025}
      value={volume}
      onChange={(e) => {
        setVolume(e);
        handleVolume(e);
      }}
    />
    // <input
    //   id="volume"
    //   type="range"
    //   step="0.025"
    //   min="0"
    //   max="1"
    //   value={volume}
    //   onChange={(e) => {
    //     console.log(e);
    //     setVolume(e.target.value);
    //     handleVolume(e.target.value);
    //   }}
    // ></input>
  );
}
