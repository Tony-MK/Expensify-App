"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const CONST_1 = require("@src/CONST");
const usePermissions_1 = require("@src/hooks/usePermissions");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
function Wrapper({ children }) {
    return <OnyxListItemProvider_1.default>{children}</OnyxListItemProvider_1.default>;
}
describe('usePermissions', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    it('should handle empty betas gracefully via Onyx', async () => {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, []);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const { result } = (0, react_native_1.renderHook)(() => (0, usePermissions_1.default)(), { wrapper: Wrapper });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.ALL)).toBe(false);
    });
    it('should return correct permissions when betas are provided via Onyx', async () => {
        const mockBetas = [CONST_1.default.BETAS.ALL];
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, mockBetas);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const { result } = (0, react_native_1.renderHook)(() => (0, usePermissions_1.default)(), { wrapper: Wrapper });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Ensure result.current is not null or undefined before accessing properties
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.ALL)).toBe(true);
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL)).toBe(true);
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS)).toBe(true);
    });
    it('should react to updates in Betas context via Onyx and give correct value for isBetaEnabled', async () => {
        const initialBetas = [CONST_1.default.BETAS.DEFAULT_ROOMS, CONST_1.default.BETAS.PER_DIEM, CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL];
        const updatedBetas = [CONST_1.default.BETAS.ALL];
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, initialBetas);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const { result } = (0, react_native_1.renderHook)(() => (0, usePermissions_1.default)(), { wrapper: Wrapper });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Initially, check the value for the initial betas
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS)).toBe(true);
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL)).toBe(true);
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.ALL)).toBe(false);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.BETAS, updatedBetas);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // After update, check the value for the updated betas
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL)).toBe(true);
        expect(result.current.isBetaEnabled(CONST_1.default.BETAS.ALL)).toBe(true);
    });
    it('should handle explicit only and exclusion betas correctly', async () => {
        // Given: A beta configuration with both explicit only and exclusion betas
        const explicitOnlyBeta = CONST_1.default.BETAS.MANUAL_DISTANCE;
        const exclusionBeta = CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL;
        const betaConfiguration = {
            explicitOnly: [explicitOnlyBeta],
            exclusion: [exclusionBeta],
        };
        // Test explicit only beta behavior
        // Given: Account with 'all' beta enabled, but not the explicit only beta
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, [CONST_1.default.BETAS.ALL]);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETA_CONFIGURATION, betaConfiguration);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const { result } = (0, react_native_1.renderHook)(() => (0, usePermissions_1.default)(), { wrapper: Wrapper });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When: Checking if the account is in the explicit only beta
        // Then: The beta check should return false because explicit-only betas override the 'all' beta
        expect(result.current.isBetaEnabled(explicitOnlyBeta)).toBe(false);
        // Given: The explicit only beta is explicitly enabled
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, [CONST_1.default.BETAS.ALL, explicitOnlyBeta]);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When: Checking if the account is in the explicit only beta
        // Then: The beta check should return true because the beta is explicitly enabled
        expect(result.current.isBetaEnabled(explicitOnlyBeta)).toBe(true);
        // Test exclusion beta behavior
        // Given: Account with 'all' beta enabled, but not the exclusion beta
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, [CONST_1.default.BETAS.ALL]);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When: Checking if the account is in the exclusion beta
        // Then: The beta check should return false because exclusion betas are not enabled by 'all' beta
        expect(result.current.isBetaEnabled(exclusionBeta)).toBe(false);
        // Given: The exclusion beta is explicitly enabled
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, [CONST_1.default.BETAS.ALL, exclusionBeta]);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When: Checking if the account is in the exclusion beta
        // Then: The beta check should return true because the beta is explicitly enabled
        expect(result.current.isBetaEnabled(exclusionBeta)).toBe(true);
        // Given: Neither 'all' nor the exclusion beta are enabled
        react_native_onyx_1.default.set(ONYXKEYS_1.default.BETAS, []);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When: Checking if the account is in the exclusion beta
        // Then: The beta check should return false since neither beta is enabled
        expect(result.current.isBetaEnabled(exclusionBeta)).toBe(false);
    });
});
