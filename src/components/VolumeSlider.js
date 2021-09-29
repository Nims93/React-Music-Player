import React, { useState } from 'react';
import InputRange from 'react-input-range';
// import 'react-input-range/lib/css/index.css';

export default function VolumeSlider({ handleVolume }) {
  const [volume, setVolume] = useState(1);
  return (
    <InputRange
      maxValue={1}
      minValue={0}
      step={0.025}
      value={volume}
      onChange={(e) => {
        setVolume(e);
        handleVolume(e);
      }}
    />
  );
}
