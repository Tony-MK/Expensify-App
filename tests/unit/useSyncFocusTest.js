"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const useSyncFocusImplementation_1 = require("@hooks/useSyncFocus/useSyncFocusImplementation");
describe('useSyncFocus', () => {
    it('useSyncFocus should only focus if shouldSyncFocus is true', () => {
        const refMock = { current: { focus: jest.fn() } };
        // When useSyncFocus is rendered initially while shouldSyncFocus is false.
        const { rerender } = (0, react_native_1.renderHook)(({ ref = refMock, isFocused = true, shouldSyncFocus = false, }) => (0, useSyncFocusImplementation_1.default)(ref, isFocused, shouldSyncFocus), { initialProps: {} });
        // Then the ref focus will not be called.
        expect(refMock.current.focus).not.toHaveBeenCalled();
        rerender({ isFocused: false });
        expect(refMock.current.focus).not.toHaveBeenCalled();
        // When shouldSyncFocus and isFocused are true
        rerender({ isFocused: true, shouldSyncFocus: true });
        // Then the ref focus will be called.
        expect(refMock.current.focus).toHaveBeenCalled();
    });
});
