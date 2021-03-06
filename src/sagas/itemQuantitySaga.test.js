import fetch from 'isomorphic-fetch';
import { call, put, takeLatest, select } from 'redux-saga/effects';

import {
    handleIncreaseItemQuantity,
    handleDeacreaseItemQuantity,
    itemQuantitySaga
} from './itemQuantitySaga'

import {
    INCREASE_ITEM_QUANTITY,
    DECREASE_ITEM_QUANTITY,
    setItemQuantityFetchStatus,
    decreaseItemQuantity,
    increaseItemQuantity,
    FETCHING,
    FETCHED
} from './../actions';

import { fromJS } from 'immutable'

import { currentUserSelector } from '../selectors'

describe("item quantity saga", () => {
    let user, item;
   beforeEach(() => {
    item = { id: 12345 };
    user = fromJS({ id: "ABCDE" });
     });

    describe('handle increase item', () => {
        let gen;
        beforeEach(() => {
            gen = handleIncreaseItemQuantity(item)
            expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
            expect(gen.next().value).toEqual(select(currentUserSelector));
            expect(gen.next(user).value).toEqual(call(fetch, `http://localhost:8081/cart/add/ABCDE/12345`));

        })
        test("increasindg quantity successfully", () => {
            expect(gen.next({ status: 200 }).value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));

        });
        test("increasing quantity fail", () => {
            expect(gen.next({ status: 500 }).value).toEqual(put(decreaseItemQuantity(item.id, true)));
            expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
        })
    });
    test('handle deacrease item', () => {
        let gen = handleDeacreaseItemQuantity(item);
        expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
        expect(gen.next().value).toEqual(select(currentUserSelector));
        expect(gen.next(user).value).toEqual(call(fetch, `http://localhost:8081/cart/remove/ABCDE/12345`));
        expect(gen.next({status:500}).value).toEqual(put(setItemQuantityFetchStatus(FETCHED)))
    })

});