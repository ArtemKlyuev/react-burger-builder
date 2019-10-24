import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* purchaseBurger(action) {
    const { token, orderData } = action;
    yield put(actions.purchaseBurgerStart());

    try {
        const response = yield axios.post(
            `/orders.json?auth=${token}`,
            orderData
        );

        console.log('[order response.data]', response.data);
        yield put(actions.purchaseBurgerSuccess(response.data.id, orderData));
    } catch (error) {
        yield put(actions.purchaseBurgerFail(error));
    }
}

export function* fetchOrders(action) {
    yield put(actions.fetchOrdersStart());

    const { token, userId } = action;
    const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;

    try {
        const res = yield axios.get(`/orders.json${queryParams}`);

        const fetchedOrders = [];

        Object.keys(res.data).forEach((key) =>
            fetchedOrders.push({ ...res.data[key], id: key })
        );

        yield put(actions.fetchOrdersSuccess(fetchedOrders));
    } catch (err) {
        console.log('[fetch orders fail]', err);
        yield put(actions.fetchOrdersFail(err));
    }
}
