"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const usePopoverPosition_1 = require("@hooks/usePopoverPosition");
const CONST_1 = require("@src/CONST");
// Mock responsive layout to control small/large screen behavior
let mockIsSmallScreenWidth = false;
jest.mock('@hooks/useResponsiveLayout', () => () => ({ isSmallScreenWidth: mockIsSmallScreenWidth }));
const createAnchorRef = (x, y, width, height) => {
    const measureInWindow = (callback) => callback(x, y, width, height);
    return { current: { measureInWindow } };
};
describe('usePopoverPosition', () => {
    beforeEach(() => {
        mockIsSmallScreenWidth = false;
    });
    it('returns zeros on small screens', async () => {
        mockIsSmallScreenWidth = true;
        const { result } = (0, react_native_1.renderHook)(() => (0, usePopoverPosition_1.default)());
        const anchorRef = createAnchorRef(10, 20, 100, 50);
        let position;
        await (0, react_native_1.act)(async () => {
            position = await result.current.calculatePopoverPosition(anchorRef);
        });
        expect(position).toEqual({ horizontal: 0, vertical: 0, width: 0, height: 0 });
    });
    it('computes default RIGHT/TOP alignment', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, usePopoverPosition_1.default)());
        const anchorRef = createAnchorRef(10, 20, 100, 50);
        // Default: RIGHT/TOP → horizontal = x + width, vertical = y + height + padding
        let position;
        await (0, react_native_1.act)(async () => {
            position = await result.current.calculatePopoverPosition(anchorRef);
        });
        expect(position).toEqual({
            horizontal: 10 + 100,
            vertical: 20 + 50 + CONST_1.default.MODAL.POPOVER_MENU_PADDING,
            width: 100,
            height: 50,
        });
    });
    it('computes LEFT/TOP alignment', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, usePopoverPosition_1.default)());
        const anchorRef = createAnchorRef(5, 8, 40, 20);
        let position;
        await (0, react_native_1.act)(async () => {
            position = await result.current.calculatePopoverPosition(anchorRef, {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            });
        });
        expect(position).toEqual({
            horizontal: 5,
            vertical: 8 + 20 + CONST_1.default.MODAL.POPOVER_MENU_PADDING,
            width: 40,
            height: 20,
        });
    });
    it('computes CENTER/BOTTOM alignment', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, usePopoverPosition_1.default)());
        const anchorRef = createAnchorRef(0, 100, 60, 30);
        let position;
        await (0, react_native_1.act)(async () => {
            position = await result.current.calculatePopoverPosition(anchorRef, {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            });
        });
        expect(position).toEqual({
            horizontal: 0 + 60 / 2,
            vertical: 100 - CONST_1.default.MODAL.POPOVER_MENU_PADDING,
            width: 60,
            height: 30,
        });
    });
});
