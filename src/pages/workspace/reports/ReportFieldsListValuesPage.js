"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const TableRowSkeleton_1 = require("@components/Skeletons/TableRowSkeleton");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const ReportField_1 = require("@libs/actions/Policy/ReportField");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ReportFieldsListValuesPage({ policy, route: { params: { policyID, reportFieldID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout here to use the mobile selection mode on small screens only
    // See https://github.com/Expensify/App/issues/48724 for more details
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [selectedValues, setSelectedValues] = (0, react_1.useState)({});
    const [deleteValuesConfirmModalVisible, setDeleteValuesConfirmModalVisible] = (0, react_1.useState)(false);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const canSelectMultiple = !hasAccountingConnections && (isSmallScreenWidth ? isMobileSelectionModeEnabled : true);
    const [listValues, disabledListValues] = (0, react_1.useMemo)(() => {
        let reportFieldValues;
        let reportFieldDisabledValues;
        if (reportFieldID) {
            const reportFieldKey = (0, ReportUtils_1.getReportFieldKey)(reportFieldID);
            reportFieldValues = Object.values(policy?.fieldList?.[reportFieldKey]?.values ?? {});
            reportFieldDisabledValues = Object.values(policy?.fieldList?.[reportFieldKey]?.disabledOptions ?? {});
        }
        else {
            reportFieldValues = formDraft?.listValues ?? [];
            reportFieldDisabledValues = formDraft?.disabledListValues ?? [];
        }
        return [reportFieldValues, reportFieldDisabledValues];
    }, [formDraft?.disabledListValues, formDraft?.listValues, policy?.fieldList, reportFieldID]);
    const updateReportFieldListValueEnabled = (0, react_1.useCallback)((value, valueIndex) => {
        if (reportFieldID) {
            (0, ReportField_1.updateReportFieldListValueEnabled)(policyID, reportFieldID, [Number(valueIndex)], value);
            return;
        }
        (0, ReportField_1.setReportFieldsListValueEnabled)([valueIndex], value);
    }, [policyID, reportFieldID]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => {
            setSelectedValues({});
        },
        onNavigationCallBack: () => Navigation_1.default.goBack(),
    });
    const data = (0, react_1.useMemo)(() => listValues.map((value, index) => ({
        value,
        index,
        text: value,
        keyForList: value,
        isSelected: selectedValues[value] && canSelectMultiple,
        enabled: !disabledListValues.at(index),
        rightElement: (<Switch_1.default isOn={!disabledListValues.at(index)} accessibilityLabel={translate('workspace.distanceRates.trackTax')} onToggle={(newValue) => updateReportFieldListValueEnabled(newValue, index)}/>),
    })), [canSelectMultiple, disabledListValues, listValues, selectedValues, translate, updateReportFieldListValueEnabled]);
    const filterListValue = (0, react_1.useCallback)((item, searchInput) => {
        const itemText = StringUtils_1.default.normalize(item.text?.toLowerCase() ?? '');
        const normalizedSearchInput = StringUtils_1.default.normalize(searchInput.toLowerCase());
        return itemText.includes(normalizedSearchInput);
    }, []);
    const sortListValues = (0, react_1.useCallback)((values) => values.sort((a, b) => localeCompare(a.value, b.value)), [localeCompare]);
    const [inputValue, setInputValue, filteredListValues] = (0, useSearchResults_1.default)(data, filterListValue, sortListValues);
    const sections = (0, react_1.useMemo)(() => [{ data: filteredListValues, isDisabled: false }], [filteredListValues]);
    const filteredListValuesArray = filteredListValues.map((item) => item.value);
    const shouldShowEmptyState = Object.values(listValues ?? {}).length <= 0;
    const selectedValuesArray = Object.keys(selectedValues).filter((key) => selectedValues[key] && listValues.includes(key));
    const toggleValue = (valueItem) => {
        setSelectedValues((prev) => ({
            ...prev,
            [valueItem.value]: !prev[valueItem.value],
        }));
    };
    const toggleAllValues = () => {
        setSelectedValues(selectedValuesArray.length > 0 ? {} : Object.fromEntries(filteredListValuesArray.map((value) => [value, true])));
    };
    const handleDeleteValues = () => {
        const valuesToDelete = selectedValuesArray.reduce((acc, valueName) => {
            const index = listValues?.indexOf(valueName) ?? -1;
            if (index !== -1) {
                acc.push(index);
            }
            return acc;
        }, []);
        if (reportFieldID) {
            (0, ReportField_1.removeReportFieldListValue)(policyID, reportFieldID, valuesToDelete);
        }
        else {
            (0, ReportField_1.deleteReportFieldsListValue)(valuesToDelete);
        }
        setDeleteValuesConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedValues({});
        });
    };
    const openListValuePage = (valueItem) => {
        if (valueItem.index === undefined || hasAccountingConnections) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_VALUE_SETTINGS.getRoute(policyID, valueItem.index, reportFieldID));
    };
    const getCustomListHeader = () => {
        if (filteredListValues.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.name')} rightHeaderText={translate('common.enabled')}/>);
    };
    const getHeaderButtons = () => {
        const options = [];
        if (isSmallScreenWidth ? isMobileSelectionModeEnabled : selectedValuesArray.length > 0) {
            if (selectedValuesArray.length > 0) {
                options.push({
                    icon: Expensicons.Trashcan,
                    text: translate(selectedValuesArray.length === 1 ? 'workspace.reportFields.deleteValue' : 'workspace.reportFields.deleteValues'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DELETE,
                    onSelected: () => setDeleteValuesConfirmModalVisible(true),
                });
            }
            const enabledValues = selectedValuesArray.filter((valueName) => {
                const index = listValues?.indexOf(valueName) ?? -1;
                return !disabledListValues?.at(index);
            });
            if (enabledValues.length > 0) {
                const valuesToDisable = selectedValuesArray.reduce((acc, valueName) => {
                    const index = listValues?.indexOf(valueName) ?? -1;
                    if (!disabledListValues?.at(index) && index !== -1) {
                        acc.push(index);
                    }
                    return acc;
                }, []);
                options.push({
                    icon: Expensicons.Close,
                    text: translate(enabledValues.length === 1 ? 'workspace.reportFields.disableValue' : 'workspace.reportFields.disableValues'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.DISABLE,
                    onSelected: () => {
                        setSelectedValues({});
                        if (reportFieldID) {
                            (0, ReportField_1.updateReportFieldListValueEnabled)(policyID, reportFieldID, valuesToDisable, false);
                            return;
                        }
                        (0, ReportField_1.setReportFieldsListValueEnabled)(valuesToDisable, false);
                    },
                });
            }
            const disabledValues = selectedValuesArray.filter((valueName) => {
                const index = listValues?.indexOf(valueName) ?? -1;
                return disabledListValues?.at(index);
            });
            if (disabledValues.length > 0) {
                const valuesToEnable = selectedValuesArray.reduce((acc, valueName) => {
                    const index = listValues?.indexOf(valueName) ?? -1;
                    if (disabledListValues?.at(index) && index !== -1) {
                        acc.push(index);
                    }
                    return acc;
                }, []);
                options.push({
                    icon: Expensicons.Checkmark,
                    text: translate(disabledValues.length === 1 ? 'workspace.reportFields.enableValue' : 'workspace.reportFields.enableValues'),
                    value: CONST_1.default.POLICY.BULK_ACTION_TYPES.ENABLE,
                    onSelected: () => {
                        setSelectedValues({});
                        if (reportFieldID) {
                            (0, ReportField_1.updateReportFieldListValueEnabled)(policyID, reportFieldID, valuesToEnable, true);
                            return;
                        }
                        (0, ReportField_1.setReportFieldsListValueEnabled)(valuesToEnable, true);
                    },
                });
            }
            return (<ButtonWithDropdownMenu_1.default onPress={() => null} shouldAlwaysShowDropdownMenu buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} customText={translate('workspace.common.selected', { count: selectedValuesArray.length })} options={options} isSplitButton={false} style={[isSmallScreenWidth && styles.flexGrow1, isSmallScreenWidth && styles.mb3]} isDisabled={!selectedValuesArray.length}/>);
        }
        return (<Button_1.default style={[isSmallScreenWidth && styles.flexGrow1, isSmallScreenWidth && styles.mb3]} success icon={Expensicons.Plus} text={translate('workspace.reportFields.addValue')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_ADD_VALUE.getRoute(policyID, reportFieldID))}/>);
    };
    const selectionModeHeader = isMobileSelectionModeEnabled && isSmallScreenWidth;
    const headerContent = (<>
            <react_native_1.View style={[styles.ph5, styles.pv4]}>
                <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{translate('workspace.reportFields.listInputSubtitle')}</Text_1.default>
            </react_native_1.View>
            {data.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.reportFields.findReportField')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={!shouldShowEmptyState && filteredListValues.length === 0}/>)}
        </>);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={ReportFieldsListValuesPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate(selectionModeHeader ? 'common.selectMultiple' : 'workspace.reportFields.listValues')} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedValues({});
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            Navigation_1.default.goBack();
        }}>
                    {!isSmallScreenWidth && !hasAccountingConnections && getHeaderButtons()}
                </HeaderWithBackButton_1.default>
                {isSmallScreenWidth && <react_native_1.View style={[styles.pl5, styles.pr5]}>{!hasAccountingConnections && getHeaderButtons()}</react_native_1.View>}
                {shouldShowEmptyState && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                        {headerContent}
                        <EmptyStateComponent_1.default title={translate('workspace.reportFields.emptyReportFieldsValues.title')} subtitle={translate('workspace.reportFields.emptyReportFieldsValues.subtitle')} SkeletonComponent={TableRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={Illustrations.FolderWithPapers} headerStyles={styles.emptyFolderDarkBG} headerContentStyles={styles.emptyStateFolderWithPaperIconSize}/>
                    </ScrollView_1.default>)}
                {!shouldShowEmptyState && (<SelectionListWithModal_1.default addBottomSafeAreaPadding canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress={!hasAccountingConnections} onTurnOnSelectionMode={(item) => item && toggleValue(item)} sections={sections} selectedItems={selectedValuesArray} shouldUseDefaultRightHandSideCheckmark={false} onCheckboxPress={toggleValue} onSelectRow={openListValuePage} onSelectAll={filteredListValues.length > 0 ? toggleAllValues : undefined} ListItem={TableListItem_1.default} listHeaderContent={headerContent} customListHeader={getCustomListHeader()} shouldShowListEmptyContent={false} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} showScrollIndicator={false}/>)}
                <ConfirmModal_1.default isVisible={deleteValuesConfirmModalVisible} onConfirm={handleDeleteValues} onCancel={() => setDeleteValuesConfirmModalVisible(false)} title={translate(selectedValuesArray.length === 1 ? 'workspace.reportFields.deleteValue' : 'workspace.reportFields.deleteValues')} prompt={translate(selectedValuesArray.length === 1 ? 'workspace.reportFields.deleteValuePrompt' : 'workspace.reportFields.deleteValuesPrompt')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsListValuesPage.displayName = 'ReportFieldsListValuesPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsListValuesPage);
