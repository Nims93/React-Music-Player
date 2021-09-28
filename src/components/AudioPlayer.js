import React, {
  useRef,
  useEffect,
  useReducer,
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
  secondsValue = seconds < 10 ? (secondsValue = '0' + seconds) : (secondsValue = seconds);
  return `${minutes}:${secondsValue}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'play-pause':
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };

    case 'set-track-loaded-state':
      return {
        ...state,
        trackLoaded: action.payload,
      };

    case 'set-track-progress':
      return {
        ...state,
        trackProgress: action.payload,
      };

    case 'unmount-track':
      return {
        ...state,
        trackProgress: 0,
        trackLoaded: false,
      };

    case 'toggle-repeat':
      return {
        ...state,
        repeatSong: !state.repeatSong,
      };

    case 'toggle-mute':
      return {
        ...state,
        isMuted: !state.isMuted,
      };

    default:
      return state;
  }
}

const initialState = {
  trackLoaded: false,
  trackProgress: 0,
  isPlaying: false,
  repeatSong: false,
  isMuted: false,
};

export default forwardRef(function AudioPlayer(props, ref) {
  const audioRef = useRef(new Audio());
  const timeoutRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { trackLoaded, trackProgress, isPlaying, repeatSong, isMuted } = state;
  const { handleNext, handlePrev, track, getTrackProgressComponent } = props;

  useImperativeHandle(ref, () => ({
    //resets trackElapsedTimeComponent when a track is selected from track selector
    //resets track elasped time display when track is selcted from track selector
    unmountTrack: () => dispatch({ type: 'unmount-track' }),
  }));

  const trackTimeElapsedComponent = (
    <AudioTimeDisplay
      className="elapsed-time-wrapper"
      currentTimeElapsed={trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`}
      songLength={
        trackLoaded ? convertToMinsAndSecs(audioRef.current.duration) : `${NaN}`
      }
    />
  );

  //handle track/src switching
  useEffect(() => {
    audioRef.current.src = track;
    const playPromise = audioRef.current.play();
    playPromise &&
      playPromise
        .then(() => {
          !isPlaying && audioRef.current.pause();
          dispatch({ type: 'set-track-loaded-state', payload: true });
        })
        .catch((error) => {});
  }, [track]);

  useEffect(() => {
    if (audioRef.current.ended && repeatSong) {
      dispatch({ type: 'set-track-progress', payload: 0 });
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
        const audioTime = audioRef.current.currentTime;
        dispatch({ type: 'set-track-progress', payload: audioTime });
      }, 500);
    }
  }, [isPlaying, trackProgress, trackLoaded]);

  //sends <AudioTimeDisplay /> component up to App component to be sent back
  //down to artwork display component
  useEffect(() => {
    getTrackProgressComponent(trackTimeElapsedComponent);
  }, [trackProgress, trackLoaded, track]);

  function playPause() {
    if (isPlaying) {
      dispatch({ type: 'play-pause' });
      audioRef.current.pause();
    } else {
      dispatch({ type: 'play-pause' });
      audioRef.current.play();
    }
  }

  function seekMinus10Seconds() {
    if (audioRef.current.currentTime <= 10) {
      audioRef.current.currentTime = 0;
      dispatch({ type: 'set-track-progress', payload: 0 });
    } else {
      const time = audioRef.current.currentTime - 10;
      audioRef.current.currentTime = time;
      dispatch({ type: 'set-track-progress', payload: time });
    }
  }

  function seekPlus10Seconds() {
    if (audioRef.current.duration - audioRef.current.currentTime < 10) {
      const time = audioRef.current.currentTime - 5;
      audioRef.current.currentTime = time;
      dispatch({ type: 'set-track-progress', payload: time });
    } else {
      const time = (audioRef.current.currentTime += 10);
      audioRef.current.currentTime = time;
      dispatch({ type: 'set-track-progress', payload: time });
    }
  }

  function seekBarScrub(mouseDownXCoord, seekBarWidth) {
    const percentage = ((mouseDownXCoord / seekBarWidth) * 100) / 100;
    const newNum = percentage * Math.round(audioRef.current.duration);

    clearTimeout(timeoutRef.current);
    dispatch({ type: 'set-track-progress', payload: newNum });
    audioRef.current.currentTime = newNum;
  }

  function prevSong() {
    if (audioRef.current.currentTime > 7) {
      dispatch({ type: 'set-track-progress', payload: 0 });
      audioRef.current.currentTime = 0;
    } else {
      dispatch({ type: 'unmount-track' });
      clearTimeout(timeoutRef);
      handlePrev();
    }
  }

  function nextSong() {
    dispatch({ type: 'unmount-track' });
    clearTimeout(timeoutRef);
    handleNext();
  }

  function handleVolume(volume) {
    audioRef.current.volume = volume;
  }

  function handleMuteButtonClick() {
    //turn on
    if (isMuted) {
      audioRef.current.muted = false;
      dispatch({ type: 'toggle-mute' });
    }
    //turn off
    else {
      audioRef.current.muted = true;
      dispatch({ type: 'toggle-mute' });
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
          onClick={() => dispatch({ type: 'toggle-repeat' })}
        />

        <div className="playpause-seek-buttons">
          <MediaButton
            className="rewind-10-sec"
            icon={<Rewind10Icon />}
            onClick={seekMinus10Seconds}
          />

          <MediaButton className="prev" icon={<BackwardsIcon />} onClick={prevSong} />

          <MediaButton
            className="play-pause"
            icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={playPause}
          />

          <MediaButton className="next" icon={<ForwardsIcon />} onClick={nextSong} />

          <MediaButton
            className="skip-10-sec"
            icon={<Forwards10Icon />}
            onClick={seekPlus10Seconds}
          />
        </div>
        <div className="volume-controls-wrapper">
          <MediaButton
            className="volume-icon"
            icon={isMuted ? <VolumeMuteIcon /> : <VolumeIcon />}
            onClick={handleMuteButtonClick}
          />
          <VolumeSlider handleVolume={handleVolume} />
        </div>
      </div>
    </div>
  );
});
