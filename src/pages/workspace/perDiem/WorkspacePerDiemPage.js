"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const TableRowSkeleton_1 = require("@components/Skeletons/TableRowSkeleton");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCleanupSelectedOptions_1 = require("@hooks/useCleanupSelectedOptions");
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
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Link_1 = require("@userActions/Link");
const MobileSelectionMode_1 = require("@userActions/MobileSelectionMode");
const Modal_1 = require("@userActions/Modal");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function getSubRatesData(customUnitRates) {
    const subRatesData = [];
    for (const rate of customUnitRates) {
        const subRates = rate.subRates;
        if (subRates) {
            for (const subRate of subRates) {
                subRatesData.push({
                    pendingAction: rate.pendingAction,
                    destination: rate.name ?? '',
                    subRateName: subRate.name,
                    rate: subRate.rate,
                    currency: rate.currency ?? CONST_1.default.CURRENCY.USD,
                    rateID: rate.customUnitRateID,
                    subRateID: subRate.id,
                });
            }
        }
    }
    return subRatesData;
}
function generateSingleSubRateData(customUnitRates, rateID, subRateID) {
    const selectedRate = customUnitRates.find((rate) => rate.customUnitRateID === rateID);
    if (!selectedRate) {
        return null;
    }
    const selectedSubRate = selectedRate.subRates?.find((subRate) => subRate.id === subRateID);
    if (!selectedSubRate) {
        return null;
    }
    return {
        pendingAction: selectedRate.pendingAction,
        destination: selectedRate.name ?? '',
        subRateName: selectedSubRate.name,
        rate: selectedSubRate.rate,
        currency: selectedRate.currency ?? CONST_1.default.CURRENCY.USD,
        rateID: selectedRate.customUnitRateID,
        subRateID: selectedSubRate.id,
    };
}
function WorkspacePerDiemPage({ route }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const [selectedPerDiem, setSelectedPerDiem] = (0, react_1.useState)([]);
    const [deletePerDiemConfirmModalVisible, setDeletePerDiemConfirmModalVisible] = (0, react_1.useState)(false);
    const [isDownloadFailureModalVisible, setIsDownloadFailureModalVisible] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const backTo = route.params?.backTo;
    const policy = (0, usePolicy_1.default)(policyID);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: false });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [customUnit, allRatesArray, allSubRates] = (0, react_1.useMemo)(() => {
        const customUnits = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
        const customUnitRates = customUnits?.rates ?? {};
        const allRates = Object.values(customUnitRates);
        const allSubRatesMemo = getSubRatesData(allRates);
        return [customUnits, allRates, allSubRatesMemo];
    }, [policy]);
    const canSelectMultiple = shouldUseNarrowLayout ? isMobileSelectionModeEnabled : true;
    const fetchPerDiem = (0, react_1.useCallback)(() => {
        (0, PerDiem_1.openPolicyPerDiemPage)(policyID);
    }, [policyID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchPerDiem });
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        fetchPerDiem();
    }, [fetchPerDiem]));
    const cleanupSelectedOption = (0, react_1.useCallback)(() => setSelectedPerDiem([]), []);
    (0, useCleanupSelectedOptions_1.default)(cleanupSelectedOption);
    const subRatesList = (0, react_1.useMemo)(() => allSubRates.map((value) => {
        const isDisabled = value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        return {
            text: value.destination,
            subRateID: value.subRateID,
            rateID: value.rateID,
            keyForList: value.subRateID,
            isDisabled,
            pendingAction: value.pendingAction,
            rightElement: (<>
                            <react_native_1.View style={styles.flex2}>
                                <Text_1.default numberOfLines={1} style={[styles.alignItemsStart, styles.textSupporting, styles.label, styles.pl2]}>
                                    {value.subRateName}
                                </Text_1.default>
                            </react_native_1.View>
                            <react_native_1.View style={styles.flex2}>
                                <Text_1.default numberOfLines={1} style={[styles.alignSelfEnd, styles.textSupporting, styles.pl2, styles.label]}>
                                    {(0, CurrencyUtils_1.convertAmountToDisplayString)(value.rate, value.currency)}
                                </Text_1.default>
                            </react_native_1.View>
                        </>),
        };
    }), [allSubRates, styles.flex2, styles.alignItemsStart, styles.textSupporting, styles.label, styles.pl2, styles.alignSelfEnd]);
    const filterRate = (0, react_1.useCallback)((rate, searchInput) => {
        const rateText = StringUtils_1.default.normalize(rate.text?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase());
        return rateText.includes(normalizedSearchInput);
    }, []);
    const sortRates = (0, react_1.useCallback)((rates) => rates.sort((a, b) => localeCompare(a.text ?? '', b.text ?? '')), [localeCompare]);
    const [inputValue, setInputValue, filteredSubRatesList] = (0, useSearchResults_1.default)(subRatesList, filterRate, sortRates);
    const toggleSubRate = (subRate) => {
        if (selectedPerDiem.find((selectedSubRate) => selectedSubRate.subRateID === subRate.subRateID) !== undefined) {
            setSelectedPerDiem((prev) => prev.filter((selectedSubRate) => selectedSubRate.subRateID !== subRate.subRateID));
        }
        else {
            const subRateData = generateSingleSubRateData(allRatesArray, subRate.rateID, subRate.subRateID);
            if (!subRateData) {
                return;
            }
            setSelectedPerDiem((prev) => [...prev, subRateData]);
        }
    };
    const toggleAllSubRates = () => {
        if (selectedPerDiem.length > 0) {
            setSelectedPerDiem([]);
        }
        else {
            const availablePerDiemRates = allSubRates.filter((subRate) => subRate.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && filteredSubRatesList.some((filteredSubRate) => filteredSubRate.subRateID === subRate.subRateID));
            setSelectedPerDiem(availablePerDiemRates);
        }
    };
    const getCustomListHeader = () => {
        if (filteredSubRatesList.length === 0) {
            return null;
        }
        const header = (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentBetween, canSelectMultiple && styles.pl3]}>
                <react_native_1.View style={styles.flex3}>
                    <Text_1.default style={[styles.textMicroSupporting, styles.alignSelfStart]}>{translate('common.destination')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.flex2}>
                    <Text_1.default style={[styles.textMicroSupporting, styles.alignItemsStart, styles.pl2]}>{translate('common.subrate')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.flex2}>
                    <Text_1.default style={[styles.textMicroSupporting, styles.alignSelfEnd]}>{translate('workspace.perDiem.amount')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>);
        if (canSelectMultiple) {
            return header;
        }
        return <react_native_1.View style={!canSelectMultiple && [styles.ph9, styles.pv3, styles.pb5]}>{header}</react_native_1.View>;
    };
    const openSettings = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_SETTINGS.getRoute(policyID));
    }, [policyID]);
    const openSubRateDetails = (rate) => {
        if (isSmallScreenWidth && isMobileSelectionModeEnabled) {
            toggleSubRate(rate);
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rate.rateID, rate.subRateID));
    };
    const handleDeletePerDiemRates = () => {
        (0, PerDiem_1.deleteWorkspacePerDiemRates)(policyID, customUnit, selectedPerDiem);
        setDeletePerDiemConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedPerDiem([]);
        });
    };
    const hasVisibleSubRates = subRatesList.some((subRate) => subRate.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline);
    const secondaryActions = (0, react_1.useMemo)(() => {
        const menuItems = [];
        if (policy?.areCategoriesEnabled && (0, OptionsListUtils_1.hasEnabledOptions)(policyCategories ?? {})) {
            menuItems.push({
                icon: Expensicons.Gear,
                text: translate('common.settings'),
                onSelected: openSettings,
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
            });
        }
        menuItems.push({
            icon: Expensicons.Table,
            text: translate('spreadsheet.importSpreadsheet'),
            onSelected: () => {
                if (isOffline) {
                    (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORT.getRoute(policyID));
            },
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.IMPORT_SPREADSHEET,
        });
        if (hasVisibleSubRates) {
            menuItems.push({
                icon: Expensicons.Download,
                text: translate('spreadsheet.downloadCSV'),
                onSelected: () => {
                    if (isOffline) {
                        (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                        return;
                    }
                    (0, PerDiem_1.downloadPerDiemCSV)(policyID, () => {
                        setIsDownloadFailureModalVisible(true);
                    });
                },
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.DOWNLOAD_CSV,
            });
        }
        return menuItems;
    }, [policy?.areCategoriesEnabled, policyCategories, translate, hasVisibleSubRates, openSettings, isOffline, policyID]);
    const getHeaderButtons = () => {
        const options = [];
        if (shouldUseNarrowLayout ? canSelectMultiple : selectedPerDiem.length > 0) {
            options.push({
                icon: Expensicons.Trashcan,
                text: translate('workspace.perDiem.deleteRates', { count: selectedPerDiem.length }),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                onSelected: () => setDeletePerDiemConfirmModalVisible(true),
            });
            return (<ButtonWithDropdownMenu_1.default onPress={() => null} shouldAlwaysShowDropdownMenu buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedPerDiem.length })} options={options} isSplitButton={false} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedPerDiem.length}/>);
        }
        return (<react_native_1.View style={[styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
                <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={styles.flexGrow1}/>
            </react_native_1.View>);
    };
    const isLoading = !isOffline && customUnit === undefined;
    (0, react_1.useEffect)(() => {
        if (isMobileSelectionModeEnabled) {
            return;
        }
        setSelectedPerDiem([]);
    }, [setSelectedPerDiem, isMobileSelectionModeEnabled]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => {
            setSelectedPerDiem([]);
        },
        onNavigationCallBack: () => Navigation_1.default.goBack(backTo),
    });
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                <Text_1.default>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.perDiem.subtitle')}</Text_1.default>
                    <TextLink_1.default style={[styles.textNormal, styles.link]} onPress={() => (0, Link_1.openExternalLink)(CONST_1.default.DEEP_DIVE_PER_DIEM)}>
                        {translate('workspace.common.learnMore')}
                    </TextLink_1.default>
                    .
                </Text_1.default>
            </react_native_1.View>
            {subRatesList.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.perDiem.findPerDiemRate')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={hasVisibleSubRates && !isLoading && filteredSubRatesList.length === 0}/>)}
        </>);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspacePerDiemPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto}>
                <HeaderWithBackButton_1.default shouldShowBackButton={shouldUseNarrowLayout} title={translate(selectionModeHeader ? 'common.selectMultiple' : 'common.perDiem')} icon={!selectionModeHeader ? Illustrations.PerDiem : undefined} shouldUseHeadlineHeader={!selectionModeHeader} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedPerDiem([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            if (backTo) {
                Navigation_1.default.goBack(backTo);
                return;
            }
            Navigation_1.default.popToSidebar();
        }}>
                    {!shouldUseNarrowLayout && getHeaderButtons()}
                </HeaderWithBackButton_1.default>
                <ConfirmModal_1.default isVisible={deletePerDiemConfirmModalVisible} onConfirm={handleDeletePerDiemRates} onCancel={() => setDeletePerDiemConfirmModalVisible(false)} title={translate('workspace.perDiem.deletePerDiemRate')} prompt={translate('workspace.perDiem.areYouSureDelete', { count: selectedPerDiem.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{getHeaderButtons()}</react_native_1.View>}
                {(!hasVisibleSubRates || isLoading) && headerContent}
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                {hasVisibleSubRates && !isLoading && (<SelectionListWithModal_1.default addBottomSafeAreaPadding canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress onTurnOnSelectionMode={(item) => item && toggleSubRate(item)} sections={[{ data: filteredSubRatesList, isDisabled: false }]} shouldUseDefaultRightHandSideCheckmark={false} selectedItems={selectedPerDiem.map((item) => item.subRateID)} onCheckboxPress={toggleSubRate} onSelectRow={openSubRateDetails} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onSelectAll={filteredSubRatesList.length > 0 ? toggleAllSubRates : undefined} ListItem={TableListItem_1.default} listHeaderContent={headerContent} shouldShowListEmptyContent={false} customListHeader={getCustomListHeader()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} listItemTitleContainerStyles={styles.flex3} showScrollIndicator={false}/>)}
                {!hasVisibleSubRates && !isLoading && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                        <EmptyStateComponent_1.default SkeletonComponent={TableRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.GenericEmptyState} title={translate('workspace.perDiem.emptyList.title')} subtitle={translate('workspace.perDiem.emptyList.subtitle')} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.emptyFolderBG]} lottieWebViewStyles={styles.emptyStateFolderWebStyles} headerContentStyles={styles.emptyStateFolderWebStyles} buttons={[
                {
                    buttonText: translate('spreadsheet.importSpreadsheet'),
                    buttonAction: () => {
                        if (isOffline) {
                            setIsOfflineModalVisible(true);
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORT.getRoute(policyID));
                    },
                    success: true,
                },
            ]}/>
                    </ScrollView_1.default>)}
                <ConfirmModal_1.default isVisible={isOfflineModalVisible} onConfirm={() => setIsOfflineModalVisible(false)} title={translate('common.youAppearToBeOffline')} prompt={translate('common.thisFeatureRequiresInternet')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} onCancel={() => setIsOfflineModalVisible(false)} shouldHandleNavigationBack/>
                <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadFailureModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadFailureModalVisible} onClose={() => setIsDownloadFailureModalVisible(false)}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspacePerDiemPage.displayName = 'WorkspacePerDiemPage';
exports.default = WorkspacePerDiemPage;
