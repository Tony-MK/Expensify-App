"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ImportedFromAccountingSoftware_1 = require("@components/ImportedFromAccountingSoftware");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useCleanupSelectedOptions_1 = require("@hooks/useCleanupSelectedOptions");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const TaxRate_1 = require("@libs/actions/TaxRate");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceTaxesPage({ policy, route: { params: { policyID }, }, }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [selectedTaxesIDs, setSelectedTaxesIDs] = (0, react_1.useState)([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const defaultExternalID = policy?.taxRates?.defaultExternalID;
    const foreignTaxDefault = policy?.taxRates?.foreignTaxDefault;
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy?.id}`, { canBeMissing: true });
    const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy) ?? connectionSyncProgress?.connectionName;
    const isConnectionVerified = connectedIntegration && !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const canSelectMultiple = shouldUseNarrowLayout ? isMobileSelectionModeEnabled : true;
    const enabledRatesCount = selectedTaxesIDs.filter((taxID) => !policy?.taxRates?.taxes[taxID]?.isDisabled).length;
    const disabledRatesCount = selectedTaxesIDs.length - enabledRatesCount;
    const fetchTaxes = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyTaxesPage)(policyID);
    }, [policyID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchTaxes });
    (0, react_1.useEffect)(() => {
        fetchTaxes();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const cleanupSelectedOption = (0, react_1.useCallback)(() => setSelectedTaxesIDs([]), []);
    (0, useCleanupSelectedOptions_1.default)(cleanupSelectedOption);
    (0, react_1.useEffect)(() => {
        if (selectedTaxesIDs.length === 0 || !canSelectMultiple) {
            return;
        }
        setSelectedTaxesIDs((prevSelectedTaxesIDs) => {
            const newSelectedTaxesIDs = [];
            for (const taxID of prevSelectedTaxesIDs) {
                if (policy?.taxRates?.taxes?.[taxID] &&
                    policy?.taxRates?.taxes?.[taxID].pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
                    (0, PolicyUtils_1.canEditTaxRate)(policy, taxID)) {
                    newSelectedTaxesIDs.push(taxID);
                }
            }
            return newSelectedTaxesIDs;
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policy?.taxRates?.taxes]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => {
            setSelectedTaxesIDs([]);
        },
        onNavigationCallBack: () => Navigation_1.default.goBack(),
    });
    const textForDefault = (0, react_1.useCallback)((taxID, taxRate) => {
        let suffix;
        if (taxID === defaultExternalID && taxID === foreignTaxDefault) {
            suffix = translate('common.default');
        }
        else if (taxID === defaultExternalID) {
            suffix = translate('workspace.taxes.workspaceDefault');
        }
        else if (taxID === foreignTaxDefault) {
            suffix = translate('workspace.taxes.foreignDefault');
        }
        if (suffix) {
            return `${taxRate.value} ${CONST_1.default.DOT_SEPARATOR} ${suffix}`;
        }
        return `${taxRate.value}`;
    }, [defaultExternalID, foreignTaxDefault, translate]);
    const updateWorkspaceTaxEnabled = (0, react_1.useCallback)((value, taxID) => {
        (0, TaxRate_1.setPolicyTaxesEnabled)(policy, [taxID], value);
    }, [policy]);
    const taxesList = (0, react_1.useMemo)(() => {
        if (!policy) {
            return [];
        }
        return Object.entries(policy.taxRates?.taxes ?? {}).map(([key, value]) => {
            const canEditTaxRate = policy && (0, PolicyUtils_1.canEditTaxRate)(policy, key);
            return {
                text: value.name,
                alternateText: textForDefault(key, value),
                keyForList: key,
                isDisabledCheckbox: !(0, PolicyUtils_1.canEditTaxRate)(policy, key),
                isDisabled: value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                pendingAction: value.pendingAction ?? (Object.keys(value.pendingFields ?? {}).length > 0 ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : null),
                errors: value.errors ?? (0, ErrorUtils_1.getLatestErrorFieldForAnyField)(value),
                rightElement: (<Switch_1.default isOn={!value.isDisabled} disabled={!canEditTaxRate || value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE} accessibilityLabel={translate('workspace.taxes.actions.enable')} onToggle={(newValue) => updateWorkspaceTaxEnabled(newValue, key)}/>),
            };
        });
    }, [policy, textForDefault, translate, updateWorkspaceTaxEnabled]);
    const filterTax = (0, react_1.useCallback)((tax, searchInput) => {
        const taxName = StringUtils_1.default.normalize(tax.text?.toLowerCase() ?? '');
        const taxAlternateText = StringUtils_1.default.normalize(tax.alternateText?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase() ?? '');
        return taxName.includes(normalizedSearchInput) || taxAlternateText.includes(normalizedSearchInput);
    }, []);
    const sortTaxes = (0, react_1.useCallback)((taxes) => {
        return taxes.sort((a, b) => {
            const aText = a.text ?? a.keyForList ?? '';
            const bText = b.text ?? b.keyForList ?? '';
            return localeCompare(aText, bText);
        });
    }, [localeCompare]);
    const [inputValue, setInputValue, filteredTaxesList] = (0, useSearchResults_1.default)(taxesList, filterTax, sortTaxes);
    const isLoading = !isOffline && taxesList === undefined;
    const toggleTax = (tax) => {
        const key = tax.keyForList;
        if (typeof key !== 'string' || key === defaultExternalID || key === foreignTaxDefault) {
            return;
        }
        setSelectedTaxesIDs((prev) => {
            if (prev?.includes(key)) {
                return prev.filter((item) => item !== key);
            }
            return [...prev, key];
        });
    };
    const toggleAllTaxes = () => {
        const taxesToSelect = filteredTaxesList.filter((tax) => tax.keyForList !== defaultExternalID && tax.keyForList !== foreignTaxDefault && tax.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        setSelectedTaxesIDs((prev) => {
            if (prev.length > 0) {
                return [];
            }
            return taxesToSelect.map((item) => (item.keyForList ? item.keyForList : ''));
        });
    };
    const getCustomListHeader = () => {
        if (filteredTaxesList.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.name')} rightHeaderText={translate('common.enabled')}/>);
    };
    const deleteTaxes = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        (0, TaxRate_1.deletePolicyTaxes)(policy, selectedTaxesIDs, localeCompare);
        setIsDeleteModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedTaxesIDs([]);
        });
    }, [policy, selectedTaxesIDs, localeCompare]);
    const toggleTaxes = (0, react_1.useCallback)((isEnabled) => {
        if (!policy?.id) {
            return;
        }
        (0, TaxRate_1.setPolicyTaxesEnabled)(policy, selectedTaxesIDs, isEnabled);
        setSelectedTaxesIDs([]);
    }, [policy, selectedTaxesIDs]);
    const navigateToEditTaxRate = (taxRate) => {
        if (!taxRate.keyForList) {
            return;
        }
        if (isSmallScreenWidth && isMobileSelectionModeEnabled) {
            toggleTax(taxRate);
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, taxRate.keyForList));
    };
    const dropdownMenuOptions = (0, react_1.useMemo)(() => {
        const isMultiple = selectedTaxesIDs.length > 1;
        const options = [];
        if (!hasAccountingConnections) {
            options.push({
                icon: Expensicons.Trashcan,
                text: isMultiple ? translate('workspace.taxes.actions.deleteMultiple') : translate('workspace.taxes.actions.delete'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                onSelected: () => setIsDeleteModalVisible(true),
            });
        }
        // `Disable rates` when at least one enabled rate is selected.
        if (selectedTaxesIDs.some((taxID) => !policy?.taxRates?.taxes[taxID]?.isDisabled)) {
            options.push({
                icon: Expensicons.Close,
                text: translate('workspace.taxes.actions.disableTaxRates', { count: enabledRatesCount }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                onSelected: () => toggleTaxes(false),
            });
        }
        // `Enable rates` when at least one disabled rate is selected.
        if (selectedTaxesIDs.some((taxID) => policy?.taxRates?.taxes[taxID]?.isDisabled)) {
            options.push({
                icon: Expensicons.Checkmark,
                text: translate('workspace.taxes.actions.enableTaxRates', { count: disabledRatesCount }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                onSelected: () => toggleTaxes(true),
            });
        }
        return options;
    }, [hasAccountingConnections, policy?.taxRates?.taxes, selectedTaxesIDs, toggleTaxes, translate, enabledRatesCount, disabledRatesCount]);
    const shouldShowBulkActionsButton = shouldUseNarrowLayout ? isMobileSelectionModeEnabled : selectedTaxesIDs.length > 0;
    const secondaryActions = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons.Gear,
            text: translate('common.settings'),
            onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS.getRoute(policyID)),
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        },
    ], [policyID, translate]);
    const headerButtons = !shouldShowBulkActionsButton ? (<react_native_1.View style={[styles.w100, styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
            {!hasAccountingConnections && (<Button_1.default success onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAX_CREATE.getRoute(policyID))} icon={Expensicons.Plus} text={translate('workspace.taxes.addRate')} style={[shouldUseNarrowLayout && styles.flex1]}/>)}
            <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldUseOptionIcon customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={hasAccountingConnections ? styles.flexGrow1 : styles.flexGrow0}/>
        </react_native_1.View>) : (<ButtonWithDropdownMenu_1.default onPress={() => { }} options={dropdownMenuOptions} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedTaxesIDs.length })} shouldAlwaysShowDropdownMenu isSplitButton={false} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedTaxesIDs.length}/>);
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                {!hasSyncError && isConnectionVerified && currentConnectionName ? (<ImportedFromAccountingSoftware_1.default policyID={policyID} currentConnectionName={currentConnectionName} connectedIntegration={connectedIntegration} translatedText={translate('workspace.taxes.importedFromAccountingSoftware')}/>) : (<Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.taxes.subtitle')}</Text_1.default>)}
            </react_native_1.View>
            {taxesList.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.taxes.findTaxRate')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={filteredTaxesList.length === 0}/>)}
        </>);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceTaxesPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                <HeaderWithBackButton_1.default icon={!selectionModeHeader ? Illustrations.Coins : undefined} shouldUseHeadlineHeader={!selectionModeHeader} title={translate(selectionModeHeader ? 'common.selectMultiple' : 'workspace.common.taxes')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedTaxesIDs([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            Navigation_1.default.popToSidebar();
        }}>
                    {!shouldUseNarrowLayout && headerButtons}
                </HeaderWithBackButton_1.default>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{headerButtons}</react_native_1.View>}
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                <SelectionListWithModal_1.default canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress onTurnOnSelectionMode={(item) => item && toggleTax(item)} sections={[{ data: filteredTaxesList, isDisabled: false }]} shouldUseDefaultRightHandSideCheckmark={false} selectedItems={selectedTaxesIDs} onCheckboxPress={toggleTax} onSelectRow={navigateToEditTaxRate} onSelectAll={filteredTaxesList.length > 0 ? toggleAllTaxes : undefined} ListItem={TableListItem_1.default} listHeaderContent={headerContent} shouldShowListEmptyContent={false} customListHeader={getCustomListHeader()} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} onDismissError={(item) => (item.keyForList ? (0, TaxRate_1.clearTaxRateError)(policyID, item.keyForList, item.pendingAction) : undefined)} showScrollIndicator={false} addBottomSafeAreaPadding/>
                <ConfirmModal_1.default title={translate('workspace.taxes.actions.delete')} isVisible={isDeleteModalVisible} onConfirm={deleteTaxes} onCancel={() => setIsDeleteModalVisible(false)} prompt={selectedTaxesIDs.length > 1
            ? translate('workspace.taxes.deleteMultipleTaxConfirmation', { taxAmount: selectedTaxesIDs.length })
            : translate('workspace.taxes.deleteTaxConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceTaxesPage.displayName = 'WorkspaceTaxesPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceTaxesPage);
