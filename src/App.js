import React, { useRef, useReducer, useState, useMemo } from 'react';
import AudioPlayer from './components/AudioPlayer';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';

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
        isPlaying: action?.payload || !state.isPlaying,
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

const initialState = {
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { trackLoaded, trackProgress, isPlaying, repeatSong, isMuted, trackIndex } =
    state;
  const [trackIdx, setTrackIndex] = useState(0);
  const [trackTimeElapsedComponent, setTrackTimeElapsedComponent] = useState(null);
  const audioPlayerRef = useRef(null);
  // const trackIndex = useMemo(() => trackIdx, [trackIdx]);

  const nextTrackName =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].name : SONGS[trackIndex + 1].name;

  const nextTrackArtist =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].artist : SONGS[trackIndex + 1].artist;

  function handlePrev() {
    if (trackIndex - 1 < 0) {
      // setTrackIndex(SONGS.length - 1);
      dispatch({ type: 'set-track-index', payload: SONGS.length - 1 });
    } else {
      // setTrackIndex(trackIndex - 1);
      dispatch({ type: 'set-track-index', payload: trackIndex - 1 });
    }
  }

  function handleNext() {
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

  function getTrackProgressComponent(AudioDislayComponent) {
    setTrackTimeElapsedComponent(AudioDislayComponent);
  }

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
        handlePrev={handlePrev}
        handleNext={handleNext}
        track={SONGS[trackIndex].songUrl}
        getTrackProgressComponent={getTrackProgressComponent}
        ref={audioPlayerRef}
      />
    </div>
  );
}

export default App;
