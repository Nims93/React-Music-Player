import React from 'react';

export default function MediaButton(props) {
  const { className, icon, onClick: callbackProp } = props;

  return (
    <button className={className} onClick={callbackProp}>
      {icon}
    </button>
  );
}
