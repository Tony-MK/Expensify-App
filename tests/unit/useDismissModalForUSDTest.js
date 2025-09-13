"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const useDismissModalForUSD_1 = require("@hooks/useDismissModalForUSD");
const CONST_1 = require("@src/CONST");
describe('useDismissModalForUSD', () => {
    it('useDismissModalForUSD should dismiss currency modal when the currency changes to USD', () => {
        const { rerender, result } = (0, react_native_1.renderHook)(({ workspaceCurrency = CONST_1.default.CURRENCY.EUR }) => (0, useDismissModalForUSD_1.default)(workspaceCurrency), {
            initialProps: {},
        });
        // Open the currency modal
        result.current[1](true);
        // When currency is updated to USD
        rerender({ workspaceCurrency: CONST_1.default.CURRENCY.USD });
        // Then the isCurrencyModalOpen state should be false
        expect(result.current[0]).toBe(false);
    });
});
