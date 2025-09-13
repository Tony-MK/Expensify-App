"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchBar_1 = require("@components/SearchBar");
const ListItemRightCaretWithLabel_1 = require("@components/SelectionList/ListItemRightCaretWithLabel");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const Switch_1 = require("@components/Switch");
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
const Tag_1 = require("@libs/actions/Policy/Tag");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function WorkspaceViewTagsPage({ route }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for the small screen selection mode
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const dropdownButtonRef = (0, react_1.useRef)(null);
    const [isDeleteTagsConfirmModalVisible, setIsDeleteTagsConfirmModalVisible] = (0, react_1.useState)(false);
    const isFocused = (0, native_1.useIsFocused)();
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const policy = (0, usePolicy_1.default)(policyID);
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: false });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const currentTagListName = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagListName)(policyTags, route.params.orderWeight), [policyTags, route.params.orderWeight]);
    const hasDependentTags = (0, react_1.useMemo)(() => (0, PolicyUtils_1.hasDependentTags)(policy, policyTags), [policy, policyTags]);
    const currentPolicyTag = policyTags?.[currentTagListName];
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_LIST_VIEW;
    const [isCannotMakeAllTagsOptionalModalVisible, setIsCannotMakeAllTagsOptionalModalVisible] = (0, react_1.useState)(false);
    const [isCannotDeleteOrDisableLastTagModalVisible, setIsCannotDeleteOrDisableLastTagModalVisible] = (0, react_1.useState)(false);
    const fetchTags = (0, react_1.useCallback)(() => {
        (0, Tag_1.openPolicyTagsPage)(policyID);
    }, [policyID]);
    const filterFunction = (0, react_1.useCallback)((tag) => !!tag && tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, []);
    const [selectedTags, setSelectedTags] = (0, useFilteredSelection_1.default)(currentPolicyTag?.tags, filterFunction);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchTags });
    const canSelectMultiple = (0, react_1.useMemo)(() => {
        if (hasDependentTags) {
            return false;
        }
        return isSmallScreenWidth ? isMobileSelectionModeEnabled : true;
    }, [hasDependentTags, isSmallScreenWidth, isMobileSelectionModeEnabled]);
    (0, react_1.useEffect)(() => {
        if (isFocused) {
            return;
        }
        return () => {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        };
    }, [isFocused]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => {
            setSelectedTags([]);
        },
        onNavigationCallBack: () => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID) : undefined),
    });
    const updateWorkspaceTagEnabled = (0, react_1.useCallback)((value, tagName) => {
        (0, Tag_1.setWorkspaceTagEnabled)(policyID, { [tagName]: { name: tagName, enabled: value } }, route.params.orderWeight);
    }, [policyID, route.params.orderWeight]);
    const tagList = (0, react_1.useMemo)(() => Object.values(currentPolicyTag?.tags ?? {}).map((tag) => ({
        value: tag.name,
        text: hasDependentTags ? tag.name : (0, PolicyUtils_1.getCleanedTagName)(tag.name),
        keyForList: hasDependentTags ? `${tag.name}-${tag.rules?.parentTagsFilter ?? ''}` : tag.name,
        isSelected: selectedTags.includes(tag.name) && canSelectMultiple,
        pendingAction: tag.pendingAction,
        rules: tag.rules,
        errors: tag.errors ?? undefined,
        enabled: tag.enabled,
        isDisabled: tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        rightElement: hasDependentTags ? (<ListItemRightCaretWithLabel_1.default shouldShowCaret/>) : (<Switch_1.default isOn={tag.enabled} disabled={tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE} accessibilityLabel={translate('workspace.tags.enableTag')} onToggle={(newValue) => {
                if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(currentPolicyTag, [tag])) {
                    setIsCannotDeleteOrDisableLastTagModalVisible(true);
                    return;
                }
                updateWorkspaceTagEnabled(newValue, tag.name);
            }} showLockIcon={(0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(currentPolicyTag, [tag])}/>),
    })), [currentPolicyTag, hasDependentTags, selectedTags, canSelectMultiple, translate, updateWorkspaceTagEnabled]);
    const filterTag = (0, react_1.useCallback)((tag, searchInput) => {
        const tagText = StringUtils_1.default.normalize(tag.text?.toLowerCase() ?? '');
        const tagValue = StringUtils_1.default.normalize(tag.text?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase() ?? '');
        return tagText.includes(normalizedSearchInput) || tagValue.includes(normalizedSearchInput);
    }, []);
    const sortTags = (0, react_1.useCallback)((tags) => tags.sort((tagA, tagB) => localeCompare(tagA.value, tagB.value)), [localeCompare]);
    const [inputValue, setInputValue, filteredTagList] = (0, useSearchResults_1.default)(tagList, filterTag, sortTags);
    const tagListKeyedByName = (0, react_1.useMemo)(() => filteredTagList.reduce((acc, tag) => {
        acc[tag.value] = tag;
        return acc;
    }, {}), [filteredTagList]);
    if (!currentPolicyTag) {
        return <NotFoundPage_1.default />;
    }
    const toggleTag = (tag) => {
        setSelectedTags((prev) => {
            if (prev.includes(tag.value)) {
                return prev.filter((selectedTag) => selectedTag !== tag.value);
            }
            return [...prev, tag.value];
        });
    };
    const toggleAllTags = () => {
        const availableTags = filteredTagList.filter((tag) => tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        const anySelected = availableTags.some((tag) => selectedTags.includes(tag.value));
        setSelectedTags(anySelected ? [] : availableTags.map((tag) => tag.value));
    };
    const getCustomListHeader = () => {
        if (filteredTagList.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.name')} rightHeaderText={hasDependentTags ? undefined : translate('common.enabled')}/>);
    };
    const navigateToTagSettings = (tag) => {
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(policyID, route.params.orderWeight, tag.value, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(policyID, route.params.orderWeight, tag.value, tag?.rules?.parentTagsFilter ?? undefined));
    };
    const deleteTags = () => {
        (0, Tag_1.deletePolicyTags)(policyID, selectedTags);
        setIsDeleteTagsConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedTags([]);
        });
    };
    const isLoading = !isOffline && policyTags === undefined;
    const listHeaderContent = tagList.length > CONST_1.default.SEARCH_ITEM_LIMIT ? (<SearchBar_1.default inputValue={inputValue} onChangeText={setInputValue} label={translate('workspace.tags.findTag')} shouldShowEmptyState={filteredTagList.length === 0 && !isLoading}/>) : undefined;
    const getHeaderButtons = () => {
        if ((!isSmallScreenWidth && selectedTags.length === 0) || (isSmallScreenWidth && !isMobileSelectionModeEnabled)) {
            return null;
        }
        const options = [];
        const isThereAnyAccountingConnection = Object.keys(policy?.connections ?? {}).length !== 0;
        const isMultiLevelTags = (0, PolicyUtils_1.isMultiLevelTags)(policyTags);
        if (!isThereAnyAccountingConnection && !isMultiLevelTags && selectedTags.length > 0) {
            options.push({
                icon: Expensicons.Trashcan,
                text: translate(selectedTags.length === 1 ? 'workspace.tags.deleteTag' : 'workspace.tags.deleteTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                onSelected: () => setIsDeleteTagsConfirmModalVisible(true),
            });
        }
        let enabledTagCount = 0;
        const tagsToDisable = {};
        let disabledTagCount = 0;
        const tagsToEnable = {};
        for (const tagName of selectedTags) {
            if (tagListKeyedByName[tagName]?.enabled) {
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
        if (enabledTagCount > 0) {
            const selectedTagsObject = selectedTags.map((key) => currentPolicyTag?.tags[key]);
            options.push({
                icon: Expensicons.Close,
                text: translate(enabledTagCount === 1 ? 'workspace.tags.disableTag' : 'workspace.tags.disableTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                onSelected: () => {
                    if ((0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(currentPolicyTag, selectedTagsObject)) {
                        setIsCannotDeleteOrDisableLastTagModalVisible(true);
                        return;
                    }
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagEnabled)(policyID, tagsToDisable, route.params.orderWeight);
                },
            });
        }
        if (disabledTagCount > 0) {
            options.push({
                icon: Expensicons.Checkmark,
                text: translate(disabledTagCount === 1 ? 'workspace.tags.enableTag' : 'workspace.tags.enableTags'),
                value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                onSelected: () => {
                    setSelectedTags([]);
                    (0, Tag_1.setWorkspaceTagEnabled)(policyID, tagsToEnable, route.params.orderWeight);
                },
            });
        }
        return (<ButtonWithDropdownMenu_1.default buttonRef={dropdownButtonRef} onPress={() => null} shouldAlwaysShowDropdownMenu isSplitButton={false} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedTags.length })} options={options} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedTags.length}/>);
    };
    if (!!currentPolicyTag?.required && !Object.values(currentPolicyTag?.tags ?? {}).some((tag) => tag.enabled)) {
        (0, Tag_1.setPolicyTagsRequired)(policyID, false, route.params.orderWeight);
    }
    const navigateToEditTag = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAGS_EDIT.getRoute(route.params.policyID, currentPolicyTag?.orderWeight ?? 0, backTo)
            : ROUTES_1.default.WORKSPACE_EDIT_TAGS.getRoute(route.params.policyID, currentPolicyTag?.orderWeight ?? 0, Navigation_1.default.getActiveRoute()));
    };
    const selectionModeHeader = isMobileSelectionModeEnabled && isSmallScreenWidth;
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceViewTagsPage.displayName}>
                <HeaderWithBackButton_1.default title={selectionModeHeader ? translate('common.selectMultiple') : currentTagListName} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedTags([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID) : undefined);
        }}>
                    {!shouldUseNarrowLayout && getHeaderButtons()}
                </HeaderWithBackButton_1.default>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{getHeaderButtons()}</react_native_1.View>}
                <ConfirmModal_1.default isVisible={isDeleteTagsConfirmModalVisible} onConfirm={deleteTags} onCancel={() => setIsDeleteTagsConfirmModalVisible(false)} title={translate(selectedTags.length === 1 ? 'workspace.tags.deleteTag' : 'workspace.tags.deleteTags')} prompt={translate(selectedTags.length === 1 ? 'workspace.tags.deleteTagConfirmation' : 'workspace.tags.deleteTagsConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                {!hasDependentTags && (<react_native_1.View style={[styles.pv4, styles.ph5]}>
                        <ToggleSettingsOptionRow_1.default title={translate('common.required')} switchAccessibilityLabel={translate('common.required')} isActive={!!currentPolicyTag?.required} onToggle={(on) => {
                if ((0, OptionsListUtils_1.isMakingLastRequiredTagListOptional)(policy, policyTags, [currentPolicyTag])) {
                    setIsCannotMakeAllTagsOptionalModalVisible(true);
                    return;
                }
                (0, Tag_1.setPolicyTagsRequired)(policyID, on, route.params.orderWeight);
            }} pendingAction={currentPolicyTag.pendingFields?.required} errors={currentPolicyTag?.errorFields?.required ?? undefined} onCloseError={() => (0, Tag_1.clearPolicyTagListErrorField)(policyID, route.params.orderWeight, 'required')} disabled={!currentPolicyTag?.required && !Object.values(currentPolicyTag?.tags ?? {}).some((tag) => tag.enabled)} showLockIcon={(0, OptionsListUtils_1.isMakingLastRequiredTagListOptional)(policy, policyTags, [currentPolicyTag])}/>
                    </react_native_1.View>)}
                <OfflineWithFeedback_1.default errors={currentPolicyTag.errors} onClose={() => (0, Tag_1.clearPolicyTagListErrors)(policyID, currentPolicyTag.orderWeight)} pendingAction={currentPolicyTag.pendingAction} errorRowStyles={styles.mh5}>
                    <MenuItemWithTopDescription_1.default title={(0, PolicyUtils_1.getCleanedTagName)(currentPolicyTag.name)} description={translate(`workspace.tags.customTagName`)} onPress={navigateToEditTag} shouldShowRightIcon/>
                </OfflineWithFeedback_1.default>
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                {tagList.length > 0 && !isLoading && (<SelectionListWithModal_1.default canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress={!hasDependentTags} onTurnOnSelectionMode={(item) => item && toggleTag(item)} sections={[{ data: filteredTagList, isDisabled: false }]} selectedItems={selectedTags} shouldUseDefaultRightHandSideCheckmark={false} onCheckboxPress={toggleTag} onSelectRow={navigateToTagSettings} onSelectAll={filteredTagList.length > 0 ? toggleAllTags : undefined} showScrollIndicator ListItem={TableListItem_1.default} customListHeader={getCustomListHeader()} listHeaderContent={listHeaderContent} shouldShowListEmptyContent={false} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} addBottomSafeAreaPadding onDismissError={(item) => {
                (0, Tag_1.clearPolicyTagErrors)(policyID, item.value, route.params.orderWeight);
            }}/>)}
                <ConfirmModal_1.default isVisible={isCannotDeleteOrDisableLastTagModalVisible} onConfirm={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} onCancel={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} title={translate('workspace.tags.cannotDeleteOrDisableAllTags.title')} prompt={translate('workspace.tags.cannotDeleteOrDisableAllTags.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                <ConfirmModal_1.default isVisible={isCannotMakeAllTagsOptionalModalVisible} onConfirm={() => setIsCannotMakeAllTagsOptionalModalVisible(false)} onCancel={() => setIsCannotMakeAllTagsOptionalModalVisible(false)} title={translate('workspace.tags.cannotMakeAllTagsOptional.title')} prompt={translate('workspace.tags.cannotMakeAllTagsOptional.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceViewTagsPage.displayName = 'WorkspaceViewTagsPage';
exports.default = WorkspaceViewTagsPage;
