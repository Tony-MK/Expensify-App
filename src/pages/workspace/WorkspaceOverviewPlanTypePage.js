"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Plan_1 = require("@libs/actions/Policy/Plan");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/settings/Subscription/CardSection/utils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicy_1 = require("./withPolicy");
function WorkspaceOverviewPlanTypePage({ policy }) {
    const [currentPlan, setCurrentPlan] = (0, react_1.useState)(policy?.type);
    const policyID = policy?.id;
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    (0, react_1.useEffect)(() => {
        if (!policyID) {
            return;
        }
        (0, Plan_1.default)(policyID);
    }, [policyID]);
    (0, react_1.useEffect)(() => {
        setCurrentPlan(policy?.type);
    }, [policy?.type]);
    const workspacePlanTypes = Object.values(CONST_1.default.POLICY.TYPE)
        .filter((type) => type !== CONST_1.default.POLICY.TYPE.PERSONAL)
        .map((policyType) => ({
        value: policyType,
        text: translate(`workspace.planTypePage.planTypes.${policyType}.label`),
        alternateText: translate(`workspace.planTypePage.planTypes.${policyType}.description`),
        keyForList: policyType,
        isSelected: policyType === currentPlan,
    }))
        .reverse();
    const isControl = policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE;
    const isAnnual = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL;
    const autoRenewalDate = privateSubscription?.endDate ? (0, date_fns_1.format)(privateSubscription.endDate, CONST_1.default.DATE.MONTH_DAY_YEAR_ORDINAL_FORMAT) : utils_1.default.getNextBillingDate();
    /** If user has the annual Control plan and their first billing cycle is completed, they cannot downgrade the Workspace plan to Collect. */
    const isPlanTypeLocked = isControl && isAnnual && !policy.canDowngrade;
    const lockedIcon = (option) => option.value === policy?.type ? (<Icon_1.default src={Expensicons.Lock} fill={theme.success}/>) : null;
    const handleUpdatePlan = () => {
        if (policyID && policy?.type === CONST_1.default.POLICY.TYPE.TEAM && currentPlan === CONST_1.default.POLICY.TYPE.CORPORATE) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID));
            return;
        }
        if (policyID && policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE && currentPlan === CONST_1.default.POLICY.TYPE.TEAM) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DOWNGRADE.getRoute(policyID));
            return;
        }
        if (policy?.type === currentPlan) {
            Navigation_1.default.goBack();
        }
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]}>
            <ScreenWrapper_1.default testID={WorkspaceOverviewPlanTypePage.displayName} shouldShowOfflineIndicatorInWideScreen enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.common.planType')}/>
                {policy?.isLoading ? (<react_native_1.View style={styles.flex1}>
                        <FullscreenLoadingIndicator_1.default />
                    </react_native_1.View>) : (<>
                        {isPlanTypeLocked ? (<Text_1.default style={[styles.mh5, styles.mv3]}>
                                {translate('workspace.planTypePage.lockedPlanDescription', {
                    count: privateSubscription?.userCount ?? 1,
                    annualSubscriptionEndDate: autoRenewalDate,
                })}{' '}
                                <TextLink_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(Navigation_1.default.getActiveRoute()))}>
                                    {translate('workspace.planTypePage.subscriptions')}
                                </TextLink_1.default>
                                .
                            </Text_1.default>) : (<Text_1.default style={[styles.mh5, styles.mv3]}>
                                {translate('workspace.planTypePage.description')}{' '}
                                <TextLink_1.default href={CONST_1.default.PLAN_TYPES_AND_PRICING_HELP_URL}>{translate('workspace.planTypePage.subscriptionLink')}</TextLink_1.default>.
                            </Text_1.default>)}
                        <SelectionList_1.default shouldIgnoreFocus sections={[{ data: workspacePlanTypes, isDisabled: isPlanTypeLocked }]} ListItem={RadioListItem_1.default} onSelectRow={(option) => {
                setCurrentPlan(option.value);
            }} rightHandSideComponent={isPlanTypeLocked ? lockedIcon : null} shouldUpdateFocusedIndex shouldSingleExecuteRowSelect initiallyFocusedOptionKey={workspacePlanTypes.find((mode) => mode.isSelected)?.keyForList} addBottomSafeAreaPadding footerContent={<Button_1.default success large text={isPlanTypeLocked ? translate('common.buttonConfirm') : translate('common.save')} style={styles.mt6} onPress={handleUpdatePlan}/>}/>
                    </>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOverviewPlanTypePage.displayName = 'WorkspaceOverviewPlanTypePage';
exports.default = (0, withPolicy_1.default)(WorkspaceOverviewPlanTypePage);
