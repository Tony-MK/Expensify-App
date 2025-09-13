"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ImportSpreadsheet_1 = require("@components/ImportSpreadsheet");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useCloseImportPage_1 = require("@hooks/useCloseImportPage");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Tag_1 = require("@libs/actions/Policy/Tag");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportMultiLevelTagsSettingsPage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const backTo = route.params.backTo;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isImportingTags, setIsImportingTags] = (0, react_1.useState)(false);
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        (0, Tag_1.setImportedSpreadsheetIsFirstLineHeader)(true);
        (0, Tag_1.setImportedSpreadsheetIsImportingIndependentMultiLevelTags)(true);
        (0, Tag_1.setImportedSpreadsheetIsGLAdjacent)(false);
    }, []);
    if (hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImportingTags(false);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID));
    };
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={ImportSpreadsheet_1.default.displayName} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.importTags')} onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.WORKSPACE_TAGS_IMPORT.getRoute(policyID))}/>
                <FullPageOfflineBlockingView_1.default>
                    <Text_1.default style={[styles.textSupporting, styles.textNormal, styles.ph5]}>{translate('workspace.tags.configureMultiLevelTags')}</Text_1.default>

                    <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mv4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                        <Text_1.default style={[styles.textNormal, styles.flex1]}>{translate('workspace.tags.importMultiLevelTags.firstRowTitle')}</Text_1.default>
                        <Switch_1.default isOn={spreadsheet?.containsHeader ?? true} accessibilityLabel={translate('workspace.tags.importMultiLevelTags.firstRowTitle')} onToggle={(value) => {
            (0, Tag_1.setImportedSpreadsheetIsFirstLineHeader)(value);
        }}/>
                    </react_native_1.View>

                    <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mv4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                        <Text_1.default style={[styles.textNormal, styles.flex1, styles.mr2]}>{translate('workspace.tags.importMultiLevelTags.independentTags')}</Text_1.default>
                        <Switch_1.default isOn={spreadsheet?.isImportingIndependentMultiLevelTags ?? true} accessibilityLabel={translate('workspace.tags.importMultiLevelTags.independentTags')} onToggle={(value) => {
            (0, Tag_1.setImportedSpreadsheetIsImportingIndependentMultiLevelTags)(value);
        }}/>
                    </react_native_1.View>

                    <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mv4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                        <Text_1.default style={[styles.textNormal, styles.flex1, styles.mr2]}>{translate('workspace.tags.importMultiLevelTags.glAdjacentColumn')}</Text_1.default>
                        <Switch_1.default isOn={spreadsheet?.isGLAdjacent ?? false} accessibilityLabel={translate('workspace.tags.importMultiLevelTags.glAdjacentColumn')} onToggle={(value) => {
            (0, Tag_1.setImportedSpreadsheetIsGLAdjacent)(value);
        }}/>
                    </react_native_1.View>

                    <FixedFooter_1.default style={[styles.mtAuto]} addBottomSafeAreaPadding>
                        <Button_1.default text={spreadsheet?.isImportingIndependentMultiLevelTags ? translate('common.next') : translate('common.import')} onPress={() => {
            if (spreadsheet?.isImportingIndependentMultiLevelTags) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAGS_IMPORTED_MULTI_LEVEL.getRoute(policyID));
            }
            else {
                setIsImportingTags(true);
                (0, Tag_1.importMultiLevelTags)(policyID, spreadsheet);
            }
        }} isLoading={isImportingTags} success large/>
                    </FixedFooter_1.default>
                    <ConfirmModal_1.default isVisible={isFocused && (spreadsheet?.shouldFinalModalBeOpened ?? false)} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
                </FullPageOfflineBlockingView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ImportMultiLevelTagsSettingsPage.displayName = 'ImportMultiLevelTagsSettingsPage';
exports.default = ImportMultiLevelTagsSettingsPage;
