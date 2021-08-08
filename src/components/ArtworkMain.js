import React from 'react';
// import SongListToggle from './SongListToggle';

export default function ArtworkDisplay(props) {
  const { trackName, imgUrl } = props;

  return (
    <div className="artwork-wrapper">
      <img
        className="track-artwork"
        src={imgUrl}
        alt={`track artwork for song ${trackName}`}
      />
      <h2>{trackName}</h2>
    </div>
  );
}
