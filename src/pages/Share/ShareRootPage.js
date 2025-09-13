"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showErrorAlert = showErrorAlert;
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TabNavigatorSkeleton_1 = require("@components/Skeletons/TabNavigatorSkeleton");
const TabSelector_1 = require("@components/TabSelector/TabSelector");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Share_1 = require("@libs/actions/Share");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ShareActionHandlerModule_1 = require("@libs/ShareActionHandlerModule");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getFileSize_1 = require("./getFileSize");
const ShareTab_1 = require("./ShareTab");
const SubmitTab_1 = require("./SubmitTab");
function showErrorAlert(title, message) {
    react_native_1.Alert.alert(title, message, [
        {
            onPress: () => {
                Navigation_1.default.navigate(ROUTES_1.default.HOME);
            },
        },
    ]);
    Navigation_1.default.navigate(ROUTES_1.default.HOME);
}
function ShareRootPage() {
    const [currentAttachment] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true });
    const { validateFiles } = (0, useFilesValidation_1.default)(Share_1.addValidatedShareFile);
    const isTextShared = currentAttachment?.mimeType === 'txt';
    const validateFileIfNecessary = (0, react_1.useCallback)((file) => {
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
    const appState = (0, react_1.useRef)(react_native_1.AppState.currentState);
    const [isFileReady, setIsFileReady] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isFileScannable, setIsFileScannable] = (0, react_1.useState)(false);
    const receiptFileFormats = Object.values(CONST_1.default.RECEIPT_ALLOWED_FILE_TYPES);
    const shareFileMimeTypes = Object.values(CONST_1.default.SHARE_FILE_MIMETYPE);
    const [errorTitle, setErrorTitle] = (0, react_1.useState)(undefined);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        if (!errorTitle || !errorMessage) {
            return;
        }
        showErrorAlert(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    const handleProcessFiles = (0, react_1.useCallback)(() => {
        ShareActionHandlerModule_1.default.processFiles((processedFiles) => {
            const tempFile = Array.isArray(processedFiles) ? processedFiles.at(0) : JSON.parse(processedFiles);
            if (errorTitle) {
                return;
            }
            if (!tempFile?.mimeType || !shareFileMimeTypes.includes(tempFile?.mimeType)) {
                setErrorTitle(translate('attachmentPicker.wrongFileType'));
                setErrorMessage(translate('attachmentPicker.notAllowedExtension'));
                return;
            }
            const isImage = /image\/.*/.test(tempFile?.mimeType);
            if (tempFile?.mimeType && tempFile?.mimeType !== 'txt' && !isImage) {
                (0, getFileSize_1.default)(tempFile?.content).then((size) => {
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
                const fileObject = { name: tempFile.id, uri: tempFile?.content, type: tempFile?.mimeType };
                (0, FileUtils_1.validateImageForCorruption)(fileObject).catch(() => {
                    setErrorTitle(translate('attachmentPicker.attachmentError'));
                    setErrorMessage(translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
                });
            }
            const { fileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(tempFile?.content);
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
    (0, react_1.useEffect)(() => {
        const subscription = react_native_1.AppState.addEventListener('change', (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                handleProcessFiles();
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    }, [handleProcessFiles]);
    (0, react_1.useEffect)(() => {
        (0, Share_1.clearShareData)();
        handleProcessFiles();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const shareTabInputRef = (0, react_1.useRef)(null);
    const submitTabInputRef = (0, react_1.useRef)(null);
    // We're focusing the input using internal onPageSelected to fix input focus inconsistencies on native.
    // More info: https://github.com/Expensify/App/issues/59388
    const onTabSelectFocusHandler = ({ index }) => {
        // We runAfterInteractions since the function is called in the animate block on web-based
        // implementation, this fixes an animation glitch and matches the native internal delay
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // Chat tab (0) / Room tab (1) according to OnyxTabNavigator (see below)
            if (index === 0) {
                shareTabInputRef.current?.focus();
            }
            else if (index === 1) {
                submitTabInputRef.current?.focus();
            }
        });
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={ShareRootPage.displayName}>
            <react_native_1.View style={[styles.flex1]}>
                <HeaderWithBackButton_1.default title={translate('share.shareToExpensify')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.navigate(ROUTES_1.default.HOME)}/>
                {isFileReady ? (<OnyxTabNavigator_1.default id={CONST_1.default.TAB.SHARE.NAVIGATOR_ID} tabBar={TabSelector_1.default} lazyLoadEnabled onTabSelect={onTabSelectFocusHandler}>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.SHARE.SHARE}>{() => <ShareTab_1.default ref={shareTabInputRef}/>}</OnyxTabNavigator_1.TopTab.Screen>
                        {isFileScannable && <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.SHARE.SUBMIT}>{() => <SubmitTab_1.default ref={submitTabInputRef}/>}</OnyxTabNavigator_1.TopTab.Screen>}
                    </OnyxTabNavigator_1.default>) : (<TabNavigatorSkeleton_1.default />)}
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ShareRootPage.displayName = 'ShareRootPage';
exports.default = ShareRootPage;
