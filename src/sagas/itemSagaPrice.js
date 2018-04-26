import { take, all, call, apply, put,fork } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch'

import { SET_CART_ITEMS, SET_CURRENT_USER, setItemPrice } from '../actions'


const url = 'http://localhost:8081/prices/';

function* fetchItemPrice(country, id) {
    const response = yield call(fetch, `${url}${country}/${id}`);
    const data = yield apply(response, response.json);
    const price = data[0].price;
    yield put(setItemPrice(id, price));
}

export function* itemSagaPrice() {
    const [{ user }, { items }] = yield all([
        take(SET_CURRENT_USER),
        take(SET_CART_ITEMS)
    ])

    console.log('user', user, 'items', items);
    yield items.map(item => call(fetchItemPrice, user.country, item.id))
}