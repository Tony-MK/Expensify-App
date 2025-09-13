"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const TextLink_1 = require("@components/TextLink");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceCardSettingsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params?.policyID;
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: false });
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: false });
    const paymentBankAccountID = cardSettings?.paymentBankAccountID;
    const paymentBankAccountNumber = cardSettings?.paymentBankAccountNumber;
    const isMonthlySettlementAllowed = cardSettings?.isMonthlySettlementAllowed ?? false;
    const settlementFrequency = cardSettings?.monthlySettlementDate ? CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.MONTHLY : CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY;
    const isSettlementFrequencyBlocked = !isMonthlySettlementAllowed && settlementFrequency === CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY;
    const bankAccountNumber = bankAccountList?.[paymentBankAccountID?.toString() ?? '']?.accountData?.accountNumber ?? paymentBankAccountNumber ?? '';
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceCardSettingsPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.common.settings')}/>
                <ScrollView_1.default contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                    <react_native_1.View>
                        <OfflineWithFeedback_1.default errorRowStyles={styles.mh5}>
                            <MenuItemWithTopDescription_1.default description={translate('workspace.expensifyCard.settlementAccount')} title={bankAccountNumber ? `${CONST_1.default.MASKED_PAN_PREFIX}${(0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber)}` : ''} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS_ACCOUNT.getRoute(policyID, Navigation_1.default.getActiveRoute()))}/>
                        </OfflineWithFeedback_1.default>
                        <OfflineWithFeedback_1.default errorRowStyles={styles.mh5}>
                            <MenuItemWithTopDescription_1.default description={translate('workspace.expensifyCard.settlementFrequency')} title={translate(`workspace.expensifyCard.frequency.${settlementFrequency}`)} shouldShowRightIcon={settlementFrequency !== CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY} interactive={!isSettlementFrequencyBlocked} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS_FREQUENCY.getRoute(policyID))} hintText={isSettlementFrequencyBlocked ? (<>
                                            {translate('workspace.expensifyCard.settlementFrequencyInfo')}{' '}
                                            <TextLink_1.default href={CONST_1.default.EXPENSIFY_CARD.MANAGE_EXPENSIFY_CARDS_ARTICLE_LINK} style={styles.label}>
                                                {translate('common.learnMore')}
                                            </TextLink_1.default>
                                            .
                                        </>) : undefined}/>
                        </OfflineWithFeedback_1.default>
                    </react_native_1.View>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCardSettingsPage.displayName = 'WorkspaceCardSettingsPage';
exports.default = WorkspaceCardSettingsPage;
