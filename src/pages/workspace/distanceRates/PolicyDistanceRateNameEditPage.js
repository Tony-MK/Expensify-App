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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var TextInput_1 = require("@components/TextInput");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useLocalize_1 = require("@hooks/useLocalize");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var DistanceRate_1 = require("@userActions/Policy/DistanceRate");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var PolicyDistanceRateNameEditForm_1 = require("@src/types/form/PolicyDistanceRateNameEditForm");
function PolicyDistanceRateNameEditPage(_a) {
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var inputCallbackRef = (0, useAutoFocusInput_1.default)().inputCallbackRef;
    var policyID = route.params.policyID;
    var rateID = route.params.rateID;
    var policy = (0, usePolicy_1.default)(policyID);
    var customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    var rate = customUnit === null || customUnit === void 0 ? void 0 : customUnit.rates[rateID];
    var currentRateName = rate === null || rate === void 0 ? void 0 : rate.name;
    var validate = (0, react_1.useCallback)(function (values) {
        var _a;
        var errors = {};
        var newRateName = values.rateName.trim();
        if (!newRateName) {
            errors.rateName = translate('workspace.distanceRates.errors.rateNameRequired');
        }
        else if (Object.values((_a = customUnit === null || customUnit === void 0 ? void 0 : customUnit.rates) !== null && _a !== void 0 ? _a : {}).some(function (r) { return r.name === newRateName; }) && currentRateName !== newRateName) {
            errors.rateName = translate('workspace.distanceRates.errors.existingRateName');
        }
        else if (__spreadArray([], newRateName, true).length > CONST_1.default.TAX_RATES.NAME_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            errors.rateName = translate('common.error.characterLimitExceedCounter', { length: __spreadArray([], newRateName, true).length, limit: CONST_1.default.TAX_RATES.NAME_MAX_LENGTH });
        }
        return errors;
    }, [customUnit, currentRateName, translate]);
    var submit = (0, react_1.useCallback)(function (values) {
        if (!customUnit || !rate) {
            return;
        }
        if (currentRateName === values.rateName) {
            Navigation_1.default.goBack();
            return;
        }
        (0, DistanceRate_1.updatePolicyDistanceRateName)(policyID, customUnit, [__assign(__assign({}, rate), { name: values.rateName })]);
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack();
    }, [currentRateName, customUnit, rate, policyID]);
    if (!rate) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRateNameEditPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('common.name')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.POLICY_DISTANCE_RATE_NAME_EDIT_FORM} onSubmit={submit} submitButtonText={translate('common.save')} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={currentRateName} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={PolicyDistanceRateNameEditForm_1.default.RATE_NAME} role={CONST_1.default.ROLE.PRESENTATION}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateNameEditPage.displayName = 'PolicyDistanceRateNameEditPage';
exports.default = PolicyDistanceRateNameEditPage;
