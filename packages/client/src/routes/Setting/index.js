import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: 'setting',
  breadcrumbName:'Setting',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/SettingContainer',
      './modules/setting'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const setting = require('./containers/SettingContainer').default;
      const reducer = require('./modules/setting').default;
      const sagas = require('./modules/setting').sagas;
      /*  Add the reducer to the store on key 'setting'  */
      injectReducer(store, { key: 'setting', reducer });
      injectSagas(store, { key: 'setting', sagas });
      /*  Return getComponent   */
      cb(null, setting);

    /* Webpack named bundle   */
    }, 'setting')
  }
})
