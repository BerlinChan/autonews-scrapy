import 'whatwg-fetch';
import {push} from 'react-router-redux'
import store from 'store/createStore'
import cookie from 'react-cookie'
import config from './config'
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status == 403) {
    if (window.store.getState().router.locationBeforeTransitions.pathname != '/counter') {
      window.location = config.oAuth + window.location.href;
    }
  }

  if (response.status == 401) {
    window.location = config.oAuth + window.location.href;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  let token = window.store.getState().global.get('token');
  let opt = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  Object.assign(opt, options);
  return fetch(url, opt)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({data}))
    .catch((err) => ({err}));
}
