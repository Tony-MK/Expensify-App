"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useThrottledButtonState;
const react_1 = require("react");
function useThrottledButtonState() {
    const [isButtonActive, setIsButtonActive] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (isButtonActive) {
            return;
        }
        const timer = setTimeout(() => {
            setIsButtonActive(true);
        }, 1800);
        return () => clearTimeout(timer);
    }, [isButtonActive]);
    return [isButtonActive, () => setIsButtonActive(false)];
}
