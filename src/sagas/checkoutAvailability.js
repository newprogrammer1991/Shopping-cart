
import { take, put, actionChannel } from 'redux-saga/effects'

import { setCanCheckOut, SET_SHIPPING_FETCH_STATUS } from '../actions'


export function* checkoutAvailability() {

    const response = yield actionChannel(SET_SHIPPING_FETCH_STATUS)
    console.log(response);
    while (true) {
        const { status } = yield take(response);
        yield put(setCanCheckOut(status == 'FETCHED'));
    }

}