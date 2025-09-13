"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const initialState = {
    isSelectedPaymentMethodDefault: false,
    selectedPaymentMethod: {},
    formattedSelectedPaymentMethod: {
        title: '',
    },
    methodID: '',
    selectedPaymentMethodType: '',
};
function usePaymentMethodState() {
    const [paymentMethod, setPaymentMethod] = (0, react_1.useState)(initialState);
    const resetSelectedPaymentMethodData = (0, react_1.useCallback)(() => {
        setPaymentMethod(initialState);
    }, [setPaymentMethod]);
    return {
        paymentMethod,
        setPaymentMethod,
        resetSelectedPaymentMethodData,
    };
}
exports.default = usePaymentMethodState;
