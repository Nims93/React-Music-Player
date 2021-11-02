import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import DarkAngel from './media/darkangel.mp3';
import SmoothSoulRnBHipHop from './media/smoothsoulrnbhiphop.mp3';
import ClubFashionHouse from './media/clubfashionhouse.mp3';
import LofiChillx2 from './media/lofichillx2.mp3';
import PixabayMiniPianoArp from './media/pixabay1minpianoarp.mp3';
import Melancholy from './media/melancholy.mp3';
import RelaxedInspiration from './media/relaxedinspiration.mp3';
import NaturesExperiment from './media/theexperiment.mp3';
import Fluidity from './media/tobylane-fluidity.mp3';
import PinaColada from './media/tobylane-pinacolada.mp3';
import MelodicTechno from './media/zenman-melodictechno01.mp3';
import BirthOfAHero from './media/bensound-birthofahero.mp3';
import Dreams from './media/bensound-dreams.mp3';
import GroovyHipHop from './media/bensound-groovyhiphop.mp3';
import SlowMotion from './media/bensound-slowmotion.mp3';

import DarkAngelCover from './media/darkangel.jpg';
import SmoothSoulRnBHipHopCover from './media/smoothsoulrnbhiphop.jpg';
import ClubFashionHouseCover from './media/clubfashionhouse.jpg';
import LofiChillx2Cover from './media/LofiChillx2.jpg';
import PixabayMiniPianoArpCover from './media/pixabay1minpianoarp.jpg';
import MelancholyCover from './media/melancholy.jpg';
import RelaxedInspirationCover from './media/relaxedinspiration.webp';
import NaturesExperimentCover from './media/theexperiment.jpg';
import FluidityCover from './media/fluidity.jpg';
import PinaColadaCover from './media/pinacolada.jpg';
import MelodicTechnoCover from './media/backgroundloopmelodictechno.jpg';
import BirthOfAHeroCover from './media/birthofahero.jpg';
import DreamsCover from './media/dreams.jpg';
import GroovyHipHopCover from './media/groovyhiphop.jpg';
import SlowMotionCover from './media/slowmotion.jpg';

const SONGS = [
  {
    name: 'Club Fashion House',
    songUrl: ClubFashionHouse,
    imgUrl: ClubFashionHouseCover,
    artist: 'Beach Vibes Music',
  },
  {
    name: 'Melodic Techno 01',
    songUrl: MelodicTechno,
    imgUrl: MelodicTechnoCover,
    artist: 'Zen Man',
  },
  {
    name: 'Dark Angel',
    songUrl: DarkAngel,
    imgUrl: DarkAngelCover,
    artist: 'Alex Ortiz Sofield',
  },
  {
    name: 'Smooth Soul',
    songUrl: SmoothSoulRnBHipHop,
    imgUrl: SmoothSoulRnBHipHopCover,
    artist: 'Beach Vibes Music',
  },
  {
    name: 'Lofi Chill x2',
    songUrl: LofiChillx2,
    imgUrl: LofiChillx2Cover,
    artist: 'Ceea Did It',
  },
  {
    name: 'Pixabay 1 Min Piano Arp',
    songUrl: PixabayMiniPianoArp,
    imgUrl: PixabayMiniPianoArpCover,
    artist: 'Deep Music Everyday',
  },
  {
    name: 'Melancholy',
    songUrl: Melancholy,
    imgUrl: MelancholyCover,
    artist: 'Julius H',
  },
  {
    name: 'Relaxed Inspiration',
    songUrl: RelaxedInspiration,
    imgUrl: RelaxedInspirationCover,
    artist: 'Les FM',
  },
  {
    name: 'The Experiment',
    songUrl: NaturesExperiment,
    imgUrl: NaturesExperimentCover,
    artist: 'Natures Eye',
  },
  {
    name: 'Fluidity',
    songUrl: Fluidity,
    imgUrl: FluidityCover,
    artist: 'Tobylane',
  },
  {
    name: 'Pina Colada',
    songUrl: PinaColada,
    imgUrl: PinaColadaCover,
    artist: 'Tobylane',
  },
  {
    name: 'Birth of a Hero',
    songUrl: BirthOfAHero,
    imgUrl: BirthOfAHeroCover,
    artist: 'Bensound',
  },
  {
    name: 'Dreams',
    songUrl: Dreams,
    imgUrl: DreamsCover,
    artist: 'Bensound',
  },
  {
    name: 'Groovy Hip-Hop',
    songUrl: GroovyHipHop,
    imgUrl: GroovyHipHopCover,
    artist: 'Bensound',
  },
  {
    name: 'Slow Motion',
    songUrl: SlowMotion,
    imgUrl: SlowMotionCover,
    artist: 'Bensound',
  },
];

ReactDOM.render(
  <React.StrictMode>
    <App SONGS={SONGS} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
