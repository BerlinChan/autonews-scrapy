import { AnyAction, Reducer } from "redux";
import actionTypes from "../types/actionTypes";

const initialState = {
  fakeDataList: [],
  postResponseData: {},

  userInfo: {},
  clientCount: 0, //客户端连接数
  socketConnectStatus: "disconnect", //[disconnect | connect]
  gridLayoutConfig: {
    breakpoints: { lg: 1440, md: 1024, sm: 425, xs: 0 },
    gridCols: { lg: 12, md: 12, sm: 6, xs: 2 }, //grid cols, 栅格列数
    monitorWidth: { lg: 3, md: 4, sm: 3, xs: 2 }, //每监视器栅格宽
    monitorHeight: { lg: 2, md: 2, sm: 2, xs: 2 }, //每监视器栅格高
  },
  origin: [],
  /* [
     {"_id": "58caa435de0f2f724e27148", "key": "ctdsb", "name": "楚天都市报"},
     ] */
  userSetting: {
    //默认值在 saga-watchFetchGlobalUserSetting 中生成
    originKeys: [], // 已监控的keys
    layouts: {}, // monitor layout
    showSentimentInspector: true, // 是否显示情感评价指示器
  },
  newsList: {
    /*'ctdsb': {
     origin_name: '楚天都市报',
     isFetched: false,
     list: [
     {title: 'title', url: 'url', origin_key: 'origin', date: new Date()},
     ]
     },*/
  },
  filteredList: [],
};

const rootReducer: Reducer<any> = (
  state: any = initialState,
  action: AnyAction
): any | any => {
  switch (action.type) {
    case actionTypes.GLOBAL_SET_USERINFO:
      localStorage.setItem("userInfo", action.payload);
      return {
        ...state,
        userInfo: action.payload,
      };
    case actionTypes.socket_Global_SET_clientCount:
      return {
        ...state,
        clientCount: action.payload,
      };
    case actionTypes.socket_Global_SET_SOCKET_STATUS:
      return {
        ...state,
        socketConnectStatus: action.payload,
      };
    case actionTypes.socket_global_ON_News_Added:
      if (state.newsList[action.payload.origin_key]) {
        let newList = state.newsList[action.payload.origin_key].list;
        newList.unshift(action.payload);

        return {
          ...state,
          newsList: {
            ...state.newsList,
            [action.payload.origin_key]: {
              ...state.newsList[action.payload.origin_key],
              list: newList,
            },
          },
        };
      } else {
        return state;
      }
    case actionTypes.GLOBAL_FETCH_userSetting_SUCCESSED:
      const origin = state.origin;
      let tempNewsList = {};
      action.userSetting.originKeys.length &&
        action.userSetting.originKeys.forEach((item: any, index: number) => {
          const currentOriginItem = origin.find(
            (originItem: any) => originItem.key === item
          );
          tempNewsList[item] = {
            origin_name: currentOriginItem ? currentOriginItem.name : "",
            list: [],
            isFetched: false,
          };
        });

      return {
        ...state,
        userSetting: action.payload.userSetting,
        newsList: tempNewsList,
      };
    case actionTypes.GLOBAL_FETCH_origin_SUCCESSED:
      return {
        ...state,
        origin: action.payload,
      };
    case actionTypes.GLOBAL_FETCH_newsList_SUCCESSED:
      return {
        ...state,
        newsList: {
          ...state.newsList[action.payload.origin],
          list: state.newsList[action.payload.origin].list.concat(
            action.payload.data
          ),
          isFetched: true,
        },
      };
    case actionTypes.GLOBAL_SET_layouts:
      if (action.payload.md.length) {
        return {
          ...state,
          userSetting: {
            ...state.userSetting,
            layouts: action.payload,
          },
        };
      } else {
        return state;
      }
    case actionTypes.GLOBAL_SET_filteredList:
      let tempList = state.filteredList;
      if (tempList.findIndex((i: any) => i === action.payload.item) > -1) {
        tempList = tempList.filter((i: any) => i !== action.payload.item);
      } else {
        tempList.push(action.payload.item);
      }

      return { ...state, filteredList: tempList };
    case actionTypes.GLOBAL_SET_showSentimentInspector:
      localStorage.setItem("userSetting.showSentimentInspector", action.status);

      return {
        ...state,
        userSetting: {
          ...state.userSetting,
          showSentimentInspector: action.payload.status,
        },
      };

    case actionTypes.GET_API_DATA:
      return {
        ...state,
        fakeDataList: action.payload,
      };
    // case actionTypes.POST_API_DATA: return updateObject(state, action);
    case actionTypes.POST_API_DATA:
      return {
        ...state,
        postResponseData: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
