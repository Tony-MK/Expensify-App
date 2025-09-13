"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedAccountContext = void 0;
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ConfirmModal_1 = require("./ConfirmModal");
const LockedAccountContext = (0, react_1.createContext)({
    showLockedAccountModal: () => { },
    isAccountLocked: false,
});
exports.LockedAccountContext = LockedAccountContext;
function LockedAccountModalProvider({ children }) {
    const { translate } = (0, useLocalize_1.default)();
    const [lockAccountDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_LOCK_ACCOUNT_DETAILS, { canBeMissing: true });
    const isAccountLocked = lockAccountDetails?.isLocked ?? false;
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const contextValue = (0, react_1.useMemo)(() => ({
        isAccountLocked,
        showLockedAccountModal: () => setIsModalOpen(true),
    }), [isAccountLocked]);
    return (<LockedAccountContext.Provider value={contextValue}>
            {children}
            <ConfirmModal_1.default isVisible={isModalOpen} onConfirm={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} title={translate('lockedAccount.title')} prompt={translate('lockedAccount.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </LockedAccountContext.Provider>);
}
LockedAccountModalProvider.displayName = 'LockedAccountModal';
exports.default = LockedAccountModalProvider;
