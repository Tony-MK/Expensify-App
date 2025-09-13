"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FullScreenLoaderContext_1 = require("@components/FullScreenLoaderContext");
const PDFThumbnail_1 = require("@components/PDFThumbnail");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const heicConverter_1 = require("@libs/fileDownload/heicConverter");
const CONST_1 = require("@src/CONST");
const useLocalize_1 = require("./useLocalize");
const useThemeStyles_1 = require("./useThemeStyles");
const sortFilesByOriginalOrder = (files, orderMap) => {
    return files.sort((a, b) => (orderMap.get(a.uri ?? '') ?? 0) - (orderMap.get(b.uri ?? '') ?? 0));
};
function useFilesValidation(proceedWithFilesAction, isValidatingReceipts = true) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isErrorModalVisible, setIsErrorModalVisible] = (0, react_1.useState)(false);
    const [fileError, setFileError] = (0, react_1.useState)(null);
    const [pdfFilesToRender, setPdfFilesToRender] = (0, react_1.useState)([]);
    const [validFilesToUpload, setValidFilesToUpload] = (0, react_1.useState)([]);
    const [isValidatingMultipleFiles, setIsValidatingMultipleFiles] = (0, react_1.useState)(false);
    const [invalidFileExtension, setInvalidFileExtension] = (0, react_1.useState)('');
    const [errorQueue, setErrorQueue] = (0, react_1.useState)([]);
    const [currentErrorIndex, setCurrentErrorIndex] = (0, react_1.useState)(0);
    const { setIsLoaderVisible } = (0, FullScreenLoaderContext_1.useFullScreenLoader)();
    const validatedPDFs = (0, react_1.useRef)([]);
    const validFiles = (0, react_1.useRef)([]);
    const filesToValidate = (0, react_1.useRef)([]);
    const dataTransferItemList = (0, react_1.useRef)([]);
    const collectedErrors = (0, react_1.useRef)([]);
    const originalFileOrder = (0, react_1.useRef)(new Map());
    const updateFileOrderMapping = (0, react_1.useCallback)((oldFile, newFile) => {
        const originalIndex = originalFileOrder.current.get(oldFile?.uri ?? '');
        if (originalIndex !== undefined) {
            originalFileOrder.current.set(newFile.uri ?? '', originalIndex);
        }
    }, []);
    const deduplicateErrors = (0, react_1.useCallback)((errors) => {
        const uniqueErrors = new Set();
        return errors.filter((error) => {
            const key = `${error.error}-${error.fileExtension ?? ''}`;
            if (uniqueErrors.has(key)) {
                return false;
            }
            uniqueErrors.add(key);
            return true;
        });
    }, []);
    const resetValidationState = (0, react_1.useCallback)(() => {
        setIsErrorModalVisible(false);
        setPdfFilesToRender([]);
        setIsLoaderVisible(false);
        setValidFilesToUpload([]);
        setIsValidatingMultipleFiles(false);
        setFileError(null);
        setInvalidFileExtension('');
        setErrorQueue([]);
        setCurrentErrorIndex(0);
        validatedPDFs.current = [];
        validFiles.current = [];
        filesToValidate.current = [];
        dataTransferItemList.current = [];
        collectedErrors.current = [];
        originalFileOrder.current.clear();
    }, [setIsLoaderVisible]);
    const hideModalAndReset = (0, react_1.useCallback)(() => {
        setIsErrorModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            resetValidationState();
        });
    }, [resetValidationState]);
    const setErrorAndOpenModal = (error) => {
        setFileError(error);
        setIsErrorModalVisible(true);
    };
    const isValidFile = (originalFile, item, isCheckingMultipleFiles) => {
        if (item && item.kind === 'file' && 'webkitGetAsEntry' in item) {
            const entry = item.webkitGetAsEntry();
            if (entry?.isDirectory) {
                collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FOLDER_NOT_ALLOWED });
                return Promise.resolve(false);
            }
        }
        return (0, FileUtils_1.normalizeFileObject)(originalFile)
            .then((normalizedFile) => (0, FileUtils_1.validateImageForCorruption)(normalizedFile).then(() => {
            const error = (0, FileUtils_1.validateAttachment)(normalizedFile, isCheckingMultipleFiles, isValidatingReceipts);
            if (error) {
                const errorData = {
                    error,
                    fileExtension: error === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE ? (0, FileUtils_1.splitExtensionFromFileName)(normalizedFile.name ?? '').fileExtension : undefined,
                };
                collectedErrors.current.push(errorData);
                return false;
            }
            return true;
        }))
            .catch(() => {
            collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FILE_CORRUPTED });
            return false;
        });
    };
    const convertHeicImageToJpegPromise = (file) => {
        return new Promise((resolve, reject) => {
            (0, heicConverter_1.default)(file, {
                onSuccess: (convertedFile) => resolve(convertedFile),
                onError: (nonConvertedFile) => {
                    reject(nonConvertedFile);
                },
            });
        });
    };
    const checkIfAllValidatedAndProceed = (0, react_1.useCallback)(() => {
        if (!validatedPDFs.current || !validFiles.current) {
            return;
        }
        if (validatedPDFs.current.length !== pdfFilesToRender.length) {
            return;
        }
        if (validFiles.current.length > 0) {
            setValidFilesToUpload(validFiles.current);
        }
        if (collectedErrors.current.length > 0) {
            const uniqueErrors = deduplicateErrors(collectedErrors.current);
            setErrorQueue(uniqueErrors);
            setCurrentErrorIndex(0);
            const firstError = uniqueErrors.at(0);
            if (firstError) {
                setFileError(firstError.error);
                if (firstError.fileExtension) {
                    setInvalidFileExtension(firstError.fileExtension);
                }
                setIsErrorModalVisible(true);
            }
        }
        else if (validFiles.current.length > 0) {
            const sortedFiles = sortFilesByOriginalOrder(validFiles.current, originalFileOrder.current);
            proceedWithFilesAction(sortedFiles);
            resetValidationState();
        }
    }, [deduplicateErrors, pdfFilesToRender.length, proceedWithFilesAction, resetValidationState]);
    const validateAndResizeFiles = (files, items) => {
        // Early return for empty files
        if (files.length === 0) {
            return;
        }
        // Reset collected errors for new validation
        collectedErrors.current = [];
        files.forEach((file, index) => {
            originalFileOrder.current.set(file.uri ?? '', index);
        });
        Promise.all(files.map((file, index) => isValidFile(file, items.at(index), files.length > 1).then((isValid) => (isValid ? file : null))))
            .then((validationResults) => {
            const filteredResults = validationResults.filter((result) => result !== null);
            const pdfsToLoad = filteredResults.filter((file) => expensify_common_1.Str.isPDF(file.name ?? ''));
            const otherFiles = filteredResults.filter((file) => !expensify_common_1.Str.isPDF(file.name ?? ''));
            // Check if we need to convert images
            if (otherFiles.some((file) => (0, FileUtils_1.isHeicOrHeifImage)(file))) {
                setIsLoaderVisible(true);
                return Promise.all(otherFiles.map((file) => convertHeicImageToJpegPromise(file))).then((convertedImages) => {
                    convertedImages.forEach((convertedFile, index) => {
                        updateFileOrderMapping(otherFiles.at(index), convertedFile);
                    });
                    // Check if we need to resize images
                    if (convertedImages.some((file) => (file.size ?? 0) > CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE)) {
                        return Promise.all(convertedImages.map((file) => (0, FileUtils_1.resizeImageIfNeeded)(file))).then((processedFiles) => {
                            processedFiles.forEach((resizedFile, index) => {
                                updateFileOrderMapping(convertedImages.at(index), resizedFile);
                            });
                            setIsLoaderVisible(false);
                            return Promise.resolve({ processedFiles, pdfsToLoad });
                        });
                    }
                    // No resizing needed, just return the converted images
                    setIsLoaderVisible(false);
                    return Promise.resolve({ processedFiles: convertedImages, pdfsToLoad });
                });
            }
            // No conversion needed, but check if we need to resize images
            if (otherFiles.some((file) => (file.size ?? 0) > CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE)) {
                setIsLoaderVisible(true);
                return Promise.all(otherFiles.map((file) => (0, FileUtils_1.resizeImageIfNeeded)(file))).then((processedFiles) => {
                    processedFiles.forEach((resizedFile, index) => {
                        updateFileOrderMapping(otherFiles.at(index), resizedFile);
                    });
                    setIsLoaderVisible(false);
                    return Promise.resolve({ processedFiles, pdfsToLoad });
                });
            }
            // No conversion or resizing needed, just return the valid images
            return Promise.resolve({ processedFiles: otherFiles, pdfsToLoad });
        })
            .then(({ processedFiles, pdfsToLoad }) => {
            if (pdfsToLoad.length) {
                validFiles.current = processedFiles;
                setPdfFilesToRender(pdfsToLoad);
            }
            else {
                if (processedFiles.length > 0) {
                    setValidFilesToUpload(processedFiles);
                }
                if (collectedErrors.current.length > 0) {
                    const uniqueErrors = Array.from(new Set(collectedErrors.current.map((error) => JSON.stringify(error)))).map((errorStr) => JSON.parse(errorStr));
                    setErrorQueue(uniqueErrors);
                    setCurrentErrorIndex(0);
                    const firstError = uniqueErrors.at(0);
                    if (firstError) {
                        setFileError(firstError.error);
                        if (firstError.fileExtension) {
                            setInvalidFileExtension(firstError.fileExtension);
                        }
                        setIsErrorModalVisible(true);
                    }
                }
                else if (processedFiles.length > 0) {
                    const sortedFiles = sortFilesByOriginalOrder(processedFiles, originalFileOrder.current);
                    proceedWithFilesAction(sortedFiles);
                    resetValidationState();
                }
            }
        });
    };
    const validateFiles = (files, items) => {
        if (files.length > 1) {
            setIsValidatingMultipleFiles(true);
        }
        if (files.length > CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_FILE_LIMIT) {
            filesToValidate.current = files.slice(0, CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_FILE_LIMIT);
            if (items) {
                dataTransferItemList.current = items.slice(0, CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_FILE_LIMIT);
            }
            setErrorAndOpenModal(CONST_1.default.FILE_VALIDATION_ERRORS.MAX_FILE_LIMIT_EXCEEDED);
        }
        else {
            validateAndResizeFiles(files, items ?? []);
        }
    };
    const onConfirm = () => {
        if (fileError === CONST_1.default.FILE_VALIDATION_ERRORS.MAX_FILE_LIMIT_EXCEEDED) {
            setIsErrorModalVisible(false);
            validateAndResizeFiles(filesToValidate.current, dataTransferItemList.current);
            return;
        }
        if (currentErrorIndex < errorQueue.length - 1) {
            const nextIndex = currentErrorIndex + 1;
            const nextError = errorQueue.at(nextIndex);
            if (nextError) {
                if (isValidatingMultipleFiles && currentErrorIndex === errorQueue.length - 2 && validFilesToUpload.length === 0) {
                    setIsValidatingMultipleFiles(false);
                }
                setCurrentErrorIndex(nextIndex);
                setFileError(nextError.error);
                setInvalidFileExtension(nextError.fileExtension ?? '');
                return;
            }
        }
        const sortedFiles = sortFilesByOriginalOrder(validFilesToUpload, originalFileOrder.current);
        // If we're validating attachments we need to use InteractionManager to ensure
        // the error modal is dismissed before opening the attachment modal
        if (!isValidatingReceipts && fileError) {
            setIsErrorModalVisible(false);
            react_native_1.InteractionManager.runAfterInteractions(() => {
                if (sortedFiles.length !== 0) {
                    proceedWithFilesAction(sortedFiles);
                }
                resetValidationState();
            });
        }
        else {
            if (sortedFiles.length !== 0) {
                proceedWithFilesAction(sortedFiles);
            }
            hideModalAndReset();
        }
    };
    const PDFValidationComponent = pdfFilesToRender.length
        ? pdfFilesToRender.map((file) => (<PDFThumbnail_1.default key={file.uri} style={styles.invisiblePDF} previewSourceURL={file.uri ?? ''} onLoadSuccess={() => {
                validatedPDFs.current.push(file);
                validFiles.current.push(file);
                checkIfAllValidatedAndProceed();
            }} onPassword={() => {
                validatedPDFs.current.push(file);
                if (isValidatingReceipts) {
                    collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.PROTECTED_FILE });
                }
                else {
                    validFiles.current.push(file);
                }
                checkIfAllValidatedAndProceed();
            }} onLoadError={() => {
                validatedPDFs.current.push(file);
                collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FILE_CORRUPTED });
                checkIfAllValidatedAndProceed();
            }}/>))
        : undefined;
    const getModalPrompt = (0, react_1.useCallback)(() => {
        if (!fileError) {
            return '';
        }
        const prompt = (0, FileUtils_1.getFileValidationErrorText)(fileError, { fileType: invalidFileExtension }, isValidatingReceipts).reason;
        if (fileError === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE || fileError === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE) {
            return (<Text_1.default>
                    {prompt}
                    <TextLink_1.default href={CONST_1.default.BULK_UPLOAD_HELP_URL}> {translate('attachmentPicker.learnMoreAboutSupportedFiles')}</TextLink_1.default>
                </Text_1.default>);
        }
        return prompt;
    }, [fileError, invalidFileExtension, isValidatingReceipts, translate]);
    const ErrorModal = (<ConfirmModal_1.default title={(0, FileUtils_1.getFileValidationErrorText)(fileError, { fileType: invalidFileExtension }, isValidatingReceipts).title} onConfirm={onConfirm} onCancel={hideModalAndReset} isVisible={isErrorModalVisible} prompt={getModalPrompt()} confirmText={translate(isValidatingMultipleFiles ? 'common.continue' : 'common.close')} cancelText={translate('common.cancel')} shouldShowCancelButton={isValidatingMultipleFiles}/>);
    return {
        PDFValidationComponent,
        validateFiles,
        ErrorModal,
    };
}
exports.default = useFilesValidation;
