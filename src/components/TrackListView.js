import React, { useState } from 'react';
import SongListToggle from './SongListToggle';

export default function TrackListView(props) {
  const { SONGS, trackIndex, handleTrackSelect } = props;
  const [toggleList, setToggleList] = useState(false);
  // const toRender = toggle ? <ul>{createList(SONGS)}</ul> : null;

  function handleToggle() {
    setToggleList(!toggleList);
  }

  function createList(songs, currentlyPlayingSongIndex) {
    const songsList = songs.map((songObj, index) => {
      return (
        <li
          style={
            index === currentlyPlayingSongIndex
              ? {
                  backgroundColor: 'hsla(0, 0%, 100%, .2)',
                  borderRadius: '5px',
                }
              : null
          }
          id={`song-list-item-${index}`}
          key={index}
          onClickCapture={handleClick}
        >
          <img src={songObj.imgUrl} alt={`track artwork for ${songObj.name}`} />
          <span>{songObj.name}</span>
        </li>
      );
    });
    return songsList;
  }

  function handleClick(e) {
    e.stopPropagation();
    const id = e.currentTarget.id;
    const index = Number(id.slice(id.lastIndexOf('-') + 1));
    console.log(index);
    handleTrackSelect(index);
  }

  return (
    <div className="track-list">
      <SongListToggle handleTracklistVisibility={handleToggle} />
      {toggleList && <ul>{createList(SONGS, trackIndex)}</ul>}
    </div>
  );
}
