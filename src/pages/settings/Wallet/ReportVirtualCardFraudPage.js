"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ReportVirtualCardFraudPage({ route: { params: { cardID = '', backTo }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false });
    const [formData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REPORT_VIRTUAL_CARD_FRAUD, { canBeMissing: true });
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const primaryLogin = account?.primaryLogin ?? '';
    const virtualCard = cardList?.[cardID];
    const latestIssuedVirtualCardID = Object.keys(cardList ?? {})?.pop();
    const virtualCardError = (0, ErrorUtils_1.getLatestErrorMessage)(virtualCard);
    const validateError = (0, ErrorUtils_1.getLatestErrorMessageField)(virtualCard);
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const prevIsLoading = (0, usePrevious_1.default)(formData?.isLoading);
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        (0, Card_1.clearReportVirtualCardFraudForm)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!prevIsLoading || formData?.isLoading) {
            return;
        }
        if (!(0, EmptyObject_1.isEmptyObject)(virtualCard?.errors) || !(0, EmptyObject_1.isEmptyObject)(validateCodeAction?.errorFields?.reportVirtualCard)) {
            return;
        }
        if (latestIssuedVirtualCardID) {
            Navigation_1.default.removeScreenFromNavigationState(SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD);
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_REPORT_FRAUD_CONFIRMATION.getRoute(latestIssuedVirtualCardID));
            setIsValidateCodeActionModalVisible(false);
        }
    }, [formData?.isLoading, latestIssuedVirtualCardID, prevIsLoading, virtualCard?.errors, validateCodeAction?.errorFields]);
    const handleValidateCodeEntered = (0, react_1.useCallback)((validateCode) => {
        if (!virtualCard) {
            return;
        }
        (0, Card_1.reportVirtualExpensifyCardFraud)(virtualCard, validateCode);
    }, [virtualCard]);
    const handleSubmit = (0, react_1.useCallback)(() => {
        setIsValidateCodeActionModalVisible(true);
    }, [setIsValidateCodeActionModalVisible]);
    if ((0, EmptyObject_1.isEmptyObject)(virtualCard) && !formData?.cardID) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportVirtualCardFraudPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('reportFraudPage.title')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <react_native_1.View style={[styles.flex1, styles.justifyContentBetween]}>
                    <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.mh5]}>{translate('reportFraudPage.description')}</Text_1.default>
                    <FormAlertWithSubmitButton_1.default isAlertVisible={!!virtualCardError} onSubmit={handleSubmit} message={virtualCardError} buttonText={translate('reportFraudPage.deactivateCard')} containerStyles={[styles.m5]}/>
                    <ValidateCodeActionModal_1.default handleSubmitForm={handleValidateCodeEntered} sendValidateCode={User_1.requestValidateCodeAction} validateCodeActionErrorField="reportVirtualCard" validateError={validateError} clearError={() => {
            if (!virtualCard?.cardID) {
                return;
            }
            (0, Card_1.clearCardListErrors)(virtualCard.cardID);
        }} onClose={() => setIsValidateCodeActionModalVisible(false)} isVisible={isValidateCodeActionModalVisible} title={translate('cardPage.validateCardTitle')} descriptionPrimary={translate('cardPage.enterMagicCode', { contactMethod: primaryLogin })} isLoading={formData?.isLoading}/>
                </react_native_1.View>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
ReportVirtualCardFraudPage.displayName = 'ReportVirtualCardFraudPage';
exports.default = ReportVirtualCardFraudPage;
