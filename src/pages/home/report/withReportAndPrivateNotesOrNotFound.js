"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const Report_1 = require("@libs/actions/Report");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const LoadingPage_1 = require("@pages/LoadingPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withReportOrNotFound_1 = require("./withReportOrNotFound");
function default_1(pageTitle) {
    return (WrappedComponent) => {
        // eslint-disable-next-line rulesdir/no-negated-variables
        function WithReportAndPrivateNotesOrNotFound(props) {
            const { translate } = (0, useLocalize_1.default)();
            const { isOffline } = (0, useNetwork_1.default)();
            const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
            const { route, report, reportMetadata } = props;
            const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`);
            const accountID = ('accountID' in route.params && route.params.accountID) || '';
            const isPrivateNotesFetchTriggered = reportMetadata?.isLoadingPrivateNotes !== undefined;
            const prevIsOffline = (0, usePrevious_1.default)(isOffline);
            const isReconnecting = prevIsOffline && !isOffline;
            const isOtherUserNote = !!accountID && Number(session?.accountID) !== Number(accountID);
            const isPrivateNotesFetchFinished = isPrivateNotesFetchTriggered && !reportMetadata.isLoadingPrivateNotes;
            const isPrivateNotesUndefined = accountID ? report?.privateNotes?.[Number(accountID)]?.note === undefined : (0, EmptyObject_1.isEmptyObject)(report?.privateNotes);
            (0, react_1.useEffect)(() => {
                // Do not fetch private notes if isLoadingPrivateNotes is already defined, or if network is offline.
                if ((isPrivateNotesFetchTriggered && !isReconnecting) || isOffline) {
                    return;
                }
                (0, Report_1.getReportPrivateNote)(report?.reportID);
                // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- do not add report.isLoadingPrivateNotes to dependencies
            }, [report?.reportID, isOffline, isPrivateNotesFetchTriggered, isReconnecting]);
            const shouldShowFullScreenLoadingIndicator = !isPrivateNotesFetchFinished;
            // eslint-disable-next-line rulesdir/no-negated-variables
            const shouldShowNotFoundPage = (0, react_1.useMemo)(() => {
                // Show not found view if the report is archived, or if the note is not of current user or if report is a self DM.
                if ((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || isOtherUserNote || (0, ReportUtils_1.isSelfDM)(report)) {
                    return true;
                }
                // Don't show not found view if the notes are still loading, or if the notes are non-empty.
                if (shouldShowFullScreenLoadingIndicator || !isPrivateNotesUndefined || isReconnecting) {
                    return false;
                }
                // As notes being empty and not loading is a valid case, show not found view only in offline mode.
                return isOffline;
            }, [report, isOtherUserNote, shouldShowFullScreenLoadingIndicator, isPrivateNotesUndefined, isReconnecting, isOffline, reportNameValuePairs]);
            if (shouldShowFullScreenLoadingIndicator) {
                if (isOffline) {
                    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID="PrivateNotesOfflinePage">
                            <HeaderWithBackButton_1.default title={translate('privateNotes.title')} onBackButtonPress={() => Navigation_1.default.goBack()} shouldShowBackButton onCloseButtonPress={() => Navigation_1.default.dismissModal()}/>
                            <FullPageOfflineBlockingView_1.default>
                                <react_native_1.View />
                            </FullPageOfflineBlockingView_1.default>
                        </ScreenWrapper_1.default>);
                }
                return <LoadingPage_1.default title={translate(pageTitle)}/>;
            }
            if (shouldShowNotFoundPage) {
                return <NotFoundPage_1.default />;
            }
            return (<WrappedComponent 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props} accountID={session?.accountID}/>);
        }
        WithReportAndPrivateNotesOrNotFound.displayName = `withReportAndPrivateNotesOrNotFound(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
        return (0, withReportOrNotFound_1.default)()(WithReportAndPrivateNotesOrNotFound);
    };
}
