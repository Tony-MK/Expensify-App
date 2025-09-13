"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutoReportingFrequencyDisplayNames = void 0;
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const getAutoReportingFrequencyDisplayNames = (translate) => ({
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY]: translate('workflowsPage.frequencies.monthly'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE]: translate('workflowsPage.frequencies.daily'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY]: translate('workflowsPage.frequencies.weekly'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.SEMI_MONTHLY]: translate('workflowsPage.frequencies.twiceAMonth'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.TRIP]: translate('workflowsPage.frequencies.byTrip'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL]: translate('workflowsPage.frequencies.manually'),
});
exports.getAutoReportingFrequencyDisplayNames = getAutoReportingFrequencyDisplayNames;
function WorkspaceAutoReportingFrequencyPage({ policy, route }) {
    const autoReportingFrequency = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy);
    const { translate, toLocaleOrdinal } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const onSelectAutoReportingFrequency = (item) => {
        if (!policy?.id) {
            return;
        }
        (0, Policy_1.setWorkspaceAutoReportingFrequency)(policy.id, item.keyForList);
        if (item.keyForList === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY) {
            return;
        }
        Navigation_1.default.goBack();
    };
    const getDescriptionText = () => {
        if (policy?.autoReportingOffset === undefined) {
            return toLocaleOrdinal(1);
        }
        if (typeof policy?.autoReportingOffset === 'number') {
            return toLocaleOrdinal(policy.autoReportingOffset);
        }
        if (typeof policy?.autoReportingOffset === 'string' && parseInt(policy?.autoReportingOffset, 10)) {
            return toLocaleOrdinal(parseInt(policy.autoReportingOffset, 10));
        }
        return translate(`workflowsPage.frequencies.${policy?.autoReportingOffset}`);
    };
    const monthlyFrequencyDetails = () => (<OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.autoReportingOffset} errors={(0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING_OFFSET)} onClose={() => (0, Policy_1.clearPolicyErrorField)(policy?.id, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING_OFFSET)} errorRowStyles={[styles.ml7]}>
            <MenuItem_1.default title={translate('workflowsPage.submissionFrequencyDateOfMonth')} titleStyle={styles.textLabelSupportingNormal} description={getDescriptionText()} descriptionTextStyle={styles.textNormalThemeText} wrapperStyle={styles.pr3} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_MONTHLY_OFFSET.getRoute(policy?.id))} shouldShowRightIcon/>
        </OfflineWithFeedback_1.default>);
    const autoReportingFrequencyItems = Object.keys(getAutoReportingFrequencyDisplayNames(translate)).map((frequencyKey) => ({
        text: getAutoReportingFrequencyDisplayNames(translate)[frequencyKey] || '',
        keyForList: frequencyKey,
        isSelected: frequencyKey === autoReportingFrequency,
        footerContent: frequencyKey === autoReportingFrequency && frequencyKey === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY ? monthlyFrequencyDetails() : null,
    }));
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceAutoReportingFrequencyPage.displayName}>
                <FullPageNotFoundView_1.default onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} shouldShow={(0, EmptyObject_1.isEmptyObject)(policy) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy) || !(0, PolicyUtils_1.isPaidGroupPolicy)(policy)} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsPage.submissionFrequency')} onBackButtonPress={Navigation_1.default.goBack}/>
                    <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.autoReportingFrequency} errors={(0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING_FREQUENCY)} onClose={() => (0, Policy_1.clearPolicyErrorField)(policy?.id, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING_FREQUENCY)} style={styles.flex1} contentContainerStyle={styles.flex1}>
                        <SelectionList_1.default ListItem={RadioListItem_1.default} sections={[{ data: autoReportingFrequencyItems }]} onSelectRow={onSelectAutoReportingFrequency} initiallyFocusedOptionKey={autoReportingFrequency} shouldUpdateFocusedIndex addBottomSafeAreaPadding/>
                    </OfflineWithFeedback_1.default>
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceAutoReportingFrequencyPage.displayName = 'WorkspaceAutoReportingFrequencyPage';
exports.default = (0, withPolicy_1.default)(WorkspaceAutoReportingFrequencyPage);
