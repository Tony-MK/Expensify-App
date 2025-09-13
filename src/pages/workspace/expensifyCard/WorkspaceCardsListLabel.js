"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Popover_1 = require("@components/Popover");
const Pressable_1 = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getClickedTargetLocation_1 = require("@libs/getClickedTargetLocation");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const Policy_1 = require("@userActions/Policy/Policy");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceCardsListLabel({ type, value, style }) {
    const route = (0, native_1.useRoute)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [isVisible, setVisible] = (0, react_1.useState)(false);
    const [anchorPosition, setAnchorPosition] = (0, react_1.useState)({ top: 0, left: 0 });
    const anchorRef = (0, react_1.useRef)(null);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const settlementCurrency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`, { canBeMissing: true });
    const [cardManualBilling] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_MANUAL_BILLING}${workspaceAccountID}`, { canBeMissing: true });
    const paymentBankAccountID = cardSettings?.paymentBankAccountID;
    const isLessThanMediumScreen = isMediumScreenWidth || shouldUseNarrowLayout;
    const isConnectedWithPlaid = (0, react_1.useMemo)(() => {
        const bankAccountData = bankAccountList?.[paymentBankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.accountData;
        // TODO: remove the extra check when plaidAccountID storing is aligned in https://github.com/Expensify/App/issues/47944
        // Right after adding a bank account plaidAccountID is stored inside the accountData and not in the additionalData
        return !!bankAccountData?.plaidAccountID || !!bankAccountData?.additionalData?.plaidAccountID;
    }, [bankAccountList, paymentBankAccountID]);
    (0, react_1.useEffect)(() => {
        if (!anchorRef.current || !isVisible) {
            return;
        }
        const position = (0, getClickedTargetLocation_1.default)(anchorRef.current);
        const BOTTOM_MARGIN_OFFSET = 3;
        setAnchorPosition({
            top: position.top + position.height + BOTTOM_MARGIN_OFFSET,
            left: position.left,
        });
    }, [isVisible, windowWidth]);
    const requestLimitIncrease = () => {
        (0, Policy_1.requestExpensifyCardLimitIncrease)(cardSettings?.paymentBankAccountID);
        setVisible(false);
        (0, Report_1.navigateToConciergeChat)();
    };
    const isCurrentBalanceType = type === CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE;
    const isSettleBalanceButtonDisplayed = !!cardSettings?.isMonthlySettlementAllowed && !cardManualBilling && isCurrentBalanceType;
    const isSettleDateTextDisplayed = !!cardManualBilling && isCurrentBalanceType;
    const settlementDate = isSettleDateTextDisplayed ? (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 1), CONST_1.default.DATE.FNS_FORMAT_STRING) : '';
    const handleSettleBalanceButtonClick = () => {
        (0, Card_1.queueExpensifyCardForBilling)(CONST_1.default.COUNTRY.US, workspaceAccountID);
    };
    return (<react_native_1.View style={styles.flex1}>
            <react_native_1.View style={styles.flex1}>
                <react_native_1.View ref={anchorRef} style={[styles.flexRow, styles.alignItemsCenter, styles.mb1, style]}>
                    <Text_1.default style={[styles.mutedNormalTextLabel, styles.mr1]}>{translate(`workspace.expensifyCard.${type}`)}</Text_1.default>
                    <Pressable_1.PressableWithFeedback accessibilityLabel={translate(`workspace.expensifyCard.${type}`)} accessibilityRole={CONST_1.default.ROLE.BUTTON} onPress={() => setVisible(true)}>
                        <Icon_1.default src={Expensicons_1.Info} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                    </Pressable_1.PressableWithFeedback>
                </react_native_1.View>
                <react_native_1.View style={[styles.flexRow, styles.flexWrap]}>
                    <Text_1.default style={[styles.shortTermsHeadline, isSettleBalanceButtonDisplayed && [styles.mb2, styles.mr3]]}>{(0, CurrencyUtils_1.convertToDisplayString)(value, settlementCurrency)}</Text_1.default>
                    {isSettleBalanceButtonDisplayed && (<react_native_1.View style={[styles.mr2, isLessThanMediumScreen && styles.mb3]}>
                            <Button_1.default onPress={handleSettleBalanceButtonClick} text={translate('workspace.expensifyCard.settleBalance')} innerStyles={[styles.buttonSmall]} textStyles={[styles.buttonSmallText]}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </react_native_1.View>
            {isSettleDateTextDisplayed && <Text_1.default style={[styles.mutedNormalTextLabel, styles.mt1]}>{translate('workspace.expensifyCard.balanceWillBeSettledOn', { settlementDate })}</Text_1.default>}
            <Popover_1.default onClose={() => setVisible(false)} isVisible={isVisible} outerStyle={!shouldUseNarrowLayout ? styles.pr5 : undefined} innerContainerStyle={!shouldUseNarrowLayout ? { maxWidth: variables_1.default.modalContentMaxWidth } : undefined} anchorRef={anchorRef} anchorPosition={anchorPosition}>
                <react_native_1.View style={styles.p4}>
                    <Text_1.default numberOfLines={1} style={[styles.optionDisplayName, styles.textStrong, styles.mb2]}>
                        {translate(`workspace.expensifyCard.${type}`)}
                    </Text_1.default>
                    <Text_1.default style={[styles.textLabelSupporting, styles.lh16]}>{translate(`workspace.expensifyCard.${type}Description`)}</Text_1.default>

                    {!isConnectedWithPlaid && type === CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT && (<react_native_1.View style={[styles.flexRow, styles.mt3]}>
                            <Button_1.default onPress={requestLimitIncrease} text={translate('workspace.expensifyCard.requestLimitIncrease')} style={shouldUseNarrowLayout && styles.flex1}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </Popover_1.default>
        </react_native_1.View>);
}
exports.default = WorkspaceCardsListLabel;
