"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useLocationBias_1 = require("@hooks/useLocationBias");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const variables_1 = require("@styles/variables");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
// Only grab the most recent 20 waypoints because that's all that is shown in the UI. This also puts them into the format of data
// that the google autocomplete component expects for it's "predefined places" feature.
function recentWaypointsSelector(waypoints = []) {
    return waypoints
        .slice(0, CONST_1.default.RECENT_WAYPOINTS_NUMBER)
        .filter((waypoint) => waypoint.keyForList?.includes(CONST_1.default.YOUR_LOCATION_TEXT) !== true)
        .map((waypoint) => ({
        name: waypoint.name,
        description: waypoint.address ?? '',
        geometry: {
            location: {
                lat: waypoint.lat ?? 0,
                lng: waypoint.lng ?? 0,
            },
        },
    }));
}
function IOURequestStepWaypoint({ route: { params: { action, backTo, iouType, pageIndex, reportID, transactionID }, }, transaction, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isDeleteStopModalOpen, setIsDeleteStopModalOpen] = (0, react_1.useState)(false);
    const [restoreFocusType, setRestoreFocusType] = (0, react_1.useState)();
    const navigation = (0, native_1.useNavigation)();
    const isFocused = navigation.isFocused();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const parsedWaypointIndex = parseInt(pageIndex, 10);
    const allWaypoints = transaction?.comment?.waypoints ?? {};
    const currentWaypoint = allWaypoints[`waypoint${pageIndex}`] ?? {};
    const waypointCount = Object.keys(allWaypoints).length;
    const filledWaypointCount = Object.values(allWaypoints).filter((waypoint) => !(0, EmptyObject_1.isEmptyObject)(waypoint)).length;
    const [caretHidden, setCaretHidden] = (0, react_1.useState)(false);
    const [userLocation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_LOCATION, { canBeMissing: true });
    const [recentWaypoints] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS, { selector: recentWaypointsSelector, canBeMissing: true });
    const waypointDescriptionKey = (0, react_1.useMemo)(() => {
        switch (parsedWaypointIndex) {
            case 0:
                return 'distance.waypointDescription.start';
            default:
                return 'distance.waypointDescription.stop';
        }
    }, [parsedWaypointIndex]);
    const locationBias = (0, useLocationBias_1.default)(allWaypoints, userLocation);
    const waypointAddress = currentWaypoint.address ?? '';
    // Hide the menu when there is only start and finish waypoint
    const shouldShowThreeDotsButton = waypointCount > 2 && !!waypointAddress;
    const shouldDisableEditor = isFocused &&
        (Number.isNaN(parsedWaypointIndex) || parsedWaypointIndex < 0 || parsedWaypointIndex > waypointCount || (filledWaypointCount < 2 && parsedWaypointIndex >= waypointCount));
    const goBack = () => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID));
    };
    const validate = (values) => {
        const errors = {};
        const waypointValue = values[`waypoint${pageIndex}`] ?? '';
        if (isOffline && waypointValue !== '' && !(0, ValidationUtils_1.isValidAddress)(waypointValue)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, `waypoint${pageIndex}`, translate('bankAccount.error.address'));
        }
        // If the user is online, and they are trying to save a value without using the autocomplete, show an error message instructing them to use a selected address instead.
        // That enables us to save the address with coordinates when it is selected
        if (!isOffline && waypointValue !== '' && waypointAddress !== waypointValue) {
            (0, ErrorUtils_1.addErrorMessage)(errors, `waypoint${pageIndex}`, translate('distance.error.selectSuggestedAddress'));
        }
        return errors;
    };
    const save = (waypoint) => (0, Transaction_1.saveWaypoint)(transactionID, pageIndex, waypoint, (0, IOUUtils_1.shouldUseTransactionDraft)(action));
    const submit = (values) => {
        const waypointValue = values[`waypoint${pageIndex}`] ?? '';
        // Allows letting you set a waypoint to an empty value
        if (waypointValue === '') {
            (0, Transaction_1.removeWaypoint)(transaction, pageIndex, (0, IOUUtils_1.shouldUseTransactionDraft)(action));
        }
        // While the user is offline, the auto-complete address search will not work
        // Therefore, we're going to save the waypoint as just the address, and the lat/long will be filled in on the backend
        if (isOffline && waypointValue) {
            const waypoint = {
                address: waypointValue ?? '',
                name: values.name ?? '',
                lat: values.lat ?? 0,
                lng: values.lng ?? 0,
                keyForList: `${(values.name ?? 'waypoint')}_${Date.now()}`,
            };
            save(waypoint);
        }
        // Other flows will be handled by selecting a waypoint with selectWaypoint as this is mainly for the offline flow
        goBack();
    };
    const deleteStopAndHideModal = () => {
        (0, Transaction_1.removeWaypoint)(transaction, pageIndex, (0, IOUUtils_1.shouldUseTransactionDraft)(action));
        setRestoreFocusType(CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE);
        setIsDeleteStopModalOpen(false);
        goBack();
    };
    const selectWaypoint = (values) => {
        const waypoint = {
            lat: values.lat ?? 0,
            lng: values.lng ?? 0,
            address: values.address ?? '',
            name: values.name ?? '',
            keyForList: `${values.name ?? 'waypoint'}_${Date.now()}`,
        };
        (0, Transaction_1.saveWaypoint)(transactionID, pageIndex, waypoint, (0, IOUUtils_1.shouldUseTransactionDraft)(action));
        goBack();
    };
    const onScroll = (0, react_1.useCallback)(() => {
        if (!(0, Browser_1.isSafari)()) {
            return;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        textInput.current?.measureInWindow((x, y) => {
            if (y < variables_1.default.contentHeaderHeight) {
                setCaretHidden(true);
            }
            else {
                setCaretHidden(false);
            }
        });
    }, []);
    const resetCaretHiddenValue = (0, react_1.useCallback)(() => {
        setCaretHidden(false);
    }, []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom onEntryTransitionEnd={() => textInput.current?.focus()} shouldEnableMaxHeight testID={IOURequestStepWaypoint.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldDisableEditor}>
                <HeaderWithBackButton_1.default title={translate(waypointDescriptionKey)} shouldShowBackButton onBackButtonPress={goBack} shouldShowThreeDotsButton={shouldShowThreeDotsButton} shouldSetModalVisibility={false} threeDotsMenuItems={[
            {
                icon: Expensicons.Trashcan,
                text: translate('distance.deleteWaypoint'),
                onSelected: () => {
                    setRestoreFocusType(undefined);
                    setIsDeleteStopModalOpen(true);
                },
                shouldCallAfterModalHide: true,
            },
        ]}/>
                <ConfirmModal_1.default title={translate('distance.deleteWaypoint')} isVisible={isDeleteStopModalOpen} onConfirm={deleteStopAndHideModal} onCancel={() => setIsDeleteStopModalOpen(false)} shouldSetModalVisibility={false} prompt={translate('distance.deleteWaypointConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} shouldEnableNewFocusManagement danger restoreFocusType={restoreFocusType}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.WAYPOINT_FORM} enabledWhenOffline validate={validate} onSubmit={submit} shouldValidateOnChange={false} shouldValidateOnBlur={false} submitButtonText={translate('common.save')} shouldHideFixErrorsAlert onScroll={onScroll}>
                    <react_native_1.View>
                        <InputWrapper_1.default InputComponent={AddressSearch_1.default} locationBias={locationBias} canUseCurrentLocation inputID={`waypoint${pageIndex}`} ref={(e) => {
            textInput.current = e;
        }} hint={!isOffline ? translate('distance.error.selectSuggestedAddress') : ''} containerStyles={[styles.mt4]} label={translate('distance.address')} defaultValue={waypointAddress} onPress={selectWaypoint} maxInputLength={CONST_1.default.FORM_CHARACTER_LIMIT} renamedInputKeys={{
            address: `waypoint${pageIndex}`,
            city: '',
            country: '',
            street: '',
            street2: '',
            zipCode: '',
            lat: '',
            lng: '',
            state: '',
        }} predefinedPlaces={recentWaypoints} resultTypes="" caretHidden={caretHidden} onValueChange={resetCaretHiddenValue}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
IOURequestStepWaypoint.displayName = 'IOURequestStepWaypoint';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepWaypoint), true);
