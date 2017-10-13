/* eslint-disable camelcase, consistent-return, no-case-declarations */
/* global fetch */
import {
  succeedPostLogin,
  failPostLogin } from '../../containers/LoginContainer/reducer';
import rejectBadResponse from '../../func/rejectBadResponse';

const getUser = (payload, dispatch, history) => (
  fetch(`${process.env.REACT_APP_PROXY_ENDPOINT}/api/login/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(rejectBadResponse)
    .then(response => response.json())
    .then(data => dispatch(succeedPostLogin(data)))
    .then(() => history.push('/'))
    // TODO fixup chain of errors
    .catch(response => response.json())
    .then(error => error && dispatch(failPostLogin({ error })))
    .catch(() => dispatch({
      type: 'CONNECTION_ERROR',
      form: 'sign-up',
      error: { message: 'Unable to connect to the Wallet' }
    }))
);

const login = store => next => (action) => {
  if (action.type === 'TRY_POST_LOGIN') {
    const { account_name, owner_key, history } = action;

    getUser({ account_name, owner_key }, store.dispatch, history);
  }

  next(action);
};

export default login;
