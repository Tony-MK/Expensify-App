"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceSettlementFrequencyPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params?.policyID;
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`);
    const shouldShowMonthlyOption = cardSettings?.isMonthlySettlementAllowed ?? false;
    const selectedFrequency = cardSettings?.monthlySettlementDate ? CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.MONTHLY : CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY;
    const isSettlementFrequencyBlocked = !shouldShowMonthlyOption && selectedFrequency === CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY;
    const data = (0, react_1.useMemo)(() => {
        const options = [];
        options.push({
            value: CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY,
            text: translate('workspace.expensifyCard.frequency.daily'),
            keyForList: CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY,
            isSelected: selectedFrequency === CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY,
        });
        if (shouldShowMonthlyOption) {
            options.push({
                value: CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.MONTHLY,
                text: translate('workspace.expensifyCard.frequency.monthly'),
                keyForList: CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.MONTHLY,
                isSelected: selectedFrequency === CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.MONTHLY,
            });
        }
        return options;
    }, [translate, shouldShowMonthlyOption, selectedFrequency]);
    const updateSettlementFrequency = (value) => {
        (0, Card_1.updateSettlementFrequency)(defaultFundID, value, cardSettings?.monthlySettlementDate);
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} shouldBeBlocked={isSettlementFrequencyBlocked} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceSettlementFrequencyPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.expensifyCard.settlementFrequency')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS.getRoute(policyID))}/>
                <Text_1.default style={[styles.mh5, styles.mv4]}>{translate('workspace.expensifyCard.settlementFrequencyDescription')}</Text_1.default>
                <SelectionList_1.default sections={[{ data }]} ListItem={RadioListItem_1.default} onSelectRow={({ value }) => updateSettlementFrequency(value)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={selectedFrequency} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceSettlementFrequencyPage.displayName = 'WorkspaceSettlementFrequencyPage';
exports.default = WorkspaceSettlementFrequencyPage;
