import {put,call,apply, take} from 'redux-saga/effects'

import {setTaxRate,SET_CURRENT_USER} from '../actions'
import fetch from 'isomorphic-fetch'
const url ='http://localhost:8081/tax/';


export function *taxRateSaga(){
 const {user:{country}} =yield take(SET_CURRENT_USER);
 const response = yield call(fetch,`${url}${country}`);
 const {rate}=yield apply(response,response.json);
 yield put(setTaxRate(rate));
}