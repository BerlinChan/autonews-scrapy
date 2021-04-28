import { AnyAction, Reducer } from "redux";
import actionTypes from "../types/actionTypes";
// import { updateObject } from '../../utils/utility';

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
    case actionTypes.GLOBAL_SET_layouts:
      return {
        ...state,
        postResponseData: action.payload,
      };
    case actionTypes.GLOBAL_SET_USERINFO:
      localStorage.setItem('userInfo', action.payload);
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
        let newList = state.newsList[action.payload.origin_key].list ;
        newList.unshift(action.payload);
  
        return {
          ...state,
          newsList:{...state.newsList,[action.payload.origin_key]:{
            ...state.newsList[action.payload.origin_key],
            list:newList
          }},
        }
      } else {
        return state;
      }
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
