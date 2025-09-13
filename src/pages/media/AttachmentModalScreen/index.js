"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SCREENS_1 = require("@src/SCREENS");
const AttachmentModalContext_1 = require("./AttachmentModalContext");
const ProfileAvatarModalContent_1 = require("./routes/ProfileAvatarModalContent");
const ReportAttachmentModalContent_1 = require("./routes/ReportAttachmentModalContent");
const ReportAvatarModalContent_1 = require("./routes/ReportAvatarModalContent");
const TransactionReceiptModalContent_1 = require("./routes/TransactionReceiptModalContent");
const WorkspaceAvatarModalContent_1 = require("./routes/WorkspaceAvatarModalContent");
/**
 * The attachment modal screen can take various different shapes. This is the main screen component that receives the route and
 * navigation props from the parent screen and renders the correct modal content based on the route.
 */
function AttachmentModalScreen({ route, navigation }) {
    const attachmentsContext = (0, react_1.useContext)(AttachmentModalContext_1.default);
    const routeWithContext = (0, react_1.useMemo)(() => {
        const currentAttachment = attachmentsContext.getCurrentAttachment();
        if (currentAttachment) {
            return { ...route, params: { ...route.params, ...currentAttachment } };
        }
        return route;
    }, [attachmentsContext, route]);
    if (route.name === SCREENS_1.default.ATTACHMENTS) {
        return (<ReportAttachmentModalContent_1.default route={routeWithContext} navigation={navigation}/>);
    }
    if (route.name === SCREENS_1.default.TRANSACTION_RECEIPT || route.name === SCREENS_1.default.MONEY_REQUEST.RECEIPT_PREVIEW) {
        return (<TransactionReceiptModalContent_1.default route={routeWithContext} navigation={navigation}/>);
    }
    if (route.name === SCREENS_1.default.PROFILE_AVATAR) {
        return (<ProfileAvatarModalContent_1.default route={routeWithContext} navigation={navigation}/>);
    }
    if (route.name === SCREENS_1.default.WORKSPACE_AVATAR) {
        return (<WorkspaceAvatarModalContent_1.default route={routeWithContext} navigation={navigation}/>);
    }
    if (route.name === SCREENS_1.default.REPORT_AVATAR) {
        return (<ReportAvatarModalContent_1.default route={routeWithContext} navigation={navigation}/>);
    }
    return null;
}
AttachmentModalScreen.displayName = 'AttachmentModalScreen';
exports.default = AttachmentModalScreen;
