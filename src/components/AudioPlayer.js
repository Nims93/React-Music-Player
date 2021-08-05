import React, { useRef, useEffect, useState } from 'react';
import SeekBar from './SeekBar';
import MediaButton from './MediaButton';
import AudioTimeDisplay from './AudioTimeDisplay';
import VolumeSlider from './VolumeSlider';

let repeatSong = false;

export default function AudioPlayer(props) {
  const { handleNext, handlePrev, track } = props;
  const [trackLoaded, setTrackLoaded] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    console.log('track switcher useEffect called');
    const audio = new Audio(track);
    audioRef.current = audio;
    audioRef.current.addEventListener('canplay', () => {
      if (isPlaying) {
        setTrackLoaded(true);
        audioRef.current.play();
      } else {
        setTrackLoaded(true);
      }
    });

    audioRef.current.addEventListener('ended', () => {
      if (repeatSong) {
        audioRef.current.currentTime = 0;
        setTrackProgress(0);
        audioRef.current.play();
      } else {
        nextSong();
        setIsPlaying(false);
      }
    });
  }, [track]);

  useEffect(() => {
    //if isPlaying (bool), run callback
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        const audioTime = audioRef.current.currentTime;
        setTrackProgress(audioTime);
      }, 500);
    }
  }, [isPlaying, trackProgress]);

  function seekBarScrub(mouseDownCoord, seekBarWidth) {
    const percentage = ((mouseDownCoord / seekBarWidth) * 100) / 100;
    const newNum = percentage * Math.round(audioRef.current.duration);

    clearTimeout(timeoutRef);

    setTrackProgress(newNum);
    audioRef.current.currentTime = newNum;
  }

  function convertToMinsAndSecs(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);

    let secondsValue;
    secondsValue =
      seconds < 10 ? (secondsValue = '0' + seconds) : (secondsValue = seconds);

    return `${minutes}:${secondsValue}`;
  }

  function playPause() {
    if (isPlaying) {
      setIsPlaying(!isPlaying);
      audioRef.current.pause();
    } else {
      setIsPlaying(!isPlaying);
      audioRef.current.play();
    }
  }

  function seekMinus10Seconds() {
    if (audioRef.current.currentTime <= 10) {
      audioRef.current.currentTime = 0;
      setTrackProgress(0);
    } else {
      const time = audioRef.current.currentTime - 10;
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    }
  }

  function seekPlus10Seconds() {
    if (audioRef.current.duration - audioRef.current.currentTime < 10) {
      const time = audioRef.current.currentTime - 5;
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    } else {
      const time = (audioRef.current.currentTime += 10);
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    }
  }

  function prevSong() {
    if (audioRef.current.currentTime > 7) {
      setTrackProgress(0);
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.pause();
      // setIsPlaying(false);
      // audioRef.current.currentTime = 0;
      setTrackProgress(0);
      setTrackLoaded(false);
      clearTimeout(timeoutRef);
      handlePrev();
    }
  }

  function nextSong() {
    // if repeat button? set currentTime and track Progress to 0
    // else call handleNext prop
    audioRef.current.pause();
    // setIsPlaying(false);
    setTrackProgress(0);
    clearTimeout(timeoutRef);
    setTrackLoaded(false);
    handleNext();
  }

  function handleVolume(volume) {
    audioRef.current.volume = volume;
  }

  return (
    <div className="player">
      <SeekBar
        trackProgress={trackProgress}
        totalDuration={trackLoaded ? audioRef.current.duration : 0}
        onMouseDown={seekBarScrub}
      />
      {/* <audio ref={audioRef} onCanPlay={() => setTrackLoaded(true)}>
        <source src={media} type="audio/mp3"></source>
      </audio> */}
      <div className="control-buttons-elapsed-time">
        <AudioTimeDisplay
          className="audio-time-display"
          currentDuration={
            trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`
          }
          songLength={
            trackLoaded
              ? convertToMinsAndSecs(audioRef.current.duration)
              : `${NaN}`
          }
        />
        <MediaButton id="prev" icon="prevSVG" onClick={prevSong} />
        <MediaButton
          id="rewind-10-sec"
          icon="rewind10SVG"
          onClick={seekMinus10Seconds}
        />
        <MediaButton id="play-pause" icon="play/pauseSVG" onClick={playPause} />
        <MediaButton
          id="skip-10-sec"
          icon="skip10SVG"
          onClick={seekPlus10Seconds}
        />
        <MediaButton id="next" icon="nextSVG" onClick={nextSong} />

        <MediaButton
          id="repeat"
          icon="repeatSVG"
          onClick={() => (repeatSong = !repeatSong)}
        />

        {/* <RepeatButton
          id="repeat"
          icon="repeatSVG"
          onClick={() => (repeatSong = !repeatSong)}
        /> */}

        <VolumeSlider handleVolume={handleVolume} />
      </div>
    </div>
  );
}
