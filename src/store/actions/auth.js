import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (idToken, userId) => {
    return { type: actionTypes.AUTH_SUCCESS, idToken, userId };
};

export const authFail = (err) => {
    return { type: actionTypes.AUTH_FAIL, err };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return { type: actionTypes.AUTH_LOGOUT };
};

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, +expirationTime * 1000);
    };
};

// handle async
export const auth = (email, password, isSignup) => {
    return (dispatch) => {
        dispatch(authStart());
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

        axios
            .post(url, authData)
            .then((res) => {
                console.log('[url]', url);
                console.log('[Auth success]', res);
                const { idToken, localId, expiresIn } = res.data;
                const expirationDate = new Date(
                    new Date().getTime() + expiresIn * 1000
                );

                localStorage.setItem('token', idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', localId);

                dispatch(authSuccess(idToken, localId));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .catch((err) => {
                console.log('[Auth error]', err.response);
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(
                localStorage.getItem('expirationDate')
            );
            if (expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(
                    checkAuthTimeout(
                        (expirationDate.getTime() - new Date().getTime()) / 1000
                    )
                );
            } else {
                dispatch(logout());
            }
        }
    };
};
