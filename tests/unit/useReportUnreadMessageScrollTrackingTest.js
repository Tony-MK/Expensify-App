"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const useReportUnreadMessageScrollTracking_1 = require("@pages/home/report/useReportUnreadMessageScrollTracking");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
jest.mock('@userActions/Report', () => {
    return {
        readNewestAction: jest.fn(),
    };
});
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: jest.fn().mockImplementation(() => true),
    };
});
const reportID = '12345';
const readActionRefFalse = { current: false };
const emptyScrollEventMock = {
    nativeEvent: { layoutMeasurement: { height: 0, width: 0 }, contentSize: { width: 100, height: 100 }, contentOffset: { x: 0, y: 0 } },
};
describe('useReportUnreadMessageScrollTracking', () => {
    describe('on init and without any scrolling', () => {
        const onTrackScrollingMockFn = jest.fn();
        it('returns floatingMessage visibility that was set to a new value', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: readActionRefFalse,
                unreadMarkerReportActionIndex: -1,
                isInverted: true,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                result.current.setIsFloatingMessageCounterVisible(true);
            });
            rerender({});
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).not.toHaveBeenCalled();
        });
    });
    describe('when scrolling', () => {
        const onTrackScrollingMockFn = jest.fn();
        it('returns floatingMessage visibility as true when scrolling outside of threshold', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: readActionRefFalse,
                isInverted: true,
                unreadMarkerReportActionIndex: -1,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                offsetRef.current = CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD + 100;
                result.current.trackVerticalScrolling(emptyScrollEventMock);
            });
            rerender({});
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as true when the unread message is not visible in the view port', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: readActionRefFalse,
                isInverted: true,
                unreadMarkerReportActionIndex: 1,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 1, key: 'reportActions_1', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            // When
            (0, react_native_1.act)(() => {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as false when scrolling inside the threshold', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: readActionRefFalse,
                unreadMarkerReportActionIndex: -1,
                isInverted: true,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                offsetRef.current = CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD - 100;
                result.current.trackVerticalScrolling(emptyScrollEventMock);
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as false when unread message is visible', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: readActionRefFalse,
                unreadMarkerReportActionIndex: 1,
                isInverted: true,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            (0, react_native_1.act)(() => {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 1, key: 'reportActions_1', isViewable: true, item: {} }], changed: [] });
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('calls readAction when scrolling to an extent the unread message is visible and read action skipped is true', () => {
            // Given
            const offsetRef = { current: 0 };
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportUnreadMessageScrollTracking_1.default)({
                reportID,
                currentVerticalScrollingOffsetRef: offsetRef,
                readActionSkippedRef: { current: true },
                unreadMarkerReportActionIndex: 1,
                isInverted: true,
                onTrackScrolling: onTrackScrollingMockFn,
            }));
            // When
            (0, react_native_1.act)(() => {
                // if unread action is not visible, the floating button will be visible
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(Report_1.readNewestAction).toHaveBeenCalledTimes(0);
            (0, react_native_1.act)(() => {
                // scrolling so that the unread action is visible, should call readNewestAction
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 1, key: 'reportActions_1', isViewable: true, item: {} }], changed: [] });
            });
            // Then
            expect(Report_1.readNewestAction).toHaveBeenCalledTimes(1);
            expect(readActionRefFalse.current).toBe(false);
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
        });
    });
});
