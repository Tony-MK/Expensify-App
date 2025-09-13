"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const AttachmentModalHandler_1 = require("@libs/AttachmentModalHandler");
const fileDownload_1 = require("@libs/fileDownload");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
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
const AttachmentCarousel_1 = require("./Attachments/AttachmentCarousel");
const AttachmentCarouselPagerContext_1 = require("./Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const AttachmentView_1 = require("./Attachments/AttachmentView");
const useAttachmentErrors_1 = require("./Attachments/AttachmentView/useAttachmentErrors");
const BlockingView_1 = require("./BlockingViews/BlockingView");
const Button_1 = require("./Button");
const ConfirmModal_1 = require("./ConfirmModal");
const FullscreenLoadingIndicator_1 = require("./FullscreenLoadingIndicator");
const HeaderGap_1 = require("./HeaderGap");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const Expensicons = require("./Icon/Expensicons");
const Illustrations = require("./Icon/Illustrations");
const Modal_1 = require("./Modal");
const SafeAreaConsumer_1 = require("./SafeAreaConsumer");
function AttachmentModal({ source = '', onConfirm, defaultOpen = false, originalFileName = '', isAuthTokenRequired = false, allowDownload = false, isTrackExpenseAction = false, report, reportID, onModalShow = () => { }, onModalHide = () => { }, onCarouselAttachmentChange = () => { }, isReceiptAttachment = false, isWorkspaceAvatar = false, maybeIcon = false, headerTitle, children, fallbackSource, canEditReceipt = false, canDeleteReceipt = false, onModalClose = () => { }, isLoading = false, shouldShowNotFoundPage = false, type = undefined, attachmentID, accountID = undefined, shouldDisableSendButton = false, draftTransactionID, iouAction, iouType: iouTypeProp, attachmentLink = '', shouldHandleNavigationBack, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(defaultOpen);
    const [shouldLoadAttachment, setShouldLoadAttachment] = (0, react_1.useState)(false);
    const [isAttachmentInvalid, setIsAttachmentInvalid] = (0, react_1.useState)(false);
    const [isDeleteReceiptConfirmModalVisible, setIsDeleteReceiptConfirmModalVisible] = (0, react_1.useState)(false);
    const [isAuthTokenRequiredState, setIsAuthTokenRequiredState] = (0, react_1.useState)(isAuthTokenRequired);
    const [attachmentInvalidReasonTitle, setAttachmentInvalidReasonTitle] = (0, react_1.useState)(null);
    const [attachmentInvalidReason, setAttachmentInvalidReason] = (0, react_1.useState)(null);
    const [sourceState, setSourceState] = (0, react_1.useState)(() => source);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = (0, react_1.useState)(false);
    const [isDownloadButtonReadyToBeShown, setIsDownloadButtonReadyToBeShown] = react_1.default.useState(true);
    const isPDFLoadError = (0, react_1.useRef)(false);
    const isReplaceReceipt = (0, react_1.useRef)(false);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const nope = (0, react_native_reanimated_1.useSharedValue)(false);
    const isOverlayModalVisible = (isReceiptAttachment && isDeleteReceiptConfirmModalVisible) || (!isReceiptAttachment && isAttachmentInvalid);
    const iouType = (0, react_1.useMemo)(() => iouTypeProp ?? (isTrackExpenseAction ? CONST_1.default.IOU.TYPE.TRACK : CONST_1.default.IOU.TYPE.SUBMIT), [isTrackExpenseAction, iouTypeProp]);
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const transactionID = ((0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction)?.IOUTransactionID) || CONST_1.default.DEFAULT_NUMBER_ID;
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { canBeMissing: true });
    const [currentAttachmentLink, setCurrentAttachmentLink] = (0, react_1.useState)(attachmentLink);
    const { setAttachmentError, isErrorInAttachment, clearAttachmentErrors } = (0, useAttachmentErrors_1.default)();
    const [file, setFile] = (0, react_1.useState)(originalFileName
        ? {
            name: originalFileName,
        }
        : undefined);
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isLocalSource = typeof sourceState === 'string' && /^file:|^blob:/.test(sourceState);
    (0, react_1.useEffect)(() => {
        setFile(originalFileName ? { name: originalFileName } : undefined);
    }, [originalFileName]);
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
    }, [isAuthTokenRequiredState, sourceState, file, type, draftTransactionID]);
    /**
     * Execute the onConfirm callback and close the modal.
     */
    const submitAndClose = (0, react_1.useCallback)(() => {
        // If the modal has already been closed or the confirm button is disabled
        // do not submit.
        if (!isModalOpen || isConfirmButtonDisabled) {
            return;
        }
        if (onConfirm) {
            onConfirm(Object.assign(file ?? {}, { source: sourceState }));
        }
        setIsModalOpen(false);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isModalOpen, isConfirmButtonDisabled, onConfirm, file, sourceState]);
    /**
     * Close the confirm modals.
     */
    const closeConfirmModal = (0, react_1.useCallback)(() => {
        setIsAttachmentInvalid(false);
        setIsDeleteReceiptConfirmModalVisible(false);
    }, []);
    /**
     * Detach the receipt and close the modal.
     */
    const deleteAndCloseModal = (0, react_1.useCallback)(() => {
        (0, IOU_1.detachReceipt)(transaction?.transactionID);
        setIsDeleteReceiptConfirmModalVisible(false);
        Navigation_1.default.goBack();
    }, [transaction]);
    /**
     * Closes the modal.
     * @param {boolean} [shouldCallDirectly] If true, directly calls `onModalClose`.
     * This is useful when you plan to continue navigating to another page after closing the modal, to avoid freezing the app due to navigating to another page first and dismissing the modal later.
     * If `shouldCallDirectly` is false or undefined, it calls `attachmentModalHandler.handleModalClose` to close the modal.
     * This ensures smooth modal closing behavior without causing delays in closing.
     */
    const closeModal = (0, react_1.useCallback)((shouldCallDirectly) => {
        setIsModalOpen(false);
        if (typeof onModalClose === 'function') {
            if (shouldCallDirectly) {
                onModalClose();
                return;
            }
            AttachmentModalHandler_1.default.handleModalClose(onModalClose);
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [onModalClose]);
    /**
     *  open the modal
     */
    const openModal = (0, react_1.useCallback)(() => {
        setIsModalOpen(true);
    }, []);
    (0, react_1.useEffect)(() => {
        setSourceState(() => source);
    }, [source]);
    (0, react_1.useEffect)(() => {
        setIsAuthTokenRequiredState(isAuthTokenRequired);
    }, [isAuthTokenRequired]);
    const sourceForAttachmentView = sourceState || source;
    const threeDotsMenuItems = (0, react_1.useMemo)(() => {
        if (!isReceiptAttachment) {
            return [];
        }
        const menuItems = [];
        if (canEditReceipt) {
            // linter keep complain about accessing ref during render
            // eslint-disable-next-line react-compiler/react-compiler
            menuItems.push({
                icon: Expensicons.Camera,
                text: translate('common.replace'),
                onSelected: () => {
                    closeModal(true);
                    // Set the ref to true, so when the modal is hidden, we will navigate to the scan receipt screen
                    isReplaceReceipt.current = true;
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
                onSelected: () => {
                    setIsDeleteReceiptConfirmModalVisible(true);
                },
                shouldCallAfterModalHide: true,
            });
        }
        return menuItems;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isReceiptAttachment, transaction, file, sourceState, iouType]);
    const headerTitleNew = headerTitle ?? translate(isReceiptAttachment ? 'common.receipt' : 'common.attachment');
    const shouldShowThreeDotsButton = isReceiptAttachment && isModalOpen && threeDotsMenuItems.length !== 0;
    let shouldShowDownloadButton = false;
    if ((!(0, EmptyObject_1.isEmptyObject)(report) || type === CONST_1.default.ATTACHMENT_TYPE.SEARCH) && !isErrorInAttachment(sourceState)) {
        shouldShowDownloadButton = allowDownload && isDownloadButtonReadyToBeShown && !shouldShowNotFoundPage && !isReceiptAttachment && !isOffline && !isLocalSource;
    }
    const context = (0, react_1.useMemo)(() => ({
        pagerItems: [{ source: sourceForAttachmentView, index: 0, isActive: true }],
        activePage: 0,
        pagerRef: undefined,
        isPagerScrolling: nope,
        isScrollEnabled: nope,
        onTap: () => { },
        onScaleChanged: () => { },
        onSwipeDown: closeModal,
        onAttachmentError: setAttachmentError,
    }), [closeModal, setAttachmentError, nope, sourceForAttachmentView]);
    const submitRef = (0, react_1.useRef)(null);
    return (<>
            <Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE} onClose={isOverlayModalVisible ? closeConfirmModal : closeModal} isVisible={isModalOpen} onModalShow={() => {
            onModalShow();
            setShouldLoadAttachment(true);
        }} onModalHide={() => {
            if (!isPDFLoadError.current) {
                onModalHide();
            }
            setShouldLoadAttachment(false);
            clearAttachmentErrors();
            if (isPDFLoadError.current) {
                setIsAttachmentInvalid(true);
                setAttachmentInvalidReasonTitle('attachmentPicker.attachmentError');
                setAttachmentInvalidReason('attachmentPicker.errorWhileSelectingCorruptedAttachment');
                return;
            }
            if (isReplaceReceipt.current) {
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(iouAction ?? CONST_1.default.IOU.ACTION.EDIT, iouType, draftTransactionID ?? transaction?.transactionID, report?.reportID, Navigation_1.default.getActiveRoute()));
                });
            }
        }} propagateSwipe initialFocus={() => {
            if (!submitRef.current) {
                return false;
            }
            return submitRef.current;
        }} shouldHandleNavigationBack={shouldHandleNavigationBack}>
                <react_native_gesture_handler_1.GestureHandlerRootView style={styles.flex1}>
                    {shouldUseNarrowLayout && <HeaderGap_1.default />}
                    <HeaderWithBackButton_1.default shouldMinimizeMenuButton title={headerTitleNew} shouldShowBorderBottom shouldShowDownloadButton={shouldShowDownloadButton} onDownloadButtonPress={() => downloadAttachment()} shouldShowCloseButton={!shouldUseNarrowLayout} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={closeModal} onCloseButtonPress={closeModal} shouldShowThreeDotsButton={shouldShowThreeDotsButton} threeDotsAnchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} shouldSetModalVisibility={false} threeDotsMenuItems={threeDotsMenuItems} shouldOverlayDots subTitleLink={currentAttachmentLink ?? ''} shouldDisplayHelpButton={false}/>
                    <react_native_1.View style={styles.imageModalImageCenterContainer}>
                        {isLoading && <FullscreenLoadingIndicator_1.default testID="attachment-loading-spinner"/>}
                        {shouldShowNotFoundPage && !isLoading && (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('notFound.notHere')} subtitle={translate('notFound.pageNotFound')} linkTranslationKey="notFound.goBackHome" onLinkPress={() => Navigation_1.default.dismissModal()}/>)}
                        {!shouldShowNotFoundPage &&
            !isLoading &&
            // We shouldn't show carousel arrow in search result attachment
            (!(0, EmptyObject_1.isEmptyObject)(report) && !isReceiptAttachment && type !== CONST_1.default.ATTACHMENT_TYPE.SEARCH ? (<AttachmentCarousel_1.default accountID={accountID} type={type} attachmentID={attachmentID} report={report} onNavigate={onNavigate} onClose={closeModal} source={source} setDownloadButtonVisibility={setDownloadButtonVisibility} attachmentLink={currentAttachmentLink} onAttachmentError={setAttachmentError}/>) : (!!sourceForAttachmentView &&
                shouldLoadAttachment && (<AttachmentCarouselPagerContext_1.default.Provider value={context}>
                                        <AttachmentView_1.default containerStyles={[styles.mh5]} source={sourceForAttachmentView} isAuthTokenRequired={isAuthTokenRequiredState} file={file} onToggleKeyboard={setIsConfirmButtonDisabled} onPDFLoadError={() => {
                    isPDFLoadError.current = true;
                    closeModal();
                }} isWorkspaceAvatar={isWorkspaceAvatar} maybeIcon={maybeIcon} fallbackSource={fallbackSource} isUsedInAttachmentModal transactionID={transaction?.transactionID} isUploaded={!(0, EmptyObject_1.isEmptyObject)(report)} reportID={reportID ?? (!(0, EmptyObject_1.isEmptyObject)(report) ? report.reportID : undefined)}/>
                                    </AttachmentCarouselPagerContext_1.default.Provider>)))}
                    </react_native_1.View>
                    {/* If we have an onConfirm method show a confirmation button */}
                    <react_native_reanimated_1.LayoutAnimationConfig skipEntering>
                        {!!onConfirm && !isConfirmButtonDisabled && (<SafeAreaConsumer_1.default>
                                {({ safeAreaPaddingBottomStyle }) => (<react_native_reanimated_1.default.View style={safeAreaPaddingBottomStyle} entering={react_native_reanimated_1.FadeIn}>
                                        <Button_1.default ref={(0, viewRef_1.default)(submitRef)} success large style={[styles.buttonConfirm, shouldUseNarrowLayout ? {} : styles.attachmentButtonBigScreen]} textStyles={[styles.buttonConfirmText]} text={translate('common.send')} onPress={submitAndClose} isDisabled={isConfirmButtonDisabled || shouldDisableSendButton} pressOnEnter/>
                                    </react_native_reanimated_1.default.View>)}
                            </SafeAreaConsumer_1.default>)}
                    </react_native_reanimated_1.LayoutAnimationConfig>
                    {isReceiptAttachment && (<ConfirmModal_1.default title={translate('receipt.deleteReceipt')} isVisible={isDeleteReceiptConfirmModalVisible} onConfirm={deleteAndCloseModal} onCancel={closeConfirmModal} prompt={translate('receipt.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>)}
                </react_native_gesture_handler_1.GestureHandlerRootView>
            </Modal_1.default>
            {!isReceiptAttachment && (<ConfirmModal_1.default title={attachmentInvalidReasonTitle ? translate(attachmentInvalidReasonTitle) : ''} onConfirm={closeConfirmModal} onCancel={closeConfirmModal} isVisible={isAttachmentInvalid} prompt={attachmentInvalidReason ? translate(attachmentInvalidReason) : ''} confirmText={translate('common.close')} shouldShowCancelButton={false} onModalHide={() => {
                if (!isPDFLoadError.current) {
                    return;
                }
                isPDFLoadError.current = false;
                onModalHide?.();
            }}/>)}

            {children?.({ show: openModal })}
        </>);
}
AttachmentModal.displayName = 'AttachmentModal';
exports.default = (0, react_1.memo)(AttachmentModal);
