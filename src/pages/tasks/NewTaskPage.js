"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const Task_1 = require("@libs/actions/Task");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function NewTaskPage({ route }) {
    const [task] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TASK, { canBeMissing: true });
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [quickAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const assignee = (0, react_1.useMemo)(() => (0, Task_1.getAssignee)(task?.assigneeAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, personalDetails), [task?.assigneeAccountID, personalDetails]);
    const assigneeTooltipDetails = (0, ReportUtils_1.getDisplayNamesWithTooltips)((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(task?.assigneeAccountID ? [task.assigneeAccountID] : [], personalDetails), false, localeCompare);
    const shareDestination = (0, react_1.useMemo)(() => (task?.shareDestination ? (0, Task_1.getShareDestination)(task.shareDestination, reports, personalDetails, localeCompare) : undefined), [task?.shareDestination, reports, personalDetails, localeCompare]);
    const parentReport = (0, react_1.useMemo)(() => (task?.shareDestination ? reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${task.shareDestination}`] : undefined), [reports, task?.shareDestination]);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const hasDestinationError = task?.skipConfirmation && !task?.parentReportID;
    const isAllowedToCreateTask = (0, react_1.useMemo)(() => (0, EmptyObject_1.isEmptyObject)(parentReport) || (0, ReportUtils_1.isAllowedToComment)(parentReport), [parentReport]);
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const backTo = route.params?.backTo;
    const confirmButtonRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, blurActiveElement_1.default)();
            });
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current);
    }, []));
    (0, react_1.useEffect)(() => {
        setErrorMessage('');
        // We only set the parentReportID if we are creating a task from a report
        // this allows us to go ahead and set that report as the share destination
        // and disable the share destination selector
        if (task?.parentReportID) {
            (0, Task_1.setShareDestinationValue)(task.parentReportID);
        }
    }, [task?.assignee, task?.assigneeAccountID, task?.description, task?.parentReportID, task?.shareDestination, task?.title]);
    // On submit, we want to call the createTask function and wait to validate
    // the response
    const onSubmit = () => {
        if (!task?.title && !task?.shareDestination) {
            setErrorMessage(translate('newTaskPage.confirmError'));
            return;
        }
        if (!task.title) {
            setErrorMessage(translate('newTaskPage.pleaseEnterTaskName'));
            return;
        }
        if (!task.shareDestination) {
            setErrorMessage(translate('newTaskPage.pleaseEnterTaskDestination'));
            return;
        }
        (0, Task_1.createTaskAndNavigate)(parentReport?.reportID, task.title, task?.description ?? '', task?.assignee ?? '', task.assigneeAccountID, task.assigneeChatReport, parentReport?.policyID, false, quickAction);
    };
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={NewTaskPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!isAllowedToCreateTask} onBackButtonPress={() => (0, Task_1.dismissModalAndClearOutTaskInfo)()} shouldShowLink={false}>
                <HeaderWithBackButton_1.default title={translate('newTaskPage.confirmTask')} shouldShowBackButton onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK_DETAILS.getRoute(backTo));
        }}/>
                {!!hasDestinationError && (<FormHelpMessage_1.default style={[styles.ph4, styles.mb4]} isError={false} shouldShowRedDotIndicator={false} message={translate('quickAction.noLongerHaveReportAccess')}/>)}
                <ScrollView_1.default contentContainerStyle={styles.flexGrow1} 
    // on iOS, navigation animation sometimes cause the scrollbar to appear
    // on middle/left side of ScrollView. scrollIndicatorInsets with right
    // to closest value to 0 fixes this issue, 0 (default) doesn't work
    // See: https://github.com/Expensify/App/issues/31441
    scrollIndicatorInsets={{ right: Number.MIN_VALUE }}>
                    <react_native_1.View style={styles.flex1}>
                        <react_native_1.View style={styles.mb5}>
                            <MenuItemWithTopDescription_1.default description={translate('task.title')} title={task?.title} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK_TITLE.getRoute(backTo))} shouldShowRightIcon rightLabel={translate('common.required')} shouldParseTitle excludedMarkdownRules={[...CONST_1.default.TASK_TITLE_DISABLED_RULES]}/>
                            <MenuItemWithTopDescription_1.default description={translate('task.description')} title={task?.description} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK_DESCRIPTION.getRoute(backTo))} shouldShowRightIcon shouldParseTitle numberOfLinesTitle={2} titleStyle={styles.flex1}/>
                            <MenuItem_1.default label={assignee?.displayName ? translate('task.assignee') : ''} title={assignee?.displayName ?? ''} description={assignee?.displayName ? formatPhoneNumber(assignee?.subtitle) : translate('task.assignee')} iconAccountID={task?.assigneeAccountID} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK_ASSIGNEE.getRoute(backTo))} shouldShowRightIcon titleWithTooltips={assigneeTooltipDetails}/>
                            <MenuItem_1.default label={shareDestination?.displayName ? translate('common.share') : ''} title={shareDestination?.displayName ?? ''} description={shareDestination?.displayName ? shareDestination.subtitle : translate('common.share')} iconReportID={task?.shareDestination} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK_SHARE_DESTINATION)} interactive={!task?.parentReportID} shouldShowRightIcon={!task?.parentReportID} titleWithTooltips={shareDestination?.shouldUseFullTitleToDisplay ? undefined : shareDestination?.displayNamesWithTooltips} rightLabel={translate('common.required')}/>
                        </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.View style={styles.flexShrink0}>
                        <FormAlertWithSubmitButton_1.default isAlertVisible={!!errorMessage} message={errorMessage} onSubmit={onSubmit} enabledWhenOffline buttonRef={confirmButtonRef} buttonText={translate('newTaskPage.confirmTask')} containerStyles={[styles.mh0, styles.mt5, styles.flex1, styles.ph5, !paddingBottom ? styles.mb5 : null]}/>
                    </react_native_1.View>
                </ScrollView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
NewTaskPage.displayName = 'NewTaskPage';
exports.default = NewTaskPage;
