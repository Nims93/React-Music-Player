import React, { useRef, useEffect, useReducer, useCallback } from 'react';
import AudioPlayerBar from './components/AudioPlayerBar';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';

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
  // const timeoutRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [state, dispatch] = useReducer(reducer, initState);
  const { trackLoaded, trackProgress, isPlaying, repeatSong, isMuted, trackIndex } =
    state;

  const trackTotalDuration = audioRef.current.duration;

  const track = SONGS[trackIndex].songUrl;

  function handlePrevSong() {
    if (audioRef.current.currentTime > 7) {
      dispatch({ type: 'set-track-progress', payload: 0 });
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.pause();
      dispatch({ type: 'unmount-track' });
      trackIndex - 1 < 0
        ? dispatch({ type: 'set-track-index', payload: SONGS.length - 1 })
        : dispatch({ type: 'set-track-index', payload: trackIndex - 1 });
    }
  }

  const handleNextSong = useCallback(() => {
    dispatch({ type: 'unmount-track' });
    // trackIndex + 1 > SONGS.length - 1 ? setTrackIndex(0) : setTrackIndex(trackIndex + 1);
    trackIndex + 1 > SONGS.length - 1
      ? dispatch({ type: 'set-track-index', payload: 0 })
      : dispatch({ type: 'set-track-index', payload: trackIndex + 1 });
  }, [SONGS, trackIndex]);

  function handleTrackSelect(idx) {
    if (idx !== trackIndex) {
      dispatch({ type: 'unmount-track' });
      dispatch({ type: 'set-track-index', payload: idx });
    }
  }

  function playPause() {
    //pause
    if (isPlaying) {
      dispatch({ type: 'play/pause' });
      audioRef.current.pause();
    }
    //play
    else {
      audioRef.current
        .play()
        .then(() => {
          dispatch({ type: 'play/pause' });
        })
        .catch((err) => console.error(err));
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

  const seekBarScrub = useCallback((mouseDownXCoord, seekBarWidth) => {
    const percentage = ((mouseDownXCoord / seekBarWidth) * 100) / 100;
    const newNum = percentage * Math.round(audioRef.current.duration);

    dispatch({ type: 'set-track-progress', payload: newNum });
    audioRef.current.currentTime = newNum;
  }, []);

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

  useEffect(() => {
    (async () => {
      audioRef.current.src = track;
      try {
        await audioRef.current.play();
        !isPlaying && audioRef.current.pause();
        dispatch({ type: 'set-track-loaded-state', payload: true });
      } catch (e) {
        console.error(e);
      }
    })();

    const handleTimeUpdate = () => {
      const audioCurrentTimeElapsed = audioRef.current.currentTime;
      dispatch({ type: 'set-track-progress', payload: audioCurrentTimeElapsed });
    };

    const currentlyPlayingAudio = audioRef.current;
    currentlyPlayingAudio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      currentlyPlayingAudio.removeEventListener('timeupdate', handleTimeUpdate);
    };
    // eslint-disable-next-line
  }, [track]);

  useEffect(() => {
    if (audioRef.current.ended && repeatSong) {
      dispatch({ type: 'set-track-progress', payload: 0 });
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current.ended && !repeatSong) {
      handleNextSong();
    }
  }, [trackProgress, repeatSong, handleNextSong]);

  return (
    <div className="App">
      <div className="visualiser-wrapper">
        <ArtworkDisplay
          trackName={SONGS[trackIndex].name}
          trackArtist={SONGS[trackIndex].artist}
          imgUrl={SONGS[trackIndex].imgUrl}
          nextTrackName={nextTrackName(SONGS, trackIndex)}
          nextTrackArtist={nextTrackArtist(SONGS, trackIndex)}
          trackProgress={trackProgress}
          trackTotalDuration={trackTotalDuration}
          trackLoaded={trackLoaded}
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
