import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit,stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'


// Constants
const <%= pascalEntityName %>_FETCH_REQUESTED = '<%= pascalEntityName %>_FETCH_REQUESTED';
const <%= pascalEntityName %>_FETCH_SUCCESSED = '<%= pascalEntityName %>_FETCH_SUCCESSED';
const <%= pascalEntityName %>_FETCH_FAILURE = '<%= pascalEntityName %>_FETCH_FAILURE';


// Actions
function fetch<%= pascalEntityName %>() {
  return {
  type: <%= pascalEntityName %>_FETCH_REQUESTED
}
}

export const actions = {
  fetch<%= pascalEntityName %>,
};

// Action Handlers
const ACTION_HANDLERS = {
  [<%= pascalEntityName %>_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [<%= pascalEntityName %>_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [<%= pascalEntityName %>_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  list: Immutable.fromJS([{key: '001'},]),
});
export default function <%= camelEntityName %>Reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
 function* watchFetch<%= pascalEntityName %>() {
  while (true) {

  yield take(<%= pascalEntityName %>_FETCH_REQUESTED)
  // let {data, err} = yield call(asyncWait)
  // if (!err)

  yield put({type: '<%= pascalEntityName %>_FETCH_SUCCESSED'})
  // else {
  //
  //   yield put({type: '<%= pascalEntityName %>_FETCH_FAILURE', error: err.toString()})
  // }
}
}


export const sagas = [
watchFetch<%= pascalEntityName %>,
];
