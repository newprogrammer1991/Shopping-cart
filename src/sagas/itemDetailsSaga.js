
import { put, call, apply, fork, take } from 'redux-saga/effects'
import { SET_CART_ITEMS,setItemDetails} from './../actions'
import fetch from 'isomorphic-fetch'
const url = 'http://localhost:8081/items/';

function* itemDetailSaga(item) {
    const { id } = item;
    const response = yield call(fetch, `${url}${id}`)
    const data = yield apply(response, response.json);
    const info=data[0];
    yield put(setItemDetails(info))
}

export function* itemDetailsSaga() {
    const { items } = yield take(SET_CART_ITEMS);
    const res = yield items.map(item => fork(itemDetailSaga, item))

}