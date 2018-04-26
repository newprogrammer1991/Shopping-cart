import {connect} from '../createSocketConnection'
import {put,take} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'

import {setCustomerServiceAvailability} from '../actions'

export function *customerServiceSaga(){

    const socket=connect();
    const chan=new eventChannel(emit=>{

   const enableSupportMessage=()=>{
    emit(true)
   };

   const disableSupportMessage=()=>{
    emit(false)
   };

   socket.on(`SUPPORT_AVAILABLE`,enableSupportMessage);
   socket.on(`SUPPORT_NOT_AVAILABLE`,disableSupportMessage);


return ()=>{}

    });

    while(true){
        let supportAvailable=yield take(chan);
        yield put(setCustomerServiceAvailability(supportAvailable));
    }

}
