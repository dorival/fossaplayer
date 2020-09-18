import { PAUSE_SONG, PLAY_SONG } from '../../shared/constants/action-types';

export function playAudio(audio) {
  return {
    type: PLAY_SONG,
    audio
  }
}

export function pauseAudio() {
  return {
    type: PAUSE_SONG
  }
}