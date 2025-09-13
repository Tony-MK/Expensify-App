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
const ListItemRightCaretWithLabel_1 = require("@components/SelectionList/ListItemRightCaretWithLabel");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const TableRowSkeleton_1 = require("@components/Skeletons/TableRowSkeleton");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
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
const Tag_1 = require("@libs/actions/Policy/Tag");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function WorkspaceTagsPage({ route }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isDownloadFailureModalVisible, setIsDownloadFailureModalVisible] = (0, react_1.useState)(false);
    const [isDeleteTagsConfirmModalVisible, setIsDeleteTagsConfirmModalVisible] = (0, react_1.useState)(false);
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const [isCannotDeleteOrDisableLastTagModalVisible, setIsCannotDeleteOrDisableLastTagModalVisible] = (0, react_1.useState)(false);
    const [isCannotMakeLastTagOptionalModalVisible, setIsCannotMakeLastTagOptionalModalVisible] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const policy = (0, usePolicy_1.default)(policyID);
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy?.id}`, { canBeMissing: true });
    const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy) ?? connectionSyncProgress?.connectionName;
    const isConnectionVerified = connectedIntegration && !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const [policyTagLists, isMultiLevelTags, hasDependentTags, hasIndependentTags] = (0, react_1.useMemo)(() => [(0, PolicyUtils_1.getTagLists)(policyTags), (0, PolicyUtils_1.isMultiLevelTags)(policyTags), (0, PolicyUtils_1.hasDependentTags)(policy, policyTags), (0, PolicyUtils_1.hasIndependentTags)(policy, policyTags)], [policy, policyTags]);
    const canSelectMultiple = !hasDependentTags && (shouldUseNarrowLayout ? isMobileSelectionModeEnabled : true);
    const fetchTags = (0, react_1.useCallback)(() => {
        (0, Tag_1.openPolicyTagsPage)(policyID);
    }, [policyID]);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_ROOT;
    const tagsList = (0, react_1.useMemo)(() => {
        if (isMultiLevelTags) {
            return policyTagLists.reduce((acc, policyTagList) => {
                acc[policyTagList.name] = policyTagList;
                return acc;
            }, {});
        }
        return policyTagLists?.at(0)?.tags;
    }, [isMultiLevelTags, policyTagLists]);
    const [selectedTags, setSelectedTags] = (0, react_1.useState)([]);
    const isTagSelected = (0, react_1.useCallback)((tag) => selectedTags.includes(tag.value), [selectedTags]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchTags });
    (0, react_1.useEffect)(() => {
        fetchTags();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (selectedTags.length === 0 || !canSelectMultiple) {
            return;
        }
        setSelectedTags((prevSelectedTags) => {
            const newSelectedTags = [];
            for (const tagName of prevSelectedTags) {
                if (isMultiLevelTags) {
                    const tagListExists = tagsList?.[tagName];
                    if (!tagListExists) {
                        const renamedTagList = Object.entries(tagsList ?? {}).find(([, tagList]) => {
                            const typedTagList = tagList;
                            return typedTagList.previousTagName === tagName;
                        });
                        if (renamedTagList) {
                            newSelectedTags.push(renamedTagList[0]);
                            continue;
                        }
                    }
                    if (tagListExists && tagListExists.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                        newSelectedTags.push(tagName);
                    }
                }
                else {
                    const tagExists = tagsList?.[tagName];
                    if (!tagExists) {
                        const renamedTag = Object.entries(tagsList ?? {}).find(([, tag]) => {
                            const typedTag = tag;
                            return typedTag.previousTagName === tagName;
                        });
                        if (renamedTag) {
                            newSelectedTags.push(renamedTag[0]);
                            continue;
                        }
                    }
                    if (tagExists && tagExists.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                        newSelectedTags.push(tagName);
                    }
                }
            }
            return newSelectedTags;
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [tagsList]);
    const cleanupSelectedOption = (0, react_1.useCallback)(() => setSelectedTags([]), []);
    (0, useCleanupSelectedOptions_1.default)(cleanupSelectedOption);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => {
            setSelectedTags([]);
        },
        onNavigationCallBack: () => Navigation_1.default.goBack(backTo),
    });
    const getPendingAction = (policyTagList) => {
        if (!policyTagList) {
            return undefined;
        }
        return (policyTagList.pendingAction ?? Object.values(policyTagList.tags).some((tag) => tag.pendingAction))
            ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE
            : undefined;
    };
    const updateWorkspaceTagEnabled = (0, react_1.useCallback)((value, tagName) => {
        (0, Tag_1.setWorkspaceTagEnabled)(policyID, { [tagName]: { name: tagName, enabled: value } }, 0);
    }, [policyID]);
    const updateWorkspaceRequiresTag = (0, react_1.useCallback)((value, orderWeight) => {
        (0, Tag_1.setPolicyTagsRequired)(policyID, value, orderWeight);
    }, [policyID]);
    const tagList = (0, react_1.useMemo)(() => {
        if (isMultiLevelTags) {
            return policyTagLists.map((policyTagList) => {
                const areTagsEnabled = !!Object.values(policyTagList?.tags ?? {}).some((tag) => tag.enabled);
                const isSwitchDisabled = !policyTagList.required && !areTagsEnabled;
                const isSwitchEnabled = policyTagList.required && areTagsEnabled;
                if (policyTagList.required && !areTagsEnabled) {
                    updateWorkspaceRequiresTag(false, policyTagList.orderWeight);
                }
                return {
                    value: policyTagList.name,
                    orderWeight: policyTagList.orderWeight,
                    text: (0, PolicyUtils_1.getCleanedTagName)(policyTagList.name),
                    alternateText: !hasDependentTags ? translate('workspace.tags.tagCount', { count: Object.keys(policyTagList?.tags ?? {}).length }) : '',
                    keyForList: (0, PolicyUtils_1.getCleanedTagName)(policyTagList.name),
                    pendingAction: getPendingAction(policyTagList),
                    enabled: true,
                    required: policyTagList.required,
                    isDisabledCheckbox: isSwitchDisabled,
                    rightElement: hasDependentTags ? (<ListItemRightCaretWithLabel_1.default labelText={translate('workspace.tags.tagCount', { count: Object.keys(policyTagList?.tags ?? {}).length })} shouldShowCaret/>) : (<Switch_1.default isOn={isSwitchEnabled} accessibilityLabel={translate('workspace.tags.requiresTag')} onToggle={(newValue) => {
                            if ((0, OptionsListUtils_1.isMakingLastRequiredTagListOptional)(policy, policyTags, [policyTagList])) {
                                setIsCannotMakeLastTagOptionalModalVisible(true);
                                return;
                            }
                            updateWorkspaceRequiresTag(newValue, policyTagList.orderWeight);
                        }} disabled={isSwitchDisabled} showLockIcon={(0, OptionsListUtils_1.isMakingLastRequiredTagListOptional)(policy, policyTags, [policyTagList])}/>),
                };
            });
        }
        return Object.values(policyTagLists?.at(0)?.tags ?? {}).map((tag) => ({
            value: tag.name,
            text: (0, PolicyUtils_1.getCleanedTagName)(tag.name),
            keyForList: tag.name,
            pendingAction: tag.pendingAction,
            errors: tag.errors ?? undefined,
            enabled: tag.enabled,
            isDisabled: tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            rightElement: (<Switch_1.default isOn={tag.enabled} disabled={tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE} accessibilityLabel={translate('workspace.tags.enableTag')} onToggle={(newValue) => {
                    if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(policyTagLists.at(0), [tag])) {
                        setIsCannotDeleteOrDisableLastTagModalVisible(true);
                        return;
                    }
                    updateWorkspaceTagEnabled(newValue, tag.name);
                }} showLockIcon={(0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(policyTagLists.at(0), [tag])}/>),
        }));
    }, [isMultiLevelTags, policyTagLists, hasDependentTags, translate, policy, policyTags, updateWorkspaceRequiresTag, updateWorkspaceTagEnabled]);
    const filterTag = (0, react_1.useCallback)((tag, searchInput) => {
        const tagText = StringUtils_1.default.normalize(tag.text?.toLowerCase() ?? '');
        const tagValue = StringUtils_1.default.normalize(tag.value?.toLowerCase() ?? '');
        const normalizeSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase());
        return tagText.includes(normalizeSearchInput) || tagValue.includes(normalizeSearchInput);
    }, []);
    const sortTags = (0, react_1.useCallback)((tags) => {
        // For multi-level tags, preserve the policy order (by orderWeight) instead of sorting alphabetically
        if (hasDependentTags || isMultiLevelTags) {
            return tags.sort((a, b) => (a.orderWeight ?? 0) - (b.orderWeight ?? 0));
        }
        // For other cases, sort alphabetically by name
        return tags.sort((a, b) => localeCompare(a.value, b.value));
    }, [hasDependentTags, isMultiLevelTags, localeCompare]);
    const [inputValue, setInputValue, filteredTagList] = (0, useSearchResults_1.default)(tagList, filterTag, sortTags);
    const filteredTagListKeyedByName = (0, react_1.useMemo)(() => filteredTagList.reduce((acc, tag) => {
        acc[tag.value] = tag;
        return acc;
    }, {}), [filteredTagList]);
    const toggleTag = (tag) => {
        setSelectedTags((prev) => {
            if (prev.includes(tag.value)) {
                return prev.filter((item) => item !== tag.value);
            }
            return [...prev, tag.value];
        });
    };
    const toggleAllTags = () => {
        const availableTags = filteredTagList.filter((tag) => tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && !tag.isDisabledCheckbox);
        setSelectedTags(selectedTags.length > 0 ? [] : availableTags.map((item) => item.value));
    };
    const getCustomListHeader = () => {
        if (hasDependentTags) {
            return (<CustomListHeader_1.default canSelectMultiple={false} leftHeaderText={translate('common.name')} rightHeaderText={translate('common.count')} rightHeaderMinimumWidth={120}/>);
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.name')} rightHeaderText={translate(isMultiLevelTags ? 'common.required' : 'common.enabled')}/>);
    };
    const navigateToTagsSettings = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_SETTINGS.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_TAGS_SETTINGS.getRoute(policyID));
    }, [isQuickSettingsFlow, policyID, backTo]);
    const navigateToCreateTagPage = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAG_CREATE.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_TAG_CREATE.getRoute(policyID));
    };
    const navigateToTagSettings = (tag) => {
        if (isSmallScreenWidth && isMobileSelectionModeEnabled) {
            toggleTag(tag);
            return;
        }
        if (tag.orderWeight !== undefined) {
            Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAG_LIST_VIEW.getRoute(policyID, tag.orderWeight, backTo) : ROUTES_1.default.WORKSPACE_TAG_LIST_VIEW.getRoute(policyID, tag.orderWeight));
        }
        else {
            Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(policyID, 0, tag.value, backTo) : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(policyID, 0, tag.value));
        }
    };
    const deleteTags = () => {
        (0, Tag_1.deletePolicyTags)(policyID, selectedTags);
        setIsDeleteTagsConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedTags([]);
            if (isMobileSelectionModeEnabled && selectedTags.length === Object.keys(policyTagLists.at(0)?.tags ?? {}).length) {
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
            }
        });
    };
    const isLoading = !isOffline && policyTags === undefined;
    const hasVisibleTags = tagList.some((tag) => tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline);
    const navigateToImportSpreadsheet = (0, react_1.useCallback)(() => {
        if (isOffline) {
            (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
            return;
        }
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo))
            : ROUTES_1.default.WORKSPACE_TAGS_IMPORT_OPTIONS.getRoute(policyID));
    }, [backTo, isOffline, isQuickSettingsFlow, policyID]);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const secondaryActions = (0, react_1.useMemo)(() => {
        const menuItems = [];
        menuItems.push({
            icon: Expensicons.Gear,
            text: translate('common.settings'),
            onSelected: navigateToTagsSettings,
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        });
        if (!hasAccountingConnections) {
            menuItems.push({
                icon: Expensicons.Table,
                text: translate('spreadsheet.importSpreadsheet'),
                onSelected: navigateToImportSpreadsheet,
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.IMPORT_SPREADSHEET,
            });
        }
        if (hasVisibleTags && !hasDependentTags) {
            menuItems.push({
                icon: Expensicons.Download,
                text: translate('spreadsheet.downloadCSV'),
                onSelected: () => {
                    if (isOffline) {
                        (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                        return;
                    }
                    (0, Modal_1.close)(() => {
                        if (hasIndependentTags) {
                            (0, Tag_1.downloadMultiLevelIndependentTagsCSV)(policyID, () => {
                                setIsDownloadFailureModalVisible(true);
                            });
                        }
                        else {
                            (0, Tag_1.downloadTagsCSV)(policyID, () => {
                                setIsDownloadFailureModalVisible(true);
                            });
                        }
                    });
                },
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.DOWNLOAD_CSV,
            });
        }
        return menuItems;
    }, [translate, navigateToTagsSettings, hasDependentTags, hasVisibleTags, isOffline, policyID, hasIndependentTags, hasAccountingConnections, navigateToImportSpreadsheet]);
    const getHeaderButtons = () => {
        const selectedTagsObject = selectedTags.map((key) => policyTagLists.at(0)?.tags?.[key]);
        const selectedTagLists = selectedTags.map((selectedTag) => policyTagLists.find((policyTagList) => policyTagList.name === selectedTag));
        if (shouldUseNarrowLayout ? !isMobileSelectionModeEnabled : selectedTags.length === 0) {
            const hasPrimaryActions = !hasAccountingConnections && !isMultiLevelTags && hasVisibleTags;
            return (<react_native_1.View style={[styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
                    {hasPrimaryActions && (<Button_1.default success onPress={navigateToCreateTagPage} icon={Expensicons.Plus} text={translate('workspace.tags.addTag')} style={[shouldUseNarrowLayout && styles.flex1]}/>)}
                    <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={hasPrimaryActions ? styles.flexGrow0 : styles.flexGrow1}/>
                </react_native_1.View>);
        }
        const options = [];
        if (!hasAccountingConnections && !isMultiLevelTags) {
            options.push({
                icon: Expensicons.Trashcan,
                text: translate(selectedTags.length === 1 ? 'workspace.tags.deleteTag' : 'workspace.tags.deleteTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                onSelected: () => {
                    if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(policyTagLists.at(0), selectedTagsObject)) {
                        setIsCannotDeleteOrDisableLastTagModalVisible(true);
                        return;
                    }
                    setIsDeleteTagsConfirmModalVisible(true);
                },
            });
        }
        let enabledTagCount = 0;
        const tagsToDisable = {};
        let disabledTagCount = 0;
        const tagsToEnable = {};
        for (const tagName of selectedTags) {
            if (filteredTagListKeyedByName[tagName]?.enabled) {
                enabledTagCount++;
                tagsToDisable[tagName] = {
                    name: tagName,
                    enabled: false,
                };
            }
            else {
                disabledTagCount++;
                tagsToEnable[tagName] = {
                    name: tagName,
                    enabled: true,
                };
            }
        }
        if (enabledTagCount > 0 && !isMultiLevelTags) {
            options.push({
                icon: Expensicons.Close,
                text: translate(enabledTagCount === 1 ? 'workspace.tags.disableTag' : 'workspace.tags.disableTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                onSelected: () => {
                    if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(policyTagLists.at(0), selectedTagsObject)) {
                        setIsCannotDeleteOrDisableLastTagModalVisible(true);
                        return;
                    }
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagEnabled)(policyID, tagsToDisable, 0);
                },
            });
        }
        if (disabledTagCount > 0 && !isMultiLevelTags) {
            options.push({
                icon: Expensicons.Checkmark,
                text: translate(disabledTagCount === 1 ? 'workspace.tags.enableTag' : 'workspace.tags.enableTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                onSelected: () => {
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagEnabled)(policyID, tagsToEnable, 0);
                },
            });
        }
        let requiredTagCount = 0;
        const tagListIndexesToMarkRequired = [];
        let optionalTagCount = 0;
        const tagListIndexesToMarkOptional = [];
        for (const tagName of selectedTags) {
            if (filteredTagListKeyedByName[tagName]?.required) {
                requiredTagCount++;
                tagListIndexesToMarkOptional.push(filteredTagListKeyedByName[tagName]?.orderWeight ?? 0);
            }
            else {
                optionalTagCount++;
                tagListIndexesToMarkRequired.push(filteredTagListKeyedByName[tagName]?.orderWeight ?? 0);
            }
        }
        if (requiredTagCount > 0 && !hasDependentTags && isMultiLevelTags) {
            options.push({
                icon: Expensicons.Close,
                text: translate('workspace.tags.notRequireTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.REQUIRE,
                onSelected: () => {
                    if ((0, OptionsListUtils_1.isMakingLastRequiredTagListOptional)(policy, policyTags, selectedTagLists)) {
                        setIsCannotMakeLastTagOptionalModalVisible(true);
                        return;
                    }
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagRequired)(policyID, tagListIndexesToMarkOptional, false, policyTags);
                },
            });
        }
        if (optionalTagCount > 0 && !hasDependentTags && isMultiLevelTags) {
            options.push({
                icon: Expensicons.Checkmark,
                text: translate(requiredTagCount === 1 ? 'workspace.tags.requireTag' : 'workspace.tags.requireTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.NOT_REQUIRED,
                onSelected: () => {
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagRequired)(policyID, tagListIndexesToMarkRequired, true, policyTags);
                },
            });
        }
        return (<ButtonWithDropdownMenu_1.default onPress={() => null} shouldAlwaysShowDropdownMenu isSplitButton={false} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedTags.length })} options={options} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedTags.length} testID={`${WorkspaceTagsPage.displayName}-header-dropdown-menu-button`}/>);
    };
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : undefined]}>
                {!hasSyncError && isConnectionVerified && currentConnectionName ? (<ImportedFromAccountingSoftware_1.default policyID={policyID} currentConnectionName={currentConnectionName} connectedIntegration={connectedIntegration} translatedText={translate('workspace.tags.importedFromAccountingSoftware')}/>) : (<Text_1.default style={[styles.textNormal, styles.colorMuted]}>
                        {translate('workspace.tags.subtitle')}
                        {hasDependentTags && (<react_native_1.View style={[styles.renderHTML]}>
                                <RenderHTML_1.default html={translate('workspace.tags.dependentMultiLevelTagsSubtitle', {
                    importSpreadsheetLink: isQuickSettingsFlow
                        ? `${environmentURL}/${ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo))}`
                        : `${environmentURL}/${ROUTES_1.default.WORKSPACE_TAGS_IMPORT_OPTIONS.getRoute(policyID)}`,
                })}/>
                            </react_native_1.View>)}
                    </Text_1.default>)}
            </react_native_1.View>
            {tagList.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.tags.findTag')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={hasVisibleTags && !isLoading && !filteredTagList.length}/>)}
        </>);
    const subtitleText = (0, react_1.useMemo)(() => {
        const emptyTagsSubtitle = hasAccountingConnections
            ? translate('workspace.tags.emptyTags.subtitleWithAccounting', {
                accountingPageURL: `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID)}`,
            })
            : translate('workspace.tags.emptyTags.subtitleHTML');
        return (<react_native_1.View style={[styles.renderHTML]}>
                <RenderHTML_1.default html={emptyTagsSubtitle}/>
            </react_native_1.View>);
    }, [hasAccountingConnections, translate, environmentURL, policyID, styles.renderHTML]);
    return (<>
            <AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
                <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceTagsPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto}>
                    <HeaderWithBackButton_1.default icon={!selectionModeHeader ? Illustrations.Tag : undefined} shouldUseHeadlineHeader={!selectionModeHeader} title={translate(selectionModeHeader ? 'common.selectMultiple' : 'workspace.common.tags')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedTags([]);
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
                    {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{getHeaderButtons()}</react_native_1.View>}
                    {(!hasVisibleTags || isLoading) && headerContent}
                    {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                    {hasVisibleTags && !isLoading && (<SelectionListWithModal_1.default canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress={!hasDependentTags} onTurnOnSelectionMode={(item) => item && toggleTag(item)} sections={[{ data: filteredTagList, isDisabled: false }]} shouldUseDefaultRightHandSideCheckmark={false} selectedItems={selectedTags} isSelected={isTagSelected} onCheckboxPress={toggleTag} onSelectRow={navigateToTagSettings} shouldSingleExecuteRowSelect={!canSelectMultiple} onSelectAll={filteredTagList.length > 0 ? toggleAllTags : undefined} ListItem={TableListItem_1.default} customListHeader={filteredTagList.length > 0 ? getCustomListHeader() : undefined} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} listHeaderContent={headerContent} shouldShowListEmptyContent={false} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} onDismissError={(item) => !hasDependentTags && (0, Tag_1.clearPolicyTagErrors)(policyID, item.value, 0)} showScrollIndicator={false} addBottomSafeAreaPadding/>)}
                    {!hasVisibleTags && !isLoading && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                            <EmptyStateComponent_1.default SkeletonComponent={TableRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.GenericEmptyState} title={translate('workspace.tags.emptyTags.title')} subtitleText={subtitleText} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.emptyFolderBG]} lottieWebViewStyles={styles.emptyStateFolderWebStyles} headerContentStyles={styles.emptyStateFolderWebStyles} buttons={!hasAccountingConnections
                ? [
                    {
                        success: true,
                        buttonAction: navigateToCreateTagPage,
                        icon: Expensicons.Plus,
                        buttonText: translate('workspace.tags.addTag'),
                    },
                    {
                        icon: Expensicons.Table,
                        buttonText: translate('common.import'),
                        buttonAction: navigateToImportSpreadsheet,
                    },
                ]
                : undefined}/>
                        </ScrollView_1.default>)}
                </ScreenWrapper_1.default>
            </AccessOrNotFoundWrapper_1.default>
            <ConfirmModal_1.default isVisible={isOfflineModalVisible} onConfirm={() => setIsOfflineModalVisible(false)} title={translate('common.youAppearToBeOffline')} prompt={translate('common.thisFeatureRequiresInternet')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} onCancel={() => setIsOfflineModalVisible(false)} shouldHandleNavigationBack/>
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadFailureModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadFailureModalVisible} onClose={() => setIsDownloadFailureModalVisible(false)}/>
            <ConfirmModal_1.default isVisible={isDeleteTagsConfirmModalVisible} onConfirm={deleteTags} onCancel={() => setIsDeleteTagsConfirmModalVisible(false)} title={translate(selectedTags.length === 1 ? 'workspace.tags.deleteTag' : 'workspace.tags.deleteTags')} prompt={translate(selectedTags.length === 1 ? 'workspace.tags.deleteTagConfirmation' : 'workspace.tags.deleteTagsConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            <ConfirmModal_1.default isVisible={isCannotDeleteOrDisableLastTagModalVisible} onConfirm={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} onCancel={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} title={translate('workspace.tags.cannotDeleteOrDisableAllTags.title')} prompt={translate('workspace.tags.cannotDeleteOrDisableAllTags.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
            <ConfirmModal_1.default isVisible={isCannotMakeLastTagOptionalModalVisible} onConfirm={() => setIsCannotMakeLastTagOptionalModalVisible(false)} onCancel={() => setIsCannotMakeLastTagOptionalModalVisible(false)} title={translate('workspace.tags.cannotMakeAllTagsOptional.title')} prompt={translate('workspace.tags.cannotMakeAllTagsOptional.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </>);
}
WorkspaceTagsPage.displayName = 'WorkspaceTagsPage';
exports.default = WorkspaceTagsPage;
