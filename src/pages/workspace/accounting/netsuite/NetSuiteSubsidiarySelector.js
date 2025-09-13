"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function NetSuiteSubsidiarySelector({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const subsidiaryList = policy?.connections?.netsuite?.options?.data?.subsidiaryList ?? [];
    const netsuiteConfig = policy?.connections?.netsuite?.options?.config;
    const currentSubsidiaryName = netsuiteConfig?.subsidiary ?? '';
    const currentSubsidiaryID = netsuiteConfig?.subsidiaryID ?? '';
    const policyID = policy?.id ?? '-1';
    const subsidiaryListSections = subsidiaryList.map((subsidiary) => ({
        text: subsidiary.name,
        keyForList: subsidiary.internalID,
        isSelected: subsidiary.name === currentSubsidiaryName,
        value: subsidiary.name,
    })) ?? [];
    const updateSubsidiary = ({ keyForList, value }) => {
        if (!keyForList || keyForList === currentSubsidiaryID) {
            return;
        }
        (0, NetSuiteCommands_1.updateNetSuiteSubsidiary)(policyID, {
            subsidiary: value,
            subsidiaryID: keyForList,
        }, {
            subsidiary: currentSubsidiaryName,
            subsidiaryID: currentSubsidiaryID,
        });
        Navigation_1.default.goBack();
    };
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noSubsidiariesFound')} subtitle={translate('workspace.netsuite.noSubsidiariesFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb2, styles.textNormal]}>{translate('workspace.netsuite.subsidiarySelectDescription')}</Text_1.default>
            </react_native_1.View>), [styles.pb2, styles.ph5, styles.textNormal, translate]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteSubsidiarySelector.displayName} sections={subsidiaryListSections.length > 0 ? [{ data: subsidiaryListSections }] : []} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onSelectRow={updateSubsidiary} initiallyFocusedOptionKey={netsuiteConfig?.subsidiaryID ?? subsidiaryListSections?.at(0)?.keyForList} headerContent={listHeaderComponent} onBackButtonPress={() => Navigation_1.default.goBack()} title="workspace.netsuite.subsidiary" listEmptyContent={listEmptyContent} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SUBSIDIARY], netsuiteConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(netsuiteConfig ?? {}, CONST_1.default.NETSUITE_CONFIG.SUBSIDIARY)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SUBSIDIARY)}/>);
}
NetSuiteSubsidiarySelector.displayName = 'NetSuiteSubsidiarySelector';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteSubsidiarySelector);
