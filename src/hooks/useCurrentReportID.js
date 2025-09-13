"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCurrentReportID;
exports.CurrentReportIDContextProvider = CurrentReportIDContextProvider;
var react_1 = require("react");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportUtils_1 = require("@libs/ReportUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
var CurrentReportIDContext = (0, react_1.createContext)(null);
function CurrentReportIDContextProvider(props) {
    var _a = (0, react_1.useState)(''), currentReportID = _a[0], setCurrentReportID = _a[1];
    var lastVisitedPath = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_VISITED_PATH, { canBeMissing: true })[0];
    var lastAccessReportFromPath = (0, ReportUtils_1.getReportIDFromLink)(lastVisitedPath !== null && lastVisitedPath !== void 0 ? lastVisitedPath : null);
    /**
     * This function is used to update the currentReportID
     * @param state root navigation state
     */
    var updateCurrentReportID = (0, react_1.useCallback)(function (state) {
        var _a, _b, _c;
        var reportID = Navigation_1.default.getTopmostReportId(state);
        /*
         * Make sure we don't make the reportID undefined when switching between the chat list and settings tab.
         * This helps prevent unnecessary re-renders.
         */
        var params = (_b = (_a = state === null || state === void 0 ? void 0 : state.routes) === null || _a === void 0 ? void 0 : _a[state.index]) === null || _b === void 0 ? void 0 : _b.params;
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
        (_c = props.onSetCurrentReportID) === null || _c === void 0 ? void 0 : _c.call(props, reportID);
        setCurrentReportID(reportID);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we don't want to re-render when onSetCurrentReportID changes
    [setCurrentReportID, currentReportID]);
    /**
     * The context this component exposes to child components
     * @returns currentReportID to share between central pane and LHN
     */
    var contextValue = (0, react_1.useMemo)(function () { return ({
        updateCurrentReportID: updateCurrentReportID,
        currentReportID: currentReportID,
        currentReportIDFromPath: lastAccessReportFromPath || undefined,
    }); }, [updateCurrentReportID, currentReportID, lastAccessReportFromPath]);
    return <CurrentReportIDContext.Provider value={contextValue}>{props.children}</CurrentReportIDContext.Provider>;
}
CurrentReportIDContextProvider.displayName = 'CurrentReportIDContextProvider';
function useCurrentReportID() {
    return (0, react_1.useContext)(CurrentReportIDContext);
}
