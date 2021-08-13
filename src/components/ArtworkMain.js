import React from 'react';
import AudioTimeDisplay from './AudioTimeDisplay';

export default function ArtworkDisplay(props) {
  // const { trackName, imgUrl, trackTimeElapsed, trackLoaded } = props;
  const {
    trackName,
    trackArtist,
    imgUrl,
    nextTrackName,
    nextTrackArtist,
    trackDurationComponent,
  } = props;

  return (
    <div className="track-info">
      <h4>PLAYING NOW</h4>
      <div className="track-artwork-wrapper">
        <img
          className="track-artwork"
          src={imgUrl}
          alt={`track artwork for song ${trackName}`}
        />
      </div>
      <div className="artist-and-track-name">
        <h1>{trackName}</h1>
        <h2>{trackArtist}</h2>
      </div>

      {trackDurationComponent}
      <h3>
        Next Up: <span>{`${nextTrackName} by ${nextTrackArtist}`}</span>
      </h3>
    </div>
  );
}
