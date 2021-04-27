import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: 'about',
  breadcrumbName:'About',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/AboutContainer',
      './modules/about'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const about = require('./containers/AboutContainer').default
      const reducer = require('./modules/about').default
      const sagas = require('./modules/about').sagas
      /*  Add the reducer to the store on key 'about'  */
      injectReducer(store, { key: 'about', reducer })
      injectSagas(store, { key: 'about', sagas })
      /*  Return getComponent   */
      cb(null, about)

    /* Webpack named bundle   */
    }, 'about')
  }
})
