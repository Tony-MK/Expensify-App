"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showErrorAlert = showErrorAlert;
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var TabNavigatorSkeleton_1 = require("@components/Skeletons/TabNavigatorSkeleton");
var TabSelector_1 = require("@components/TabSelector/TabSelector");
var useFilesValidation_1 = require("@hooks/useFilesValidation");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Share_1 = require("@libs/actions/Share");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
var ReceiptUtils_1 = require("@libs/ReceiptUtils");
var ShareActionHandlerModule_1 = require("@libs/ShareActionHandlerModule");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var getFileSize_1 = require("./getFileSize");
var ShareTab_1 = require("./ShareTab");
var SubmitTab_1 = require("./SubmitTab");
function showErrorAlert(title, message) {
    react_native_1.Alert.alert(title, message, [
        {
            onPress: function () {
                Navigation_1.default.navigate(ROUTES_1.default.HOME);
            },
        },
    ]);
    Navigation_1.default.navigate(ROUTES_1.default.HOME);
}
function ShareRootPage() {
    var currentAttachment = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true })[0];
    var validateFiles = (0, useFilesValidation_1.default)(Share_1.addValidatedShareFile).validateFiles;
    var isTextShared = (currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.mimeType) === 'txt';
    var validateFileIfNecessary = (0, react_1.useCallback)(function (file) {
        if (!file || isTextShared || !(0, ReceiptUtils_1.shouldValidateFile)(file)) {
            return;
        }
        validateFiles([
            {
                name: file.id,
                uri: file.content,
                type: file.mimeType,
            },
        ]);
    }, [isTextShared, validateFiles]);
    var appState = (0, react_1.useRef)(react_native_1.AppState.currentState);
    var _a = (0, react_1.useState)(false), isFileReady = _a[0], setIsFileReady = _a[1];
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _b = (0, react_1.useState)(false), isFileScannable = _b[0], setIsFileScannable = _b[1];
    var receiptFileFormats = Object.values(CONST_1.default.RECEIPT_ALLOWED_FILE_TYPES);
    var shareFileMimeTypes = Object.values(CONST_1.default.SHARE_FILE_MIMETYPE);
    var _c = (0, react_1.useState)(undefined), errorTitle = _c[0], setErrorTitle = _c[1];
    var _d = (0, react_1.useState)(undefined), errorMessage = _d[0], setErrorMessage = _d[1];
    (0, react_1.useEffect)(function () {
        if (!errorTitle || !errorMessage) {
            return;
        }
        showErrorAlert(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    var handleProcessFiles = (0, react_1.useCallback)(function () {
        ShareActionHandlerModule_1.default.processFiles(function (processedFiles) {
            var tempFile = Array.isArray(processedFiles) ? processedFiles.at(0) : JSON.parse(processedFiles);
            if (errorTitle) {
                return;
            }
            if (!(tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType) || !shareFileMimeTypes.includes(tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType)) {
                setErrorTitle(translate('attachmentPicker.wrongFileType'));
                setErrorMessage(translate('attachmentPicker.notAllowedExtension'));
                return;
            }
            var isImage = /image\/.*/.test(tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType);
            if ((tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType) && (tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType) !== 'txt' && !isImage) {
                (0, getFileSize_1.default)(tempFile === null || tempFile === void 0 ? void 0 : tempFile.content).then(function (size) {
                    if (size > CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE) {
                        setErrorTitle(translate('attachmentPicker.attachmentTooLarge'));
                        setErrorMessage(translate('attachmentPicker.sizeExceeded'));
                    }
                    if (size < CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE) {
                        setErrorTitle(translate('attachmentPicker.attachmentTooSmall'));
                        setErrorMessage(translate('attachmentPicker.sizeNotMet'));
                    }
                });
            }
            if (isImage) {
                var fileObject = { name: tempFile.id, uri: tempFile === null || tempFile === void 0 ? void 0 : tempFile.content, type: tempFile === null || tempFile === void 0 ? void 0 : tempFile.mimeType };
                (0, FileUtils_1.validateImageForCorruption)(fileObject).catch(function () {
                    setErrorTitle(translate('attachmentPicker.attachmentError'));
                    setErrorMessage(translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
                });
            }
            var fileExtension = (0, FileUtils_1.splitExtensionFromFileName)(tempFile === null || tempFile === void 0 ? void 0 : tempFile.content).fileExtension;
            if (tempFile) {
                if (tempFile.mimeType) {
                    if (receiptFileFormats.includes(tempFile.mimeType) && fileExtension) {
                        setIsFileScannable(true);
                    }
                    else {
                        setIsFileScannable(false);
                    }
                    validateFileIfNecessary(tempFile);
                    setIsFileReady(true);
                }
                (0, Share_1.addTempShareFile)(tempFile);
            }
        });
    }, [errorTitle, shareFileMimeTypes, translate, receiptFileFormats, validateFileIfNecessary]);
    (0, react_1.useEffect)(function () {
        var subscription = react_native_1.AppState.addEventListener('change', function (nextAppState) {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                handleProcessFiles();
            }
            appState.current = nextAppState;
        });
        return function () {
            subscription.remove();
        };
    }, [handleProcessFiles]);
    (0, react_1.useEffect)(function () {
        (0, Share_1.clearShareData)();
        handleProcessFiles();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    var shareTabInputRef = (0, react_1.useRef)(null);
    var submitTabInputRef = (0, react_1.useRef)(null);
    // We're focusing the input using internal onPageSelected to fix input focus inconsistencies on native.
    // More info: https://github.com/Expensify/App/issues/59388
    var onTabSelectFocusHandler = function (_a) {
        var index = _a.index;
        // We runAfterInteractions since the function is called in the animate block on web-based
        // implementation, this fixes an animation glitch and matches the native internal delay
        react_native_1.InteractionManager.runAfterInteractions(function () {
            var _a, _b;
            // Chat tab (0) / Room tab (1) according to OnyxTabNavigator (see below)
            if (index === 0) {
                (_a = shareTabInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else if (index === 1) {
                (_b = submitTabInputRef.current) === null || _b === void 0 ? void 0 : _b.focus();
            }
        });
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={ShareRootPage.displayName}>
            <react_native_1.View style={[styles.flex1]}>
                <HeaderWithBackButton_1.default title={translate('share.shareToExpensify')} shouldShowBackButton onBackButtonPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.HOME); }}/>
                {isFileReady ? (<OnyxTabNavigator_1.default id={CONST_1.default.TAB.SHARE.NAVIGATOR_ID} tabBar={TabSelector_1.default} lazyLoadEnabled onTabSelect={onTabSelectFocusHandler}>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.SHARE.SHARE}>{function () { return <ShareTab_1.default ref={shareTabInputRef}/>; }}</OnyxTabNavigator_1.TopTab.Screen>
                        {isFileScannable && <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.SHARE.SUBMIT}>{function () { return <SubmitTab_1.default ref={submitTabInputRef}/>; }}</OnyxTabNavigator_1.TopTab.Screen>}
                    </OnyxTabNavigator_1.default>) : (<TabNavigatorSkeleton_1.default />)}
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ShareRootPage.displayName = 'ShareRootPage';
exports.default = ShareRootPage;
