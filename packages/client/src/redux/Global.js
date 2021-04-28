import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import config from '../utils/config'
import cookie from 'react-cookie'
import {notification} from 'antd';
import moment from 'moment'

// Constants
const GLOBAL_SET_USERINFO = 'GLOBAL_SET_USERINFO';
const GLOBAL_USERINFO_FETCH_REQUESTED = 'GLOBAL_USERINFO_FETCH_REQUESTED';
const socket_Global_SET_clientCount = 'socket_Global_SET_clientCount';
const socket_Global_SET_SOCKET_STATUS = 'socket_Global_SET_SOCKET_STATUS';
const socket_global_ON_News_Added = 'socket_global_ON_News_Added';
const GLOBAL_FETCH_origin_REQUESTED = 'GLOBAL_FETCH_origin_REQUESTED';
const GLOBAL_FETCH_origin_SUCCESSED = 'GLOBAL_FETCH_origin_SUCCESSED';
const GLOBAL_FETCH_newsList_REQUESTED = 'GLOBAL_FETCH_newsList_REQUESTED';
const GLOBAL_FETCH_newsList_SUCCESSED = 'GLOBAL_FETCH_newsList_SUCCESSED';
const GLOBAL_FETCH_userSetting_REQUESTED = 'GLOBAL_FETCH_userSetting_REQUESTED';
const GLOBAL_FETCH_userSetting_SUCCESSED = 'GLOBAL_FETCH_userSetting_SUCCESSED';
const GLOBAL_SET_layouts = 'GLOBAL_SET_layouts';
const GLOBAL_SET_filteredList = 'GLOBAL_SET_filteredList';
const GLOBAL_SET_showSentimentInspector = 'GLOBAL_SET_showSentimentInspector';


export function setUserinfo(userInfo) {
  return {
    type: GLOBAL_SET_USERINFO,
    payload: userInfo
  }
}
export function fetchGlobalOrigin() {
  return {
    type: GLOBAL_FETCH_origin_REQUESTED,
  }
}
export function fetchGlobalUserSetting(origin, selectedOriginKeys, showSentimentInspector = true) {
  return {
    type: GLOBAL_FETCH_userSetting_REQUESTED,
    origin, selectedOriginKeys, showSentimentInspector
  }
}
export function fetchGlobalNewsList(originKeys) {
  return {
    type: GLOBAL_FETCH_newsList_REQUESTED,
    originKeys,
  }
}
export function setLayouts(layouts) {
  return {
    type: GLOBAL_SET_layouts,
    layouts,
  }
}
export function setFilteredList(item) {
  return {
    type: GLOBAL_SET_filteredList,
    item,
  }
}
export function setShowSentimentInspector(status) {
  return {
    type: GLOBAL_SET_showSentimentInspector,
    status,
  }
}

// Actions
export const actions = {
  setUserinfo,
  fetchGlobalOrigin,
  fetchGlobalUserSetting,
  fetchGlobalNewsList,
  setLayouts,
  setFilteredList,
  setShowSentimentInspector,
};

// Action Handlers
const ACTION_HANDLERS = {
  [GLOBAL_SET_USERINFO]: (state, payload) => {
    cookie.save('userInfo', payload.data, {path: '/'});
    return state.setIn(['userInfo'], Immutable.fromJS(payload.data));
  },
  [socket_Global_SET_clientCount]: (state, action) => state.set('clientCount', action.data),
  [socket_Global_SET_SOCKET_STATUS]: (state, action) => state.set('socketConnectStatus', action.data),
  [socket_global_ON_News_Added]: (state, action) => {
    if (state.getIn(['newsList', action.data.origin_key])) {
      let newList = state.getIn(['newsList', action.data.origin_key, 'list']).toJS();
      newList.unshift(action.data);

      return state.setIn(['newsList', action.data.origin_key, 'list'], Immutable.fromJS(newList));
    } else {
      return state;
    }
  },
  [GLOBAL_FETCH_userSetting_SUCCESSED]: (state, action) => {
    //init newsList
    const origin = state.get('origin').toJS();
    let tempNewsList = {};
    action.userSetting.originKeys.length &&
    action.userSetting.originKeys.forEach((item, index) => {
      const currentOriginItem = origin.find(originItem => originItem.key === item);
      tempNewsList[item] = {
        origin_name: currentOriginItem ? currentOriginItem.name : '',
        list: [], isFetched: false,
      };
    });

    return state.set('userSetting', Immutable.fromJS(action.userSetting))
      .set('newsList', Immutable.fromJS(tempNewsList));
  },
  [GLOBAL_FETCH_origin_SUCCESSED]: (state, action) => state.set('origin', Immutable.fromJS(action.data)),
  [GLOBAL_FETCH_newsList_SUCCESSED]: (state, action) => {
    let tempList = state.getIn(['newsList', action.origin, 'list']).toJS();
    tempList = tempList.concat(action.data);

    return state.setIn(['newsList', action.origin, 'list'], Immutable.fromJS(tempList))
      .setIn(['newsList', action.origin, 'isFetched'], true);
  },
  [GLOBAL_SET_layouts]: (state, action) => {
    if (action.layouts.md.length) {
      return state.setIn(['userSetting', 'layouts'], Immutable.fromJS(action.layouts));
    } else {
      return state;
    }
  },
  [GLOBAL_SET_filteredList]: (state, action) => {
    let tempList = state.get('filteredList').toJS();
    if (tempList.findIndex(i => i === action.item) > -1) {
      tempList = tempList.filter(i => i !== action.item);
    }
    else {
      tempList.push(action.item);
    }

    return state.set('filteredList', Immutable.fromJS(tempList));
  },
  [GLOBAL_SET_showSentimentInspector]: (state, action) => {
    localStorage.setItem('userSetting.showSentimentInspector', action.status);

    return state.setIn(['userSetting', 'showSentimentInspector'], action.status)
  },
};

