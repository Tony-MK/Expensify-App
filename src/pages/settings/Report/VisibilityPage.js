"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const ReportUtils_1 = require("@libs/ReportUtils");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
function VisibilityPage({ report }) {
    const route = (0, native_1.useRoute)();
    const [showConfirmModal, setShowConfirmModal] = (0, react_1.useState)(false);
    const shouldGoBackToDetailsPage = (0, react_1.useRef)(false);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const shouldDisableVisibility = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived);
    const { translate } = (0, useLocalize_1.default)();
    const visibilityOptions = (0, react_1.useMemo)(() => Object.values(CONST_1.default.REPORT.VISIBILITY)
        .filter((visibilityOption) => visibilityOption !== CONST_1.default.REPORT.VISIBILITY.PUBLIC_ANNOUNCE)
        .map((visibilityOption) => ({
        text: translate(`newRoomPage.visibilityOptions.${visibilityOption}`),
        value: visibilityOption,
        alternateText: translate(`newRoomPage.${visibilityOption}Description`),
        keyForList: visibilityOption,
        isSelected: visibilityOption === report?.visibility,
    })), [translate, report?.visibility]);
    const goBack = (0, react_1.useCallback)(() => {
        (0, ReportUtils_1.goBackToDetailsPage)(report, route.params.backTo);
    }, [report, route.params.backTo]);
    const changeVisibility = (0, react_1.useCallback)((newVisibility) => {
        if (!report) {
            return;
        }
        (0, Report_1.updateRoomVisibility)(report.reportID, report.visibility, newVisibility);
        if (showConfirmModal) {
            shouldGoBackToDetailsPage.current = true;
        }
        else {
            goBack();
        }
    }, [report, showConfirmModal, goBack]);
    const hideModal = (0, react_1.useCallback)(() => {
        setShowConfirmModal(false);
    }, []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={VisibilityPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldDisableVisibility}>
                <HeaderWithBackButton_1.default title={translate('newRoomPage.visibility')} onBackButtonPress={goBack}/>
                <SelectionList_1.default shouldPreventDefaultFocusOnSelectRow sections={[{ data: visibilityOptions }]} onSelectRow={(option) => {
            if (option.value === CONST_1.default.REPORT.VISIBILITY.PUBLIC) {
                setShowConfirmModal(true);
                return;
            }
            changeVisibility(option.value);
        }} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={visibilityOptions.find((visibility) => visibility.isSelected)?.keyForList} ListItem={RadioListItem_1.default}/>
                <ConfirmModal_1.default isVisible={showConfirmModal} onConfirm={() => {
            changeVisibility(CONST_1.default.REPORT.VISIBILITY.PUBLIC);
            hideModal();
        }} onModalHide={() => {
            if (!shouldGoBackToDetailsPage.current) {
                return;
            }
            shouldGoBackToDetailsPage.current = false;
            goBack();
        }} onCancel={hideModal} title={translate('common.areYouSure')} prompt={translate('newRoomPage.publicDescription')} confirmText={translate('common.yes')} cancelText={translate('common.no')} danger/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
VisibilityPage.displayName = 'VisibilityPage';
exports.default = (0, withReportOrNotFound_1.default)()(VisibilityPage);
