import { put, call, apply, takeLatest, select } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import {
    increaseItemQuantity,
    decreaseItemQuantity,
    setItemQuantityFetchStatus,
    DECREASE_ITEM_QUANTITY,
    INCREASE_ITEM_QUANTITY,
    FETCHING,
    FETCHED
} from './../actions';

import { currentUserSelector } from '../selectors';

const urlAdd = 'http://localhost:8081/cart/add/';
const urlRemove = 'http://localhost:8081/cart/remove/';

export function* handleDeacreaseItemQuantity({ id }) {
    yield put(setItemQuantityFetchStatus(FETCHING));
    const user = yield select(currentUserSelector);
    const response = yield call(fetch, `${urlRemove}${user.get('id')}/${id}`)
    console.log('get response', response);

yield put(setItemQuantityFetchStatus(FETCHED));
};

export function* handleIncreaseItemQuantity({ id }) {
   yield put(setItemQuantityFetchStatus(FETCHING));
    const user = yield select(currentUserSelector);
    const response = yield call(fetch, `${urlAdd}${user.get('id')}/${id}`);

    if (response.status !== 200) {
        yield put(decreaseItemQuantity(id,true));
        console.log("Sorry, there weren't enough items to complete your order. ");
    }
    yield put(setItemQuantityFetchStatus(FETCHED));
};


export function* itemQuantitySaga() {
    yield [
        takeLatest(INCREASE_ITEM_QUANTITY, handleIncreaseItemQuantity),
        takeLatest(DECREASE_ITEM_QUANTITY, handleDeacreaseItemQuantity)
    ]

};