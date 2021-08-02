
import React, { useRef, useEffect, useState } from 'react';
import SeekBar from './SeekBar';
import MediaButton from './MediaButton';
import AudioTimeDisplay from './AudioTimeDisplay';
import media from './../media/Castr6 (Y.ACG) - Untold Stories _ @PacmanTV.mp3';

export default function AudioPlayer(props) {
  
  const [trackLoaded, setTrackLoaded] = useState(false);
  const [trackProgress, setTrackProgress] = useState('0:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const timeoutRef = useRef();
  
  useEffect(() => {
    //if isPlaying (bool), run callback
    (isPlaying) && setTimeout(() => {
      const audioTime = Math.floor(audioRef.current.currentTime);
      setTrackProgress(audioTime);      
    }, 1000)
  }, [isPlaying, trackProgress])

  function convertToMinsAndSecs(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);

    let secondsValue;
    secondsValue = (seconds < 10) ? secondsValue = '0' + seconds : secondsValue = seconds;

    return `${minutes}:${secondsValue}`
  }

  function playPause() {
    if (isPlaying) {
      setIsPlaying(!isPlaying)
      audioRef.current.pause();
    } else {
      setIsPlaying(!isPlaying);
      audioRef.current.play();
    }
  }

  function seekMinus10Seconds() {
    if (audioRef.current.currentTime <= 10) {
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.currentTime -= 10;
    }
  }

  function seekPlus10Seconds() {
    if (audioRef.current.duration - audioRef.current.currentTime < 10) {
      audioRef.current.currentTime = audioRef.current.duration - 5;
    } else {
      audioRef.current.currentTime += 10;
    }
  }

  function prevSong() {
    if (audioRef.current.currentTime > 5) {
      audioRef.current.currentTime = 0;
    }
  }

  function nextSong() {
    console.log('next called!');
  }

  return (
    <div className="player">
      <SeekBar trackProgress={trackProgress}/>
      <audio ref={audioRef} onCanPlay={() => setTrackLoaded(true)}>
        <source src={media} type="audio/mp3"></source>
      </audio>
      <div className='control-buttons-elapsed-time'>
        <AudioTimeDisplay 
          className='audio-time-display' 
          currentDuration={(trackLoaded) ? convertToMinsAndSecs(trackProgress) : `${NaN}`} 
          songLength={(trackLoaded) ? convertToMinsAndSecs(audioRef.current.duration) : `${NaN}`}
        />
        <MediaButton id="prev" icon="prevSVG" onClick={prevSong} />
        <MediaButton id="rewind-10-sec" icon="rewind10SVG" onClick={seekMinus10Seconds} />
        <MediaButton id="play-pause" icon="play/pauseSVG" onClick={playPause} />
        <MediaButton id="skip-10-sec" icon="skip10SVG" onClick={seekPlus10Seconds} />
        <MediaButton id="next" icon="nextSVG" onClick={nextSong} />
      </div>
    </div>
  );
}
