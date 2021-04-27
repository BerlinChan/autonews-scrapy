import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'


// Constants
const Filter_FETCH_REQUESTED = 'Filter_FETCH_REQUESTED';
const Filter_FETCH_SUCCESSED = 'Filter_FETCH_SUCCESSED';
const Filter_FETCH_FAILURE = 'Filter_FETCH_FAILURE';


// Actions
function fetchFilter(filteredList) {
  return {
    type: Filter_FETCH_REQUESTED,
    filteredList,
  }
}

export const actions = {
  fetchFilter,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Filter_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Filter_FETCH_SUCCESSED]: (state, action) => state.setIn(['isFetching'], false)
    .set('filteredList', Immutable.fromJS(action.data)),
  [Filter_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  filteredList: Immutable.List(),
});
export default function filterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchFilter() {
  while (true) {
    const {filteredList} = yield take(Filter_FETCH_REQUESTED);
    const filteredDetail = yield call(request,
      config.API_SERVER + `getFilteredList?id=${filteredList.join(',')}`,
    );
    if (!filteredDetail.err) {
      yield put({type: Filter_FETCH_SUCCESSED, data: filteredDetail.data.data});
    } else {
      yield put({type: Filter_FETCH_FAILURE});
      let errBody = yield filteredDetail.err.response.statusText;
      notification.error({
        message: 'Error',
        description: errBody,
      });
    }
  }
}


export const sagas = [
  watchFetchFilter,
];
