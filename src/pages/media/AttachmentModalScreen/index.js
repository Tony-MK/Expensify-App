"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SCREENS_1 = require("@src/SCREENS");
var AttachmentModalContext_1 = require("./AttachmentModalContext");
var ProfileAvatarModalContent_1 = require("./routes/ProfileAvatarModalContent");
var ReportAttachmentModalContent_1 = require("./routes/ReportAttachmentModalContent");
var ReportAvatarModalContent_1 = require("./routes/ReportAvatarModalContent");
var TransactionReceiptModalContent_1 = require("./routes/TransactionReceiptModalContent");
var WorkspaceAvatarModalContent_1 = require("./routes/WorkspaceAvatarModalContent");
/**
 * The attachment modal screen can take various different shapes. This is the main screen component that receives the route and
 * navigation props from the parent screen and renders the correct modal content based on the route.
 */
function AttachmentModalScreen(_a) {
    var route = _a.route, navigation = _a.navigation;
    var attachmentsContext = (0, react_1.useContext)(AttachmentModalContext_1.default);
    var routeWithContext = (0, react_1.useMemo)(function () {
        var currentAttachment = attachmentsContext.getCurrentAttachment();
        if (currentAttachment) {
            return __assign(__assign({}, route), { params: __assign(__assign({}, route.params), currentAttachment) });
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
