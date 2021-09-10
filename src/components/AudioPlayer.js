import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import SeekBar from './SeekBar';
import MediaButton from './MediaButton';
import AudioTimeDisplay from './AudioTimeDisplay';
import VolumeSlider from './VolumeSlider';

import { ReactComponent as BackwardsIcon } from './../assets/skip-backward-fill.svg';
import { ReactComponent as PlayIcon } from './../assets/play.svg';
import { ReactComponent as PauseIcon } from './../assets/pause.svg';
import { ReactComponent as ForwardsIcon } from './../assets/skip-forward-fill.svg';
import { ReactComponent as Rewind10Icon } from './../assets/arrow-counterclockwise-backwards.svg';
import { ReactComponent as Forwards10Icon } from './../assets/arrow-clockwise-forward.svg';
import { ReactComponent as RepeatIcon } from './../assets/arrow-repeat.svg';
import { ReactComponent as VolumeIcon } from './../assets/volume-icon.svg';
import { ReactComponent as VolumeMuteIcon } from './../assets/volume-mute-icon.svg';

function convertToMinsAndSecs(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  let secondsValue;
  secondsValue =
    seconds < 10 ? (secondsValue = '0' + seconds) : (secondsValue = seconds);
  return `${minutes}:${secondsValue}`;
}
const handleCanPlay = (audioRef, setTrackLoaded, isPlaying) => {
  setTrackLoaded(true);
  isPlaying && audioRef.current.play();
};

function AudioPlayer(props, ref) {
  const {
    handleNext,
    handlePrev,
    track,
    handleTrackProgressForTrackInfoDisplay,
  } = props;

  const [trackLoaded, setTrackLoaded] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatSong, setRepeatSong] = useState(false);
  const [toggleVolumeIcon, setToggleVolume] = useState(true);
  const audioRef = useRef(new Audio(track));
  const timeoutRef = useRef(null);

  useImperativeHandle(ref, () => ({
    //resets trackElapsedTimeComponent when a track is selected from track selector
    unloadTrack: () => setTrackLoaded(false),
    //resets track elasped time display when track is selcted from track selector
    resetTrackProgress: () => setTrackProgress(0),
    returnTrackTimeElapsedComponent: () => trackTimeElapsedComponent,
  }));

  const trackTimeElapsedComponent = (
    <AudioTimeDisplay
      className="elapsed-time-wrapper"
      currentTimeElapsed={
        trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`
      }
      songLength={
        trackLoaded ? convertToMinsAndSecs(audioRef.current.duration) : `${NaN}`
      }
    />
  );

  //handle track switching
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(track);
    audioRef.current.addEventListener(
      'canplay',
      handleCanPlay.bind(null, audioRef, setTrackLoaded, isPlaying)
    );
    // return () => {
    //   audioRef.current.pause();
    //   audioRef.current.removeEventListener('canplay', handleCanPlay);
    // };
  }, [track]);

  useEffect(() => {
    if (audioRef.current.ended && repeatSong) {
      setTrackProgress(0);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current.ended && !repeatSong) {
      nextSong();
    }
  }, [trackProgress, repeatSong]);

  //creates timeout callback for tracking current elapsed track time.
  //called whenever that track plays and when elapsed track time changes
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        console.log('going')
        const audioTime = audioRef.current.currentTime;
        setTrackProgress(audioTime);
      }, 500);
    }
  }, [isPlaying, trackProgress, trackLoaded]);

  //sends <AudioTimeDisplay /> up to App component to be sent back down to
  //artwork display component
  useEffect(() => {
    handleTrackProgressForTrackInfoDisplay(trackTimeElapsedComponent);
  }, [trackProgress, trackLoaded, track]);

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
      // audioRef.current.currentTime = 0;
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

  function seekBarScrub(mouseDownCoord, seekBarWidth) {
    const percentage = ((mouseDownCoord / seekBarWidth) * 100) / 100;
    const newNum = percentage * Math.round(audioRef.current.duration);

    clearTimeout(timeoutRef);
    setTrackProgress(newNum);
    audioRef.current.currentTime = newNum;
  }

  function prevSong() {
    if (audioRef.current.currentTime > 7) {
      setTrackProgress(0);
      audioRef.current.currentTime = 0;
    } else {
      setTrackProgress(0);
      setTrackLoaded(false);
      clearTimeout(timeoutRef);
      handlePrev();
    }
  }

  function nextSong() {
    setTrackProgress(0);
    clearTimeout(timeoutRef);
    setTrackLoaded(false);
    handleNext();
  }

  function handleVolume(volume) {
    audioRef.current.volume = volume;
  }

  function handleMuteButtonClick() {
    //turn off
    if (toggleVolumeIcon) {
      audioRef.current.muted = true;
      setToggleVolume(!toggleVolumeIcon);
    }
    //turn on
    else {
      audioRef.current.muted = false;
      setToggleVolume(!toggleVolumeIcon);
    }
  }

  return (
    <div className="player">
      <SeekBar
        trackProgress={trackProgress}
        totalDuration={trackLoaded ? audioRef.current.duration : 0}
        seekBarScrub={seekBarScrub}
        audioRef={audioRef}
      />

      <div className="control-buttons">
        <MediaButton
          className={repeatSong ? 'repeat active' : 'repeat'}
          icon={<RepeatIcon />}
          onClick={() => setRepeatSong((repeatSong) => !repeatSong)}
        />

        <div className="playpause-seek-buttons">
          <MediaButton
            className="rewind-10-sec"
            icon={<Rewind10Icon />}
            onClick={seekMinus10Seconds}
          />

          <MediaButton
            className="prev"
            icon={<BackwardsIcon />}
            onClick={prevSong}
          />

          <MediaButton
            className="play-pause"
            icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={playPause}
          />

          <MediaButton
            className="next"
            icon={<ForwardsIcon />}
            onClick={nextSong}
          />

          <MediaButton
            className="skip-10-sec"
            icon={<Forwards10Icon />}
            onClick={seekPlus10Seconds}
          />
        </div>
        <div className="volume-controls-wrapper">
          <MediaButton
            className="volume-indicator"
            icon={toggleVolumeIcon ? <VolumeIcon /> : <VolumeMuteIcon />}
            onClick={handleMuteButtonClick}
          />
          <VolumeSlider handleVolume={handleVolume} />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer = forwardRef(AudioPlayer);
