import { put, call, apply, fork, take } from 'redux-saga/effects'

import { SET_CART_ITEMS, setItemDetails } from './../actions'
import fetch from 'isomorphic-fetch'

import { loadItemDetailSaga, itemDetailsSaga } from './itemDetailsSaga'

describe('fetch and set data', () => {
    test('should take action', () => {
        const items = [
            {
                id: '10'
            },
            {
                id: '11'
            },
            { id: '12' }];

        const gen = itemDetailsSaga();
        expect(gen.next().value).toEqual(take(SET_CART_ITEMS));
        expect(gen.next({ items }).value).toEqual(items.map(item => fork(loadItemDetailSaga, item)))
    });

    test('should fetch and put action', () => {
        const item = { id: 10 };
        const data = [{}];
        let gen = loadItemDetailSaga(item);
        const json = () => { }
        const response = { json };
        expect(gen.next().value).toEqual(call(fetch, `http://localhost:8081/items/${item.id}`));
        expect(gen.next(response).value).toEqual(apply(response, response.json));
        expect(gen.next(data).value).toEqual(put(setItemDetails(data[0])))

    })

})