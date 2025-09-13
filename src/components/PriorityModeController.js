"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PriorityModeController;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const User_1 = require("@libs/actions/User");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Log_1 = require("@libs/Log");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const FocusModeNotification_1 = require("./FocusModeNotification");
/**
 * This component is used to automatically switch a user into #focus mode when they exceed a certain number of reports.
 * We do this primarily for performance reasons. Similar to the "Welcome action" we must wait for a number of things to
 * happen when the user signs in or refreshes the page:
 *
 *  - NVP that tracks whether they have already been switched over. We only do this once.
 *  - Priority mode NVP (that dictates the ordering/filtering logic of the LHN)
 *  - Reports to load (in ReconnectApp or OpenApp). As we check the count of the reports to determine whether the
 *    user is eligible to be automatically switched.
 *
 */
function PriorityModeController() {
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.accountID, canBeMissing: true });
    const [isLoadingReportData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
    const [isInFocusMode, isInFocusModeMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { selector: (priorityMode) => priorityMode === CONST_1.default.PRIORITY_MODE.GSD, canBeMissing: true });
    const [hasTriedFocusMode = true, hasTriedFocusModeMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_FOCUS_MODE, { canBeMissing: true });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const currentRouteName = useCurrentRouteName();
    const [shouldShowModal, setShouldShowModal] = (0, react_1.useState)(false);
    const closeModal = (0, react_1.useCallback)(() => setShouldShowModal(false), []);
    const validReportCount = (0, react_1.useMemo)(() => {
        let count = 0;
        Object.values(allReports ?? {}).forEach((report) => {
            if (!(0, ReportUtils_1.isValidReport)(report) || !(0, ReportUtils_1.isReportParticipant)(accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, report)) {
                return;
            }
            count++;
        });
        return count;
    }, [accountID, allReports]);
    // We set this when we have finally auto-switched the user of #focus mode to prevent duplication.
    const hasSwitched = (0, react_1.useRef)(false);
    // Listen for state changes and trigger the #focus mode when appropriate
    (0, react_1.useEffect)(() => {
        // Wait for Onyx state to fully load
        if (isLoadingReportData !== false || !accountID || (0, isLoadingOnyxValue_1.default)(isInFocusModeMetadata, hasTriedFocusModeMetadata)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (hasSwitched.current || isInFocusMode || hasTriedFocusMode) {
            return;
        }
        if (validReportCount < CONST_1.default.REPORT.MAX_COUNT_BEFORE_FOCUS_UPDATE) {
            Log_1.default.info('[PriorityModeController] Not switching user to focus mode as they do not have enough reports', false, { validReportCount });
            return;
        }
        // We wait for the user to navigate back to the home screen before triggering this switch
        const isNarrowLayout = (0, getIsNarrowLayout_1.default)();
        if ((isNarrowLayout && currentRouteName !== SCREENS_1.default.HOME) || (!isNarrowLayout && currentRouteName !== SCREENS_1.default.REPORT)) {
            Log_1.default.info("[PriorityModeController] Not switching user to focus mode as they aren't on the home screen", false, { validReportCount, currentRouteName });
            return;
        }
        Log_1.default.info('[PriorityModeController] Switching user to focus mode', false, { validReportCount, hasTriedFocusMode, isInFocusMode, currentRouteName });
        (0, User_1.updateChatPriorityMode)(CONST_1.default.PRIORITY_MODE.GSD, true);
        setShouldShowModal(true);
        hasSwitched.current = true;
    }, [accountID, currentRouteName, hasTriedFocusMode, hasTriedFocusModeMetadata, isInFocusMode, isInFocusModeMetadata, isLoadingReportData, validReportCount]);
    return shouldShowModal ? <FocusModeNotification_1.default onClose={closeModal}/> : null;
}
/**
 * A funky but reliable way to subscribe to screen changes.
 */
function useCurrentRouteName() {
    const navigation = (0, native_1.useNavigation)();
    const [currentRouteName, setCurrentRouteName] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('state', () => {
            setCurrentRouteName(navigationRef_1.default.getCurrentRoute()?.name);
        });
        return () => unsubscribe();
    }, [navigation]);
    return currentRouteName;
}
