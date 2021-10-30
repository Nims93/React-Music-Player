import React from 'react';
import AudioTimeDisplay from './AudioTimeDisplay';

const convertToMinsAndSecs = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const secondsValue = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes}:${secondsValue}`;
};

export default function ArtworkDisplay(props) {
  const {
    trackName,
    trackArtist,
    imgUrl,
    nextTrackName,
    nextTrackArtist,
    trackProgress,
    trackTotalDuration,
    trackLoaded,
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
      <AudioTimeDisplay
        className="elapsed-time-wrapper"
        currentTimeElapsed={trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`}
        songLength={trackLoaded ? convertToMinsAndSecs(trackTotalDuration) : `${NaN}`}
      />
      <h3>
        Next Up: <span>{`${nextTrackName} by ${nextTrackArtist}`}</span>
      </h3>
    </div>
  );
}
