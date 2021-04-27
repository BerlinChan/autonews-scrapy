import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: 'filter',
  breadcrumbName:'Filter',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/FilterContainer',
      './modules/filter'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const filter = require('./containers/FilterContainer').default;
      const reducer = require('./modules/filter').default;
      const sagas = require('./modules/filter').sagas;
      /*  Add the reducer to the store on key 'filter'  */
      injectReducer(store, { key: 'filter', reducer });
      injectSagas(store, { key: 'filter', sagas });
      /*  Return getComponent   */
      cb(null, filter);

    /* Webpack named bundle   */
    }, 'filter')
  }
})
