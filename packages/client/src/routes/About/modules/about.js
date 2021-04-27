import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit,stopSubmit} from 'redux-form'
import {message, notification} from 'antd';


// Constants
const About_FETCH_REQUESTED = 'About_FETCH_REQUESTED';
const About_FETCH_SUCCESSED = 'About_FETCH_SUCCESSED';
const About_FETCH_FAILURE = 'About_FETCH_FAILURE';


// Actions
function fetchAbout() {
  return {
  type: About_FETCH_REQUESTED
}
};

export const actions = {
  fetchAbout,
};

// Action Handlers
const ACTION_HANDLERS = {
  [About_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [About_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [About_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  list: Immutable.fromJS([{key: '001'},]),
});
export default function aboutReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}


// Sagas
 function* watchFetchAbout() {
  while (true) {

  yield take(About_FETCH_REQUESTED)
  // let {data, err} = yield call(asyncWait)
  // if (!err)

  yield put({type: 'About_FETCH_SUCCESSED'})
  // else {
  //
  //   yield put({type: 'About_FETCH_FAILURE', error: err.toString()})
  // }
}
}


export const sagas = [
watchFetchAbout,
];
