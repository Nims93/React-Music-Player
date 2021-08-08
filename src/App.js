import React, { useState } from 'react';
import AudioPlayer from './components/AudioPlayer';
import ArtworkDisplay from './components/ArtworkMain';
import TrackListView from './components/TrackListView';

import UntoldStories from './media/Castr6_-_Untold_Stories.mp3';
import AllThat from './media/bensound-allthat.mp3';
import BetterDays from './media/bensound-betterdays.mp3';
import BirthOfAHero from './media/bensound-birthofahero.mp3';
import Downtown from './media/bensound-downtown.mp3';
import Dreams from './media/bensound-dreams.mp3';
import FunkyElement from './media/bensound-funkyelement.mp3';
import GroovyHipHop from './media/bensound-groovyhiphop.mp3';
import Instinct from './media/bensound-instinct.mp3';
import Moose from './media/bensound-moose.mp3';
import SlowMotion from './media/bensound-slowmotion.mp3';

import UntoldStoriesCover from './media/Castr6_-_Untold_Stories.jpg';
import AllThatCover from './media/bensound-allthat.jpg';
import BetterDaysCover from './media/betterdays.jpg';
import BirthOfAHeroCover from './media/birthofahero.jpg';
import DowntownCover from './media/downtown.jpg';
import DreamsCover from './media/dreams.jpg';
import FunkyElementCover from './media/funkyelement.jpg';
import GroovyHipHopCover from './media/groovyhiphop.jpg';
import InstinctCover from './media/instinct.jpg';
import MooseCover from './media/moose.jpg';
import SlowMotionCover from './media/slowmotion.jpg';

const SONGS = [
  {
    name: 'Castr6 - Untold Stories',
    songUrl: UntoldStories,
    imgUrl: UntoldStoriesCover,
  },
  {
    name: 'All That',
    songUrl: AllThat,
    imgUrl: AllThatCover,
  },
  {
    name: 'Better Days',
    songUrl: BetterDays,
    imgUrl: BetterDaysCover,
  },
  {
    name: 'Birth of a Hero',
    songUrl: BirthOfAHero,
    imgUrl: BirthOfAHeroCover,
  },
  {
    name: 'Downtown',
    songUrl: Downtown,
    imgUrl: DowntownCover,
  },
  {
    name: 'Dreams',
    songUrl: Dreams,
    imgUrl: DreamsCover,
  },
  {
    name: 'Funky Element',
    songUrl: FunkyElement,
    imgUrl: FunkyElementCover,
  },
  {
    name: 'Groovy Hip-Hop',
    songUrl: GroovyHipHop,
    imgUrl: GroovyHipHopCover,
  },
  {
    name: 'Instinct',
    songUrl: Instinct,
    imgUrl: InstinctCover,
  },
  {
    name: 'Moose',
    songUrl: Moose,
    imgUrl: MooseCover,
  },
  {
    name: 'Slow Motion',
    songUrl: SlowMotion,
    imgUrl: SlowMotionCover,
  },
];

function App() {
  const [trackIndex, setTrackIndex] = useState(0);
  // console.log(`${SONGS[trackIndex].songUrl}`);
  // function handleTracklistVisibility() {
  //   setTracksVisible(!tracksVisible);
  // }

  function handlePrev() {
    if (trackIndex - 1 < 0) {
      setTrackIndex(SONGS.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  }

  function handleNext() {
    // console.log(SONGS);
    if (trackIndex + 1 > SONGS.length - 1) {
      setTrackIndex(0);
    } else {
      setTrackIndex(trackIndex + 1);
    }
  }

  function handleTrackSelect(idx) {
    setTrackIndex(idx);
  }

  return (
    <div className="App">
      <div className="visualiser-wrapper">
        <ArtworkDisplay
          // handleTracklistVisibility={handleTracklistVisibility}
          trackName={SONGS[trackIndex].name}
          imgUrl={SONGS[trackIndex].imgUrl}
        />
        {/* {tracksVisible && <TrackListView SONGS={SONGS} visible={tracksVisible} />} */}
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
      />
    </div>
  );
}

export default App;
