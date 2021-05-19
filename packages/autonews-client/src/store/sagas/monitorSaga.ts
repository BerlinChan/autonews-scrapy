import { take, put } from "redux-saga/effects";
import actionTypes from "../types/actionTypes";

function* watchFetchMonitor() {
  while (true) {
    yield take(actionTypes.Monitor_FETCH_REQUESTED);

    yield put({ type: actionTypes.Monitor_FETCH_SUCCESSED });
  }
}

const monitorSaga = [watchFetchMonitor()];

export default monitorSaga;
