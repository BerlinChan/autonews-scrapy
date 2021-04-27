import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'
import {fetchGlobalOrigin, fetchGlobalUserSetting, setShowSentimentInspector} from '../../../redux/Global'


// Constants
const Setting_FETCH_REQUESTED = 'Setting_FETCH_REQUESTED';
const Setting_FETCH_SUCCESSED = 'Setting_FETCH_SUCCESSED';
const Setting_FETCH_FAILURE = 'Setting_FETCH_FAILURE';
const Setting_ON_submitForm_REQUESTED = 'Setting_ON_submitForm_REQUESTED';
const Setting_ON_resetDefault_REQUESTED = 'Setting_ON_resetDefault_REQUESTED';
const Setting_ON_destroy = 'Setting_ON_destroy';


// Actions
function fetchSetting() {
  return {
    type: Setting_FETCH_REQUESTED
  }
}
function onSubmitForm(value) {
  return {
    type: Setting_ON_submitForm_REQUESTED,
    value,
  }
}
function onResetDefault() {
  return {
    type: Setting_ON_resetDefault_REQUESTED,
  }
}
function onDestroy() {
  return {
    type: Setting_ON_destroy,
  }
}

export const actions = {
  fetchSetting,
  onSubmitForm,
  onDestroy,
  onResetDefault,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Setting_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Setting_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [Setting_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [Setting_ON_destroy]: () => initialState,
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
});
export default function settingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchSetting() {
  while (true) {
    yield take(Setting_FETCH_REQUESTED);
    const {global} = yield select();


    yield put({type: 'Setting_FETCH_SUCCESSED'})
  }
}
function* watchOnSubmitForm() {
  while (true) {
    const {value} = yield take(Setting_ON_submitForm_REQUESTED);

    yield put(startSubmit('settingForm'));
    localStorage.removeItem('userSetting.originKeys');
    localStorage.removeItem('userSetting.layouts');
    yield put(fetchGlobalUserSetting(null, value.selectedOriginKeys, value.sentimentInspector));
    yield put(setShowSentimentInspector(value.sentimentInspector));
    yield put(stopSubmit('settingForm'));
  }
}
function* watchOnResetDefault() {
  while (true) {
    yield take(Setting_ON_resetDefault_REQUESTED);

    yield put(startSubmit('settingForm'));
    localStorage.removeItem('userSetting.originKeys');
    localStorage.removeItem('userSetting.layouts');
    yield put(fetchGlobalOrigin());
    yield put(stopSubmit('settingForm'));
  }
}


export const sagas = [
  watchFetchSetting,
  watchOnSubmitForm,
  watchOnResetDefault,
];