// Reducer
const initialState = Immutable.Map({
  userInfo: Immutable.Map(),
  clientCount: 0,//客户端连接数
  socketConnectStatus: 'disconnect',//[disconnect | connect]
  gridLayoutConfig: Immutable.fromJS({
    breakpoints: {lg: 1440, md: 1024, sm: 425, xs: 0},
    gridCols: {lg: 12, md: 12, sm: 6, xs: 2},//grid cols, 栅格列数
    monitorWidth: {lg: 3, md: 4, sm: 3, xs: 2},//每监视器栅格宽
    monitorHeight: {lg: 2, md: 2, sm: 2, xs: 2},//每监视器栅格高
  }),
  origin: Immutable.List(
    /* [
     {"_id": "58caa435de0f2f724e27148", "key": "ctdsb", "name": "楚天都市报"},
     ] */
  ),
  userSetting: Immutable.fromJS({
    //默认值在 saga-watchFetchGlobalUserSetting 中生成
    originKeys: [],// 已监控的keys
    layouts: {},// monitor layout
    showSentimentInspector: true,// 是否显示情感评价指示器
  }),
  newsList: Immutable.fromJS({
    /*'ctdsb': {
     origin_name: '楚天都市报',
     isFetched: false,
     list: [
     {title: 'title', url: 'url', origin_key: 'origin', date: new Date()},
     ]
     },*/
  }),
  filteredList: Immutable.List(),//
});
export default function globalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchUserInfo() {
  yield take(GLOBAL_USERINFO_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.API_SERVER + `/userInfo`
  );
  if (!err)
    yield put({type: GLOBAL_SET_USERINFO, data: data});
}
function* watchFetchGlobalOrigin() {
  while (true) {
    yield take(GLOBAL_FETCH_origin_REQUESTED);

    //fetch origin list
    const originList = yield call(request,
      config.API_SERVER + `getOrigin`,
    );
    if (!originList.err) {
      yield put({type: GLOBAL_FETCH_origin_SUCCESSED, data: originList.data.data});
      yield put({type: GLOBAL_FETCH_userSetting_REQUESTED, origin: originList.data.data});
    } else {
      let errBody = yield originList.err.response.json();
      notification.error({
        message: 'Error',
        description: errBody.msg,
      });
    }
  }
}
function* watchFetchGlobalUserSetting() {
  while (true) {
    const {origin, selectedOriginKeys, showSentimentInspector} = yield take(GLOBAL_FETCH_userSetting_REQUESTED);

    // get user setting
    let userSetting = {
      originKeys: JSON.parse(localStorage.getItem('userSetting.originKeys')),
      layouts: JSON.parse(localStorage.getItem('userSetting.layouts')),
      showSentimentInspector: JSON.parse(localStorage.getItem('userSetting.showSentimentInspector')),
    };
    if (!userSetting.originKeys) {
      // no localStorage data, save default to it
      const {global} = yield select();
      const {gridCols, monitorWidth, monitorHeight} = global.get('gridLayoutConfig').toJS();
      userSetting = {
        originKeys: selectedOriginKeys ? selectedOriginKeys : origin.slice(0, 8).map(item => item.key),
        layouts: {lg: [], md: [], sm: [], xs: []},
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
      localStorage.setItem('userSetting.originKeys', JSON.stringify(userSetting.originKeys));
      localStorage.setItem('userSetting.layouts', JSON.stringify(userSetting.layouts));
      localStorage.setItem('userSetting.showSentimentInspector', true);
    }

    yield put({type: GLOBAL_FETCH_userSetting_SUCCESSED, userSetting});
    yield put({type: GLOBAL_FETCH_newsList_REQUESTED, originKeys: userSetting.originKeys});
  }
}
function* watchFetchGlobalNewsList() {
  while (true) {
    const {originKeys} = yield take(GLOBAL_FETCH_newsList_REQUESTED);

    //fetch today news list with origin
    if (originKeys && originKeys.length) {
      const listResults = yield originKeys.map(item => call(request,
        config.API_SERVER + `getTodayList?origin_key=${item}`,
      ));
      if (listResults && listResults.length) {
        yield listResults.map((item, index) => {
          if (!item.err) {
            return put({type: GLOBAL_FETCH_newsList_SUCCESSED, origin: originKeys[index], data: item.data.data});
          } else {
            let errBody = item.err.response.json();
            return notification.error({
              message: 'Error',
              description: errBody.msg,
            });
          }
        });
      }
    }
  }
}
function* watchSetLayouts() {
  while (true) {
    const {layouts} = yield take(GLOBAL_SET_layouts);

    if (layouts.md.length)
      localStorage.setItem('userSetting.layouts', JSON.stringify(layouts));
  }
}

export const sagas = [
  watchFetchUserInfo,
  watchFetchGlobalUserSetting,
  watchFetchGlobalOrigin,
  watchFetchGlobalNewsList,
  watchSetLayouts,
];
