import React, { useRef, useEffect, useReducer, useMemo } from 'react';
import AudioPlayerBar from './components/AudioPlayerBar';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';
import AudioTimeDisplay from './components/AudioTimeDisplay';

const convertToMinsAndSecs = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const secondsValue = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes}:${secondsValue}`;
};

const nextTrackName = (SONGS, currIdx) =>
  currIdx + 1 > SONGS.length - 1 ? SONGS[0].name : SONGS[currIdx + 1].name;

const nextTrackArtist = (SONGS, currIdx) =>
  currIdx + 1 > SONGS.length - 1 ? SONGS[0].artist : SONGS[currIdx + 1].artist;

const reducer = (state, action) => {
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
};

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

  const trackTimeElapsedComponent = (
    <AudioTimeDisplay
      className="elapsed-time-wrapper"
      currentTimeElapsed={trackLoaded ? convertToMinsAndSecs(trackProgress) : `${NaN}`}
      songLength={
        trackLoaded ? convertToMinsAndSecs(audioRef.current.duration) : `${NaN}`
      }
    />
  );
  // console.log('App component rerender');
  const track = SONGS[trackIndex].songUrl;

  useEffect(() => {
    audioRef.current.src = track;
    const playPromise = audioRef.current.play();
    playPromise &&
      playPromise
        .then(() => {
          console.log('callback');
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
        console.log('timeout callback');
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
      audioRef.current.pause();
      dispatch({ type: 'unmount-track' });
      clearTimeout(timeoutRef);
      trackIndex - 1 < 0
        ? dispatch({ type: 'set-track-index', payload: SONGS.length - 1 })
        : dispatch({ type: 'set-track-index', payload: trackIndex - 1 });
    }
  }

  function handleNextSong() {
    audioRef.current.pause();

    dispatch({ type: 'unmount-track' });
    clearTimeout(timeoutRef);
    // trackIndex + 1 > SONGS.length - 1 ? setTrackIndex(0) : setTrackIndex(trackIndex + 1);
    trackIndex + 1 > SONGS.length - 1
      ? dispatch({ type: 'set-track-index', payload: 0 })
      : dispatch({ type: 'set-track-index', payload: trackIndex + 1 });
  }

  function handleTrackSelect(idx) {
    if (idx !== trackIndex) {
      dispatch({ type: 'unmount-track' });
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

  function seekBarScrub(mouseDownXCoord, seekBarWidth) {
    const percentage = ((mouseDownXCoord / seekBarWidth) * 100) / 100;
    const newNum = percentage * Math.round(audioRef.current.duration);

    clearTimeout(timeoutRef.current);
    dispatch({ type: 'set-track-progress', payload: newNum });
    audioRef.current.currentTime = newNum;
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

  return (
    <div className="App">
      <div className="visualiser-wrapper">
        <ArtworkDisplay
          trackName={SONGS[trackIndex].name}
          trackArtist={SONGS[trackIndex].artist}
          imgUrl={SONGS[trackIndex].imgUrl}
          nextTrackName={nextTrackName(SONGS, trackIndex)}
          nextTrackArtist={nextTrackArtist(SONGS, trackIndex)}
          trackDurationComponent={trackTimeElapsedComponent}
        />

        <TrackListView
          SONGS={SONGS}
          trackIndex={trackIndex}
          handleTrackSelect={handleTrackSelect}
        />
      </div>

      <AudioPlayerBar
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
        seekBarScrub={seekBarScrub}
        trackProgress={trackProgress}
        trackLoaded={trackLoaded}
        audioRef={audioRef}
        track={SONGS[trackIndex].songUrl}
      />
    </div>
  );
}

export default App;
