import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: 'pastInquiry',
  breadcrumbName:'PastInquiry',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/PastInquiryContainer',
      './modules/pastInquiry'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const pastInquiry = require('./containers/PastInquiryContainer').default;
      const reducer = require('./modules/pastInquiry').default;
      const sagas = require('./modules/pastInquiry').sagas;
      /*  Add the reducer to the store on key 'pastInquiry'  */
      injectReducer(store, { key: 'pastInquiry', reducer });
      injectSagas(store, { key: 'pastInquiry', sagas });
      /*  Return getComponent   */
      cb(null, pastInquiry);

    /* Webpack named bundle   */
    }, 'pastInquiry')
  }
})
