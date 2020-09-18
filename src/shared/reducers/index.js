
import { combineReducers } from 'redux';
import { CURRENT_TRACK } from '../constants/state';
import currentTrackReducer from './currentTrack';

const rootReducer = combineReducers({
  [CURRENT_TRACK]: currentTrackReducer
});

export default rootReducer;