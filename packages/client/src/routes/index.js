// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import MonitorRoute from './Monitor'
import FilterRoute from './Filter'
import PastInquiryRoute from './PastInquiry'
import SettingRoute from './Setting'
import AboutRoute from './About'

/*  Note: Instead of using JSX, we recommend using react-router
 PlainRoute objects to build route definitions.   */
function requireAuth(nextState, replace) {

  // let {store}=window;
  //
  // //返回access_token
  // let {query}=nextState.location;
  // if (query && query.access_token) {
  //   store.dispatch({type: 'GLOBAL_SET_TOKEN', token: query.access_token});
  //   store.dispatch({type: 'GLOBAL_USERINFO_FETCH_REQUESTED'});
  //   //todo 会过滤掉其他参数 只清除access_token参数
  //
  // //  console.log(window.location.pathname)
  //   //replace('');
  //   return;
  // }
  // //没有 token
  // if (!store.getState().global.get('token')) {
  //   let token = cookie.load('token');
  //   if (!token) {
  //     //no cookie
  //     window.location = config.oAuth + window.location.href;
  //   }
  //   else {
  //     //has cookie
  //     store.dispatch({type: 'GLOBAL_SET_TOKEN', token: token});
  //   }
  // }
  //
  //
  // //没有 userInfo
  // if (!store.getState().global.getIn(['userInfo', 'employeeNumber'])) {
  //   let userInfo = cookie.load('userInfo');
  //   if (!userInfo) {
  //     store.dispatch({type: 'GLOBAL_USERINFO_FETCH_REQUESTED'});
  //   }
  //   else {
  //     //has cookie
  //     store.dispatch({type: 'GLOBAL_SET_USERINFO', data: userInfo});
  //   }
  // }
  //
  //
  // //获取 userInfo
  // else {
  //
  // }
}

export const createRoutes = (store) => ({
  path: '/',
  name: "monitor",
  breadcrumbName: "Dashboard",
  childRoutes: [
    {
      component: CoreLayout,
      indexRoute: MonitorRoute,
    },
    {
      component: CoreLayout,
      childRoutes: [
        FilterRoute(store),
        PastInquiryRoute(store),
        SettingRoute(store),
        AboutRoute(store),
      ]
    }
  ]
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
 using getChildRoutes with the following signature:

 getChildRoutes (location, cb) {
 require.ensure([], (require) => {
 cb(null, [
 // Remove imports!
 require('./Counter').default(store)
 ])
 })
 }

 However, this is not necessary for code-splitting! It simply provides
 an API for async route definitions. Your code splitting should occur
 inside the route `getComponent` function, since it is only invoked
 when the route exists and matches.
 */

export default createRoutes
