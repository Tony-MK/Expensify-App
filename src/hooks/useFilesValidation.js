"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var FullScreenLoaderContext_1 = require("@components/FullScreenLoaderContext");
var PDFThumbnail_1 = require("@components/PDFThumbnail");
var Text_1 = require("@components/Text");
var TextLink_1 = require("@components/TextLink");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var heicConverter_1 = require("@libs/fileDownload/heicConverter");
var CONST_1 = require("@src/CONST");
var useLocalize_1 = require("./useLocalize");
var useThemeStyles_1 = require("./useThemeStyles");
var sortFilesByOriginalOrder = function (files, orderMap) {
    return files.sort(function (a, b) { var _a, _b, _c, _d; return ((_b = orderMap.get((_a = a.uri) !== null && _a !== void 0 ? _a : '')) !== null && _b !== void 0 ? _b : 0) - ((_d = orderMap.get((_c = b.uri) !== null && _c !== void 0 ? _c : '')) !== null && _d !== void 0 ? _d : 0); });
};
function useFilesValidation(proceedWithFilesAction, isValidatingReceipts) {
    if (isValidatingReceipts === void 0) { isValidatingReceipts = true; }
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _a = (0, react_1.useState)(false), isErrorModalVisible = _a[0], setIsErrorModalVisible = _a[1];
    var _b = (0, react_1.useState)(null), fileError = _b[0], setFileError = _b[1];
    var _c = (0, react_1.useState)([]), pdfFilesToRender = _c[0], setPdfFilesToRender = _c[1];
    var _d = (0, react_1.useState)([]), validFilesToUpload = _d[0], setValidFilesToUpload = _d[1];
    var _e = (0, react_1.useState)(false), isValidatingMultipleFiles = _e[0], setIsValidatingMultipleFiles = _e[1];
    var _f = (0, react_1.useState)(''), invalidFileExtension = _f[0], setInvalidFileExtension = _f[1];
    var _g = (0, react_1.useState)([]), errorQueue = _g[0], setErrorQueue = _g[1];
    var _h = (0, react_1.useState)(0), currentErrorIndex = _h[0], setCurrentErrorIndex = _h[1];
    var setIsLoaderVisible = (0, FullScreenLoaderContext_1.useFullScreenLoader)().setIsLoaderVisible;
    var validatedPDFs = (0, react_1.useRef)([]);
    var validFiles = (0, react_1.useRef)([]);
    var filesToValidate = (0, react_1.useRef)([]);
    var dataTransferItemList = (0, react_1.useRef)([]);
    var collectedErrors = (0, react_1.useRef)([]);
    var originalFileOrder = (0, react_1.useRef)(new Map());
    var updateFileOrderMapping = (0, react_1.useCallback)(function (oldFile, newFile) {
        var _a, _b;
        var originalIndex = originalFileOrder.current.get((_a = oldFile === null || oldFile === void 0 ? void 0 : oldFile.uri) !== null && _a !== void 0 ? _a : '');
        if (originalIndex !== undefined) {
            originalFileOrder.current.set((_b = newFile.uri) !== null && _b !== void 0 ? _b : '', originalIndex);
        }
    }, []);
    var deduplicateErrors = (0, react_1.useCallback)(function (errors) {
        var uniqueErrors = new Set();
        return errors.filter(function (error) {
            var _a;
            var key = "".concat(error.error, "-").concat((_a = error.fileExtension) !== null && _a !== void 0 ? _a : '');
            if (uniqueErrors.has(key)) {
                return false;
            }
            uniqueErrors.add(key);
            return true;
        });
    }, []);
    var resetValidationState = (0, react_1.useCallback)(function () {
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
    var hideModalAndReset = (0, react_1.useCallback)(function () {
        setIsErrorModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(function () {
            resetValidationState();
        });
    }, [resetValidationState]);
    var setErrorAndOpenModal = function (error) {
        setFileError(error);
        setIsErrorModalVisible(true);
    };
    var isValidFile = function (originalFile, item, isCheckingMultipleFiles) {
        if (item && item.kind === 'file' && 'webkitGetAsEntry' in item) {
            var entry = item.webkitGetAsEntry();
            if (entry === null || entry === void 0 ? void 0 : entry.isDirectory) {
                collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FOLDER_NOT_ALLOWED });
                return Promise.resolve(false);
            }
        }
        return (0, FileUtils_1.normalizeFileObject)(originalFile)
            .then(function (normalizedFile) {
            return (0, FileUtils_1.validateImageForCorruption)(normalizedFile).then(function () {
                var _a;
                var error = (0, FileUtils_1.validateAttachment)(normalizedFile, isCheckingMultipleFiles, isValidatingReceipts);
                if (error) {
                    var errorData = {
                        error: error,
                        fileExtension: error === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE ? (0, FileUtils_1.splitExtensionFromFileName)((_a = normalizedFile.name) !== null && _a !== void 0 ? _a : '').fileExtension : undefined,
                    };
                    collectedErrors.current.push(errorData);
                    return false;
                }
                return true;
            });
        })
            .catch(function () {
            collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FILE_CORRUPTED });
            return false;
        });
    };
    var convertHeicImageToJpegPromise = function (file) {
        return new Promise(function (resolve, reject) {
            (0, heicConverter_1.default)(file, {
                onSuccess: function (convertedFile) { return resolve(convertedFile); },
                onError: function (nonConvertedFile) {
                    reject(nonConvertedFile);
                },
            });
        });
    };
    var checkIfAllValidatedAndProceed = (0, react_1.useCallback)(function () {
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
            var uniqueErrors = deduplicateErrors(collectedErrors.current);
            setErrorQueue(uniqueErrors);
            setCurrentErrorIndex(0);
            var firstError = uniqueErrors.at(0);
            if (firstError) {
                setFileError(firstError.error);
                if (firstError.fileExtension) {
                    setInvalidFileExtension(firstError.fileExtension);
                }
                setIsErrorModalVisible(true);
            }
        }
        else if (validFiles.current.length > 0) {
            var sortedFiles = sortFilesByOriginalOrder(validFiles.current, originalFileOrder.current);
            proceedWithFilesAction(sortedFiles);
            resetValidationState();
        }
    }, [deduplicateErrors, pdfFilesToRender.length, proceedWithFilesAction, resetValidationState]);
    var validateAndResizeFiles = function (files, items) {
        // Early return for empty files
        if (files.length === 0) {
            return;
        }
        // Reset collected errors for new validation
        collectedErrors.current = [];
        files.forEach(function (file, index) {
            var _a;
            originalFileOrder.current.set((_a = file.uri) !== null && _a !== void 0 ? _a : '', index);
        });
        Promise.all(files.map(function (file, index) { return isValidFile(file, items.at(index), files.length > 1).then(function (isValid) { return (isValid ? file : null); }); }))
            .then(function (validationResults) {
            var filteredResults = validationResults.filter(function (result) { return result !== null; });
            var pdfsToLoad = filteredResults.filter(function (file) { var _a; return expensify_common_1.Str.isPDF((_a = file.name) !== null && _a !== void 0 ? _a : ''); });
            var otherFiles = filteredResults.filter(function (file) { var _a; return !expensify_common_1.Str.isPDF((_a = file.name) !== null && _a !== void 0 ? _a : ''); });
            // Check if we need to convert images
            if (otherFiles.some(function (file) { return (0, FileUtils_1.isHeicOrHeifImage)(file); })) {
                setIsLoaderVisible(true);
                return Promise.all(otherFiles.map(function (file) { return convertHeicImageToJpegPromise(file); })).then(function (convertedImages) {
                    convertedImages.forEach(function (convertedFile, index) {
                        updateFileOrderMapping(otherFiles.at(index), convertedFile);
                    });
                    // Check if we need to resize images
                    if (convertedImages.some(function (file) { var _a; return ((_a = file.size) !== null && _a !== void 0 ? _a : 0) > CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE; })) {
                        return Promise.all(convertedImages.map(function (file) { return (0, FileUtils_1.resizeImageIfNeeded)(file); })).then(function (processedFiles) {
                            processedFiles.forEach(function (resizedFile, index) {
                                updateFileOrderMapping(convertedImages.at(index), resizedFile);
                            });
                            setIsLoaderVisible(false);
                            return Promise.resolve({ processedFiles: processedFiles, pdfsToLoad: pdfsToLoad });
                        });
                    }
                    // No resizing needed, just return the converted images
                    setIsLoaderVisible(false);
                    return Promise.resolve({ processedFiles: convertedImages, pdfsToLoad: pdfsToLoad });
                });
            }
            // No conversion needed, but check if we need to resize images
            if (otherFiles.some(function (file) { var _a; return ((_a = file.size) !== null && _a !== void 0 ? _a : 0) > CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE; })) {
                setIsLoaderVisible(true);
                return Promise.all(otherFiles.map(function (file) { return (0, FileUtils_1.resizeImageIfNeeded)(file); })).then(function (processedFiles) {
                    processedFiles.forEach(function (resizedFile, index) {
                        updateFileOrderMapping(otherFiles.at(index), resizedFile);
                    });
                    setIsLoaderVisible(false);
                    return Promise.resolve({ processedFiles: processedFiles, pdfsToLoad: pdfsToLoad });
                });
            }
            // No conversion or resizing needed, just return the valid images
            return Promise.resolve({ processedFiles: otherFiles, pdfsToLoad: pdfsToLoad });
        })
            .then(function (_a) {
            var processedFiles = _a.processedFiles, pdfsToLoad = _a.pdfsToLoad;
            if (pdfsToLoad.length) {
                validFiles.current = processedFiles;
                setPdfFilesToRender(pdfsToLoad);
            }
            else {
                if (processedFiles.length > 0) {
                    setValidFilesToUpload(processedFiles);
                }
                if (collectedErrors.current.length > 0) {
                    var uniqueErrors = Array.from(new Set(collectedErrors.current.map(function (error) { return JSON.stringify(error); }))).map(function (errorStr) { return JSON.parse(errorStr); });
                    setErrorQueue(uniqueErrors);
                    setCurrentErrorIndex(0);
                    var firstError = uniqueErrors.at(0);
                    if (firstError) {
                        setFileError(firstError.error);
                        if (firstError.fileExtension) {
                            setInvalidFileExtension(firstError.fileExtension);
                        }
                        setIsErrorModalVisible(true);
                    }
                }
                else if (processedFiles.length > 0) {
                    var sortedFiles = sortFilesByOriginalOrder(processedFiles, originalFileOrder.current);
                    proceedWithFilesAction(sortedFiles);
                    resetValidationState();
                }
            }
        });
    };
    var validateFiles = function (files, items) {
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
            validateAndResizeFiles(files, items !== null && items !== void 0 ? items : []);
        }
    };
    var onConfirm = function () {
        var _a;
        if (fileError === CONST_1.default.FILE_VALIDATION_ERRORS.MAX_FILE_LIMIT_EXCEEDED) {
            setIsErrorModalVisible(false);
            validateAndResizeFiles(filesToValidate.current, dataTransferItemList.current);
            return;
        }
        if (currentErrorIndex < errorQueue.length - 1) {
            var nextIndex = currentErrorIndex + 1;
            var nextError = errorQueue.at(nextIndex);
            if (nextError) {
                if (isValidatingMultipleFiles && currentErrorIndex === errorQueue.length - 2 && validFilesToUpload.length === 0) {
                    setIsValidatingMultipleFiles(false);
                }
                setCurrentErrorIndex(nextIndex);
                setFileError(nextError.error);
                setInvalidFileExtension((_a = nextError.fileExtension) !== null && _a !== void 0 ? _a : '');
                return;
            }
        }
        var sortedFiles = sortFilesByOriginalOrder(validFilesToUpload, originalFileOrder.current);
        // If we're validating attachments we need to use InteractionManager to ensure
        // the error modal is dismissed before opening the attachment modal
        if (!isValidatingReceipts && fileError) {
            setIsErrorModalVisible(false);
            react_native_1.InteractionManager.runAfterInteractions(function () {
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
    var PDFValidationComponent = pdfFilesToRender.length
        ? pdfFilesToRender.map(function (file) {
            var _a;
            return (<PDFThumbnail_1.default key={file.uri} style={styles.invisiblePDF} previewSourceURL={(_a = file.uri) !== null && _a !== void 0 ? _a : ''} onLoadSuccess={function () {
                    validatedPDFs.current.push(file);
                    validFiles.current.push(file);
                    checkIfAllValidatedAndProceed();
                }} onPassword={function () {
                    validatedPDFs.current.push(file);
                    if (isValidatingReceipts) {
                        collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.PROTECTED_FILE });
                    }
                    else {
                        validFiles.current.push(file);
                    }
                    checkIfAllValidatedAndProceed();
                }} onLoadError={function () {
                    validatedPDFs.current.push(file);
                    collectedErrors.current.push({ error: CONST_1.default.FILE_VALIDATION_ERRORS.FILE_CORRUPTED });
                    checkIfAllValidatedAndProceed();
                }}/>);
        })
        : undefined;
    var getModalPrompt = (0, react_1.useCallback)(function () {
        if (!fileError) {
            return '';
        }
        var prompt = (0, FileUtils_1.getFileValidationErrorText)(fileError, { fileType: invalidFileExtension }, isValidatingReceipts).reason;
        if (fileError === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE || fileError === CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE) {
            return (<Text_1.default>
                    {prompt}
                    <TextLink_1.default href={CONST_1.default.BULK_UPLOAD_HELP_URL}> {translate('attachmentPicker.learnMoreAboutSupportedFiles')}</TextLink_1.default>
                </Text_1.default>);
        }
        return prompt;
    }, [fileError, invalidFileExtension, isValidatingReceipts, translate]);
    var ErrorModal = (<ConfirmModal_1.default title={(0, FileUtils_1.getFileValidationErrorText)(fileError, { fileType: invalidFileExtension }, isValidatingReceipts).title} onConfirm={onConfirm} onCancel={hideModalAndReset} isVisible={isErrorModalVisible} prompt={getModalPrompt()} confirmText={translate(isValidatingMultipleFiles ? 'common.continue' : 'common.close')} cancelText={translate('common.cancel')} shouldShowCancelButton={isValidatingMultipleFiles}/>);
    return {
        PDFValidationComponent: PDFValidationComponent,
        validateFiles: validateFiles,
        ErrorModal: ErrorModal,
    };
}
exports.default = useFilesValidation;
