"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const applyOnyxUpdatesReliably_1 = require("@libs/actions/applyOnyxUpdatesReliably");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Visibility_1 = require("@libs/Visibility");
const App_1 = require("@userActions/App");
const Modal = require("@userActions/Modal");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const _1 = require(".");
/**
 * Manage push notification subscriptions on sign-in/sign-out.
 */
// We do not depend on updates on the UI for notifications, so we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NVP_PRIVATE_PUSH_NOTIFICATION_ID,
    callback: (notificationID) => {
        if (notificationID) {
            _1.default.register(notificationID);
            _1.default.init();
            // Subscribe handlers for different push notification types
            _1.default.onReceived(_1.default.TYPE.REPORT_COMMENT, applyOnyxData);
            _1.default.onSelected(_1.default.TYPE.REPORT_COMMENT, navigateToReport);
            _1.default.onReceived(_1.default.TYPE.REPORT_ACTION, applyOnyxData);
            _1.default.onSelected(_1.default.TYPE.REPORT_ACTION, navigateToReport);
            _1.default.onReceived(_1.default.TYPE.TRANSACTION, applyOnyxData);
            _1.default.onSelected(_1.default.TYPE.TRANSACTION, navigateToReport);
        }
        else {
            _1.default.deregister();
            _1.default.clearNotifications();
        }
    },
});
let isSingleNewDotEntry;
// Hybrid app config is not determined by changes in the UI, so we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.HYBRID_APP,
    callback: (value) => {
        if (!value) {
            return;
        }
        isSingleNewDotEntry = value?.isSingleNewDotEntry;
    },
});
function applyOnyxData({ reportID, onyxData, lastUpdateID, previousUpdateID, hasPendingOnyxUpdates = false }) {
    Log_1.default.info(`[PushNotification] Applying onyx data in the ${Visibility_1.default.isVisible() ? 'foreground' : 'background'}`, false, { reportID, lastUpdateID });
    const logMissingOnyxDataInfo = (isDataMissing) => {
        if (isDataMissing) {
            Log_1.default.hmmm("[PushNotification] didn't apply onyx updates because some data is missing", { lastUpdateID, previousUpdateID, onyxDataCount: onyxData?.length ?? 0 });
            return false;
        }
        Log_1.default.info('[PushNotification] reliable onyx update received', false, { lastUpdateID, previousUpdateID, onyxDataCount: onyxData?.length ?? 0 });
        return true;
    };
    let updates;
    if (hasPendingOnyxUpdates) {
        const isDataMissing = !lastUpdateID;
        logMissingOnyxDataInfo(isDataMissing);
        if (isDataMissing) {
            return Promise.resolve();
        }
        updates = {
            type: CONST_1.default.ONYX_UPDATE_TYPES.AIRSHIP,
            lastUpdateID,
            shouldFetchPendingUpdates: true,
            updates: [],
        };
    }
    else {
        const isDataMissing = !lastUpdateID || !onyxData || !previousUpdateID;
        logMissingOnyxDataInfo(isDataMissing);
        if (isDataMissing) {
            return Promise.resolve();
        }
        updates = {
            type: CONST_1.default.ONYX_UPDATE_TYPES.AIRSHIP,
            lastUpdateID,
            previousUpdateID,
            updates: [
                {
                    eventType: '', // This is only needed for Pusher events
                    data: onyxData,
                },
            ],
        };
    }
    /**
     * When this callback runs in the background on Android (via Headless JS), no other Onyx.connect callbacks will run. This means that
     * lastUpdateIDAppliedToClient will NOT be populated in other libs. To workaround this, we manually read the value here
     * and pass it as a param
     */
    return getLastUpdateIDAppliedToClient()
        .then((lastUpdateIDAppliedToClient) => (0, applyOnyxUpdatesReliably_1.default)(updates, { shouldRunSync: true, clientLastUpdateID: lastUpdateIDAppliedToClient }))
        .then(() => react_native_1.NativeModules.PushNotificationBridge.finishBackgroundProcessing());
}
function navigateToReport({ reportID }) {
    Log_1.default.info('[PushNotification] Navigating to report', false, { reportID });
    Navigation_1.default.waitForProtectedRoutes().then(() => {
        // The attachment modal remains open when navigating to the report so we need to close it
        Modal.close(() => {
            try {
                // When transitioning to the new experience via the singleNewDotEntry flow, the navigation
                // is handled elsewhere. So we cancel here to prevent double navigation.
                if (isSingleNewDotEntry) {
                    Log_1.default.info('[PushNotification] Not navigating because this is a singleNewDotEntry flow', false, { reportID });
                    return;
                }
                // Get rid of the transition screen, if it is on the top of the stack
                if (CONFIG_1.default.IS_HYBRID_APP && Navigation_1.default.getActiveRoute().includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS)) {
                    Navigation_1.default.goBack();
                }
                // If a chat is visible other than the one we are trying to navigate to, then we need to navigate back
                if (Navigation_1.default.getActiveRoute().slice(1, 2) === ROUTES_1.default.REPORT && !Navigation_1.default.isActiveRoute(`r/${reportID}`)) {
                    Navigation_1.default.goBack();
                }
                Log_1.default.info('[PushNotification] onSelected() - Navigation is ready. Navigating...', false, { reportID });
                const backTo = Navigation_1.default.isActiveRoute(ROUTES_1.default.REPORT_WITH_ID.getRoute(String(reportID))) ? undefined : Navigation_1.default.getActiveRoute();
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(String(reportID), undefined, undefined, backTo));
                (0, App_1.updateLastVisitedPath)(ROUTES_1.default.REPORT_WITH_ID.getRoute(String(reportID)));
            }
            catch (error) {
                let errorMessage = String(error);
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                Log_1.default.alert('[PushNotification] onSelected() - failed', { reportID, error: errorMessage });
            }
        });
    });
    return Promise.resolve();
}
function getLastUpdateIDAppliedToClient() {
    return new Promise((resolve) => {
        // We do not depend on updates on the UI to determine the last update ID applied to the client
        // So we can use `connectWithoutView` here.
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT,
            callback: (value) => resolve(value ?? CONST_1.default.DEFAULT_NUMBER_ID),
        });
    });
}
