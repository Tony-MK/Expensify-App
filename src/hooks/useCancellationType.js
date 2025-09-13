"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useCancellationType() {
    const [cancellationDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_CANCELLATION_DETAILS, { canBeMissing: true });
    const [cancellationType, setCancellationType] = (0, react_1.useState)();
    // Store initial cancellation details array in a ref for comparison
    const previousCancellationDetails = (0, react_1.useRef)(cancellationDetails);
    const memoizedCancellationType = (0, react_1.useMemo)(() => {
        const pendingManualCancellation = cancellationDetails?.filter((detail) => detail.cancellationType === CONST_1.default.CANCELLATION_TYPE.MANUAL).find((detail) => !detail.cancellationDate);
        // There is a pending manual cancellation - return manual cancellation type
        if (pendingManualCancellation) {
            return CONST_1.default.CANCELLATION_TYPE.MANUAL;
        }
        // Check for cancellation with type "none"
        const noneCancellation = cancellationDetails?.find((detail) => detail.cancellationType === CONST_1.default.CANCELLATION_TYPE.NONE);
        if (noneCancellation) {
            return CONST_1.default.CANCELLATION_TYPE.NONE;
        }
        // There are no new items in the cancellation details NVP
        // eslint-disable-next-line react-compiler/react-compiler
        if (previousCancellationDetails.current?.length === cancellationDetails?.length) {
            return;
        }
        // There is a new item in the cancellation details NVP, it has to be an automatic cancellation, as pending manual cancellations are handled above
        return CONST_1.default.CANCELLATION_TYPE.AUTOMATIC;
    }, [cancellationDetails]);
    (0, react_1.useEffect)(() => {
        if (!memoizedCancellationType) {
            return;
        }
        setCancellationType(memoizedCancellationType);
    }, [memoizedCancellationType]);
    return cancellationType;
}
exports.default = useCancellationType;
