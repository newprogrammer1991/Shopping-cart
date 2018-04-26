import { take, put,actionChannel } from 'redux-saga/effects'

import { setCanCheckOut, SET_SHIPPING_FETCH_STATUS } from '../actions'

import {checkoutAvailability} from './checkoutAvailability'




test('put canCheckout status',()=>{

const gen=checkoutAvailability();
const status='FETCHED';
expect(gen.next().value).toEqual(actionChannel(SET_SHIPPING_FETCH_STATUS));
expect(gen.next(actionChannel).value).toEqual(take(actionChannel));
expect(gen.next({status}).value).toEqual(put(setCanCheckOut(status=='FETCHED')));
})