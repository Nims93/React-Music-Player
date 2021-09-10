import React, { useState } from 'react';
import SongListToggle from './SongListToggle';
import { ReactComponent as VolumeIcon } from './../assets/volume-icon.svg';

export default function TrackListView(props) {
  const { SONGS, trackIndex, handleTrackSelect } = props;
  const [toggleListVisibility, setToggleList] = useState(false);

  // const toRender = toggle ? <ul>{createList(SONGS)}</ul> : null;

  function handleToggle() {
    setToggleList(!toggleListVisibility);
  }

  function createSongsList() {
    const songsList = SONGS.map((songObj, index) => {
      return (
        <li
          style={
            index === trackIndex
              ? {
                  backgroundColor: 'hsla(0, 0%, 100%, .2)',
                  borderRadius: '5px',
                }
              : null
          }
          id={`song-list-item-${index}`}
          key={index}
          onClick={handleClick}
        >
          <img src={songObj.imgUrl} alt={`track artwork for ${songObj.name}`} />
          <div className="song-info">
            <div className="song-name">{songObj.name}</div>
            <div className="artist-name">{songObj.artist}</div>
          </div>
          <div className="icon">
            <VolumeIcon />
          </div>
        </li>
      );
    });
    return songsList;
  }

  function handleClick(e) {
    e.stopPropagation();
    const id = e.currentTarget.id;
    const index = parseInt(id.slice(id.lastIndexOf('-') + 1));
    handleTrackSelect(index);
  }

  return (
    <div className="track-list">
      <SongListToggle handleTracklistVisibility={handleToggle} />
      <ul className={toggleListVisibility ? 'songs-list' : 'songs-list hidden'}>
        {createSongsList()}
      </ul>
    </div>
  );
}
