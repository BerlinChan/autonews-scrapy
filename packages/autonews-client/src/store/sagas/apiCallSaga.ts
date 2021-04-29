import {take, takeLatest, put } from "redux-saga/effects";
import {
  GET_JSON_PLACEHOLDER_URL,
  POST_JSON_PLACEHOLDER_URL,
  API_SERVER
} from "src/shared/constants/urls";
import {
  fetchGetApiDataExample,
  fetchPostApiDataExample,
} from "../actions/rootAction";
import FetchSendRequest from "src/shared/services/fetchSendRequestService";
import actionTypes from "../types/actionTypes";

const sendRequest = FetchSendRequest.instance;

export function* watchFetchUserInfo(): any  {
  yield take(actionTypes.GLOBAL_USERINFO_FETCH_REQUESTED)

    const response: any = yield sendRequest.MakeAPICall({
      url: API_SERVER+`/userInfo`,
    });
    if (response) {
      yield put(fetchPostApiDataExample(response));
      yield put({type: actionTypes.GLOBAL_SET_USERINFO, data: response});
    }
}
export function* watchFetchGlobalOrigin(): any  {
  while (true) {
    yield take(actionTypes.GLOBAL_FETCH_origin_REQUESTED);

    //fetch origin list
    const originList: any = yield sendRequest.MakeAPICall({
      url: API_SERVER + `getOrigin`,
    });
    if (originList) {
      yield put({type: actionTypes.GLOBAL_FETCH_origin_SUCCESSED, data: originList.data.data});
      yield put({type: actionTypes.GLOBAL_FETCH_userSetting_REQUESTED, origin: originList.data.data});
    } 
  }
}
export function* watchFetchGlobalUserSetting() : any {
  while (true) {
    const {origin, selectedOriginKeys, showSentimentInspector} = yield take(actionTypes.GLOBAL_FETCH_userSetting_REQUESTED);
    console.log("🚀 ~ file: apiCallSaga.ts ~ line 44 ~ function*watchFetchGlobalUserSetting ~ origin, selectedOriginKeys, showSentimentInspector", origin, selectedOriginKeys, showSentimentInspector)

    // get user setting
    let userSetting = {
      originKeys: JSON.parse(localStorage.getItem('userSetting.originKeys')||"{}"),
      layouts: JSON.parse(localStorage.getItem('userSetting.layouts')||"{}"),
      showSentimentInspector: JSON.parse(localStorage.getItem('userSetting.showSentimentInspector')||"{}"),
    };

    yield put({type: actionTypes.GLOBAL_FETCH_userSetting_SUCCESSED, userSetting});
    yield put({type: actionTypes.GLOBAL_FETCH_newsList_REQUESTED, originKeys: userSetting.originKeys});
  }
}
export function* watchFetchGlobalNewsList() : any {
  while (true) {
    const {originKeys} = yield take(actionTypes.GLOBAL_FETCH_newsList_REQUESTED);

    //fetch today news list with origin
    if (originKeys && originKeys.length) {
      const listResults = yield originKeys.map((item:any) => sendRequest.MakeAPICall({url:
        API_SERVER + `getTodayList?origin_key=${item}`,}
      ));
      if (listResults && listResults.length) {
        yield listResults.map((item:any, index:number) => {
          if (item) {
            return put({type: actionTypes.GLOBAL_FETCH_newsList_SUCCESSED, origin: originKeys[index], data: item.data.data});
          } 
        });
      }
    }
  }
}
export function* watchSetLayouts() : any {
  while (true) {
    const {layouts} = yield take(actionTypes.GLOBAL_SET_layouts);

    if (layouts.md.length)
      localStorage.setItem('userSetting.layouts', JSON.stringify(layouts));
  }
}

function* getAPICallSagaExample(): any {
  const response: any = yield sendRequest.MakeAPICall({
    url: GET_JSON_PLACEHOLDER_URL,
  });
  if (response) {
    yield put(fetchGetApiDataExample(response));
  }
}

function* postAPICallSagaExample({ payload }: any): Generator {
  try {
    const response: any = yield sendRequest.MakeAPICall({
      url: POST_JSON_PLACEHOLDER_URL,
      body: payload,
    });
    if (response) {
      yield put(fetchPostApiDataExample(response));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* watchApiCallSagaExample(): any {
  yield takeLatest(actionTypes.GET_API_CALL, getAPICallSagaExample);
  yield takeLatest(actionTypes.POST_API_CALL, postAPICallSagaExample);
}

export default watchApiCallSagaExample;
