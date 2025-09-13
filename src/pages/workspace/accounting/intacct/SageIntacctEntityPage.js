"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const CONST_1 = require("@src/CONST");
function SageIntacctEntityPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const config = policy?.connections?.intacct?.config;
    const entityID = config?.entity ?? '';
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const sections = [
        {
            text: translate('workspace.common.topLevel'),
            value: translate('workspace.common.topLevel'),
            keyForList: '',
            isSelected: entityID === '',
        },
    ];
    policy?.connections?.intacct?.data?.entities.forEach((entity) => {
        sections.push({
            text: entity.name,
            value: entity.name,
            keyForList: entity.id,
            isSelected: entity.id === entityID,
        });
    });
    const saveSelection = ({ keyForList }) => {
        (0, SageIntacct_1.updateSageIntacctEntity)(policyID, keyForList ?? '', entityID);
        Navigation_1.default.goBack();
    };
    return (<SelectionScreen_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctEntityPage.displayName} sections={sections ? [{ data: sections }] : []} listItem={RadioListItem_1.default} onSelectRow={saveSelection} initiallyFocusedOptionKey={sections?.find((mode) => mode.isSelected)?.keyForList} onBackButtonPress={() => Navigation_1.default.dismissModal()} title="workspace.intacct.entity" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.ENTITY], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config, CONST_1.default.SAGE_INTACCT_CONFIG.ENTITY)} errorRowStyles={[styles.ph5, styles.mv2]} onClose={() => (0, SageIntacct_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.ENTITY)}/>);
}
SageIntacctEntityPage.displayName = 'SageIntacctEntityPage';
exports.default = (0, withPolicy_1.default)(SageIntacctEntityPage);
