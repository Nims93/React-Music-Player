import React, { useState } from 'react';

export default function SeekBar(props) {

  const { trackProgress } = props;

  const [width, setWidth] = useState(0)

  return( 
    <div className='seek-bar-wrapper'>
      <div className='seek-bar' style={{width: `${width}%`}}></div>
    </div>
  )
}