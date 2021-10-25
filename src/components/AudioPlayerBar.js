import React from 'react';
import SeekBar from './SeekBar';
import MediaButton from './MediaButton';
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

export default function AudioPlayerBar(props) {
  const {
    playPause,
    isPlaying,
    handleRepeatButtonClick,
    repeatSong,
    handleMuteButtonClick,
    handleVolume,
    isMuted,
    handleNextSong,
    handlePrevSong,
    seekMinus10Seconds,
    seekPlus10Seconds,
    seekBarScrub,
    trackProgress,
    trackLoaded,
    audioRef,
  } = props;

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
          onClick={handleRepeatButtonClick}
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
            onClick={handlePrevSong}
          />

          <MediaButton
            className="play-pause"
            icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={playPause}
          />

          <MediaButton
            className="next"
            icon={<ForwardsIcon />}
            onClick={handleNextSong}
          />

          <MediaButton
            className="skip-10-sec"
            icon={<Forwards10Icon />}
            onClick={seekPlus10Seconds}
          />
        </div>
        <div className="volume-controls-wrapper">
          <MediaButton
            className="volume-icon"
            icon={
              isMuted || audioRef.current.volume === 0 ? (
                <VolumeMuteIcon />
              ) : (
                <VolumeIcon />
              )
            }
            onClick={handleMuteButtonClick}
          />
          <VolumeSlider handleVolume={handleVolume} />
        </div>
      </div>
    </div>
  );
}
