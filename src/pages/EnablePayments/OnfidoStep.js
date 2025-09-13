"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Onfido_1 = require("@components/Onfido");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var Growl_1 = require("@libs/Growl");
var Navigation_1 = require("@libs/Navigation/Navigation");
var BankAccounts_1 = require("@userActions/BankAccounts");
var Wallet_1 = require("@userActions/Wallet");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var OnfidoPrivacy_1 = require("./OnfidoPrivacy");
function OnfidoStep() {
    var _a;
    var translate = (0, useLocalize_1.default)().translate;
    var walletOnfidoData = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ONFIDO, {
        canBeMissing: true,
        // Let's get a new onfido token each time the user hits this flow (as it should only be once)
        initWithStoredValues: false,
    })[0];
    var shouldShowOnfido = (walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.hasAcceptedPrivacyPolicy) && !(walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.isLoading) && !(walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.errors) && (walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.sdkToken);
    var goBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack();
    }, []);
    var goToPreviousStep = (0, react_1.useCallback)(function () {
        (0, Wallet_1.updateCurrentStep)(CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS);
    }, []);
    var reportError = (0, react_1.useCallback)(function () {
        Growl_1.default.error(translate('onfidoStep.genericError'), 10000);
    }, [translate]);
    var verifyIdentity = (0, react_1.useCallback)(function (data) {
        (0, BankAccounts_1.verifyIdentity)({
            onfidoData: JSON.stringify(__assign(__assign({}, data), { applicantID: walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.applicantID })),
        });
    }, [walletOnfidoData === null || walletOnfidoData === void 0 ? void 0 : walletOnfidoData.applicantID]);
    return (<>
            <HeaderWithBackButton_1.default title={translate('onfidoStep.verifyIdentity')} onBackButtonPress={goToPreviousStep}/>
            <FullPageOfflineBlockingView_1.default>
                {shouldShowOnfido ? (<Onfido_1.default sdkToken={(_a = walletOnfidoData.sdkToken) !== null && _a !== void 0 ? _a : ''} onUserExit={goBack} onError={reportError} onSuccess={verifyIdentity}/>) : (<OnfidoPrivacy_1.default walletOnfidoData={walletOnfidoData}/>)}
            </FullPageOfflineBlockingView_1.default>
        </>);
}
OnfidoStep.displayName = 'OnfidoStep';
exports.default = OnfidoStep;
