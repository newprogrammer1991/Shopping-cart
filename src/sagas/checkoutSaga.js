import { take, put, select, apply, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import fetch from 'isomorphic-fetch'
import {
    TOGGLE_CHECKING_OUT,
    QUANTITY_VERIFICATION_CHECKOUT_PHASE,
    CREDIT_VALIDATION_CHECKOUT_PHASE,
    ERROR_CHECKOUT_PHASE,
    PURCHASE_FINALIZATION_CHECKOUT_PHASE,
    SUCCESS_CHECKOUT_PHASE,
    setCheckoutPhase
} from '../actions'

import { currentUserSelector } from '../selectors'


function* validateCart(user) {
    const response = yield call(fetch, `http://localhost:8081/cart/validate/${user.get('id')}`);
    const {validated} = yield apply(response, response.json);
    return validated;
}

function* validateCreditCard(user) {
    const response = yield call(fetch, `http://localhost:8081/card/validate/${user.get('id')}`);
    const {validated} = yield apply(response, response.json);
    return validated;

}

function* validateCharge(user) {
    const response = yield call(fetch, `http://localhost:8081/card/charge/${user.get('id')}`);
    const {success} = yield apply(response, response.json);
    return success;
}

function* checkout() {
    const user = yield select(currentUserSelector);
    yield put(setCheckoutPhase(QUANTITY_VERIFICATION_CHECKOUT_PHASE));
    const cartValidate = yield call(validateCart, user);
    if (!cartValidate) {
        yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE))
        return;
    }
    yield put(setCheckoutPhase(CREDIT_VALIDATION_CHECKOUT_PHASE));
    const cardValidate = yield call(validateCreditCard, user);
    if (!cardValidate) {
        yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE))
        return;
    }
    yield put(setCheckoutPhase(PURCHASE_FINALIZATION_CHECKOUT_PHASE));
    const chargeValidate= yield call(validateCharge,user);
    if(!chargeValidate){
    yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE));
    return;
    }
 
   yield put(setCheckoutPhase(SUCCESS_CHECKOUT_PHASE))

}


export function* checkoutSaga() {
    while (true) {
        const isCheckingOut = yield take(TOGGLE_CHECKING_OUT);
        if (isCheckingOut) {
            yield call(checkout)
        }

    }

}