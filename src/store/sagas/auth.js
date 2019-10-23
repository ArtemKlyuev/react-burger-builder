import { delay } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import axios from 'axios';
import * as actions from '../actions/index';

export function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    const { email, password, isSignup } = action;
    yield put(actions.authStart());
    const apiKey = 'AIzaSyCQGkHFBocz8SdjADvGjQFEWbIrBB5Gaag';
    const authData = {
        email,
        password,
        returnSecureToken: true
    };

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

    console.log('[dispatcher signup]', isSignup);

    if (isSignup) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    }

    try {
        const response = yield axios.post(url, authData);

        const { idToken, localId, expiresIn } = response.data;
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );

        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', localId);

        yield put(actions.authSuccess(idToken, localId));
        yield put(actions.checkAuthTimeout(expiresIn));
    } catch (err) {
        console.log('[Auth error]', err.response);
        yield put(actions.authFail(err.response.data.error));
    }
}
