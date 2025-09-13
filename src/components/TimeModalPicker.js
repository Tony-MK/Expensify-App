"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
const Modal_1 = require("./Modal");
const ScreenWrapper_1 = require("./ScreenWrapper");
const TimePicker_1 = require("./TimePicker/TimePicker");
function TimeModalPicker({ value, errorText, label, onInputChange = () => { } }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const currentTime = value ? DateUtils_1.default.extractTime12Hour(value) : undefined;
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (time) => {
        const newTime = DateUtils_1.default.combineDateAndTime(time, value ?? '');
        onInputChange?.(newTime);
        hidePickerModal();
    };
    return (<>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={currentTime} description={label} onPress={() => setIsPickerVisible(true)} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} ref={ref}/>
            <Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isPickerVisible} onClose={hidePickerModal} onModalHide={hidePickerModal} enableEdgeToEdgeBottomSafeAreaPadding>
                <ScreenWrapper_1.default style={styles.pb0} includePaddingTop={false} includeSafeAreaPaddingBottom testID={TimeModalPicker.displayName}>
                    <HeaderWithBackButton_1.default title={label} onBackButtonPress={hidePickerModal}/>
                    <react_native_1.View style={styles.flex1}>
                        <TimePicker_1.default defaultValue={value} onSubmit={updateInput} shouldValidateFutureTime={false}/>
                    </react_native_1.View>
                </ScreenWrapper_1.default>
            </Modal_1.default>
        </>);
}
TimeModalPicker.displayName = 'TimeModalPicker';
exports.default = (0, react_1.forwardRef)(TimeModalPicker);
