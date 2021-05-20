import { take, put, select } from "redux-saga/effects";
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
        payload: { origin: originList.data },
      });
    }
  }
}
function* watchFetchGlobalUserSetting(): any {
  while (true) {
    const {
      payload: { origin, selectedOriginKeys, showSentimentInspector },
    } = yield take(actionTypes.GLOBAL_FETCH_userSetting_REQUESTED);

    // get user setting
    let userSetting = {
      originKeys: JSON.parse(
        localStorage.getItem("userSetting.originKeys") || "[]"
      ),
      layouts: JSON.parse(localStorage.getItem("userSetting.layouts") || "{}"),
      showSentimentInspector: JSON.parse(
        localStorage.getItem("userSetting.showSentimentInspector") || "{}"
      ),
    };
    if (!userSetting.originKeys.length) {
      // no localStorage data, save default to it
      const { root } = yield select();
      const { gridCols, monitorWidth, monitorHeight } = root.gridLayoutConfig;
      userSetting = {
        originKeys: selectedOriginKeys
          ? selectedOriginKeys
          : origin.slice(0, 8).map((item: any) => item.key),
        layouts: { lg: [], md: [], sm: [], xs: [] },
        showSentimentInspector: showSentimentInspector,
      };
      for (let i in userSetting.layouts) {
        let currentX = 0;
        let currentY = 0;
        for (let j = 0; j < userSetting.originKeys.length; j++) {
          let colsPerRow = gridCols[i] / monitorWidth[i];
          userSetting.layouts[i].push({
            i: userSetting.originKeys[j],
            x: currentX * monitorWidth[i],
            y: currentY * monitorHeight[i],
            w: monitorWidth[i],
            h: monitorHeight[i],
            minW: monitorWidth[i],
            minH: 2,
          });
          if (currentX >= colsPerRow - 1) {
            currentX = 0;
            currentY += 1;
          } else {
            currentX += 1;
          }
        }
      }
      localStorage.setItem(
        "userSetting.originKeys",
        JSON.stringify(userSetting.originKeys)
      );
      localStorage.setItem(
        "userSetting.layouts",
        JSON.stringify(userSetting.layouts)
      );
      localStorage.setItem("userSetting.showSentimentInspector", "true");
    }

    yield put({
      type: actionTypes.GLOBAL_FETCH_userSetting_SUCCESSED,
      payload: userSetting,
    });
    yield put({
      type: actionTypes.GLOBAL_FETCH_newsList_REQUESTED,
      payload: userSetting.originKeys,
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
            payload: { origin: originKeys[index], data: item.data },
          });
        });
      }
    }
  }
}
function* watchSetLayouts(): any {
  while (true) {
    const { payload: layouts } = yield take(actionTypes.GLOBAL_SET_layouts);

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
