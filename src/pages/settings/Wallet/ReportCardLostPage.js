"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SingleOptionSelector_1 = require("@components/SingleOptionSelector");
const Text_1 = require("@components/Text");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormActions_1 = require("@libs/actions/FormActions");
const User_1 = require("@libs/actions/User");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Card_1 = require("@userActions/Card");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const SuccessReportCardLost_1 = require("./SuccessReportCardLost");
const OPTIONS_KEYS = {
    DAMAGED: 'damaged',
    STOLEN: 'stolen',
};
/** Options for reason selector */
const OPTIONS = [
    {
        key: OPTIONS_KEYS.DAMAGED,
        label: 'reportCardLostOrDamaged.cardDamaged',
    },
    {
        key: OPTIONS_KEYS.STOLEN,
        label: 'reportCardLostOrDamaged.cardLostOrStolen',
    },
];
function ReportCardLostPage({ route: { params: { cardID = '' }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [formData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REPORT_PHYSICAL_CARD_FORM, { canBeMissing: true });
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [reason, setReason] = (0, react_1.useState)();
    const [isReasonConfirmed, setIsReasonConfirmed] = (0, react_1.useState)(false);
    const [shouldShowAddressError, setShouldShowAddressError] = (0, react_1.useState)(false);
    const [shouldShowReasonError, setShouldShowReasonError] = (0, react_1.useState)(false);
    const [newCardID, setNewCardID] = (0, react_1.useState)('');
    const physicalCard = cardList?.[cardID];
    const validateError = (0, ErrorUtils_1.getLatestErrorMessageField)(physicalCard);
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const formattedAddress = (0, PersonalDetailsUtils_1.getFormattedAddress)(privatePersonalDetails ?? {});
    const primaryLogin = account?.primaryLogin ?? '';
    const previousCardList = (0, usePrevious_1.default)(cardList);
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        const newID = Object.keys(cardList ?? {}).find((cardKey) => cardList?.[cardKey]?.cardID && !Object.keys(previousCardList ?? {}).includes(cardKey));
        if (!newID || physicalCard?.cardID) {
            return;
        }
        setNewCardID(newID);
    }, [cardList, physicalCard, previousCardList]);
    (0, react_1.useEffect)(() => {
        (0, User_1.resetValidateActionCodeSent)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (formData?.isLoading && (0, EmptyObject_1.isEmptyObject)(physicalCard?.errors)) {
            return;
        }
        (0, FormActions_1.setErrors)(ONYXKEYS_1.default.FORMS.REPORT_PHYSICAL_CARD_FORM, physicalCard?.errors ?? {});
    }, [formData?.isLoading, physicalCard?.errors]);
    const handleValidateCodeEntered = (0, react_1.useCallback)((validateCode) => {
        if (!physicalCard) {
            return;
        }
        (0, Card_1.requestReplacementExpensifyCard)(physicalCard.cardID, reason?.key, validateCode);
    }, [physicalCard, reason?.key]);
    if ((0, EmptyObject_1.isEmptyObject)(physicalCard) && !newCardID && !formData?.isLoading) {
        return <NotFoundPage_1.default />;
    }
    const handleSubmitFirstStep = () => {
        if (!reason) {
            setShouldShowReasonError(true);
            return;
        }
        setIsReasonConfirmed(true);
        setShouldShowAddressError(false);
        setShouldShowReasonError(false);
    };
    const handleSubmitSecondStep = () => {
        if (!formattedAddress) {
            setShouldShowAddressError(true);
            return;
        }
        setIsValidateCodeActionModalVisible(true);
    };
    const handleOptionSelect = (option) => {
        setReason(option);
        setShouldShowReasonError(false);
    };
    const handleBackButtonPress = () => {
        if (isReasonConfirmed) {
            setIsReasonConfirmed(false);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(cardID));
    };
    const isDamaged = reason?.key === OPTIONS_KEYS.DAMAGED;
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={ReportCardLostPage.displayName}>
            <HeaderWithBackButton_1.default title={newCardID ? translate('common.success') : translate('reportCardLostOrDamaged.screenTitle')} onBackButtonPress={handleBackButtonPress} shouldDisplayHelpButton={!newCardID}/>
            {!newCardID && (<react_native_1.View style={[styles.flex1, styles.justifyContentBetween, styles.pt3, !paddingBottom ? styles.pb5 : null]}>
                    {isReasonConfirmed ? (<>
                            <react_native_1.View>
                                <Text_1.default style={[styles.textHeadline, styles.mb3, styles.mh5]}>{translate('reportCardLostOrDamaged.confirmAddressTitle')}</Text_1.default>
                                <MenuItemWithTopDescription_1.default title={formattedAddress} description={translate('reportCardLostOrDamaged.address')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADDRESS)} numberOfLinesTitle={2}/>
                                {isDamaged ? (<Text_1.default style={[styles.mt3, styles.mh5]}>{translate('reportCardLostOrDamaged.cardDamagedInfo')}</Text_1.default>) : (<Text_1.default style={[styles.mt3, styles.mh5]}>{translate('reportCardLostOrDamaged.cardLostOrStolenInfo')}</Text_1.default>)}
                            </react_native_1.View>
                            <react_native_1.View style={[styles.mh5]}>
                                <FormAlertWithSubmitButton_1.default isAlertVisible={shouldShowAddressError} onSubmit={handleSubmitSecondStep} message={translate('reportCardLostOrDamaged.addressError')} isLoading={formData?.isLoading} buttonText={isDamaged ? translate('reportCardLostOrDamaged.shipNewCardButton') : translate('reportCardLostOrDamaged.deactivateCardButton')}/>
                            </react_native_1.View>
                            <ValidateCodeActionModal_1.default handleSubmitForm={handleValidateCodeEntered} sendValidateCode={User_1.requestValidateCodeAction} validateCodeActionErrorField="replaceLostCard" validateError={validateError} clearError={() => {
                    if (!physicalCard?.cardID) {
                        return;
                    }
                    (0, Card_1.clearCardListErrors)(physicalCard?.cardID);
                }} onClose={() => setIsValidateCodeActionModalVisible(false)} isVisible={isValidateCodeActionModalVisible} title={translate('cardPage.validateCardTitle')} descriptionPrimary={translate('cardPage.enterMagicCode', { contactMethod: primaryLogin })}/>
                        </>) : (<>
                            <react_native_1.View style={[styles.mh5]}>
                                <Text_1.default style={[styles.textHeadline, styles.mr5]}>{translate('reportCardLostOrDamaged.reasonTitle')}</Text_1.default>
                                <SingleOptionSelector_1.default options={OPTIONS} selectedOptionKey={reason?.key} onSelectOption={handleOptionSelect}/>
                            </react_native_1.View>
                            <react_native_1.View style={[styles.mh5]}>
                                <FormAlertWithSubmitButton_1.default isAlertVisible={shouldShowReasonError} onSubmit={handleSubmitFirstStep} message={translate('reportCardLostOrDamaged.reasonError')} buttonText={translate('reportCardLostOrDamaged.nextButtonLabel')}/>
                            </react_native_1.View>
                        </>)}
                </react_native_1.View>)}
            {!!newCardID && <SuccessReportCardLost_1.default cardID={newCardID}/>}
        </ScreenWrapper_1.default>);
}
ReportCardLostPage.displayName = 'ReportCardLostPage';
exports.default = ReportCardLostPage;
