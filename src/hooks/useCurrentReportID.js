"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCurrentReportID;
exports.CurrentReportIDContextProvider = CurrentReportIDContextProvider;
const react_1 = require("react");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const CurrentReportIDContext = (0, react_1.createContext)(null);
function CurrentReportIDContextProvider(props) {
    const [currentReportID, setCurrentReportID] = (0, react_1.useState)('');
    const [lastVisitedPath] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_VISITED_PATH, { canBeMissing: true });
    const lastAccessReportFromPath = (0, ReportUtils_1.getReportIDFromLink)(lastVisitedPath ?? null);
    /**
     * This function is used to update the currentReportID
     * @param state root navigation state
     */
    const updateCurrentReportID = (0, react_1.useCallback)((state) => {
        const reportID = Navigation_1.default.getTopmostReportId(state);
        /*
         * Make sure we don't make the reportID undefined when switching between the chat list and settings tab.
         * This helps prevent unnecessary re-renders.
         */
        const params = state?.routes?.[state.index]?.params;
        if (params && 'screen' in params && typeof params.screen === 'string' && params.screen.indexOf('Settings_') !== -1) {
            return;
        }
        // Prevent unnecessary updates when the report ID hasn't changed
        if (currentReportID === reportID) {
            return;
        }
        // Also prevent updates when both are undefined/null (no report context)
        if (!currentReportID && !reportID) {
            return;
        }
        props.onSetCurrentReportID?.(reportID);
        setCurrentReportID(reportID);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we don't want to re-render when onSetCurrentReportID changes
    [setCurrentReportID, currentReportID]);
    /**
     * The context this component exposes to child components
     * @returns currentReportID to share between central pane and LHN
     */
    const contextValue = (0, react_1.useMemo)(() => ({
        updateCurrentReportID,
        currentReportID,
        currentReportIDFromPath: lastAccessReportFromPath || undefined,
    }), [updateCurrentReportID, currentReportID, lastAccessReportFromPath]);
    return <CurrentReportIDContext.Provider value={contextValue}>{props.children}</CurrentReportIDContext.Provider>;
}
CurrentReportIDContextProvider.displayName = 'CurrentReportIDContextProvider';
function useCurrentReportID() {
    return (0, react_1.useContext)(CurrentReportIDContext);
}
