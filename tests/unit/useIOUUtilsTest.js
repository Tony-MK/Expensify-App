"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const useIOUUtils_1 = require("@src/hooks/useIOUUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
describe('useIOUUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    describe('shouldStartLocationPermissionFlow', () => {
        const now = new Date();
        const daysAgo = (days) => {
            const d = new Date(now);
            d.setDate(d.getDate() - days);
            return d.toISOString();
        };
        it('returns true when lastLocationPermissionPrompt is undefined', async () => {
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
        });
        it('returns true when lastLocationPermissionPrompt is null', async () => {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, null);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
        });
        it('returns true when lastLocationPermissionPrompt is empty string', async () => {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, '');
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
        });
        it('returns false when lastLocationPermissionPrompt is a valid date string within threshold', async () => {
            const recentDate = daysAgo(CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS - 1);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, recentDate);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(false);
        });
        it('returns true when lastLocationPermissionPrompt is a valid date string outside threshold', async () => {
            const oldDate = daysAgo(CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS + 1);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, oldDate);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
        });
        it('returns false when lastLocationPermissionPrompt is an invalid date string', async () => {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, 'not-a-date');
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(false);
        });
        it('returns false when lastLocationPermissionPrompt is exactly at threshold', async () => {
            const thresholdDate = daysAgo(CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, thresholdDate);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(false);
        });
        it('reacts to changes in lastLocationPermissionPrompt', async () => {
            const { result } = (0, react_native_1.renderHook)(() => (0, useIOUUtils_1.default)());
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
            const recentDate = daysAgo(CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS - 1);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, recentDate);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(false);
            const oldDate = daysAgo(CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS + 1);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, oldDate);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current.shouldStartLocationPermissionFlow()).toBe(true);
        });
    });
});
