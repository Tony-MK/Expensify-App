"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const AttachmentCarousel_1 = require("@components/Attachments/AttachmentCarousel");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const AttachmentView_1 = require("@components/Attachments/AttachmentView");
const useAttachmentErrors_1 = require("@components/Attachments/AttachmentView/useAttachmentErrors");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderGap_1 = require("@components/HeaderGap");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
const useAttachmentLoaded_1 = require("@hooks/useAttachmentLoaded");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const fileDownload_1 = require("@libs/fileDownload");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const viewRef_1 = require("@src/types/utils/viewRef");
function AttachmentModalBaseContent({ source = '', attachmentID, fallbackSource, file: fileProp, originalFileName = '', isAuthTokenRequired = false, maybeIcon = false, headerTitle: headerTitleProp, type, draftTransactionID, iouAction, iouType: iouTypeProp, accountID, attachmentLink = '', allowDownload = false, isTrackExpenseAction = false, report, reportID, isReceiptAttachment = false, isWorkspaceAvatar = false, canEditReceipt = false, canDeleteReceipt = false, isLoading = false, shouldShowNotFoundPage = false, shouldDisableSendButton = false, shouldDisplayHelpButton = true, isDeleteReceiptConfirmModalVisible = false, isAttachmentInvalid = false, attachmentInvalidReason, attachmentInvalidReasonTitle, submitRef, onClose, onConfirm, onConfirmModalClose, onRequestDeleteReceipt, onDeleteReceipt, onCarouselAttachmentChange = () => { }, onValidateFile, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    // This logic is used to ensure that the source is updated when the source changes and
    // that the initially provided source is always used as a fallback.
    const [sourceState, setSourceState] = (0, react_1.useState)(() => source);
    const sourceForAttachmentView = sourceState || source;
    (0, react_1.useEffect)(() => {
        setSourceState(() => source);
    }, [source]);
    const [isAuthTokenRequiredState, setIsAuthTokenRequiredState] = (0, react_1.useState)(isAuthTokenRequired);
    (0, react_1.useEffect)(() => {
        setIsAuthTokenRequiredState(isAuthTokenRequired);
    }, [isAuthTokenRequired]);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = (0, react_1.useState)(false);
    const [isDownloadButtonReadyToBeShown, setIsDownloadButtonReadyToBeShown] = react_1.default.useState(true);
    const iouType = (0, react_1.useMemo)(() => iouTypeProp ?? (isTrackExpenseAction ? CONST_1.default.IOU.TYPE.TRACK : CONST_1.default.IOU.TYPE.SUBMIT), [isTrackExpenseAction, iouTypeProp]);
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const transactionID = ((0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction)?.IOUTransactionID) || CONST_1.default.DEFAULT_NUMBER_ID;
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { canBeMissing: true });
    const [currentAttachmentLink, setCurrentAttachmentLink] = (0, react_1.useState)(attachmentLink);
    const { setAttachmentError, isErrorInAttachment, clearAttachmentErrors } = (0, useAttachmentErrors_1.default)();
    (0, react_1.useEffect)(() => {
        return () => {
            clearAttachmentErrors();
        };
    }, [clearAttachmentErrors]);
    const fallbackFile = (0, react_1.useMemo)(() => (originalFileName ? { name: originalFileName } : undefined), [originalFileName]);
    const [file, setFile] = (0, react_1.useState)(() => fileProp ?? fallbackFile);
    (0, react_1.useEffect)(() => {
        if (!fileProp) {
            return;
        }
        if (onValidateFile) {
            onValidateFile?.(fileProp, setFile);
        }
        else {
            setFile(fileProp ?? fallbackFile);
        }
    }, [fileProp, fallbackFile, onValidateFile]);
    (0, react_1.useEffect)(() => {
        setFile(fallbackFile);
    }, [fallbackFile]);
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isLocalSource = typeof sourceState === 'string' && /^file:|^blob:/.test(sourceState);
    /**
     * Keeps the attachment source in sync with the attachment displayed currently in the carousel.
     */
    const onNavigate = (0, react_1.useCallback)((attachment) => {
        setSourceState(attachment.source);
        setFile(attachment.file);
        setIsAuthTokenRequiredState(attachment.isAuthTokenRequired ?? false);
        onCarouselAttachmentChange(attachment);
        setCurrentAttachmentLink(attachment?.attachmentLink ?? '');
    }, [onCarouselAttachmentChange]);
    const setDownloadButtonVisibility = (0, react_1.useCallback)((isButtonVisible) => {
        if (isDownloadButtonReadyToBeShown === isButtonVisible) {
            return;
        }
        setIsDownloadButtonReadyToBeShown(isButtonVisible);
    }, [isDownloadButtonReadyToBeShown]);
    /**
     * Download the currently viewed attachment.
     */
    const downloadAttachment = (0, react_1.useCallback)(() => {
        let sourceURL = sourceState;
        if (isAuthTokenRequiredState && typeof sourceURL === 'string') {
            sourceURL = (0, addEncryptedAuthTokenToURL_1.default)(sourceURL);
        }
        if (typeof sourceURL === 'string') {
            const fileName = type === CONST_1.default.ATTACHMENT_TYPE.SEARCH ? (0, FileUtils_1.getFileName)(`${sourceURL}`) : file?.name;
            (0, fileDownload_1.default)(sourceURL, fileName ?? '', undefined, undefined, undefined, undefined, undefined, !draftTransactionID);
        }
        // At ios, if the keyboard is open while opening the attachment, then after downloading
        // the attachment keyboard will show up. So, to fix it we need to dismiss the keyboard.
        react_native_1.Keyboard.dismiss();
    }, [sourceState, isAuthTokenRequiredState, type, file?.name, draftTransactionID]);
    /**
     * Execute the onConfirm callback and close the modal.
     */
    const submitAndClose = (0, react_1.useCallback)(() => {
        // If the modal has already been closed or the confirm button is disabled
        // do not submit.
        if (isConfirmButtonDisabled) {
            return;
        }
        if (onConfirm) {
            onConfirm(Object.assign(file ?? {}, { source: sourceState }));
        }
        onClose?.();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isConfirmButtonDisabled, onConfirm, file, sourceState]);
    /**
     * Detach the receipt and close the modal.
     */
    const deleteAndCloseModal = (0, react_1.useCallback)(() => {
        (0, IOU_1.detachReceipt)(transaction?.transactionID);
        onDeleteReceipt?.();
        onClose?.();
    }, [onClose, onDeleteReceipt, transaction?.transactionID]);
    // Close the modal when the escape key is pressed
    (0, react_1.useEffect)(() => {
        const shortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE;
        const unsubscribeEscapeKey = KeyboardShortcut_1.default.subscribe(shortcutConfig.shortcutKey, () => {
            onClose?.();
        }, shortcutConfig.descriptionKey, shortcutConfig.modifiers, true, true);
        return unsubscribeEscapeKey;
    }, [onClose]);
    const threeDotsMenuItems = (0, react_1.useMemo)(() => {
        if (!isReceiptAttachment) {
            return [];
        }
        const menuItems = [];
        if (canEditReceipt) {
            menuItems.push({
                icon: Expensicons.Camera,
                text: translate('common.replace'),
                onSelected: () => {
                    const goToScanScreen = () => {
                        react_native_1.InteractionManager.runAfterInteractions(() => {
                            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(iouAction ?? CONST_1.default.IOU.ACTION.EDIT, iouType, draftTransactionID ?? transaction?.transactionID, report?.reportID, Navigation_1.default.getActiveRoute()));
                        });
                    };
                    onClose?.({ shouldCallDirectly: true, onAfterClose: goToScanScreen });
                },
            });
        }
        if ((!isOffline && allowDownload && !isLocalSource) || !!draftTransactionID) {
            menuItems.push({
                icon: Expensicons.Download,
                text: translate('common.download'),
                onSelected: () => downloadAttachment(),
            });
        }
        const hasOnlyEReceipt = (0, TransactionUtils_1.hasEReceipt)(transaction) && !(0, TransactionUtils_1.hasReceiptSource)(transaction);
        if (!hasOnlyEReceipt && (0, TransactionUtils_1.hasReceipt)(transaction) && !(0, TransactionUtils_1.isReceiptBeingScanned)(transaction) && canDeleteReceipt && !(0, TransactionUtils_1.hasMissingSmartscanFields)(transaction)) {
            menuItems.push({
                icon: Expensicons.Trashcan,
                text: translate('receipt.deleteReceipt'),
                onSelected: onRequestDeleteReceipt,
                shouldCallAfterModalHide: true,
            });
        }
        return menuItems;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isReceiptAttachment, transaction, file, sourceState, iouType]);
    // There are a few things that shouldn't be set until we absolutely know if the file is a receipt or an attachment.
    // props.isReceiptAttachment will be null until its certain what the file is, in which case it will then be true|false.
    const headerTitle = (0, react_1.useMemo)(() => headerTitleProp ?? translate(isReceiptAttachment ? 'common.receipt' : 'common.attachment'), [headerTitleProp, isReceiptAttachment, translate]);
    const shouldShowThreeDotsButton = (0, react_1.useMemo)(() => isReceiptAttachment && threeDotsMenuItems.length !== 0, [isReceiptAttachment, threeDotsMenuItems.length]);
    const { setAttachmentLoaded, isAttachmentLoaded } = (0, useAttachmentLoaded_1.default)();
    const shouldShowDownloadButton = (0, react_1.useMemo)(() => {
        const isValidContext = !(0, EmptyObject_1.isEmptyObject)(report) || type === CONST_1.default.ATTACHMENT_TYPE.SEARCH;
        if (isValidContext && !isErrorInAttachment(sourceState)) {
            return allowDownload && isDownloadButtonReadyToBeShown && !shouldShowNotFoundPage && !isReceiptAttachment && !isOffline && !isLocalSource && isAttachmentLoaded(sourceState);
        }
        return false;
    }, [
        allowDownload,
        isDownloadButtonReadyToBeShown,
        isErrorInAttachment,
        isLocalSource,
        isOffline,
        isReceiptAttachment,
        report,
        shouldShowNotFoundPage,
        sourceState,
        type,
        isAttachmentLoaded,
    ]);
    const isPDFLoadError = (0, react_1.useRef)(false);
    const onPdfLoadError = (0, react_1.useCallback)(() => {
        isPDFLoadError.current = true;
        onClose?.();
    }, [isPDFLoadError, onClose]);
    const onInvalidReasonModalHide = (0, react_1.useCallback)(() => {
        if (!isPDFLoadError.current) {
            return;
        }
        isPDFLoadError.current = false;
    }, [isPDFLoadError]);
    // We need to pass a shared value of type boolean to the context, so `falseSV` acts as a default value.
    const falseSV = (0, react_native_reanimated_1.useSharedValue)(false);
    const context = (0, react_1.useMemo)(() => ({
        pagerItems: [{ source: sourceForAttachmentView, index: 0, isActive: true }],
        activePage: 0,
        pagerRef: undefined,
        isPagerScrolling: falseSV,
        isScrollEnabled: falseSV,
        onTap: () => { },
        onScaleChanged: () => { },
        onSwipeDown: onClose,
        onAttachmentError: setAttachmentError,
        onAttachmentLoaded: setAttachmentLoaded,
    }), [onClose, falseSV, sourceForAttachmentView, setAttachmentError, setAttachmentLoaded]);
    return (<>
            <react_native_gesture_handler_1.GestureHandlerRootView style={styles.flex1}>
                {shouldUseNarrowLayout && <HeaderGap_1.default />}
                <HeaderWithBackButton_1.default shouldMinimizeMenuButton title={headerTitle} shouldShowBorderBottom shouldShowDownloadButton={shouldShowDownloadButton} shouldDisplayHelpButton={shouldDisplayHelpButton} onDownloadButtonPress={() => downloadAttachment()} shouldShowCloseButton={!shouldUseNarrowLayout} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={onClose} onCloseButtonPress={onClose} shouldShowThreeDotsButton={shouldShowThreeDotsButton} threeDotsAnchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} shouldSetModalVisibility={false} threeDotsMenuItems={threeDotsMenuItems} shouldOverlayDots subTitleLink={currentAttachmentLink ?? ''}/>
                <react_native_1.View style={styles.imageModalImageCenterContainer}>
                    {isLoading && <FullscreenLoadingIndicator_1.default testID="attachment-loading-spinner"/>}
                    {shouldShowNotFoundPage && !isLoading && (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('notFound.notHere')} subtitle={translate('notFound.pageNotFound')} linkTranslationKey="notFound.goBackHome" onLinkPress={onClose}/>)}
                    {!shouldShowNotFoundPage &&
            !isLoading &&
            // We shouldn't show carousel arrow in search result attachment
            (!(0, EmptyObject_1.isEmptyObject)(report) && !isReceiptAttachment && type !== CONST_1.default.ATTACHMENT_TYPE.SEARCH ? (<AttachmentCarousel_1.default accountID={accountID} type={type} attachmentID={attachmentID} report={report} onNavigate={onNavigate} onClose={onClose} source={source} setDownloadButtonVisibility={setDownloadButtonVisibility} attachmentLink={currentAttachmentLink} onAttachmentError={setAttachmentError} onAttachmentLoaded={setAttachmentLoaded}/>) : (!!sourceForAttachmentView && (<AttachmentCarouselPagerContext_1.default.Provider value={context}>
                                    <AttachmentView_1.default containerStyles={[styles.mh5]} source={sourceForAttachmentView} isAuthTokenRequired={isAuthTokenRequiredState} file={file} onToggleKeyboard={setIsConfirmButtonDisabled} onPDFLoadError={() => onPdfLoadError?.()} isWorkspaceAvatar={isWorkspaceAvatar} maybeIcon={maybeIcon} fallbackSource={fallbackSource} isUsedInAttachmentModal transactionID={transaction?.transactionID} isUploaded={!(0, EmptyObject_1.isEmptyObject)(report)} reportID={reportID ?? (!(0, EmptyObject_1.isEmptyObject)(report) ? report.reportID : undefined)}/>
                                </AttachmentCarouselPagerContext_1.default.Provider>)))}
                </react_native_1.View>
                {/* If we have an onConfirm method show a confirmation button */}
                {!!onConfirm && !isConfirmButtonDisabled && (<react_native_reanimated_1.LayoutAnimationConfig skipEntering>
                        {!!onConfirm && !isConfirmButtonDisabled && (<SafeAreaConsumer_1.default>
                                {({ safeAreaPaddingBottomStyle }) => (<react_native_reanimated_1.default.View style={safeAreaPaddingBottomStyle} entering={react_native_reanimated_1.FadeIn}>
                                        <Button_1.default ref={submitRef ? (0, viewRef_1.default)(submitRef) : undefined} success large style={[styles.buttonConfirm, shouldUseNarrowLayout ? {} : styles.attachmentButtonBigScreen]} textStyles={[styles.buttonConfirmText]} text={translate('common.send')} onPress={submitAndClose} isDisabled={isConfirmButtonDisabled || shouldDisableSendButton} pressOnEnter/>
                                    </react_native_reanimated_1.default.View>)}
                            </SafeAreaConsumer_1.default>)}
                    </react_native_reanimated_1.LayoutAnimationConfig>)}
                {isReceiptAttachment && (<ConfirmModal_1.default title={translate('receipt.deleteReceipt')} isVisible={isDeleteReceiptConfirmModalVisible} onConfirm={deleteAndCloseModal} onCancel={onConfirmModalClose} prompt={translate('receipt.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>)}
            </react_native_gesture_handler_1.GestureHandlerRootView>
            {!isReceiptAttachment && (<ConfirmModal_1.default title={attachmentInvalidReasonTitle ? translate(attachmentInvalidReasonTitle) : ''} onConfirm={() => onConfirmModalClose?.()} onCancel={onConfirmModalClose} isVisible={isAttachmentInvalid} prompt={attachmentInvalidReason ? translate(attachmentInvalidReason) : ''} confirmText={translate('common.close')} shouldShowCancelButton={false} onModalHide={onInvalidReasonModalHide}/>)}
        </>);
}
AttachmentModalBaseContent.displayName = 'AttachmentModalBaseContent';
exports.default = (0, react_1.memo)(AttachmentModalBaseContent);
