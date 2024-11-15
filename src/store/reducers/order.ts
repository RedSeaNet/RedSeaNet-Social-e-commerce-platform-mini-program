import {
    CHANGE_ORDER_ADDRESS,
    CHANGE_ORDER_DELIVERY,
    CHANGE_ORDER_PAYMENT,
    CHANGE_ORDER_SELECTED_ADDRESS
} from "../../utils/constant";

const INITIAL_STATE = {
    addressList: [],
    paymentMethodList: [],
    deliveryMethodList: [],
    selectedAddress: {},
    selectedPayment: {},
    cartInfo:{},
}

export const order = (state = INITIAL_STATE,action) => {
    switch (action.type) {
        case CHANGE_ORDER_ADDRESS:
            return {...state,addressList: action.data}
        case CHANGE_ORDER_PAYMENT:
            return {...state,paymentMethodList: action.data}
        case CHANGE_ORDER_DELIVERY:
            return {...state,deliveryMethodList: action.data}
        case CHANGE_ORDER_SELECTED_ADDRESS:
            return {...state,selectedAddress: action.data}   
        default:
            return state
    }
}
