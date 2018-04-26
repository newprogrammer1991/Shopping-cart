import {take,put,call,apply} from 'redux-saga/effects'
import fetch from 'isomorphic-fetch'
import {
    SET_CURRENT_USER,
    setCartItems} from '../actions'

import {fethCartSaga} from './fetchCartSaga'


test("fetch and put cart's data",()=>{
const gen= fethCartSaga();
const user={
    id:'NNNNNN'
};
const items=[
    {id:'0000',quantity:2},
    {id:'000110',quantity:3}
]
const json=()=>{};
const response={json};
expect(gen.next().value).toEqual(take(SET_CURRENT_USER));
expect(gen.next({user}).value).toEqual(call(fetch,`http://localhost:8081/cart/${user.id}`));
expect(gen.next(response).value).toEqual(apply(response,response.json));
expect(gen.next({items}).value).toEqual(put(setCartItems(items)));
})







