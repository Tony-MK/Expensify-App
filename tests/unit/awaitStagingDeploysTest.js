"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const core = require("@actions/core");
const awaitStagingDeploys_1 = require("@github/actions/javascript/awaitStagingDeploys/awaitStagingDeploys");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const asMutable_1 = require("@src/types/utils/asMutable");
// Lower poll rate to speed up tests
const TEST_POLL_RATE = 1;
const COMPLETED_WORKFLOW = { status: 'completed' };
const INCOMPLETE_WORKFLOW = { status: 'in_progress' };
const consoleSpy = jest.spyOn(console, 'log');
const mockGetInput = jest.fn();
const mockListDeploysForTag = jest.fn();
const mockListDeploys = jest.fn();
const mockListPreDeploys = jest.fn();
const mockListWorkflowRuns = jest.fn().mockImplementation((args) => {
    const defaultReturn = Promise.resolve({ data: { workflow_runs: [] } });
    if (!args.workflow_id) {
        return defaultReturn;
    }
    if (args.branch !== undefined) {
        return mockListDeploysForTag();
    }
    if (args.workflow_id === 'deploy.yml') {
        return mockListDeploys();
    }
    if (args.workflow_id === 'preDeploy.yml') {
        return mockListPreDeploys();
    }
    return defaultReturn;
});
jest.mock('@github/libs/CONST', () => ({
    ...jest.requireActual('@github/libs/CONST'),
    POLL_RATE: TEST_POLL_RATE,
}));
beforeAll(() => {
    // Mock core module
    (0, asMutable_1.default)(core).getInput = mockGetInput;
    // Mock octokit module
    const mockOctokit = {
        rest: {
            actions: {
                ...GithubUtils_1.default.internalOctokit,
                listWorkflowRuns: mockListWorkflowRuns,
            },
        },
    };
    GithubUtils_1.default.internalOctokit = mockOctokit;
});
beforeEach(() => {
    consoleSpy.mockClear();
});
describe('awaitStagingDeploys', () => {
    test('Should wait for all running staging deploys to finish', () => {
        mockGetInput.mockImplementation(() => undefined);
        // First ping
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, INCOMPLETE_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [],
            },
        });
        // Second ping
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, COMPLETED_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [],
            },
        });
        // Third ping
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, COMPLETED_WORKFLOW, COMPLETED_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW],
            },
        });
        // Fourth ping
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, COMPLETED_WORKFLOW, COMPLETED_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW],
            },
        });
        return (0, awaitStagingDeploys_1.default)().then(() => {
            expect(consoleSpy).toHaveBeenCalledTimes(4);
            expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Found 2 staging deploys still running...');
            expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Found 1 staging deploy still running...');
            expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Found 1 staging deploy still running...');
            expect(consoleSpy).toHaveBeenLastCalledWith('No current staging deploys found');
        });
    });
    test('Should only wait for a specific staging deploy to finish', () => {
        mockGetInput.mockImplementation(() => 'my-tag');
        // First ping
        mockListDeploysForTag.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW],
            },
        });
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        // Second ping
        mockListDeploysForTag.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW],
            },
        });
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW, COMPLETED_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, COMPLETED_WORKFLOW],
            },
        });
        // Third ping
        mockListDeploysForTag.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW],
            },
        });
        mockListDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [INCOMPLETE_WORKFLOW, COMPLETED_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        mockListPreDeploys.mockResolvedValueOnce({
            data: {
                workflow_runs: [COMPLETED_WORKFLOW, COMPLETED_WORKFLOW, INCOMPLETE_WORKFLOW],
            },
        });
        return (0, awaitStagingDeploys_1.default)().then(() => {
            expect(consoleSpy).toHaveBeenCalledTimes(3);
            expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Found 1 staging deploy still running...');
            expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Found 1 staging deploy still running...');
            expect(consoleSpy).toHaveBeenLastCalledWith('No current staging deploys found');
        });
    });
});
