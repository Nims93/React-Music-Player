import React, { useState } from 'react';
import AudioPlayer from './components/AudioPlayer';
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

const SONGS = [
  {
    name: 'Castr6 - Untold Stories',
    songUrl: UntoldStories,
    imgUrl: './media/Castr6_-_Untold_Stories.jpg',
  },
  {
    name: 'All That',
    songUrl: AllThat,
    imgUrl: './media/allthat.jpg',
  },
  {
    name: 'Better Days',
    songUrl: BetterDays,
    imgUrl: './media/betterdays.jpg',
  },
  {
    name: 'Birth of a Hero',
    songUrl: BirthOfAHero,
    imgUrl: './media/birthofahero.jpg',
  },
  {
    name: 'Downtown',
    songUrl: Downtown,
    imgUrl: './media/downtown.jpg',
  },
  {
    name: 'Dreams',
    songUrl: Dreams,
    imgUrl: './media/dreams.jpg',
  },
  {
    name: 'Funky Element',
    songUrl: FunkyElement,
    ingUrl: './media/funkyelement.jpg',
  },
  {
    name: 'Groovy Hip-Hop',
    songUrl: GroovyHipHop,
    imgUrl: './media/groovyhiphop.jpg',
  },
  {
    name: 'Instinct',
    songUrl: Instinct,
    imgUrl: './media/instinct.jpg',
  },
  {
    name: 'Moose',
    songUrl: Moose,
    imgUrl: './media/moose.jpg',
  },
  {
    name: 'Slow Motion',
    songUrl: SlowMotion,
    imgUrl: './media/slowmotion.jpg',
  },
];

function App() {
  const [trackIndex, setTrackIndex] = useState(0);
  // console.log(`${SONGS[trackIndex].songUrl}`);

  function handlePrev() {
    console.log('App.js handelPrev called');
    if (trackIndex - 1 < 0) {
      setTrackIndex(SONGS.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  }

  function handleNext() {
    console.log('App.js handleNext called');
    // console.log(SONGS);
    if (trackIndex + 1 > SONGS.length - 1) {
      setTrackIndex(0);
    } else {
      setTrackIndex(trackIndex + 1);
    }
  }

  return (
    <div className="App">
      <AudioPlayer
        handlePrev={handlePrev}
        handleNext={handleNext}
        track={SONGS[trackIndex].songUrl}
      />
    </div>
  );
}

export default App;

// fetch('./../media/Castr6 (Y.ACG) - Untold Stories _ @PacmanTV.mp3').then(
//   (response) => {
//     const blob = new Blob([response.value], { type: 'audio/mp3' });
//     const url = window.URL.createObjectURL(blob);
//     const audio = new Audio(url);
//     console.log(audio);
//   }
// );
