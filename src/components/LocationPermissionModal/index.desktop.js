"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_permissions_1 = require("react-native-permissions");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Illustrations = require("@components/Icon/Illustrations");
const ELECTRON_EVENTS_1 = require("@desktop/ELECTRON_EVENTS");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getPlatform_1 = require("@libs/getPlatform");
const Visibility_1 = require("@libs/Visibility");
const LocationPermission_1 = require("@pages/iou/request/step/IOURequestStepScan/LocationPermission");
const CONST_1 = require("@src/CONST");
function LocationPermissionModal({ startPermissionFlow, resetPermissionFlow, onDeny, onGrant, onInitialGetLocationCompleted }) {
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isWeb = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB;
    const checkPermission = (0, react_1.useCallback)(() => {
        (0, LocationPermission_1.getLocationPermission)().then((status) => {
            if (status !== react_native_permissions_1.RESULTS.GRANTED && status !== react_native_permissions_1.RESULTS.LIMITED) {
                return;
            }
            onGrant();
        });
    }, [onGrant]);
    const debouncedCheckPermission = (0, react_1.useMemo)(() => (0, debounce_1.default)(checkPermission, CONST_1.default.TIMING.USE_DEBOUNCED_STATE_DELAY), [checkPermission]);
    (0, react_1.useEffect)(() => {
        if (!showModal) {
            return;
        }
        const unsubscribe = Visibility_1.default.onVisibilityChange(() => {
            debouncedCheckPermission();
        });
        const intervalId = setInterval(() => {
            debouncedCheckPermission();
        }, CONST_1.default.TIMING.LOCATION_UPDATE_INTERVAL);
        return () => {
            unsubscribe();
            clearInterval(intervalId);
        };
    }, [showModal, debouncedCheckPermission]);
    (0, react_1.useEffect)(() => {
        if (!startPermissionFlow) {
            return;
        }
        (0, LocationPermission_1.getLocationPermission)().then((status) => {
            onInitialGetLocationCompleted?.();
            if (status === react_native_permissions_1.RESULTS.GRANTED || status === react_native_permissions_1.RESULTS.LIMITED) {
                return onGrant();
            }
            setShowModal(true);
            setHasError(status === react_native_permissions_1.RESULTS.BLOCKED);
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- We only want to run this effect when startPermissionFlow changes
    }, [startPermissionFlow]);
    const handledBlockedPermission = (cb) => () => {
        setIsLoading(true);
        if (hasError) {
            window.electron.invoke(ELECTRON_EVENTS_1.default.OPEN_LOCATION_SETTING);
            return;
        }
        cb();
    };
    const grantLocationPermission = handledBlockedPermission(() => {
        (0, LocationPermission_1.requestLocationPermission)()
            .then((status) => {
            if (status === react_native_permissions_1.RESULTS.GRANTED || status === react_native_permissions_1.RESULTS.LIMITED) {
                onGrant();
            }
            else {
                onDeny();
            }
        })
            .finally(() => {
            setIsLoading(false);
            setShowModal(false);
            setHasError(false);
        });
    });
    const skipLocationPermission = () => {
        onDeny();
        setShowModal(false);
        setHasError(false);
    };
    const getConfirmText = () => {
        if (!hasError) {
            return translate('common.continue');
        }
        return isWeb ? translate('common.buttonConfirm') : translate('common.settings');
    };
    const closeModal = () => {
        setShowModal(false);
        resetPermissionFlow();
    };
    const locationErrorMessage = (0, react_1.useMemo)(() => (isWeb ? 'receipt.allowLocationFromSetting' : 'receipt.locationErrorMessage'), [isWeb]);
    return (<ConfirmModal_1.default shouldShowCancelButton={!(isWeb && hasError)} onModalHide={() => {
            setHasError(false);
            resetPermissionFlow();
        }} isVisible={showModal} onConfirm={grantLocationPermission} onCancel={skipLocationPermission} onBackdropPress={closeModal} confirmText={getConfirmText()} cancelText={translate('common.notNow')} promptStyles={[styles.textLabelSupportingEmptyValue, styles.mb4]} title={translate(hasError ? 'receipt.locationErrorTitle' : 'receipt.locationAccessTitle')} titleContainerStyles={[styles.mt2, styles.mb0]} titleStyles={[styles.textHeadline]} iconSource={Illustrations.ReceiptLocationMarker} iconFill={false} iconWidth={140} iconHeight={120} shouldCenterIcon shouldReverseStackedButtons prompt={translate(hasError ? locationErrorMessage : 'receipt.locationAccessMessage')} isConfirmLoading={isLoading}/>);
}
LocationPermissionModal.displayName = 'LocationPermissionModal';
exports.default = LocationPermissionModal;
