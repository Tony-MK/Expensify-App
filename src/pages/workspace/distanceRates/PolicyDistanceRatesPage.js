"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useFilteredSelection_1 = require("@hooks/useFilteredSelection");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const DistanceRate_1 = require("@libs/actions/Policy/DistanceRate");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const LocaleCompare_1 = require("@libs/LocaleCompare");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ButtonWithDropdownMenu_1 = require("@src/components/ButtonWithDropdownMenu");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function PolicyDistanceRatesPage({ route: { params: { policyID }, }, }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isWarningModalVisible, setIsWarningModalVisible] = (0, react_1.useState)(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const policy = (0, usePolicy_1.default)(policyID);
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const canSelectMultiple = shouldUseNarrowLayout ? isMobileSelectionModeEnabled : true;
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const customUnitRates = (0, react_1.useMemo)(() => customUnit?.rates ?? {}, [customUnit]);
    const selectableRates = (0, react_1.useMemo)(() => Object.values(customUnitRates).reduce((acc, rate) => {
        acc[rate.customUnitRateID] = rate;
        return acc;
    }, {}), [customUnitRates]);
    const rateIDs = new Set(Object.keys(selectableRates));
    const [policyReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, {
        selector: (reports) => {
            return Object.values(reports ?? {}).reduce((reportIDs, report) => {
                if (report && report.policyID === policyID) {
                    reportIDs.add(report.reportID);
                }
                return reportIDs;
            }, new Set());
        },
        canBeMissing: true,
    });
    const [eligibleTransactionsData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (transactions) => {
            if (!customUnit?.customUnitID || rateIDs.size === 0) {
                return undefined;
            }
            return Object.values(transactions ?? {}).reduce((transactionsData, transaction) => {
                if (transaction &&
                    transaction.reportID &&
                    policyReports?.has(transaction.reportID) &&
                    customUnit?.customUnitID &&
                    transaction?.comment?.customUnit?.customUnitID === customUnit.customUnitID &&
                    transaction?.comment?.customUnit?.customUnitRateID &&
                    rateIDs.has(transaction?.comment?.customUnit?.customUnitRateID)) {
                    transactionsData.transactionIDs.add(transaction.transactionID);
                    if (!transactionsData.rateIDToTransactionIDsMap[transaction?.comment?.customUnit?.customUnitRateID]) {
                        // eslint-disable-next-line no-param-reassign
                        transactionsData.rateIDToTransactionIDsMap[transaction?.comment?.customUnit?.customUnitRateID] = [];
                    }
                    transactionsData.rateIDToTransactionIDsMap[transaction?.comment?.customUnit?.customUnitRateID]?.push(transaction?.transactionID);
                }
                return transactionsData;
            }, { transactionIDs: new Set(), rateIDToTransactionIDsMap: {} });
        },
        canBeMissing: true,
    });
    const eligibleTransactionIDs = eligibleTransactionsData?.transactionIDs;
    const [transactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, {
        selector: (violations) => {
            if (!eligibleTransactionIDs || eligibleTransactionIDs.size === 0) {
                return undefined;
            }
            return Object.fromEntries(Object.entries(violations ?? {}).filter(([key]) => {
                const id = key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, '');
                return eligibleTransactionIDs?.has(id);
            }));
        },
        canBeMissing: true,
    });
    const filterRateSelection = (0, react_1.useCallback)((rate) => !!rate && !!customUnitRates?.[rate.customUnitRateID] && customUnitRates?.[rate.customUnitRateID]?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, [customUnitRates]);
    const [selectedDistanceRates, setSelectedDistanceRates] = (0, useFilteredSelection_1.default)(selectableRates, filterRateSelection);
    const canDisableOrDeleteSelectedRates = (0, react_1.useMemo)(() => Object.keys(selectableRates)
        .filter((rateID) => !selectedDistanceRates.includes(rateID))
        .some((rateID) => selectableRates[rateID].enabled), [selectableRates, selectedDistanceRates]);
    const fetchDistanceRates = (0, react_1.useCallback)(() => {
        (0, DistanceRate_1.openPolicyDistanceRatesPage)(policyID);
    }, [policyID]);
    const dismissError = (0, react_1.useCallback)((item) => {
        if (!customUnit?.customUnitID) {
            return;
        }
        if (customUnitRates[item.value].errors) {
            (0, DistanceRate_1.clearDeleteDistanceRateError)(policyID, customUnit.customUnitID, item.value);
            return;
        }
        (0, DistanceRate_1.clearCreateDistanceRateItemAndError)(policyID, customUnit.customUnitID, item.value);
    }, [customUnit?.customUnitID, customUnitRates, policyID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchDistanceRates });
    (0, react_1.useEffect)(() => {
        fetchDistanceRates();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => setSelectedDistanceRates([]),
        onNavigationCallBack: () => Navigation_1.default.goBack(),
    });
    const canDisableOrDeleteRate = (0, react_1.useCallback)((rateID) => {
        return Object.values(customUnit?.rates ?? {}).some((distanceRate) => distanceRate?.enabled && rateID !== distanceRate?.customUnitRateID && distanceRate?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    }, [customUnit?.rates]);
    const updateDistanceRateEnabled = (0, react_1.useCallback)((value, rateID) => {
        if (!customUnit) {
            return;
        }
        const rate = customUnit?.rates?.[rateID];
        // Rates can be disabled or deleted as long as in the remaining rates there is always at least one enabled rate and there are no pending delete actions
        if (!rate?.enabled || canDisableOrDeleteRate(rateID)) {
            (0, DistanceRate_1.setPolicyDistanceRatesEnabled)(policyID, customUnit, [{ ...rate, enabled: value }]);
        }
        else {
            setIsWarningModalVisible(true);
        }
    }, [canDisableOrDeleteRate, customUnit, policyID]);
    const distanceRatesList = (0, react_1.useMemo)(() => Object.values(customUnitRates).map((value) => ({
        rate: value.rate,
        value: value.customUnitRateID,
        text: value.name,
        alternateText: `${(0, CurrencyUtils_1.convertAmountToDisplayString)(value.rate, value.currency ?? CONST_1.default.CURRENCY.USD)} / ${translate(`common.${customUnit?.attributes?.unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES}`)}`,
        keyForList: value.customUnitRateID,
        isDisabled: value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        pendingAction: value.pendingAction ??
            value.pendingFields?.rate ??
            value.pendingFields?.enabled ??
            value.pendingFields?.currency ??
            value.pendingFields?.taxRateExternalID ??
            value.pendingFields?.taxClaimablePercentage ??
            (policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD ? policy?.pendingAction : undefined),
        errors: value.errors ?? undefined,
        rightElement: (<Switch_1.default isOn={!!value?.enabled} accessibilityLabel={translate('workspace.distanceRates.trackTax')} onToggle={(newValue) => updateDistanceRateEnabled(newValue, value.customUnitRateID)} showLockIcon={!canDisableOrDeleteRate(value.customUnitRateID)} disabled={value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE}/>),
    })), [canDisableOrDeleteRate, customUnitRates, translate, customUnit, policy?.pendingAction, updateDistanceRateEnabled]);
    const filterRate = (0, react_1.useCallback)((rate, searchInput) => {
        const rateText = StringUtils_1.default.normalize(rate.text?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase());
        return rateText.includes(normalizedSearchInput);
    }, []);
    const sortRates = (0, react_1.useCallback)((rates) => rates.sort((a, b) => (0, LocaleCompare_1.default)(a.text ?? '', b.text ?? '')), []);
    const [inputValue, setInputValue, filteredDistanceRatesList] = (0, useSearchResults_1.default)(distanceRatesList, filterRate, sortRates);
    const addRate = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CREATE_DISTANCE_RATE.getRoute(policyID));
    };
    const openSettings = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATES_SETTINGS.getRoute(policyID));
    }, [policyID]);
    const openRateDetails = (rate) => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_DETAILS.getRoute(policyID, rate.value));
    };
    const disableRates = () => {
        if (customUnit === undefined) {
            return;
        }
        (0, DistanceRate_1.setPolicyDistanceRatesEnabled)(policyID, customUnit, selectedDistanceRates
            .map((rateID) => selectableRates[rateID])
            .filter((rate) => rate.enabled)
            .map((rate) => ({ ...rate, enabled: false })));
        setSelectedDistanceRates([]);
    };
    const enableRates = () => {
        if (customUnit === undefined) {
            return;
        }
        (0, DistanceRate_1.setPolicyDistanceRatesEnabled)(policyID, customUnit, selectedDistanceRates
            .map((rateID) => selectableRates[rateID])
            .filter((rate) => !rate.enabled)
            .map((rate) => ({ ...rate, enabled: true })));
        setSelectedDistanceRates([]);
    };
    const deleteRates = () => {
        if (customUnit === undefined) {
            return;
        }
        const transactionIDsAffected = selectedDistanceRates.flatMap((rateID) => eligibleTransactionsData?.rateIDToTransactionIDsMap?.[rateID] ?? []);
        (0, DistanceRate_1.deletePolicyDistanceRates)(policyID, customUnit, selectedDistanceRates, transactionIDsAffected, transactionViolations);
        setIsDeleteModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedDistanceRates([]);
        });
    };
    const toggleRate = (rate) => {
        setSelectedDistanceRates((prevSelectedRates) => {
            if (prevSelectedRates.includes(rate.value)) {
                return prevSelectedRates.filter((selectedRate) => selectedRate !== rate.value);
            }
            return [...prevSelectedRates, rate.value];
        });
    };
    const toggleAllRates = () => {
        if (selectedDistanceRates.length > 0) {
            setSelectedDistanceRates([]);
        }
        else {
            setSelectedDistanceRates(Object.entries(selectableRates)
                .filter(([, rate]) => rate.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && filteredDistanceRatesList.some((item) => item.value === rate.customUnitRateID))
                .map(([key]) => key));
        }
    };
    const getCustomListHeader = () => {
        if (filteredDistanceRatesList.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('workspace.distanceRates.rate')} rightHeaderText={translate('common.enabled')}/>);
    };
    const getBulkActionsButtonOptions = () => {
        const options = [
            {
                text: translate('workspace.distanceRates.deleteRates', { count: selectedDistanceRates.length }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                icon: Expensicons.Trashcan,
                onSelected: () => (canDisableOrDeleteSelectedRates ? setIsDeleteModalVisible(true) : setIsWarningModalVisible(true)),
            },
        ];
        const enabledRates = selectedDistanceRates.filter((rateID) => selectableRates[rateID].enabled);
        if (enabledRates.length > 0) {
            options.push({
                text: translate('workspace.distanceRates.disableRates', { count: enabledRates.length }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                icon: Expensicons.Close,
                onSelected: () => (canDisableOrDeleteSelectedRates ? disableRates() : setIsWarningModalVisible(true)),
            });
        }
        const disabledRates = selectedDistanceRates.filter((rateID) => !selectableRates[rateID].enabled);
        if (disabledRates.length > 0) {
            options.push({
                text: translate('workspace.distanceRates.enableRates', { count: disabledRates.length }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                icon: Expensicons.Checkmark,
                onSelected: enableRates,
            });
        }
        return options;
    };
    const isLoading = !isOffline && customUnit === undefined;
    const secondaryActions = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons.Gear,
            text: translate('common.settings'),
            onSelected: openSettings,
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        },
    ], [openSettings, translate]);
    const headerButtons = (<react_native_1.View style={[styles.w100, styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
            {(shouldUseNarrowLayout ? !isMobileSelectionModeEnabled : selectedDistanceRates.length === 0) ? (<>
                    <Button_1.default text={translate('workspace.distanceRates.addRate')} onPress={addRate} style={[shouldUseNarrowLayout && styles.flex1]} icon={Expensicons.Plus} success/>
                    <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldUseOptionIcon customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={styles.flexGrow0}/>
                </>) : (<ButtonWithDropdownMenu_1.default shouldAlwaysShowDropdownMenu pressOnEnter customText={translate('workspace.common.selected', { count: selectedDistanceRates.length })} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} onPress={() => null} options={getBulkActionsButtonOptions()} style={[shouldUseNarrowLayout && styles.flexGrow1]} wrapperStyle={styles.w100} isSplitButton={false} isDisabled={!selectedDistanceRates.length}/>)}
        </react_native_1.View>);
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            {Object.values(customUnitRates).length > 0 && (<react_native_1.View style={[styles.ph5, styles.pb5, styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.distanceRates.centrallyManage')}</Text_1.default>
                </react_native_1.View>)}
            {Object.values(customUnitRates).length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.distanceRates.findRate')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={filteredDistanceRatesList.length === 0}/>)}
        </>);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRatesPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                <HeaderWithBackButton_1.default icon={!selectionModeHeader ? Illustrations.CarIce : undefined} shouldUseHeadlineHeader={!selectionModeHeader} title={translate(!selectionModeHeader ? 'workspace.common.distanceRates' : 'common.selectMultiple')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedDistanceRates([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            Navigation_1.default.popToSidebar();
        }}>
                    {!shouldUseNarrowLayout && headerButtons}
                </HeaderWithBackButton_1.default>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.ph5]}>{headerButtons}</react_native_1.View>}
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                {Object.values(customUnitRates).length > 0 && (<SelectionListWithModal_1.default addBottomSafeAreaPadding canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress onTurnOnSelectionMode={(item) => item && toggleRate(item)} sections={[{ data: filteredDistanceRatesList, isDisabled: false }]} shouldUseDefaultRightHandSideCheckmark={false} selectedItems={selectedDistanceRates} onCheckboxPress={toggleRate} onSelectRow={openRateDetails} onSelectAll={filteredDistanceRatesList.length > 0 ? toggleAllRates : undefined} onDismissError={dismissError} ListItem={TableListItem_1.default} listHeaderContent={headerContent} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} customListHeader={getCustomListHeader()} shouldShowListEmptyContent={false} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} showScrollIndicator={false}/>)}
                <ConfirmModal_1.default onConfirm={() => setIsWarningModalVisible(false)} onCancel={() => setIsWarningModalVisible(false)} isVisible={isWarningModalVisible} title={translate('workspace.distanceRates.oopsNotSoFast')} prompt={translate('workspace.distanceRates.workspaceNeeds')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                <ConfirmModal_1.default title={translate('workspace.distanceRates.deleteDistanceRate')} isVisible={isDeleteModalVisible} onConfirm={deleteRates} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('workspace.distanceRates.areYouSureDelete', { count: selectedDistanceRates.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRatesPage.displayName = 'PolicyDistanceRatesPage';
exports.default = PolicyDistanceRatesPage;
