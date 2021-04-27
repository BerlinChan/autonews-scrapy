import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import global from 'redux/Global'
import monitor from '../routes/Monitor/modules/monitor'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    form: formReducer,
    router,
    global,
    monitor,
    ...asyncReducers
  })
};

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers))
};

export default makeRootReducer
