"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_sdk_1 = require("@onfido/react-native-sdk");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_permissions_1 = require("react-native-permissions");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const { AppStateTracker } = react_native_1.NativeModules;
function Onfido({ sdkToken, onUserExit, onSuccess, onError }) {
    const { translate } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => {
        react_native_sdk_1.Onfido.start({
            sdkToken,
            theme: react_native_sdk_1.OnfidoTheme.AUTOMATIC,
            flowSteps: {
                welcome: true,
                captureFace: {
                    type: react_native_sdk_1.OnfidoCaptureType.VIDEO,
                },
                captureDocument: {
                    docType: react_native_sdk_1.OnfidoDocumentType.GENERIC,
                    countryCode: react_native_sdk_1.OnfidoCountryCode.USA,
                },
            },
            disableNFC: true,
        })
            .then(onSuccess)
            .catch((error) => {
            const errorMessage = error.message ?? CONST_1.default.ERROR.UNKNOWN_ERROR;
            const errorType = error.type;
            Log_1.default.hmmm('Onfido error on native', { errorType, errorMessage });
            // If the user cancels the Onfido flow we won't log this error as it's normal. In the React Native SDK the user exiting the flow will trigger this error which we can use as
            // our "user exited the flow" callback. On web, this event has it's own callback passed as a config so we don't need to bother with this there.
            if ([CONST_1.default.ONFIDO.ERROR.USER_CANCELLED, CONST_1.default.ONFIDO.ERROR.USER_TAPPED_BACK, CONST_1.default.ONFIDO.ERROR.USER_EXITED].includes(errorMessage)) {
                if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID) {
                    AppStateTracker.getWasAppRelaunchedFromIcon().then((wasAppRelaunchedFromIcon) => {
                        onUserExit(!wasAppRelaunchedFromIcon);
                    });
                    return;
                }
                onUserExit(true);
                return;
            }
            if (!!errorMessage && (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS) {
                (0, react_native_permissions_1.checkMultiple)([react_native_permissions_1.PERMISSIONS.IOS.MICROPHONE, react_native_permissions_1.PERMISSIONS.IOS.CAMERA])
                    .then((statuses) => {
                    const isMicAllowed = statuses[react_native_permissions_1.PERMISSIONS.IOS.MICROPHONE] === react_native_permissions_1.RESULTS.GRANTED;
                    const isCameraAllowed = statuses[react_native_permissions_1.PERMISSIONS.IOS.CAMERA] === react_native_permissions_1.RESULTS.GRANTED;
                    let alertTitle = '';
                    let alertMessage = '';
                    if (!isCameraAllowed) {
                        alertTitle = 'onfidoStep.cameraPermissionsNotGranted';
                        alertMessage = 'onfidoStep.cameraRequestMessage';
                    }
                    else if (!isMicAllowed) {
                        alertTitle = 'onfidoStep.microphonePermissionsNotGranted';
                        alertMessage = 'onfidoStep.microphoneRequestMessage';
                    }
                    if (!!alertTitle && !!alertMessage) {
                        react_native_1.Alert.alert(translate(alertTitle), translate(alertMessage), [
                            {
                                text: translate('common.cancel'),
                                onPress: () => onUserExit(),
                            },
                            {
                                text: translate('common.settings'),
                                onPress: () => {
                                    onUserExit();
                                    react_native_1.Linking.openSettings();
                                },
                            },
                        ], { cancelable: false });
                        return;
                    }
                    onError(errorMessage);
                })
                    .catch(() => {
                    onError(errorMessage);
                });
            }
            else {
                onError(errorMessage);
            }
        });
        // Onfido should be initialized only once on mount
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return <FullscreenLoadingIndicator_1.default />;
}
Onfido.displayName = 'Onfido';
exports.default = Onfido;
