"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const Parser_1 = require("@libs/Parser");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getCardInstructionHeader(feedProvider) {
    if (feedProvider === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA) {
        return 'workspace.companyCards.addNewCard.enableFeed.visa';
    }
    if (feedProvider === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD) {
        return 'workspace.companyCards.addNewCard.enableFeed.mastercard';
    }
    return 'workspace.companyCards.addNewCard.enableFeed.heading';
}
function CardInstructionsStep({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const data = addNewCard?.data;
    const feedProvider = data?.feedType ?? CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA;
    const bank = data?.selectedBank;
    const isStripeFeedProvider = feedProvider === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE;
    const isAmexFeedProvider = feedProvider === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX;
    const isOtherBankSelected = bank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER;
    const translationKey = getCardInstructionHeader(feedProvider);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const buttonTranslation = isStripeFeedProvider ? translate('common.submit') : translate('common.next');
    const submit = () => {
        if (isStripeFeedProvider && policyID) {
            (0, Card_1.updateSelectedFeed)(feedProvider, policyID);
            Navigation_1.default.goBack();
            return;
        }
        if (isOtherBankSelected) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: CONST_1.default.COMPANY_CARDS.STEP.CARD_NAME,
            });
            return;
        }
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
            step: CONST_1.default.COMPANY_CARDS.STEP.CARD_DETAILS,
        });
    };
    const handleBackButtonPress = () => {
        if (isAmexFeedProvider && !isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS)) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: CONST_1.default.COMPANY_CARDS.STEP.AMEX_CUSTOM_FEED,
            });
            return;
        }
        if (isStripeFeedProvider) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK });
            return;
        }
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE });
    };
    return (<ScreenWrapper_1.default testID={CardInstructionsStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>
            <ScrollView_1.default style={styles.pt0} contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>
                    {translate('workspace.companyCards.addNewCard.enableFeed.title', { provider: (0, CardUtils_1.getBankName)(feedProvider) })}
                </Text_1.default>
                <Text_1.default style={[styles.ph5, styles.mb3]}>{translate(translationKey)}</Text_1.default>
                <react_native_1.View style={[styles.ph5]}>
                    <RenderHTML_1.default html={Parser_1.default.replace(feedProvider ? translate(`workspace.companyCards.addNewCard.enableFeed.${feedProvider}`) : '')}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mh5, styles.pb5, styles.mt3, styles.flexGrow1, styles.justifyContentEnd]}>
                    <Button_1.default isDisabled={isOffline} success large style={[styles.w100]} onPress={submit} text={buttonTranslation}/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
CardInstructionsStep.displayName = 'CardInstructionsStep';
exports.default = CardInstructionsStep;
