"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const Section_1 = require("@components/Section");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Policy_1 = require("@libs/actions/Policy/Policy");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function IndividualExpenseRulesSectionSubtitle({ policy, translate, styles, environmentURL }) {
    const policyID = policy?.id;
    const categoriesPageLink = (0, react_1.useMemo)(() => {
        if (policy?.areCategoriesEnabled) {
            return `${environmentURL}/${ROUTES_1.default.WORKSPACE_CATEGORIES.getRoute(policyID)}`;
        }
        return `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`;
    }, [policy?.areCategoriesEnabled, policyID, environmentURL]);
    const tagsPageLink = (0, react_1.useMemo)(() => {
        if (policy?.areTagsEnabled) {
            return `${environmentURL}/${ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID)}`;
        }
        return `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`;
    }, [policy?.areTagsEnabled, policyID, environmentURL]);
    return (<react_native_1.View style={[styles.flexRow, styles.renderHTML, styles.w100, styles.mt2]}>
            <RenderHTML_1.default html={translate('workspace.rules.individualExpenseRules.subtitle', { categoriesPageLink, tagsPageLink })}/>
        </react_native_1.View>);
}
function IndividualExpenseRulesSection({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const policyCurrency = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const maxExpenseAmountNoReceiptText = (0, react_1.useMemo)(() => {
        if (policy?.maxExpenseAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
            return '';
        }
        return (0, CurrencyUtils_1.convertToDisplayString)(policy?.maxExpenseAmountNoReceipt, policyCurrency);
    }, [policy?.maxExpenseAmountNoReceipt, policyCurrency]);
    const maxExpenseAmountText = (0, react_1.useMemo)(() => {
        if (policy?.maxExpenseAmount === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
            return '';
        }
        return (0, CurrencyUtils_1.convertToDisplayString)(policy?.maxExpenseAmount, policyCurrency);
    }, [policy?.maxExpenseAmount, policyCurrency]);
    const maxExpenseAgeText = (0, react_1.useMemo)(() => {
        if (policy?.maxExpenseAge === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
            return '';
        }
        return translate('workspace.rules.individualExpenseRules.maxExpenseAgeDays', { count: policy?.maxExpenseAge ?? 0 });
    }, [policy?.maxExpenseAge, translate]);
    const reimbursableMode = (0, Policy_1.getCashExpenseReimbursableMode)(policyID) ?? CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.REIMBURSABLE_DEFAULT;
    const reimbursableModeText = translate(`workspace.rules.individualExpenseRules.${reimbursableMode}`);
    const billableModeText = translate(`workspace.rules.individualExpenseRules.${policy?.defaultBillable ? 'billable' : 'nonBillable'}`);
    const prohibitedExpenses = (0, react_1.useMemo)(() => {
        // Otherwise return which expenses are prohibited comma separated
        const prohibitedExpensesList = [];
        if (policy?.prohibitedExpenses?.adultEntertainment) {
            prohibitedExpensesList.push(translate('workspace.rules.individualExpenseRules.adultEntertainment'));
        }
        if (policy?.prohibitedExpenses?.alcohol) {
            prohibitedExpensesList.push(translate('workspace.rules.individualExpenseRules.alcohol'));
        }
        if (policy?.prohibitedExpenses?.gambling) {
            prohibitedExpensesList.push(translate('workspace.rules.individualExpenseRules.gambling'));
        }
        if (policy?.prohibitedExpenses?.hotelIncidentals) {
            prohibitedExpensesList.push(translate('workspace.rules.individualExpenseRules.hotelIncidentals'));
        }
        if (policy?.prohibitedExpenses?.tobacco) {
            prohibitedExpensesList.push(translate('workspace.rules.individualExpenseRules.tobacco'));
        }
        // If no expenses are prohibited, return empty string
        if (!prohibitedExpensesList.length) {
            return '';
        }
        return prohibitedExpensesList.join(', ');
    }, [policy?.prohibitedExpenses, translate]);
    const individualExpenseRulesItems = [
        {
            title: maxExpenseAmountNoReceiptText,
            descriptionTranslationKey: 'workspace.rules.individualExpenseRules.receiptRequiredAmount',
            action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_RECEIPT_REQUIRED_AMOUNT.getRoute(policyID)),
            pendingAction: policy?.pendingFields?.maxExpenseAmountNoReceipt,
        },
        {
            title: maxExpenseAmountText,
            descriptionTranslationKey: 'workspace.rules.individualExpenseRules.maxExpenseAmount',
            action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_MAX_EXPENSE_AMOUNT.getRoute(policyID)),
            pendingAction: policy?.pendingFields?.maxExpenseAmount,
        },
        {
            title: maxExpenseAgeText,
            descriptionTranslationKey: 'workspace.rules.individualExpenseRules.maxExpenseAge',
            action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_MAX_EXPENSE_AGE.getRoute(policyID)),
            pendingAction: policy?.pendingFields?.maxExpenseAge,
        },
        {
            title: reimbursableModeText,
            descriptionTranslationKey: 'workspace.rules.individualExpenseRules.cashExpenseDefault',
            action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_REIMBURSABLE_DEFAULT.getRoute(policyID)),
            pendingAction: policy?.pendingFields?.defaultReimbursable,
        },
        {
            title: billableModeText,
            descriptionTranslationKey: 'workspace.rules.individualExpenseRules.billableDefault',
            action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_BILLABLE_DEFAULT.getRoute(policyID)),
            pendingAction: policy?.pendingFields?.defaultBillable,
        },
    ];
    individualExpenseRulesItems.push({
        title: prohibitedExpenses,
        descriptionTranslationKey: 'workspace.rules.individualExpenseRules.prohibitedExpenses',
        action: () => Navigation_1.default.navigate(ROUTES_1.default.RULES_PROHIBITED_DEFAULT.getRoute(policyID)),
        pendingAction: !(0, EmptyObject_1.isEmptyObject)(policy?.prohibitedExpenses?.pendingFields) ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : undefined,
    });
    const areEReceiptsEnabled = policy?.eReceipts ?? false;
    // For backwards compatibility with Expensify Classic, we assume that Attendee Tracking is enabled by default on
    // Control policies if the policy does not contain the attribute
    const isAttendeeTrackingEnabled = policy?.isAttendeeTrackingEnabled ?? true;
    return (<Section_1.default isCentralPane title={translate('workspace.rules.individualExpenseRules.title')} renderSubtitle={() => (<IndividualExpenseRulesSectionSubtitle policy={policy} translate={translate} styles={styles} environmentURL={environmentURL}/>)} titleStyles={styles.accountSettingsSectionTitle}>
            <react_native_1.View style={[styles.mt3]}>
                {individualExpenseRulesItems.map((item) => (<OfflineWithFeedback_1.default pendingAction={item.pendingAction} key={translate(item.descriptionTranslationKey)}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={item.title} description={translate(item.descriptionTranslationKey)} onPress={item.action} wrapperStyle={[styles.sectionMenuItemTopDescription]} numberOfLinesTitle={2}/>
                    </OfflineWithFeedback_1.default>))}

                <react_native_1.View style={[styles.mt3]}>
                    <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.eReceipts}>
                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, { minHeight: variables_1.default.h40 }]}>
                            <Text_1.default style={[styles.flexShrink1, styles.mr2]}>{translate('workspace.rules.individualExpenseRules.eReceipts')}</Text_1.default>
                            <Switch_1.default isOn={areEReceiptsEnabled} accessibilityLabel={translate('workspace.rules.individualExpenseRules.eReceipts')} onToggle={() => (0, Policy_1.setWorkspaceEReceiptsEnabled)(policyID, !areEReceiptsEnabled)} disabled={policyCurrency !== CONST_1.default.CURRENCY.USD}/>
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.w100, styles.pt1]}>
                        <Text_1.default style={[styles.textLabel, styles.colorMuted]}>{translate('workspace.rules.individualExpenseRules.eReceiptsHint')}</Text_1.default>{' '}
                        <TextLink_1.default style={[styles.textLabel, styles.link]} onPress={() => (0, Link_1.openExternalLink)(CONST_1.default.DEEP_DIVE_ERECEIPTS)}>
                            {translate('workspace.rules.individualExpenseRules.eReceiptsHintLink')}
                        </TextLink_1.default>
                        .
                    </Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt3]}>
                    <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.isAttendeeTrackingEnabled}>
                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, { minHeight: variables_1.default.h40 }]}>
                            <Text_1.default style={[styles.flexShrink1, styles.mr2]}>{translate('workspace.rules.individualExpenseRules.attendeeTracking')}</Text_1.default>
                            <Switch_1.default isOn={isAttendeeTrackingEnabled} accessibilityLabel={translate('workspace.rules.individualExpenseRules.attendeeTracking')} onToggle={() => (0, Policy_1.setPolicyAttendeeTrackingEnabled)(policyID, !isAttendeeTrackingEnabled)}/>
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.w100, styles.pt1]}>
                        <Text_1.default style={[styles.textLabel, styles.colorMuted]}>{translate('workspace.rules.individualExpenseRules.attendeeTrackingHint')}</Text_1.default>
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </Section_1.default>);
}
exports.default = IndividualExpenseRulesSection;
