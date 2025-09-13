"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const AccountUtils_1 = require("@libs/AccountUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
const FullPageNotFoundView_1 = require("./BlockingViews/FullPageNotFoundView");
const DENIED_ACCESS_VARIANTS = {
    // To Restrict All Delegates From Accessing The Page.
    [CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]: (account) => isDelegate(account),
    // To Restrict Only Limited Access Delegates From Accessing The Page.
    [CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.SUBMITTER]: (account) => isSubmitter(account),
};
function isDelegate(account) {
    const isActingAsDelegate = !!account?.delegatedAccess?.delegate;
    return isActingAsDelegate;
}
function isSubmitter(account) {
    const isDelegateOnlySubmitter = AccountUtils_1.default.isDelegateOnlySubmitter(account);
    return isDelegateOnlySubmitter;
}
function DelegateNoAccessWrapper({ accessDeniedVariants = [], shouldForceFullScreen, onBackButtonPress, ...props }) {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const isPageAccessDenied = accessDeniedVariants.reduce((acc, variant) => {
        const accessDeniedFunction = DENIED_ACCESS_VARIANTS[variant];
        return acc || accessDeniedFunction(account);
    }, false);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    if (isPageAccessDenied) {
        return (<FullPageNotFoundView_1.default shouldShow shouldForceFullScreen={shouldForceFullScreen} onBackButtonPress={() => {
                if (onBackButtonPress) {
                    onBackButtonPress();
                    return;
                }
                if (shouldUseNarrowLayout) {
                    Navigation_1.default.dismissModal();
                    return;
                }
                Navigation_1.default.goBack();
            }} titleKey="delegate.notAllowed" subtitleKey="delegate.noAccessMessage" shouldShowLink={false}/>);
    }
    return (0, callOrReturn_1.default)(props.children);
}
exports.default = DelegateNoAccessWrapper;
