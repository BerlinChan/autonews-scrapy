import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {notification} from 'antd';
import config from '../../../utils/config'
import {setLayouts,setFilteredList} from '../../../redux/Global'

// Constants
const Monitor_FETCH_REQUESTED = 'Monitor_FETCH_REQUESTED';
const Monitor_FETCH_SUCCESSED = 'Monitor_FETCH_SUCCESSED';
const Monitor_FETCH_FAILURE = 'Monitor_FETCH_FAILURE';
const Monitor_ON_destroy = 'Monitor_ON_destroy';


// Actions
function fetchMonitor() {
  return {
    type: Monitor_FETCH_REQUESTED,
  }
}
function onDestroy() {
  return {
    type: Monitor_ON_destroy,
  }
}

export const actions = {
  fetchMonitor,
  onDestroy,
  setLayouts,
  setFilteredList,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Monitor_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Monitor_FETCH_SUCCESSED]: (state, action) => state.set('isFetching', false),
  [Monitor_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [Monitor_ON_destroy]: () => initialState,
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
});
export default function monitorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchMonitor() {
  while (true) {
    yield take(Monitor_FETCH_REQUESTED);

    yield put({type: 'Monitor_FETCH_SUCCESSED'});
  }
}


export const sagas = [
  watchFetchMonitor,
];
