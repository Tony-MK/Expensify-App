"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ImportedFromAccountingSoftware_1 = require("@components/ImportedFromAccountingSoftware");
const LottieAnimations_1 = require("@components/LottieAnimations");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const TableRowSkeleton_1 = require("@components/Skeletons/TableRowSkeleton");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useAutoTurnSelectionModeOffWhenHasNoActiveOption_1 = require("@hooks/useAutoTurnSelectionModeOffWhenHasNoActiveOption");
const useCleanupSelectedOptions_1 = require("@hooks/useCleanupSelectedOptions");
const useEnvironment_1 = require("@hooks/useEnvironment");
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
const connections_1 = require("@libs/actions/connections");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Modal_1 = require("@userActions/Modal");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function WorkspaceCategoriesPage({ route }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const [isDownloadFailureModalVisible, setIsDownloadFailureModalVisible] = (0, react_1.useState)(false);
    const [deleteCategoriesConfirmModalVisible, setDeleteCategoriesConfirmModalVisible] = (0, react_1.useState)(false);
    const [isCannotDeleteOrDisableLastCategoryModalVisible, setIsCannotDeleteOrDisableLastCategoryModalVisible] = (0, react_1.useState)(false);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const policyId = route.params.policyID;
    const backTo = route.params?.backTo;
    const policy = (0, usePolicy_1.default)(policyId);
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [allTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [policyTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyId}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyId}`, { canBeMissing: true });
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy?.id}`, { canBeMissing: true });
    const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy) ?? connectionSyncProgress?.connectionName;
    const isConnectionVerified = connectedIntegration && !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_ROOT;
    const [selectedCategories, setSelectedCategories] = (0, react_1.useState)([]);
    const canSelectMultiple = isSmallScreenWidth ? isMobileSelectionModeEnabled : true;
    const fetchCategories = (0, react_1.useCallback)(() => {
        (0, Category_1.openPolicyCategoriesPage)(policyId);
    }, [policyId]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchCategories });
    (0, react_1.useEffect)(() => {
        fetchCategories();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const cleanupSelectedOption = (0, react_1.useCallback)(() => setSelectedCategories([]), []);
    (0, useCleanupSelectedOptions_1.default)(cleanupSelectedOption);
    (0, react_1.useEffect)(() => {
        if (selectedCategories.length === 0 || !canSelectMultiple) {
            return;
        }
        setSelectedCategories((prevSelectedCategories) => {
            const newSelectedCategories = [];
            for (const categoryName of prevSelectedCategories) {
                const categoryExists = policyCategories?.[categoryName];
                if (!categoryExists) {
                    const renamedCategory = Object.entries(policyCategories ?? {}).find(([, category]) => category.previousCategoryName === categoryName);
                    if (renamedCategory) {
                        newSelectedCategories.push(renamedCategory[0]);
                        continue;
                    }
                }
                if (categoryExists && categoryExists.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                    newSelectedCategories.push(categoryName);
                }
            }
            return newSelectedCategories;
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policyCategories]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => setSelectedCategories([]),
        onNavigationCallBack: () => Navigation_1.default.goBack(backTo),
    });
    const updateWorkspaceCategoryEnabled = (0, react_1.useCallback)((value, categoryName) => {
        (0, Category_1.setWorkspaceCategoryEnabled)(policyId, { [categoryName]: { name: categoryName, enabled: value } }, policyTagLists, allTransactionViolations);
    }, [policyId, policyTagLists, allTransactionViolations]);
    const categoryList = (0, react_1.useMemo)(() => {
        const categories = Object.values(policyCategories ?? {});
        return categories.reduce((acc, value) => {
            const isDisabled = value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
            if (!isOffline && isDisabled) {
                return acc;
            }
            acc.push({
                text: value.name,
                keyForList: value.name,
                isDisabled,
                pendingAction: value.pendingAction,
                errors: value.errors ?? undefined,
                rightElement: (<Switch_1.default isOn={value.enabled} disabled={isDisabled} accessibilityLabel={translate('workspace.categories.enableCategory')} onToggle={(newValue) => {
                        if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledCategory)(policy, policyCategories, [value])) {
                            setIsCannotDeleteOrDisableLastCategoryModalVisible(true);
                            return;
                        }
                        updateWorkspaceCategoryEnabled(newValue, value.name);
                    }} showLockIcon={(0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledCategory)(policy, policyCategories, [value])}/>),
            });
            return acc;
        }, []);
    }, [policyCategories, isOffline, translate, updateWorkspaceCategoryEnabled, policy]);
    const filterCategory = (0, react_1.useCallback)((categoryOption, searchInput) => {
        const categoryText = StringUtils_1.default.normalize(categoryOption.text?.toLowerCase() ?? '');
        const alternateText = StringUtils_1.default.normalize(categoryOption.alternateText?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput);
        return categoryText.includes(normalizedSearchInput) || alternateText.includes(normalizedSearchInput);
    }, []);
    const sortCategories = (0, react_1.useCallback)((data) => {
        return data.sort((a, b) => localeCompare(a.text ?? '', b?.text ?? ''));
    }, [localeCompare]);
    const [inputValue, setInputValue, filteredCategoryList] = (0, useSearchResults_1.default)(categoryList, filterCategory, sortCategories);
    (0, useAutoTurnSelectionModeOffWhenHasNoActiveOption_1.default)(categoryList);
    const toggleCategory = (0, react_1.useCallback)((category) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category.keyForList)) {
                return prev.filter((key) => key !== category.keyForList);
            }
            return [...prev, category.keyForList];
        });
    }, [setSelectedCategories]);
    const toggleAllCategories = () => {
        const availableCategories = filteredCategoryList.filter((category) => category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        const someSelected = availableCategories.some((category) => selectedCategories.includes(category.keyForList));
        setSelectedCategories(someSelected ? [] : availableCategories.map((item) => item.keyForList));
    };
    const getCustomListHeader = () => {
        if (filteredCategoryList.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.name')} rightHeaderText={translate('common.enabled')}/>);
    };
    const navigateToCategorySettings = (category) => {
        if (isSmallScreenWidth && isMobileSelectionModeEnabled) {
            toggleCategory(category);
            return;
        }
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.getRoute(policyId, category.keyForList, backTo)
            : ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyId, category.keyForList));
    };
    const navigateToCategoriesSettings = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_SETTINGS.getRoute(policyId, backTo) : ROUTES_1.default.WORKSPACE_CATEGORIES_SETTINGS.getRoute(policyId));
    }, [isQuickSettingsFlow, policyId, backTo]);
    const navigateToCreateCategoryPage = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORY_CREATE.getRoute(policyId, backTo) : ROUTES_1.default.WORKSPACE_CATEGORY_CREATE.getRoute(policyId));
    };
    const dismissError = (item) => {
        (0, Category_1.clearCategoryErrors)(policyId, item.keyForList);
    };
    const handleDeleteCategories = () => {
        (0, Category_1.deleteWorkspaceCategories)(policyId, selectedCategories, policyTagLists, allTransactionViolations);
        setDeleteCategoriesConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedCategories([]);
        });
    };
    const hasVisibleCategories = categoryList.some((category) => category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline);
    const policyHasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const navigateToImportSpreadsheet = (0, react_1.useCallback)(() => {
        if (isOffline) {
            (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
            return;
        }
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_CATEGORIES_IMPORT.getRoute(policyId, ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(policyId, backTo))
            : ROUTES_1.default.WORKSPACE_CATEGORIES_IMPORT.getRoute(policyId));
    }, [backTo, isOffline, isQuickSettingsFlow, policyId]);
    const secondaryActions = (0, react_1.useMemo)(() => {
        const menuItems = [];
        menuItems.push({
            icon: Expensicons.Gear,
            text: translate('common.settings'),
            onSelected: navigateToCategoriesSettings,
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        });
        if (!policyHasAccountingConnections) {
            menuItems.push({
                icon: Expensicons.Table,
                text: translate('spreadsheet.importSpreadsheet'),
                onSelected: navigateToImportSpreadsheet,
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.IMPORT_SPREADSHEET,
            });
        }
        if (hasVisibleCategories) {
            menuItems.push({
                icon: Expensicons.Download,
                text: translate('spreadsheet.downloadCSV'),
                onSelected: () => {
                    if (isOffline) {
                        (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                        return;
                    }
                    (0, Modal_1.close)(() => {
                        (0, Category_1.downloadCategoriesCSV)(policyId, () => {
                            setIsDownloadFailureModalVisible(true);
                        });
                    });
                },
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.DOWNLOAD_CSV,
            });
        }
        return menuItems;
    }, [translate, navigateToCategoriesSettings, policyHasAccountingConnections, hasVisibleCategories, navigateToImportSpreadsheet, isOffline, policyId]);
    const getHeaderButtons = () => {
        const options = [];
        const isThereAnyAccountingConnection = Object.keys(policy?.connections ?? {}).length !== 0;
        const selectedCategoriesObject = selectedCategories.map((key) => policyCategories?.[key]);
        if (isSmallScreenWidth ? canSelectMultiple : selectedCategories.length > 0) {
            if (!isThereAnyAccountingConnection) {
                options.push({
                    icon: Expensicons.Trashcan,
                    text: translate(selectedCategories.length === 1 ? 'workspace.categories.deleteCategory' : 'workspace.categories.deleteCategories'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                    onSelected: () => {
                        if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledCategory)(policy, policyCategories, selectedCategoriesObject)) {
                            setIsCannotDeleteOrDisableLastCategoryModalVisible(true);
                            return;
                        }
                        setDeleteCategoriesConfirmModalVisible(true);
                    },
                });
            }
            const enabledCategories = selectedCategories.filter((categoryName) => policyCategories?.[categoryName]?.enabled);
            if (enabledCategories.length > 0) {
                const categoriesToDisable = selectedCategories
                    .filter((categoryName) => policyCategories?.[categoryName]?.enabled)
                    .reduce((acc, categoryName) => {
                    acc[categoryName] = {
                        name: categoryName,
                        enabled: false,
                    };
                    return acc;
                }, {});
                options.push({
                    icon: Expensicons.Close,
                    text: translate(enabledCategories.length === 1 ? 'workspace.categories.disableCategory' : 'workspace.categories.disableCategories'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                    onSelected: () => {
                        if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledCategory)(policy, policyCategories, selectedCategoriesObject)) {
                            setIsCannotDeleteOrDisableLastCategoryModalVisible(true);
                            return;
                        }
                        setSelectedCategories([]);
                        (0, Category_1.setWorkspaceCategoryEnabled)(policyId, categoriesToDisable, policyTagLists, allTransactionViolations);
                    },
                });
            }
            const disabledCategories = selectedCategories.filter((categoryName) => !policyCategories?.[categoryName]?.enabled);
            if (disabledCategories.length > 0) {
                const categoriesToEnable = selectedCategories
                    .filter((categoryName) => !policyCategories?.[categoryName]?.enabled)
                    .reduce((acc, categoryName) => {
                    acc[categoryName] = {
                        name: categoryName,
                        enabled: true,
                    };
                    return acc;
                }, {});
                options.push({
                    icon: Expensicons.Checkmark,
                    text: translate(disabledCategories.length === 1 ? 'workspace.categories.enableCategory' : 'workspace.categories.enableCategories'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                    onSelected: () => {
                        setSelectedCategories([]);
                        (0, Category_1.setWorkspaceCategoryEnabled)(policyId, categoriesToEnable, policyTagLists, allTransactionViolations);
                    },
                });
            }
            return (<ButtonWithDropdownMenu_1.default onPress={() => null} shouldAlwaysShowDropdownMenu buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedCategories.length })} options={options} isSplitButton={false} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedCategories.length} testID={`${WorkspaceCategoriesPage.displayName}-header-dropdown-menu-button`}/>);
        }
        const shouldShowAddCategory = !policyHasAccountingConnections && hasVisibleCategories;
        return (<react_native_1.View style={[styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
                {shouldShowAddCategory && (<Button_1.default success onPress={navigateToCreateCategoryPage} icon={Expensicons.Plus} text={translate('workspace.categories.addCategory')} style={[shouldUseNarrowLayout && styles.flex1]}/>)}
                <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={shouldShowAddCategory ? styles.flexGrow0 : styles.flexGrow1}/>
            </react_native_1.View>);
    };
    const isLoading = !isOffline && policyCategories === undefined;
    (0, react_1.useEffect)(() => {
        if (isMobileSelectionModeEnabled) {
            return;
        }
        setSelectedCategories([]);
    }, [setSelectedCategories, isMobileSelectionModeEnabled]);
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                {!hasSyncError && isConnectionVerified && currentConnectionName ? (<ImportedFromAccountingSoftware_1.default policyID={policyId} currentConnectionName={currentConnectionName} connectedIntegration={connectedIntegration} translatedText={translate('workspace.categories.importedFromAccountingSoftware')}/>) : (<Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.categories.subtitle')}</Text_1.default>)}
            </react_native_1.View>
            {categoryList.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.categories.findCategory')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={hasVisibleCategories && !isLoading && filteredCategoryList.length === 0}/>)}
        </>);
    const subtitleText = (0, react_1.useMemo)(() => {
        if (!policyHasAccountingConnections) {
            return <Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.textNormal]}>{translate('workspace.categories.emptyCategories.subtitle')}</Text_1.default>;
        }
        return (<react_native_1.View style={[styles.renderHTML]}>
                <RenderHTML_1.default html={translate('workspace.categories.emptyCategories.subtitleWithAccounting', {
                accountingPageURL: `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyId)}`,
            })}/>
            </react_native_1.View>);
    }, [policyHasAccountingConnections, styles.renderHTML, styles.textAlignCenter, styles.textSupporting, styles.textNormal, translate, environmentURL, policyId]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyId} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceCategoriesPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto}>
                <HeaderWithBackButton_1.default shouldShowBackButton={shouldUseNarrowLayout} title={selectionModeHeader ? translate('common.selectMultiple') : translate('workspace.common.categories')} icon={!selectionModeHeader ? Illustrations.FolderOpen : undefined} shouldUseHeadlineHeader={!selectionModeHeader} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedCategories([]);
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
                <ConfirmModal_1.default isVisible={deleteCategoriesConfirmModalVisible} onConfirm={handleDeleteCategories} onCancel={() => setDeleteCategoriesConfirmModalVisible(false)} title={translate(selectedCategories.length === 1 ? 'workspace.categories.deleteCategory' : 'workspace.categories.deleteCategories')} prompt={translate(selectedCategories.length === 1 ? 'workspace.categories.deleteCategoryPrompt' : 'workspace.categories.deleteCategoriesPrompt')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{getHeaderButtons()}</react_native_1.View>}
                {(!hasVisibleCategories || isLoading) && headerContent}
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                {hasVisibleCategories && !isLoading && (<SelectionListWithModal_1.default canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress={isSmallScreenWidth} onTurnOnSelectionMode={(item) => item && toggleCategory(item)} sections={[{ data: filteredCategoryList, isDisabled: false }]} shouldUseDefaultRightHandSideCheckmark={false} selectedItems={selectedCategories} onCheckboxPress={toggleCategory} onSelectRow={navigateToCategorySettings} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onSelectAll={filteredCategoryList.length > 0 ? toggleAllCategories : undefined} ListItem={TableListItem_1.default} listHeaderContent={headerContent} shouldShowListEmptyContent={false} onDismissError={dismissError} customListHeader={getCustomListHeader()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} showScrollIndicator={false} addBottomSafeAreaPadding/>)}
                {!hasVisibleCategories && !isLoading && inputValue.length === 0 && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                        <EmptyStateComponent_1.default SkeletonComponent={TableRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.GenericEmptyState} title={translate('workspace.categories.emptyCategories.title')} subtitleText={subtitleText} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.emptyFolderBG]} lottieWebViewStyles={styles.emptyStateFolderWebStyles} headerContentStyles={styles.emptyStateFolderWebStyles} buttons={!policyHasAccountingConnections
                ? [
                    {
                        icon: Expensicons.Plus,
                        buttonText: translate('workspace.categories.addCategory'),
                        buttonAction: navigateToCreateCategoryPage,
                        success: true,
                    },
                    {
                        icon: Expensicons.Table,
                        buttonText: translate('common.import'),
                        buttonAction: navigateToImportSpreadsheet,
                    },
                ]
                : undefined}/>
                    </ScrollView_1.default>)}
                <ConfirmModal_1.default isVisible={isCannotDeleteOrDisableLastCategoryModalVisible} onConfirm={() => setIsCannotDeleteOrDisableLastCategoryModalVisible(false)} onCancel={() => setIsCannotDeleteOrDisableLastCategoryModalVisible(false)} title={translate('workspace.categories.cannotDeleteOrDisableAllCategories.title')} prompt={translate('workspace.categories.cannotDeleteOrDisableAllCategories.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                <ConfirmModal_1.default isVisible={isOfflineModalVisible} onConfirm={() => setIsOfflineModalVisible(false)} title={translate('common.youAppearToBeOffline')} prompt={translate('common.thisFeatureRequiresInternet')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} onCancel={() => setIsOfflineModalVisible(false)} shouldHandleNavigationBack/>
                <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadFailureModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadFailureModalVisible} onClose={() => setIsDownloadFailureModalVisible(false)}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCategoriesPage.displayName = 'WorkspaceCategoriesPage';
exports.default = WorkspaceCategoriesPage;
