const ACTION_TYPES = {
  GET_API_CALL: "GET_API_CALL",
  GET_API_DATA: "GET_API_DATA",
  POST_API_CALL: "POST_API_CALL",
  POST_API_DATA: "POST_API_DATA",

  GLOBAL_SET_USERINFO: "GLOBAL_SET_USERINFO",
  GLOBAL_USERINFO_FETCH_REQUESTED: "GLOBAL_USERINFO_FETCH_REQUESTED",
  socket_Global_SET_clientCount: "socket_Global_SET_clientCount",
  socket_Global_SET_SOCKET_STATUS: "socket_Global_SET_SOCKET_STATUS",
  socket_global_ON_News_Added: "socket_global_ON_News_Added",
  GLOBAL_FETCH_origin_REQUESTED: "GLOBAL_FETCH_origin_REQUESTED",
  GLOBAL_FETCH_origin_SUCCESSED: "GLOBAL_FETCH_origin_SUCCESSED",
  GLOBAL_FETCH_newsList_REQUESTED: "GLOBAL_FETCH_newsList_REQUESTED",
  GLOBAL_FETCH_newsList_SUCCESSED: "GLOBAL_FETCH_newsList_SUCCESSED",
  GLOBAL_FETCH_userSetting_REQUESTED: "GLOBAL_FETCH_userSetting_REQUESTED",
  GLOBAL_FETCH_userSetting_SUCCESSED: "GLOBAL_FETCH_userSetting_SUCCESSED",
  GLOBAL_SET_layouts: "GLOBAL_SET_layouts",
  GLOBAL_SET_filteredList: "GLOBAL_SET_filteredList",
  GLOBAL_SET_showSentimentInspector: "GLOBAL_SET_showSentimentInspector",

  Monitor_FETCH_REQUESTED : 'Monitor_FETCH_REQUESTED',
  Monitor_FETCH_SUCCESSED : 'Monitor_FETCH_SUCCESSED',
  Monitor_FETCH_FAILURE : 'Monitor_FETCH_FAILURE',
  Monitor_ON_destroy : 'Monitor_ON_destroy',

  PastInquiry_FETCH_REQUESTED : 'PastInquiry_FETCH_REQUESTED',
  PastInquiry_FETCH_SUCCESSED : 'PastInquiry_FETCH_SUCCESSED',
  PastInquiry_FETCH_FAILURE : 'PastInquiry_FETCH_FAILURE',
  PastInquiry_ON_destroy : 'PastInquiry_ON_destroy',
  PastInquiry_SET_formValue : 'PastInquiry_SET_formValue',
  PastInquiry_SET_isDetailModalShow : 'PastInquiry_SET_isDetailModalShow',
  PastInquiry_FETCH_detail_REQUESTED : 'PastInquiry_FETCH_detail_REQUESTED',
  PastInquiry_FETCH_detail_SUCCESSED : 'PastInquiry_FETCH_detail_SUCCESSED',
};

export default ACTION_TYPES;
