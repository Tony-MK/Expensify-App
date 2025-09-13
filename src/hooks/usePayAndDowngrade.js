"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Modal_1 = require("@libs/actions/Modal");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const useOnyx_1 = require("./useOnyx");
function usePayAndDowngrade(setIsDeleteModalOpen) {
    const [isLoadingBill] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_BILL_WHEN_DOWNGRADE, { canBeMissing: true });
    const [shouldBillWhenDowngrading] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_BILL_WHEN_DOWNGRADING, { canBeMissing: true });
    const isDeletingPaidWorkspaceRef = (0, react_1.useRef)(false);
    const setIsDeletingPaidWorkspace = (value) => {
        isDeletingPaidWorkspaceRef.current = value;
    };
    (0, react_1.useEffect)(() => {
        if (!isDeletingPaidWorkspaceRef.current || isLoadingBill) {
            return;
        }
        if (!shouldBillWhenDowngrading) {
            (0, Modal_1.close)(() => setIsDeleteModalOpen(true));
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PAY_AND_DOWNGRADE.getRoute(Navigation_1.default.getActiveRoute()));
        }
        isDeletingPaidWorkspaceRef.current = false;
    }, [isLoadingBill, shouldBillWhenDowngrading, setIsDeleteModalOpen]);
    return { setIsDeletingPaidWorkspace, isLoadingBill };
}
exports.default = usePayAndDowngrade;
