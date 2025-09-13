"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_permissions_1 = require("react-native-permissions");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const LocationPermission_1 = require("@pages/iou/request/step/IOURequestStepScan/LocationPermission");
function LocationPermissionModal({ startPermissionFlow, resetPermissionFlow, onDeny, onGrant, onInitialGetLocationCompleted }) {
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
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
        if (hasError && react_native_1.Linking.openSettings) {
            react_native_1.Linking.openSettings();
            setShowModal(false);
            setHasError(false);
            resetPermissionFlow();
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
            else if (status === react_native_permissions_1.RESULTS.BLOCKED) {
                setHasError(true);
                return;
            }
            else {
                onDeny();
            }
            setShowModal(false);
            setHasError(false);
        })
            .finally(() => {
            setIsLoading(false);
        });
    });
    const skipLocationPermission = () => {
        onDeny();
        setShowModal(false);
        setHasError(false);
    };
    const closeModal = () => {
        setShowModal(false);
        resetPermissionFlow();
    };
    return (<ConfirmModal_1.default isVisible={showModal} onConfirm={grantLocationPermission} onCancel={skipLocationPermission} onBackdropPress={closeModal} confirmText={hasError ? translate('common.settings') : translate('common.continue')} cancelText={translate('common.notNow')} prompt={translate(hasError ? 'receipt.locationErrorMessage' : 'receipt.locationAccessMessage')} promptStyles={[styles.textLabelSupportingEmptyValue, styles.mb4]} title={translate(hasError ? 'receipt.locationErrorTitle' : 'receipt.locationAccessTitle')} titleContainerStyles={[styles.mt2, styles.mb0]} titleStyles={[styles.textHeadline]} iconSource={Illustrations.ReceiptLocationMarker} iconFill={false} iconWidth={140} iconHeight={120} shouldCenterIcon shouldReverseStackedButtons isConfirmLoading={isLoading}/>);
}
LocationPermissionModal.displayName = 'LocationPermissionModal';
exports.default = LocationPermissionModal;
