"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function getDisplayTypeTranslationKeys(displayType) {
    switch (displayType) {
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT: {
            return { titleKey: 'workspace.intacct.employeeDefault', descriptionKey: 'workspace.intacct.employeeDefaultDescription' };
        }
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG: {
            return { titleKey: 'workspace.common.tags', descriptionKey: 'workspace.intacct.displayedAsTagDescription' };
        }
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.REPORT_FIELD: {
            return { titleKey: 'workspace.common.reportFields', descriptionKey: 'workspace.intacct.displayedAsReportFieldDescription' };
        }
        default: {
            return undefined;
        }
    }
}
function SageIntacctToggleMappingsPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(route.params.policyID);
    const mappingName = route.params.mapping;
    const policyID = policy?.id ?? '-1';
    const config = policy?.connections?.intacct?.config;
    const isImportMappingEnable = config?.mappings?.[mappingName] !== CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.NONE;
    const isAccordionExpanded = (0, react_native_reanimated_1.useSharedValue)(isImportMappingEnable);
    const shouldAnimateAccordionSection = (0, react_native_reanimated_1.useSharedValue)(false);
    // We are storing translation keys in the local state for animation purposes.
    // Otherwise, the values change to undefined immediately after clicking, before the closing animation finishes,
    // resulting in a janky animation effect.
    const [translationKeys, setTranslationKey] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        if (!isImportMappingEnable) {
            return;
        }
        setTranslationKey(getDisplayTypeTranslationKeys(config?.mappings?.[mappingName]));
    }, [isImportMappingEnable, config?.mappings, mappingName]);
    return (<ConnectionLayout_1.default displayName={SageIntacctToggleMappingsPage.displayName} headerTitleAlreadyTranslated={expensify_common_1.Str.recapitalize(translate('workspace.intacct.mappingTitle', { mappingName }))} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT.getRoute(policyID))}>
            <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.w100, styles.mb5, styles.ph5]}>
                <Text_1.default style={[styles.textNormal]}>{translate('workspace.intacct.toggleImportTitleFirstPart')}</Text_1.default>
                <Text_1.default style={[styles.textStrong]}>{translate('workspace.intacct.mappingTitle', { mappingName })}</Text_1.default>
                <Text_1.default style={[styles.textNormal]}>{translate('workspace.intacct.toggleImportTitleSecondPart')}</Text_1.default>
            </Text_1.default>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={`${translate('workspace.accounting.import')} ${translate('workspace.intacct.mappingTitle', { mappingName })}`} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.mv3, styles.mh5]} isActive={isImportMappingEnable} onToggle={(enabled) => {
            const mappingValue = enabled ? CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG : CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.NONE;
            (0, SageIntacct_1.updateSageIntacctMappingValue)(policyID, mappingName, mappingValue, config?.mappings?.[mappingName]);
            isAccordionExpanded.set(enabled);
            shouldAnimateAccordionSection.set(true);
        }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([mappingName], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, mappingName)} onCloseError={() => (0, SageIntacct_1.clearSageIntacctErrorField)(policyID, mappingName)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([mappingName], config?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={translationKeys?.titleKey ? translate(translationKeys?.titleKey) : undefined} description={translate('workspace.common.displayedAs')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_MAPPINGS_TYPE.getRoute(policyID, mappingName))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([mappingName], config?.errorFields) ? 'error' : undefined} hintText={translationKeys?.descriptionKey ? translate(translationKeys?.descriptionKey) : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctToggleMappingsPage.displayName = 'SageIntacctToggleMappingsPage';
exports.default = SageIntacctToggleMappingsPage;
