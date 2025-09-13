"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var useReportUnreadMessageScrollTracking_1 = require("@pages/home/report/useReportUnreadMessageScrollTracking");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
jest.mock('@userActions/Report', function () {
    return {
        readNewestAction: jest.fn(),
    };
});
jest.mock('@react-navigation/native', function () {
    var actualNav = jest.requireActual('@react-navigation/native');
    return __assign(__assign({}, actualNav), { useIsFocused: jest.fn().mockImplementation(function () { return true; }) });
});
var reportID = '12345';
var readActionRefFalse = { current: false };
var emptyScrollEventMock = {
    nativeEvent: { layoutMeasurement: { height: 0, width: 0 }, contentSize: { width: 100, height: 100 }, contentOffset: { x: 0, y: 0 } },
};
describe('useReportUnreadMessageScrollTracking', function () {
    describe('on init and without any scrolling', function () {
        var onTrackScrollingMockFn = jest.fn();
        it('returns floatingMessage visibility that was set to a new value', function () {
            // Given
            var offsetRef = { current: 0 };
            var _a = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: readActionRefFalse,
                    unreadMarkerReportActionIndex: -1,
                    isInverted: true,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }), result = _a.result, rerender = _a.rerender;
            // When
            (0, react_native_1.act)(function () {
                result.current.setIsFloatingMessageCounterVisible(true);
            });
            rerender({});
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).not.toHaveBeenCalled();
        });
    });
    describe('when scrolling', function () {
        var onTrackScrollingMockFn = jest.fn();
        it('returns floatingMessage visibility as true when scrolling outside of threshold', function () {
            // Given
            var offsetRef = { current: 0 };
            var _a = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: readActionRefFalse,
                    isInverted: true,
                    unreadMarkerReportActionIndex: -1,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }), result = _a.result, rerender = _a.rerender;
            // When
            (0, react_native_1.act)(function () {
                offsetRef.current = CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD + 100;
                result.current.trackVerticalScrolling(emptyScrollEventMock);
            });
            rerender({});
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as true when the unread message is not visible in the view port', function () {
            // Given
            var offsetRef = { current: 0 };
            var result = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: readActionRefFalse,
                    isInverted: true,
                    unreadMarkerReportActionIndex: 1,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }).result;
            // When
            (0, react_native_1.act)(function () {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 1, key: 'reportActions_1', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            // When
            (0, react_native_1.act)(function () {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as false when scrolling inside the threshold', function () {
            // Given
            var offsetRef = { current: 0 };
            var result = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: readActionRefFalse,
                    unreadMarkerReportActionIndex: -1,
                    isInverted: true,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }).result;
            // When
            (0, react_native_1.act)(function () {
                offsetRef.current = CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD - 100;
                result.current.trackVerticalScrolling(emptyScrollEventMock);
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('returns floatingMessage visibility as false when unread message is visible', function () {
            // Given
            var offsetRef = { current: 0 };
            var result = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: readActionRefFalse,
                    unreadMarkerReportActionIndex: 1,
                    isInverted: true,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }).result;
            // When
            (0, react_native_1.act)(function () {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            (0, react_native_1.act)(function () {
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 1, key: 'reportActions_1', isViewable: true, item: {} }], changed: [] });
            });
            // Then
            expect(result.current.isFloatingMessageCounterVisible).toBe(false);
            expect(onTrackScrollingMockFn).toHaveBeenCalledWith(emptyScrollEventMock);
        });
        it('calls readAction when scrolling to an extent the unread message is visible and read action skipped is true', function () {
            // Given
            var offsetRef = { current: 0 };
            var result = (0, react_native_1.renderHook)(function () {
                return (0, useReportUnreadMessageScrollTracking_1.default)({
                    reportID: reportID,
                    currentVerticalScrollingOffsetRef: offsetRef,
                    readActionSkippedRef: { current: true },
                    unreadMarkerReportActionIndex: 1,
                    isInverted: true,
                    onTrackScrolling: onTrackScrollingMockFn,
                });
            }).result;
            // When
            (0, react_native_1.act)(function () {
                // if unread action is not visible, the floating button will be visible
                result.current.onViewableItemsChanged({ viewableItems: [{ index: 2, key: 'reportActions_2', isViewable: true, item: {} }], changed: [] });
            });
            expect(result.current.isFloatingMessageCounterVisible).toBe(true);
            expect(Report_1.readNewestAction).toHaveBeenCalledTimes(0);
            (0, react_native_1.act)(function () {
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
