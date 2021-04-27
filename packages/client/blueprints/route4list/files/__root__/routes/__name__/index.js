import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: '<%= realEntityName %>',
  breadcrumbName:'<%= pascalEntityName %>',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './<%= smartPath %>/<%= pascalEntityName %>Container',
      './modules/<%= camelEntityName %>'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const <%= camelEntityName %> = require('./<%= smartPath %>/<%= pascalEntityName %>Container').default;
      const reducer = require('./modules/<%= camelEntityName %>').default;
      const sagas = require('./modules/<%= camelEntityName %>').sagas;
      /*  Add the reducer to the store on key '<%= realEntityName %>'  */
      injectReducer(store, { key: '<%= camelEntityName %>', reducer });
      injectSagas(store, { key: '<%= camelEntityName %>', sagas });
      /*  Return getComponent   */
      cb(null, <%= camelEntityName %>);

    /* Webpack named bundle   */
    }, '<%= realEntityName %>')
  }
})
