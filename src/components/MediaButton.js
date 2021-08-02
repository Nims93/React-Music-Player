import React from 'react';

export default function MediaButton(props) {
  const {id, icon, onClick: callbackProp} = props;

  return (
    <button id={id} onClick={callbackProp}>
      {icon}
    </button>
  )
}