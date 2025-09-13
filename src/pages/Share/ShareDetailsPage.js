"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var AttachmentModal_1 = require("@components/AttachmentModal");
var AttachmentPreview_1 = require("@components/AttachmentPreview");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons_1 = require("@components/Icon/Expensicons");
var Pressable_1 = require("@components/Pressable");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var TextInput_1 = require("@components/TextInput");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Report_1 = require("@libs/actions/Report");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var ReceiptUtils_1 = require("@libs/ReceiptUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
var variables_1 = require("@styles/variables");
var UserListItem_1 = require("@src/components/SelectionList/UserListItem");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var keyboard_1 = require("@src/utils/keyboard");
var getFileSize_1 = require("./getFileSize");
var ShareRootPage_1 = require("./ShareRootPage");
function ShareDetailsPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var reportOrAccountID = _a.route.params.reportOrAccountID;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var unknownUserDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, { canBeMissing: true })[0];
    var currentAttachment = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true })[0];
    var validatedFile = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATED_FILE_OBJECT, { canBeMissing: true })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    var isTextShared = (currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.mimeType) === CONST_1.default.SHARE_FILE_MIMETYPE.TXT;
    var shouldUsePreValidatedFile = (0, ReceiptUtils_1.shouldValidateFile)(currentAttachment);
    var _j = (0, react_1.useState)(isTextShared ? ((_b = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) !== null && _b !== void 0 ? _b : '') : ''), message = _j[0], setMessage = _j[1];
    var _k = (0, react_1.useState)(undefined), errorTitle = _k[0], setErrorTitle = _k[1];
    var _l = (0, react_1.useState)(undefined), errorMessage = _l[0], setErrorMessage = _l[1];
    var report = (0, ReportUtils_1.getReportOrDraftReport)(reportOrAccountID);
    var displayReport = (0, react_1.useMemo)(function () { return (0, OptionsListUtils_1.getReportDisplayOption)(report, unknownUserDetails, reportAttributesDerived); }, [report, unknownUserDetails, reportAttributesDerived]);
    var fileSource = shouldUsePreValidatedFile ? ((_c = validatedFile === null || validatedFile === void 0 ? void 0 : validatedFile.uri) !== null && _c !== void 0 ? _c : '') : ((_d = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) !== null && _d !== void 0 ? _d : '');
    var validateFileName = shouldUsePreValidatedFile ? (0, FileUtils_1.getFileName)((_e = validatedFile === null || validatedFile === void 0 ? void 0 : validatedFile.uri) !== null && _e !== void 0 ? _e : CONST_1.default.ATTACHMENT_IMAGE_DEFAULT_NAME) : (0, FileUtils_1.getFileName)((_f = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) !== null && _f !== void 0 ? _f : '');
    var fileType = shouldUsePreValidatedFile ? ((_g = validatedFile === null || validatedFile === void 0 ? void 0 : validatedFile.type) !== null && _g !== void 0 ? _g : CONST_1.default.SHARE_FILE_MIMETYPE.JPEG) : ((_h = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.mimeType) !== null && _h !== void 0 ? _h : '');
    (0, react_1.useEffect)(function () {
        if (!(currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) || errorTitle) {
            return;
        }
        (0, getFileSize_1.default)(currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content).then(function (size) {
            if (size > CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE) {
                setErrorTitle(translate('attachmentPicker.attachmentTooLarge'));
                setErrorMessage(translate('attachmentPicker.sizeExceeded'));
            }
            if (size < CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE) {
                setErrorTitle(translate('attachmentPicker.attachmentTooSmall'));
                setErrorMessage(translate('attachmentPicker.sizeNotMet'));
            }
        });
    }, [currentAttachment, errorTitle, translate]);
    (0, react_1.useEffect)(function () {
        if (!errorTitle || !errorMessage) {
            return;
        }
        (0, ShareRootPage_1.showErrorAlert)(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    if ((0, EmptyObject_1.isEmptyObject)(report)) {
        return <NotFoundPage_1.default />;
    }
    var isDraft = (0, ReportUtils_1.isDraftReport)(reportOrAccountID);
    var currentUserID = (0, Report_1.getCurrentUserAccountID)();
    var shouldShowAttachment = !isTextShared;
    var handleShare = function () {
        var _a;
        if (!currentAttachment || (shouldUsePreValidatedFile && !validatedFile)) {
            return;
        }
        if (isTextShared) {
            (0, Report_1.addComment)(report.reportID, message, (_a = personalDetail.timezone) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_TIME_ZONE);
            var routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportOrAccountID);
            Navigation_1.default.navigate(routeToNavigate, { forceReplace: true });
            return;
        }
        (0, FileUtils_1.readFileAsync)(fileSource, validateFileName, function (file) {
            var _a, _b, _c;
            if (isDraft) {
                (0, Report_1.openReport)(report.reportID, '', (_b = (_a = displayReport.participantsList) === null || _a === void 0 ? void 0 : _a.filter(function (u) { return u.accountID !== currentUserID; }).map(function (u) { var _a; return (_a = u.login) !== null && _a !== void 0 ? _a : ''; })) !== null && _b !== void 0 ? _b : [], report, undefined, undefined, undefined);
            }
            if (report.reportID) {
                (0, Report_1.addAttachment)(report.reportID, file, (_c = personalDetail.timezone) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_TIME_ZONE, message);
            }
            var routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportOrAccountID);
            Navigation_1.default.navigate(routeToNavigate, { forceReplace: true });
        }, function () { }, fileType);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom keyboardAvoidingViewBehavior="padding" shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={ShareDetailsPage.displayName}>
            <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.h100, styles.appBG]}>
                <Pressable_1.PressableWithoutFeedback onPress={function () {
            keyboard_1.default.dismiss();
        }} accessible={false}>
                    <HeaderWithBackButton_1.default title={translate('share.shareToExpensify')} shouldShowBackButton/>

                    {!!report && (<react_native_1.View>
                            <react_native_1.View style={[styles.optionsListSectionHeader, styles.justifyContentCenter]}>
                                <Text_1.default style={[styles.ph5, styles.textLabelSupporting]}>{translate('common.to')}</Text_1.default>
                            </react_native_1.View>
                            <UserListItem_1.default item={displayReport} isFocused={false} showTooltip={false} onSelectRow={function () {
                keyboard_1.default.dismiss();
            }} pressableStyle={[styles.flexRow]} shouldSyncFocus={false}/>
                        </react_native_1.View>)}
                </Pressable_1.PressableWithoutFeedback>
                <react_native_1.View style={[styles.ph5, styles.flex1, styles.flexColumn, styles.overflowHidden]}>
                    <react_native_1.View style={styles.pv3}>
                        <ScrollView_1.default scrollEnabled={false}>
                            <TextInput_1.default autoFocus={false} value={message} scrollEnabled type="markdown" autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} onChangeText={setMessage} accessibilityLabel={translate('share.messageInputLabel')} label={translate('share.messageInputLabel')}/>
                        </ScrollView_1.default>
                    </react_native_1.View>
                    <Pressable_1.PressableWithoutFeedback onPress={function () {
            keyboard_1.default.dismiss();
        }} accessible={false}>
                        {shouldShowAttachment && (<>
                                <react_native_1.View style={[styles.pt6, styles.pb2]}>
                                    <Text_1.default style={styles.textLabelSupporting}>{translate('common.attachment')}</Text_1.default>
                                </react_native_1.View>
                                <react_native_1.SafeAreaView>
                                    <AttachmentModal_1.default headerTitle={validateFileName} source={fileSource} originalFileName={validateFileName} fallbackSource={Expensicons_1.FallbackAvatar}>
                                        {function (_a) {
                var show = _a.show;
                return (<AttachmentPreview_1.default source={fileSource !== null && fileSource !== void 0 ? fileSource : ''} aspectRatio={currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.aspectRatio} onPress={show} onLoadError={function () {
                        (0, ShareRootPage_1.showErrorAlert)(translate('attachmentPicker.attachmentError'), translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
                    }}/>);
            }}
                                    </AttachmentModal_1.default>
                                </react_native_1.SafeAreaView>
                            </>)}
                    </Pressable_1.PressableWithoutFeedback>
                </react_native_1.View>
                <FixedFooter_1.default style={[styles.pt4]}>
                    <Button_1.default success large text={translate('common.share')} style={styles.w100} onPress={handleShare}/>
                </FixedFooter_1.default>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ShareDetailsPage.displayName = 'ShareDetailsPage';
exports.default = ShareDetailsPage;
