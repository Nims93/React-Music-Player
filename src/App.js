import React, { useRef, useState, useMemo } from 'react';
import AudioPlayer from './components/AudioPlayer';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';

function App({ SONGS }) {
  const [trackIdx, setTrackIndex] = useState(0);
  const [trackTimeElapsedComponent, setTrackTimeElapsedComponent] = useState(null);
  const audioPlayerRef = useRef(null);
  const trackIndex = useMemo(() => trackIdx, [trackIdx]);

  const nextTrackName =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].name : SONGS[trackIndex + 1].name;

  const nextTrackArtist =
    trackIndex + 1 > SONGS.length - 1 ? SONGS[0].artist : SONGS[trackIndex + 1].artist;

  function handlePrev() {
    if (trackIndex - 1 < 0) {
      setTrackIndex(SONGS.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  }

  function handleNext() {
    trackIndex + 1 > SONGS.length - 1 ? setTrackIndex(0) : setTrackIndex(trackIndex + 1);
  }

  function handleTrackSelect(idx) {
    //reset time elasped component to 0
    if (idx !== trackIndex) {
      audioPlayerRef.current.unmountTrack();
      setTrackIndex(idx);
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
