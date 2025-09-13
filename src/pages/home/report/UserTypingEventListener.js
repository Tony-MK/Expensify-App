"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Report = require("@userActions/Report");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function UserTypingEventListener({ report }) {
    const [lastVisitedPath] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_VISITED_PATH, { selector: (path) => path ?? '' });
    const didSubscribeToReportTypingEvents = (0, react_1.useRef)(false);
    const reportID = report.reportID;
    const isFocused = (0, native_1.useIsFocused)();
    const route = (0, native_1.useRoute)();
    (0, react_1.useEffect)(() => () => {
        if (!didSubscribeToReportTypingEvents.current) {
            return;
        }
        // unsubscribe from report typing events when the component unmounts
        didSubscribeToReportTypingEvents.current = false;
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Report.unsubscribeFromReportChannel(reportID);
        });
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    (0, react_1.useEffect)(() => {
        // Ensures any optimistic report that is being created (ex: a thread report) gets created and initialized successfully before subscribing
        if (route?.params?.reportID !== reportID) {
            return;
        }
        let interactionTask = null;
        if (isFocused) {
            // Ensures subscription event succeeds when the report/workspace room is created optimistically.
            // Check if the optimistic `OpenReport` or `AddWorkspaceRoom` has succeeded by confirming
            // any `pendingFields.createChat` or `pendingFields.addWorkspaceRoom` fields are set to null.
            // Existing reports created will have empty fields for `pendingFields`.
            const didCreateReportSuccessfully = !report.pendingFields || (!report.pendingFields.addWorkspaceRoom && !report.pendingFields.createChat);
            if (!didSubscribeToReportTypingEvents.current && didCreateReportSuccessfully) {
                interactionTask = react_native_1.InteractionManager.runAfterInteractions(() => {
                    Report.subscribeToReportTypingEvents(reportID);
                    didSubscribeToReportTypingEvents.current = true;
                });
            }
        }
        else {
            const topmostReportId = Navigation_1.default.getTopmostReportId();
            if (topmostReportId !== reportID && didSubscribeToReportTypingEvents.current) {
                didSubscribeToReportTypingEvents.current = false;
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    Report.unsubscribeFromReportChannel(reportID);
                });
            }
        }
        return () => {
            if (!interactionTask) {
                return;
            }
            interactionTask.cancel();
        };
    }, [isFocused, report.pendingFields, didSubscribeToReportTypingEvents, lastVisitedPath, reportID, route]);
    return null;
}
UserTypingEventListener.displayName = 'UserTypingEventListener';
exports.default = UserTypingEventListener;
