"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
function useDismissModalForUSD(workspaceCurrency) {
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!isCurrencyModalOpen || workspaceCurrency !== CONST_1.default.CURRENCY.USD) {
            return;
        }
        setIsCurrencyModalOpen(false);
    }, [workspaceCurrency, isCurrencyModalOpen, setIsCurrencyModalOpen]);
    return [isCurrencyModalOpen, setIsCurrencyModalOpen];
}
exports.default = useDismissModalForUSD;
