"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const viewRef_1 = require("@src/types/utils/viewRef");
const AttachmentCarouselView_1 = require("./Attachments/AttachmentCarousel/AttachmentCarouselView");
const useCarouselArrows_1 = require("./Attachments/AttachmentCarousel/useCarouselArrows");
const useAttachmentErrors_1 = require("./Attachments/AttachmentView/useAttachmentErrors");
const Button_1 = require("./Button");
const HeaderGap_1 = require("./HeaderGap");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const Modal_1 = require("./Modal");
const SafeAreaConsumer_1 = require("./SafeAreaConsumer");
function AttachmentComposerModal({ onConfirm, onModalShow = () => { }, onModalHide = () => { }, headerTitle, children, shouldDisableSendButton = false, report }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { setAttachmentError, clearAttachmentErrors } = (0, useAttachmentErrors_1.default)();
    const { shouldShowArrows, setShouldShowArrows, autoHideArrows, cancelAutoHideArrows } = (0, useCarouselArrows_1.default)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [modalType, setModalType] = (0, react_1.useState)(CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE);
    const [validFilesToUpload, setValidFilesToUpload] = (0, react_1.useState)([]);
    const [attachments, setAttachments] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(0);
    const [currentAttachment, setCurrentAttachment] = (0, react_1.useState)(null);
    /**
     * If our attachment is a PDF, return the unswipeable Modal type.
     */
    const getModalType = (0, react_1.useCallback)((sourceURL, fileObject) => {
        const fileName = fileObject?.name ?? translate('attachmentView.unknownFilename');
        return sourceURL && (sourceURL.includes('.pdf') || fileName.includes('.pdf')) ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE : CONST_1.default.MODAL.MODAL_TYPE.CENTERED;
    }, [translate]);
    /**
     * Execute the onConfirm callback and close the modal.
     */
    const submitAndClose = (0, react_1.useCallback)(() => {
        // If the modal has already been closed
        if (!isModalOpen) {
            return;
        }
        if (onConfirm) {
            if (validFilesToUpload.length) {
                onConfirm(validFilesToUpload);
            }
            else if (currentAttachment) {
                onConfirm(currentAttachment.file ?? currentAttachment);
            }
        }
        setIsModalOpen(false);
    }, [isModalOpen, onConfirm, validFilesToUpload, currentAttachment]);
    /**
     * Sanitizes file names and ensures proper URI references for file system compatibility
     */
    const cleanFileObjectName = (0, react_1.useCallback)((fileObject) => {
        if (fileObject instanceof File) {
            const cleanName = (0, FileUtils_1.cleanFileName)(fileObject.name);
            if (fileObject.name !== cleanName) {
                const updatedFile = new File([fileObject], cleanName, { type: fileObject.type });
                const inputSource = URL.createObjectURL(updatedFile);
                updatedFile.uri = inputSource;
                return updatedFile;
            }
            if (!fileObject.uri) {
                const inputSource = URL.createObjectURL(fileObject);
                // eslint-disable-next-line no-param-reassign
                fileObject.uri = inputSource;
            }
        }
        return fileObject;
    }, []);
    const convertFileToAttachment = (0, react_1.useCallback)((fileObject, source) => {
        return {
            source,
            file: fileObject,
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!validFilesToUpload.length) {
            return;
        }
        if (validFilesToUpload.length > 0) {
            // Convert all files to attachments
            const newAttachments = validFilesToUpload.map((fileObject) => {
                const source = fileObject.uri ?? '';
                return convertFileToAttachment(fileObject, source);
            });
            const firstAttachment = newAttachments.at(0) ?? null;
            setAttachments(newAttachments);
            setCurrentAttachment(firstAttachment);
            setPage(0);
            if (firstAttachment?.file) {
                const inputModalType = getModalType(firstAttachment.source, firstAttachment.file);
                setModalType(inputModalType);
            }
            setIsModalOpen(true);
        }
    }, [validFilesToUpload, convertFileToAttachment, getModalType]);
    const { ErrorModal, validateFiles, PDFValidationComponent } = (0, useFilesValidation_1.default)(setValidFilesToUpload, false);
    const validateAndDisplayMultipleFilesToUpload = (0, react_1.useCallback)((data, items) => {
        if (!data?.length) {
            return;
        }
        const validIndices = [];
        const fileObjects = data
            .map((item, index) => {
            let fileObject = item;
            if ('getAsFile' in item && typeof item.getAsFile === 'function') {
                fileObject = item.getAsFile();
            }
            const cleanedFileObject = cleanFileObjectName(fileObject);
            if (cleanedFileObject !== null) {
                validIndices.push(index);
            }
            return cleanedFileObject;
        })
            .filter((fileObject) => fileObject !== null);
        if (!fileObjects.length) {
            return;
        }
        // Create a filtered items array that matches the fileObjects
        const filteredItems = items && validIndices.length > 0 ? validIndices.map((index) => items.at(index) ?? {}) : undefined;
        validateFiles(fileObjects, filteredItems);
    }, [cleanFileObjectName, validateFiles]);
    const closeModal = (0, react_1.useCallback)(() => {
        setIsModalOpen(false);
    }, []);
    const openModal = (0, react_1.useCallback)(() => {
        setIsModalOpen(true);
    }, []);
    const headerTitleNew = headerTitle ?? translate('reportActionCompose.sendAttachment');
    const submitRef = (0, react_1.useRef)(null);
    return (<>
            {PDFValidationComponent}
            <Modal_1.default type={modalType} onClose={closeModal} isVisible={isModalOpen} onModalShow={() => {
            onModalShow();
        }} onModalHide={() => {
            onModalHide();
            clearAttachmentErrors();
            setValidFilesToUpload([]);
            setAttachments([]);
            setCurrentAttachment(null);
            setPage(0);
        }} propagateSwipe initialFocus={() => {
            if (!submitRef.current) {
                return false;
            }
            return submitRef.current;
        }} shouldHandleNavigationBack>
                <react_native_gesture_handler_1.GestureHandlerRootView style={styles.flex1}>
                    {shouldUseNarrowLayout && <HeaderGap_1.default />}
                    <HeaderWithBackButton_1.default shouldMinimizeMenuButton title={headerTitleNew} shouldShowBorderBottom shouldShowCloseButton={!shouldUseNarrowLayout} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={closeModal} onCloseButtonPress={closeModal} shouldSetModalVisibility={false} shouldDisplayHelpButton={false}/>
                    {attachments.length > 0 && !!currentAttachment && (<AttachmentCarouselView_1.default attachments={attachments} source={currentAttachment.source} page={page} setPage={setPage} onClose={closeModal} autoHideArrows={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrows} setShouldShowArrows={setShouldShowArrows} onAttachmentError={setAttachmentError} shouldShowArrows={shouldShowArrows} report={report}/>)}
                    <react_native_reanimated_1.LayoutAnimationConfig skipEntering>
                        {(validFilesToUpload.length > 0 || !!currentAttachment) && (<SafeAreaConsumer_1.default>
                                {({ safeAreaPaddingBottomStyle }) => (<react_native_reanimated_1.default.View style={safeAreaPaddingBottomStyle} entering={react_native_reanimated_1.FadeIn}>
                                        <Button_1.default ref={(0, viewRef_1.default)(submitRef)} success large style={[styles.buttonConfirm, shouldUseNarrowLayout ? {} : styles.attachmentButtonBigScreen]} textStyles={[styles.buttonConfirmText]} text={translate('common.send')} onPress={submitAndClose} isDisabled={shouldDisableSendButton} pressOnEnter/>
                                    </react_native_reanimated_1.default.View>)}
                            </SafeAreaConsumer_1.default>)}
                    </react_native_reanimated_1.LayoutAnimationConfig>
                </react_native_gesture_handler_1.GestureHandlerRootView>
            </Modal_1.default>
            {children?.({
            displayFilesInModal: validateAndDisplayMultipleFilesToUpload,
            show: openModal,
        })}
            {ErrorModal}
        </>);
}
AttachmentComposerModal.displayName = 'AttachmentComposerModal';
exports.default = (0, react_1.memo)(AttachmentComposerModal);
