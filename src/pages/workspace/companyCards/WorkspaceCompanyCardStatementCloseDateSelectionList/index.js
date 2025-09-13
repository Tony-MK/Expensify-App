"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FixedFooter_1 = require("@components/FixedFooter");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const CustomCloseDateSelectionList_1 = require("./CustomCloseDateSelectionList");
function WorkspaceCompanyCardStatementCloseDateSelectionList({ confirmText, onSubmit, onBackButtonPress, enabledWhenOffline, defaultStatementPeriodEnd, defaultStatementPeriodEndDay, pendingAction, errors, onCloseError, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(() => {
        if (defaultStatementPeriodEndDay) {
            return CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE.CUSTOM_DAY_OF_MONTH;
        }
        return defaultStatementPeriodEnd;
    });
    const [selectedCustomDate, setSelectedCustomDate] = (0, react_1.useState)(defaultStatementPeriodEndDay);
    const [isChoosingCustomDate, setIsChoosingCustomDate] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(undefined);
    const title = (0, react_1.useMemo)(() => (isChoosingCustomDate ? translate('workspace.companyCards.customCloseDate') : translate('workspace.moreFeatures.companyCards.statementCloseDateTitle')), [translate, isChoosingCustomDate]);
    const goBack = (0, react_1.useCallback)(() => {
        if (isChoosingCustomDate) {
            setIsChoosingCustomDate(false);
            return;
        }
        onBackButtonPress();
    }, [isChoosingCustomDate, onBackButtonPress]);
    const selectDateAndClearError = (0, react_1.useCallback)((item) => {
        setSelectedDate(item.value);
        setError(undefined);
    }, []);
    const selectCustomDateAndClearError = (0, react_1.useCallback)((day) => {
        setSelectedCustomDate(day);
        setError(undefined);
        goBack();
    }, [goBack]);
    const submit = (0, react_1.useCallback)(() => {
        if (!selectedDate) {
            setError(translate('workspace.moreFeatures.companyCards.error.statementCloseDateRequired'));
            return;
        }
        if (selectedDate === CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE.CUSTOM_DAY_OF_MONTH) {
            if (!selectedCustomDate) {
                setError(translate('workspace.moreFeatures.companyCards.error.statementCloseDateRequired'));
                return;
            }
            onSubmit(undefined, selectedCustomDate);
            return;
        }
        onSubmit(selectedDate, undefined);
    }, [selectedDate, selectedCustomDate, onSubmit, translate]);
    return (<ScreenWrapper_1.default testID={WorkspaceCompanyCardStatementCloseDateSelectionList.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={title} onBackButtonPress={goBack}/>
            {isChoosingCustomDate ? (<CustomCloseDateSelectionList_1.default initiallySelectedDay={selectedCustomDate} onConfirmSelectedDay={selectCustomDateAndClearError}/>) : (<>
                    <ScrollView_1.default contentContainerStyle={[styles.gap7, styles.flexGrow1]}>
                        <Text_1.default style={[styles.ph5]}>{translate('workspace.moreFeatures.companyCards.statementCloseDateDescription')}</Text_1.default>
                        <OfflineWithFeedback_1.default errors={errors} errorRowStyles={[styles.mt2, styles.pl5, styles.pr3]} onClose={onCloseError} pendingAction={pendingAction}>
                            <react_native_1.View>
                                {Object.values(CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE)?.map((option) => (<SingleSelectListItem_1.default wrapperStyle={[styles.flexReset]} key={option} showTooltip item={{
                    value: option,
                    text: translate(`workspace.companyCards.statementCloseDate.${option}`),
                    isSelected: selectedDate === option,
                }} onSelectRow={selectDateAndClearError}/>))}
                                {selectedDate === CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE.CUSTOM_DAY_OF_MONTH && (<MenuItemWithTopDescription_1.default shouldShowRightIcon brickRoadIndicator={error ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} title={selectedCustomDate?.toString()} description={translate('workspace.companyCards.customCloseDate')} onPress={() => setIsChoosingCustomDate(true)} viewMode={CONST_1.default.OPTION_MODE.COMPACT}/>)}
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>
                    </ScrollView_1.default>
                    <FixedFooter_1.default style={styles.gap3} addBottomSafeAreaPadding>
                        {!!error && (<FormHelpMessage_1.default isError message={error}/>)}
                        <FormAlertWithSubmitButton_1.default buttonText={confirmText} onSubmit={submit} enabledWhenOffline={enabledWhenOffline}/>
                    </FixedFooter_1.default>
                </>)}
        </ScreenWrapper_1.default>);
}
WorkspaceCompanyCardStatementCloseDateSelectionList.displayName = 'WorkspaceCompanyCardStatementCloseDateSelectionList';
exports.default = WorkspaceCompanyCardStatementCloseDateSelectionList;
