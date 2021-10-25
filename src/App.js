import React, { useRef, useEffect, useReducer, useState, useMemo } from 'react';
import AudioPlayer from './components/AudioPlayer';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';
import AudioTimeDisplay from './components/AudioTimeDisplay';

function convertToMinsAndSecs(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  let secondsValue;
  secondsValue = seconds < 10 ? (secondsValue = '0' + seconds) : (secondsValue = seconds);
  return `${minutes}:${secondsValue}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'play/pause':
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
        isMuted: action?.payload || !state.isMuted,
      };

    case 'set-track-index':
      return {
        ...state,
        trackIndex: action.payload,
      };

    default:
      return state;
  }
}

const initState = {
  trackLoaded: false,
  trackProgress: 0,
  isPlaying: false,
  repeatSong: false,
  isMuted: false,
  trackIndex: 0,
};

function App({ SONGS }) {
  const audioRef = useRef(new Audio());
  const timeoutRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initState);
  const { trackLoaded, trackProgress, isPlaying, repeatSong, isMuted, trackIndex } =
    state;
  const [trackIdx, setTrackIndex] = useState(0);
  // const [trackTimeElapsedComponent, setTrackTimeElapsedComponent] = useState(null);
  const audioPlayerRef = useRef(null);
  // const trackIndex = useMemo(() => trackIdx, [trackIdx]);

  const trackTimeElapsedComponent = (
    <AudioTimeDisplay
      className="elapsed-time-wrapper"
      currentTimeElapsed={trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`}
      songLength={
        trackLoaded ? convertToMinsAndSecs(audioRef.current.duration) : `${NaN}`
      }
    />
  );
  console.log('App component rerender');
  const track = useMemo(() => SONGS[trackIndex].songUrl, [SONGS, trackIndex]);

  const nextTrackName =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].name : SONGS[trackIndex + 1].name;

  const nextTrackArtist =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].artist : SONGS[trackIndex + 1].artist;

  //handle track/src change
  useEffect(() => {
    audioRef.current.src = track;
    const playPromise = audioRef.current.play();
    playPromise &&
      playPromise
        .then(() => {
          !isPlaying && audioRef.current.pause();
          dispatch({ type: 'set-track-loaded-state', payload: true });
        })
        .catch((e) => {});
  }, [track]);

  useEffect(() => {
    if (audioRef.current.ended && repeatSong) {
      dispatch({ type: 'set-track-progress', payload: 0 });
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current.ended && !repeatSong) {
      handleNextSong();
    }
  }, [trackProgress, repeatSong]);

  //timeout callback for tracking current elapsed track time.
  //called whenever that track plays and when elapsed track time changes
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        const audioCurrentTimeElapsed = audioRef.current.currentTime;
        dispatch({ type: 'set-track-progress', payload: audioCurrentTimeElapsed });
      }, 500);
    }
  }, [isPlaying, trackProgress, trackLoaded]);

  function handlePrevSong() {
    if (audioRef.current.currentTime > 7) {
      dispatch({ type: 'set-track-progress', payload: 0 });
      audioRef.current.currentTime = 0;
    } else {
      dispatch({ type: 'unmount-track' });
      clearTimeout(timeoutRef);
      trackIndex - 1 < 0
        ? dispatch({ type: 'set-track-index', payload: SONGS.length - 1 })
        : dispatch({ type: 'set-track-index', payload: trackIndex - 1 });
    }
  }

  function handleNextSong() {
    dispatch({ type: 'unmount-track' });
    clearTimeout(timeoutRef);
    // trackIndex + 1 > SONGS.length - 1 ? setTrackIndex(0) : setTrackIndex(trackIndex + 1);
    trackIndex + 1 > SONGS.length - 1
      ? dispatch({ type: 'set-track-index', payload: 0 })
      : dispatch({ type: 'set-track-index', payload: trackIndex + 1 });
  }

  function handleTrackSelect(idx) {
    //reset time elasped component to 0
    if (idx !== trackIndex) {
      audioPlayerRef.current.unmountTrack();
      // setTrackIndex(idx);
      dispatch({ type: 'set-track-index', payload: idx });
    }
  }

  function playPause() {
    if (isPlaying) {
      dispatch({ type: 'play/pause' });
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => {
          dispatch({ type: 'play/pause' });
        })
        .catch((err) => console.log(err));
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
      if (repeatSong) {
        dispatch({ type: 'set-track-progress', payload: 0 });
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        handleNextSong();
      }
    } else {
      const time = (audioRef.current.currentTime += 10);
      audioRef.current.currentTime = time;
      dispatch({ type: 'set-track-progress', payload: time });
    }
  }

  function handleVolume(volume) {
    audioRef.current.volume = volume;
  }

  function handleMuteButtonClick() {
    //mute
    if (isMuted) {
      audioRef.current.muted = false;
      dispatch({ type: 'toggle-mute' });
    }
    //unmute
    else {
      audioRef.current.muted = true;
      dispatch({ type: 'toggle-mute' });
    }
  }

  function handleRepeatButtonClick() {
    dispatch({ type: 'toggle-repeat' });
  }

  // function getTrackProgressComponent(AudioDislayComponent) {
  //   setTrackTimeElapsedComponent(AudioDislayComponent);
  // }

  return (
    <div className="App">
      <div className="visualiser-wrapper">
        <ArtworkDisplay
          trackName={SONGS[trackIndex].name}
          trackArtist={SONGS[trackIndex].artist}
          imgUrl={SONGS[trackIndex].imgUrl}
          nextTrackName={nextTrackName}
          nextTrackArtist={nextTrackArtist}
          trackDurationComponent={trackTimeElapsedComponent}
        />

        <TrackListView
          SONGS={SONGS}
          trackIndex={trackIndex}
          handleTrackSelect={handleTrackSelect}
        />
      </div>

      <AudioPlayer
        playPause={playPause}
        isPlaying={isPlaying}
        handleRepeatButtonClick={handleRepeatButtonClick}
        repeatSong={repeatSong}
        handleMuteButtonClick={handleMuteButtonClick}
        handleVolume={handleVolume}
        isMuted={isMuted}
        handlePrevSong={handlePrevSong}
        handleNextSong={handleNextSong}
        seekMinus10Seconds={seekMinus10Seconds}
        seekPlus10Seconds={seekPlus10Seconds}
        audioRef={audioRef}
        track={SONGS[trackIndex].songUrl}
        // getTrackProgressComponent={getTrackProgressComponent}
        ref={audioPlayerRef}
      />
    </div>
  );
}

export default App;
