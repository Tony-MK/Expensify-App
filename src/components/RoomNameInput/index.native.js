"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
const RoomNameInputUtils_1 = require("@libs/RoomNameInputUtils");
const CONST_1 = require("@src/CONST");
function RoomNameInput({ disabled = false, autoFocus = false, isFocused, value, onBlur, onChangeText, onInputChange, ...props }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    /**
     * Calls the onChangeText callback with a modified room name
     */
    const setModifiedRoomName = (event) => {
        const roomName = event.nativeEvent.text;
        const modifiedRoomName = (0, RoomNameInputUtils_1.modifyRoomName)(roomName);
        onChangeText?.(modifiedRoomName);
        // if custom component has onInputChange, use it to trigger changes (Form input)
        if (typeof onInputChange === 'function') {
            onInputChange(modifiedRoomName);
        }
    };
    const keyboardType = (0, getOperatingSystem_1.default)() === CONST_1.default.OS.IOS ? CONST_1.default.KEYBOARD_TYPE.ASCII_CAPABLE : CONST_1.default.KEYBOARD_TYPE.VISIBLE_PASSWORD;
    return (<TextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} disabled={disabled} label={translate('newRoomPage.roomName')} accessibilityLabel={translate('newRoomPage.roomName')} role={CONST_1.default.ROLE.PRESENTATION} prefixCharacter={CONST_1.default.POLICY.ROOM_PREFIX} placeholder={translate('newRoomPage.social')} value={value?.substring(1)} // Since the room name always starts with a prefix, we omit the first character to avoid displaying it twice.
     onBlur={(event) => isFocused && onBlur?.(event)} autoFocus={isFocused && autoFocus} autoCapitalize="none" onChange={setModifiedRoomName} keyboardType={keyboardType} // this is a bit hacky solution to a RN issue https://github.com/facebook/react-native/issues/27449
    />);
}
RoomNameInput.displayName = 'RoomNameInput';
exports.default = react_1.default.forwardRef(RoomNameInput);
