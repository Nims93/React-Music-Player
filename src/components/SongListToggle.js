import React, { useState } from 'react';

export default function SongListToggle(props) {
  const { handleTracklistVisibility } = props;
  const [listVisible, setListVisible] = useState(false);

  return (
    <button onClick={() => {
      setListVisible(!listVisible)
      handleTracklistVisibility();
    }}>
      {listVisible ? 'List Visible Icon' : 'List not visible icon'}
    </button>
  );
}
