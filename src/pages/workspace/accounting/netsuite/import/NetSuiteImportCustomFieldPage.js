"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FixedFooter_1 = require("@components/FixedFooter");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const WorkspaceEmptyStateSection_1 = require("@components/WorkspaceEmptyStateSection");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function HelpLinkComponent({ importCustomField, styles, translate, alignmentStyle }) {
    return (<Text_1.default style={[styles.mb3, styles.flex1, alignmentStyle]}>
            <TextLink_1.default href={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.helpLink`)} style={[styles.link, alignmentStyle]}>
                {translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.helpLinkText`)}
            </TextLink_1.default>
            {translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.helpText`)}
        </Text_1.default>);
}
function NetSuiteImportCustomFieldPage({ policy, route: { params: { importCustomField }, }, }) {
    const policyID = policy?.id ?? '-1';
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const config = policy?.connections?.netsuite?.options?.config;
    const data = config?.syncOptions?.[importCustomField] ?? [];
    const listEmptyComponent = (0, react_1.useMemo)(() => (<WorkspaceEmptyStateSection_1.default shouldStyleAsCard={false} title={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.emptyTitle`)} icon={Illustrations.FolderWithPapers} subtitleComponent={<HelpLinkComponent importCustomField={importCustomField} styles={styles} translate={translate} alignmentStyle={styles.textAlignCenter}/>} containerStyle={[styles.flex1, styles.justifyContentCenter]}/>), [importCustomField, styles, translate]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.ph5, styles.flexRow]}>
                <HelpLinkComponent importCustomField={importCustomField} styles={styles} translate={translate} alignmentStyle={styles.textAlignLeft}/>
            </react_native_1.View>), [styles, importCustomField, translate]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportCustomFieldPage.displayName} headerTitle={`workspace.netsuite.import.importCustomFields.${importCustomField}.title`} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.getRoute(policyID))}>
            {data.length === 0 ? listEmptyComponent : listHeaderComponent}
            {data.map((record, index) => (<OfflineWithFeedback_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={`${record.internalID}-${index}`} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${importCustomField}_${index}`], config?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default description={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.recordTitle`)} shouldShowRightIcon title={'listName' in record ? record.listName : record.segmentName} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_VIEW.getRoute(policyID, importCustomField, index))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([`${importCustomField}_${index}`], config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}

            <FixedFooter_1.default style={[styles.mtAuto, styles.pt3]}>
                <Button_1.default success large isDisabled={!!config?.pendingFields?.[importCustomField]} onPress={() => {
            if (importCustomField === CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_SEGMENTS) {
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD.getRoute(policyID));
            }
            else {
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_LIST_ADD.getRoute(policyID));
            }
        }} text={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.addText`)}/>
            </FixedFooter_1.default>
        </ConnectionLayout_1.default>);
}
NetSuiteImportCustomFieldPage.displayName = 'NetSuiteImportCustomFieldPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomFieldPage);
