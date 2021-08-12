import React from 'react';
import AudioTimeDisplay from './AudioTimeDisplay';

export default function ArtworkDisplay(props) {
  // const { trackName, imgUrl, trackTimeElapsed, trackLoaded } = props;
  const { trackName, imgUrl, trackDurationComponent } = props;

  return (
    <div className="track-info">
      <img
        className="track-artwork"
        src={imgUrl}
        alt={`track artwork for song ${trackName}`}
      />
      <h2>{trackName}</h2>
      {trackDurationComponent}
    </div>
  );
}
