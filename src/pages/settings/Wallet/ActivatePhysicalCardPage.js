"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BigNumberPad_1 = require("@components/BigNumberPad");
const Button_1 = require("@components/Button");
const IllustratedHeaderPageLayout_1 = require("@components/IllustratedHeaderPageLayout");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MagicCodeInput_1 = require("@components/MagicCodeInput");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CardSettings = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const LAST_FOUR_DIGITS_LENGTH = 4;
const MAGIC_INPUT_MIN_HEIGHT = 86;
function ActivatePhysicalCardPage({ route: { params: { cardID = '' }, }, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isExtraSmallScreenHeight } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [cardList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST);
    const [formError, setFormError] = (0, react_1.useState)('');
    const [lastFourDigits, setLastFourDigits] = (0, react_1.useState)('');
    const [lastPressedDigit, setLastPressedDigit] = (0, react_1.useState)('');
    const [canShowError, setCanShowError] = (0, react_1.useState)(false);
    const inactiveCard = cardList?.[cardID];
    const cardError = ErrorUtils.getLatestErrorMessage(inactiveCard ?? {});
    const activateCardCodeInputRef = (0, react_1.useRef)(null);
    /**
     * If state of the card is CONST.EXPENSIFY_CARD.STATE.OPEN, navigate to card details screen.
     */
    (0, react_1.useEffect)(() => {
        if (inactiveCard?.state !== CONST_1.default.EXPENSIFY_CARD.STATE.OPEN || inactiveCard?.isLoading) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(cardID));
    }, [cardID, cardList, inactiveCard?.isLoading, inactiveCard?.state]);
    (0, react_1.useEffect)(() => {
        if (!inactiveCard?.cardID) {
            return;
        }
        CardSettings.clearCardListErrors(inactiveCard?.cardID);
        return () => {
            if (!inactiveCard?.cardID) {
                return;
            }
            CardSettings.clearCardListErrors(inactiveCard?.cardID);
        };
    }, [inactiveCard?.cardID]);
    /**
     * Update lastPressedDigit with value that was pressed on BigNumberPad.
     *
     * NOTE: If the same digit is pressed twice in a row, append it to the end of the string
     * so that useEffect inside MagicCodeInput will be triggered by artificial change of the value.
     */
    const updateLastPressedDigit = (0, react_1.useCallback)((key) => setLastPressedDigit(lastPressedDigit === key ? lastPressedDigit + key : key), [lastPressedDigit]);
    /**
     * Handle card activation code input
     */
    const onCodeInput = (text) => {
        setFormError('');
        if (cardError && inactiveCard?.cardID) {
            CardSettings.clearCardListErrors(inactiveCard?.cardID);
        }
        setLastFourDigits(text);
    };
    const submitAndNavigateToNextPage = (0, react_1.useCallback)(() => {
        setCanShowError(true);
        activateCardCodeInputRef.current?.blur();
        if (lastFourDigits.replace(CONST_1.default.MAGIC_CODE_EMPTY_CHAR, '').length !== LAST_FOUR_DIGITS_LENGTH) {
            setFormError(translate('activateCardPage.error.thatDidNotMatch'));
            return;
        }
        if (inactiveCard?.cardID === undefined) {
            return;
        }
        CardSettings.activatePhysicalExpensifyCard(lastFourDigits, inactiveCard?.cardID);
    }, [lastFourDigits, inactiveCard?.cardID, translate]);
    if ((0, EmptyObject_1.isEmptyObject)(inactiveCard)) {
        return <NotFoundPage_1.default />;
    }
    return (<IllustratedHeaderPageLayout_1.default title={translate('activateCardPage.activateCard')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(cardID))} backgroundColor={theme.PAGE_THEMES[SCREENS_1.default.SETTINGS.PREFERENCES.ROOT].backgroundColor} illustration={LottieAnimations_1.default.Magician} scrollViewContainerStyles={[styles.mnh100]} childrenContainerStyles={[styles.flex1]} testID={ActivatePhysicalCardPage.displayName}>
            <Text_1.default style={[styles.mh5, styles.textHeadline]}>{translate('activateCardPage.pleaseEnterLastFour')}</Text_1.default>
            <react_native_1.View style={[styles.mh5, { minHeight: MAGIC_INPUT_MIN_HEIGHT }]}>
                <MagicCodeInput_1.default isDisableKeyboard autoComplete="off" maxLength={LAST_FOUR_DIGITS_LENGTH} name="activateCardCode" value={lastFourDigits} lastPressedDigit={lastPressedDigit} onChangeText={onCodeInput} onFulfill={submitAndNavigateToNextPage} errorText={canShowError ? formError || cardError : ''} ref={activateCardCodeInputRef}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.w100, styles.justifyContentEnd, styles.pageWrapper, styles.pv0]}>
                {DeviceCapabilities.canUseTouchScreen() && <BigNumberPad_1.default numberPressed={updateLastPressedDigit}/>}
            </react_native_1.View>
            <Button_1.default success isDisabled={isOffline} isLoading={inactiveCard?.isLoading} medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} style={[styles.w100, styles.p5, styles.mtAuto]} onPress={submitAndNavigateToNextPage} pressOnEnter text={translate('activateCardPage.activatePhysicalCard')}/>
        </IllustratedHeaderPageLayout_1.default>);
}
ActivatePhysicalCardPage.displayName = 'ActivatePhysicalCardPage';
exports.default = ActivatePhysicalCardPage;
