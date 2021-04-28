// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import MonitorRoute from './Monitor'
import FilterRoute from './Filter'
import PastInquiryRoute from './PastInquiry'
import SettingRoute from './Setting'
import AboutRoute from './About'

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

export default createRoutes
