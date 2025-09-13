"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateNoAccessContext = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountUtils_1 = require("@libs/AccountUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ConfirmModal_1 = require("./ConfirmModal");
const RenderHTML_1 = require("./RenderHTML");
const DelegateNoAccessContext = (0, react_1.createContext)({
    isActingAsDelegate: false,
    isDelegateAccessRestricted: false,
    showDelegateNoAccessModal: () => { },
});
exports.DelegateNoAccessContext = DelegateNoAccessContext;
function DelegateNoAccessModalProvider({ children }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const delegatorEmail = currentUserDetails?.login ?? '';
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const isActingAsDelegate = !!account?.delegatedAccess?.delegate;
    const isDelegateAccessRestricted = isActingAsDelegate && AccountUtils_1.default.isDelegateOnlySubmitter(account);
    const delegateNoAccessPrompt = (<react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
            <RenderHTML_1.default html={translate('delegate.notAllowedMessage', { accountOwnerEmail: delegatorEmail })}/>
        </react_native_1.View>);
    const contextValue = (0, react_1.useMemo)(() => ({
        isActingAsDelegate,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal: () => setIsModalOpen(true),
    }), [isActingAsDelegate, isDelegateAccessRestricted]);
    return (<DelegateNoAccessContext.Provider value={contextValue}>
            {children}
            <ConfirmModal_1.default isVisible={isModalOpen} onConfirm={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} title={translate('delegate.notAllowed')} prompt={delegateNoAccessPrompt} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </DelegateNoAccessContext.Provider>);
}
DelegateNoAccessModalProvider.displayName = 'DelegateNoAccessModalProvider';
exports.default = DelegateNoAccessModalProvider;
