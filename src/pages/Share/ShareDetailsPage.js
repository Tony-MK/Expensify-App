"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentModal_1 = require("@components/AttachmentModal");
const AttachmentPreview_1 = require("@components/AttachmentPreview");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const variables_1 = require("@styles/variables");
const UserListItem_1 = require("@src/components/SelectionList/UserListItem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const keyboard_1 = require("@src/utils/keyboard");
const getFileSize_1 = require("./getFileSize");
const ShareRootPage_1 = require("./ShareRootPage");
function ShareDetailsPage({ route: { params: { reportOrAccountID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [unknownUserDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, { canBeMissing: true });
    const [currentAttachment] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true });
    const [validatedFile] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATED_FILE_OBJECT, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    const isTextShared = currentAttachment?.mimeType === CONST_1.default.SHARE_FILE_MIMETYPE.TXT;
    const shouldUsePreValidatedFile = (0, ReceiptUtils_1.shouldValidateFile)(currentAttachment);
    const [message, setMessage] = (0, react_1.useState)(isTextShared ? (currentAttachment?.content ?? '') : '');
    const [errorTitle, setErrorTitle] = (0, react_1.useState)(undefined);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(undefined);
    const report = (0, ReportUtils_1.getReportOrDraftReport)(reportOrAccountID);
    const displayReport = (0, react_1.useMemo)(() => (0, OptionsListUtils_1.getReportDisplayOption)(report, unknownUserDetails, reportAttributesDerived), [report, unknownUserDetails, reportAttributesDerived]);
    const fileSource = shouldUsePreValidatedFile ? (validatedFile?.uri ?? '') : (currentAttachment?.content ?? '');
    const validateFileName = shouldUsePreValidatedFile ? (0, FileUtils_1.getFileName)(validatedFile?.uri ?? CONST_1.default.ATTACHMENT_IMAGE_DEFAULT_NAME) : (0, FileUtils_1.getFileName)(currentAttachment?.content ?? '');
    const fileType = shouldUsePreValidatedFile ? (validatedFile?.type ?? CONST_1.default.SHARE_FILE_MIMETYPE.JPEG) : (currentAttachment?.mimeType ?? '');
    (0, react_1.useEffect)(() => {
        if (!currentAttachment?.content || errorTitle) {
            return;
        }
        (0, getFileSize_1.default)(currentAttachment?.content).then((size) => {
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
    (0, react_1.useEffect)(() => {
        if (!errorTitle || !errorMessage) {
            return;
        }
        (0, ShareRootPage_1.showErrorAlert)(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    if ((0, EmptyObject_1.isEmptyObject)(report)) {
        return <NotFoundPage_1.default />;
    }
    const isDraft = (0, ReportUtils_1.isDraftReport)(reportOrAccountID);
    const currentUserID = (0, Report_1.getCurrentUserAccountID)();
    const shouldShowAttachment = !isTextShared;
    const handleShare = () => {
        if (!currentAttachment || (shouldUsePreValidatedFile && !validatedFile)) {
            return;
        }
        if (isTextShared) {
            (0, Report_1.addComment)(report.reportID, message, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE);
            const routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportOrAccountID);
            Navigation_1.default.navigate(routeToNavigate, { forceReplace: true });
            return;
        }
        (0, FileUtils_1.readFileAsync)(fileSource, validateFileName, (file) => {
            if (isDraft) {
                (0, Report_1.openReport)(report.reportID, '', displayReport.participantsList?.filter((u) => u.accountID !== currentUserID).map((u) => u.login ?? '') ?? [], report, undefined, undefined, undefined);
            }
            if (report.reportID) {
                (0, Report_1.addAttachment)(report.reportID, file, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE, message);
            }
            const routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportOrAccountID);
            Navigation_1.default.navigate(routeToNavigate, { forceReplace: true });
        }, () => { }, fileType);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom keyboardAvoidingViewBehavior="padding" shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={ShareDetailsPage.displayName}>
            <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.h100, styles.appBG]}>
                <Pressable_1.PressableWithoutFeedback onPress={() => {
            keyboard_1.default.dismiss();
        }} accessible={false}>
                    <HeaderWithBackButton_1.default title={translate('share.shareToExpensify')} shouldShowBackButton/>

                    {!!report && (<react_native_1.View>
                            <react_native_1.View style={[styles.optionsListSectionHeader, styles.justifyContentCenter]}>
                                <Text_1.default style={[styles.ph5, styles.textLabelSupporting]}>{translate('common.to')}</Text_1.default>
                            </react_native_1.View>
                            <UserListItem_1.default item={displayReport} isFocused={false} showTooltip={false} onSelectRow={() => {
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
                    <Pressable_1.PressableWithoutFeedback onPress={() => {
            keyboard_1.default.dismiss();
        }} accessible={false}>
                        {shouldShowAttachment && (<>
                                <react_native_1.View style={[styles.pt6, styles.pb2]}>
                                    <Text_1.default style={styles.textLabelSupporting}>{translate('common.attachment')}</Text_1.default>
                                </react_native_1.View>
                                <react_native_1.SafeAreaView>
                                    <AttachmentModal_1.default headerTitle={validateFileName} source={fileSource} originalFileName={validateFileName} fallbackSource={Expensicons_1.FallbackAvatar}>
                                        {({ show }) => (<AttachmentPreview_1.default source={fileSource ?? ''} aspectRatio={currentAttachment?.aspectRatio} onPress={show} onLoadError={() => {
                    (0, ShareRootPage_1.showErrorAlert)(translate('attachmentPicker.attachmentError'), translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
                }}/>)}
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
