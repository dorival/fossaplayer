import {
  NEXT_SONG,
  PAUSE_SONG,
  PLAY_SONG,
  PREVIOUS_SONG,
  SEEK_BACKWARDS,
  SEEK_FORWARDS,
  SEEK_POSITION
} from '../constants/action-types';
import { PLAYBACK_PAUSED } from '../constants/playback-status';

const initialState = {
  hash: '',
  title: '',
  volume: 0,
  artist: '',
  coverUri: '',
  sizeBytes: 0,
  favorite: false,
  bufferedBytes: 0,
  playbackSeconds: 0,
  playbackStatus: '',
};

export default function currentTrackReducer(state = initialState, action) {
  switch(action.type){
    case PLAY_SONG:
      return {
        ...state,
        ...action
      };
    case PAUSE_SONG:
      return {
        ...state,
        playbackStatus: PLAYBACK_PAUSED
      };
    case NEXT_SONG:
      return {
        ...state,
        ...action
      };
    case PREVIOUS_SONG:
      return {
        ...state,
        ...action
      };
    case SEEK_POSITION:
    case SEEK_FORWARDS:
    case SEEK_BACKWARDS:
      return {
        ...state,
        ...action.playbackSeconds
      };
    default:
      return state;
  }
}