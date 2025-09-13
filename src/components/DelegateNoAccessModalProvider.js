"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateNoAccessContext = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var AccountUtils_1 = require("@libs/AccountUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ConfirmModal_1 = require("./ConfirmModal");
var RenderHTML_1 = require("./RenderHTML");
var DelegateNoAccessContext = (0, react_1.createContext)({
    isActingAsDelegate: false,
    isDelegateAccessRestricted: false,
    showDelegateNoAccessModal: function () { },
});
exports.DelegateNoAccessContext = DelegateNoAccessContext;
function DelegateNoAccessModalProvider(_a) {
    var _b, _c;
    var children = _a.children;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var _d = (0, react_1.useState)(false), isModalOpen = _d[0], setIsModalOpen = _d[1];
    var currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var delegatorEmail = (_b = currentUserDetails === null || currentUserDetails === void 0 ? void 0 : currentUserDetails.login) !== null && _b !== void 0 ? _b : '';
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var isActingAsDelegate = !!((_c = account === null || account === void 0 ? void 0 : account.delegatedAccess) === null || _c === void 0 ? void 0 : _c.delegate);
    var isDelegateAccessRestricted = isActingAsDelegate && AccountUtils_1.default.isDelegateOnlySubmitter(account);
    var delegateNoAccessPrompt = (<react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
            <RenderHTML_1.default html={translate('delegate.notAllowedMessage', { accountOwnerEmail: delegatorEmail })}/>
        </react_native_1.View>);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        isActingAsDelegate: isActingAsDelegate,
        isDelegateAccessRestricted: isDelegateAccessRestricted,
        showDelegateNoAccessModal: function () { return setIsModalOpen(true); },
    }); }, [isActingAsDelegate, isDelegateAccessRestricted]);
    return (<DelegateNoAccessContext.Provider value={contextValue}>
            {children}
            <ConfirmModal_1.default isVisible={isModalOpen} onConfirm={function () { return setIsModalOpen(false); }} onCancel={function () { return setIsModalOpen(false); }} title={translate('delegate.notAllowed')} prompt={delegateNoAccessPrompt} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </DelegateNoAccessContext.Provider>);
}
DelegateNoAccessModalProvider.displayName = 'DelegateNoAccessModalProvider';
exports.default = DelegateNoAccessModalProvider;
