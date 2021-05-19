import { take, put } from "redux-saga/effects";
import { API_SERVER } from "src/shared/constants/urls";
import { fetchPostApiDataExample } from "../actions/rootAction";
import FetchSendRequest from "src/shared/services/fetchSendRequestService";
import actionTypes from "../types/actionTypes";

const sendRequest = FetchSendRequest.instance;

function* watchFetchUserInfo(): any {
  yield take(actionTypes.GLOBAL_USERINFO_FETCH_REQUESTED);

  const response: any = yield sendRequest.MakeAPICall({
    url: API_SERVER + `/userInfo`,
  });
  if (response) {
    yield put(fetchPostApiDataExample(response));
    yield put({ type: actionTypes.GLOBAL_SET_USERINFO, payload: response });
  }
}
function* watchFetchGlobalOrigin(): any {
  while (true) {
    yield take(actionTypes.GLOBAL_FETCH_origin_REQUESTED);

    //fetch origin list
    const originList: any = yield sendRequest.MakeAPICall({
      url: API_SERVER + `getOrigin`,
    });
    if (originList) {
      yield put({
        type: actionTypes.GLOBAL_FETCH_origin_SUCCESSED,
        payload: originList.data,
      });
      yield put({
        type: actionTypes.GLOBAL_FETCH_userSetting_REQUESTED,
        payload: originList.data,
      });
    }
  }
}
function* watchFetchGlobalUserSetting(): any {
  while (true) {
    const { origin, selectedOriginKeys, showSentimentInspector } = yield take(
      actionTypes.GLOBAL_FETCH_userSetting_REQUESTED
    );
    console.log(
      "🚀 ~ file: apiCallSaga.ts ~ line 44 ~ function*watchFetchGlobalUserSetting ~ origin, selectedOriginKeys, showSentimentInspector",
      origin,
      selectedOriginKeys,
      showSentimentInspector
    );

    // get user setting
    let userSetting = {
      originKeys: JSON.parse(
        localStorage.getItem("userSetting.originKeys") || "{}"
      ),
      layouts: JSON.parse(localStorage.getItem("userSetting.layouts") || "{}"),
      showSentimentInspector: JSON.parse(
        localStorage.getItem("userSetting.showSentimentInspector") || "{}"
      ),
    };

    yield put({
      type: actionTypes.GLOBAL_FETCH_userSetting_SUCCESSED,
      userSetting,
    });
    yield put({
      type: actionTypes.GLOBAL_FETCH_newsList_REQUESTED,
      originKeys: userSetting.originKeys,
    });
  }
}
function* watchFetchGlobalNewsList(): any {
  while (true) {
    const { originKeys } = yield take(
      actionTypes.GLOBAL_FETCH_newsList_REQUESTED
    );

    //fetch today news list with origin
    if (originKeys && originKeys.length) {
      const listResults = yield originKeys.map((item: any) =>
        sendRequest.MakeAPICall({
          url: API_SERVER + `getTodayList?origin_key=${item}`,
        })
      );
      if (listResults && listResults.length) {
        yield listResults.map((item: any, index: number) => {
          return put({
            type: actionTypes.GLOBAL_FETCH_newsList_SUCCESSED,
            origin: originKeys[index],
            data: item.data,
          });
        });
      }
    }
  }
}
function* watchSetLayouts(): any {
  while (true) {
    const { layouts } = yield take(actionTypes.GLOBAL_SET_layouts);

    if (layouts.md.length)
      localStorage.setItem("userSetting.layouts", JSON.stringify(layouts));
  }
}

const globalSaga = [
  watchFetchUserInfo(),
  watchFetchGlobalOrigin(),
  watchFetchGlobalUserSetting(),
  watchFetchGlobalNewsList(),
  watchSetLayouts(),
];

export default globalSaga;
