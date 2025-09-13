"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const core = require("@actions/core");
const isStagingDeployLocked_1 = require("../../.github/actions/javascript/isStagingDeployLocked/isStagingDeployLocked");
const GithubUtils_1 = require("../../.github/libs/GithubUtils");
// Mock the entire GithubUtils module
jest.mock('../../.github/libs/GithubUtils');
beforeAll(() => {
    // Mock required GITHUB_TOKEN
    process.env.INPUT_GITHUB_TOKEN = 'fake_token';
});
beforeEach(() => {
    // Reset mocks before each test
    jest.resetModules();
});
afterAll(() => {
    // Remove mock GITHUB_TOKEN
    delete process.env.INPUT_GITHUB_TOKEN;
});
describe('isStagingDeployLockedTest', () => {
    describe('GitHub action run function', () => {
        test('Test returning empty result', () => {
            // Mock the return value of GithubUtils.getStagingDeployCash() to return an empty object
            GithubUtils_1.default.getStagingDeployCash = jest.fn().mockResolvedValue({});
            const setOutputMock = jest.spyOn(core, 'setOutput');
            const isStagingDeployLocked = (0, isStagingDeployLocked_1.default)();
            return isStagingDeployLocked.then(() => {
                expect(setOutputMock).toHaveBeenCalledWith('IS_LOCKED', false);
            });
        });
        test('Test returning valid locked issue', () => {
            // Mocking the minimum amount of data required for a found issue with the correct label
            const mockData = {
                labels: [{ name: '🔐 LockCashDeploys 🔐' }],
            };
            // Mock the return value of GithubUtils.getStagingDeployCash() to return the correct label
            GithubUtils_1.default.getStagingDeployCash = jest.fn().mockResolvedValue(mockData);
            const setOutputMock = jest.spyOn(core, 'setOutput');
            const isStagingDeployLocked = (0, isStagingDeployLocked_1.default)();
            return isStagingDeployLocked.then(() => {
                expect(setOutputMock).toHaveBeenCalledWith('IS_LOCKED', true);
            });
        });
    });
});
