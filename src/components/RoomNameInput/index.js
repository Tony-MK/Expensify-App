"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const RoomNameInputUtils_1 = require("@libs/RoomNameInputUtils");
const CONST_1 = require("@src/CONST");
function RoomNameInput({ disabled = false, autoFocus = false, isFocused, value = '', onBlur, onChangeText, onInputChange, ...props }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const [selection, setSelection] = (0, react_1.useState)({ start: value.length - 1, end: value.length - 1 });
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
        // Prevent cursor jump behaviour:
        // Check if newRoomNameWithHash is the same as modifiedRoomName
        // If it is, then the room name is valid (does not contain forbidden characters) – no action required
        // If not, then the room name contains invalid characters, and we must adjust the cursor position manually
        // Read more: https://github.com/Expensify/App/issues/12741
        const oldRoomNameWithHash = value ?? '';
        const newRoomNameWithHash = `${CONST_1.default.POLICY.ROOM_PREFIX}${roomName}`;
        if (modifiedRoomName !== newRoomNameWithHash) {
            const offset = modifiedRoomName.length - oldRoomNameWithHash.length;
            const newCursorPosition = selection.end + offset;
            setSelection({ start: newCursorPosition, end: newCursorPosition });
        }
    };
    return (<TextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} disabled={disabled} label={translate('newRoomPage.roomName')} accessibilityLabel={translate('newRoomPage.roomName')} role={CONST_1.default.ROLE.PRESENTATION} prefixCharacter={CONST_1.default.POLICY.ROOM_PREFIX} placeholder={translate('newRoomPage.social')} value={value?.substring(1)} // Since the room name always starts with a prefix, we omit the first character to avoid displaying it twice.
     onBlur={(event) => isFocused && onBlur?.(event)} autoFocus={isFocused && autoFocus} autoCapitalize="none" onChange={setModifiedRoomName} onSelectionChange={(event) => setSelection(event.nativeEvent.selection)} selection={selection} spellCheck={false} shouldInterceptSwipe/>);
}
RoomNameInput.displayName = 'RoomNameInput';
exports.default = react_1.default.forwardRef(RoomNameInput);
