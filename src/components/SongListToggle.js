import React, { useState } from 'react';
import { ReactComponent as CaretIcon } from './../assets/caret-right-fill.svg';

export default function SongListToggle(props) {
  const { handleTracklistVisibility } = props;
  const [listVisible, setListVisible] = useState(false);

  return (
    <button
      onClick={() => {
        setListVisible(!listVisible);
        handleTracklistVisibility();
      }}
      className={listVisible ? 'list-toggle active' : 'list-toggle'}
    >
      <CaretIcon />
    </button>
  );
}
