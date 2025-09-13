"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Category = require("@src/libs/actions/Policy/Category");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const policyCategory_1 = require("../utils/collections/policyCategory");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/PolicyCategory', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('setWorkspaceRequiresCategory', () => {
        it('Enable require category', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.requiresCategory = false;
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            Category.setWorkspaceRequiresCategory(fakePolicy.id, true);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Check if policy requiresCategory was updated with correct values
                        expect(policy?.requiresCategory).toBeTruthy();
                        expect(policy?.pendingFields?.requiresCategory).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.errors?.requiresCategory).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Check if the policy pendingFields was cleared
                        expect(policy?.pendingFields?.requiresCategory).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('createWorkspaceCategories', () => {
        it('Create a new policy category', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeCategories = (0, policyCategory_1.default)(3);
            const newCategoryName = 'New category';
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`, fakeCategories);
            Category.createPolicyCategory(fakePolicy.id, newCategoryName);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newCategory = policyCategories?.[newCategoryName];
                        expect(newCategory?.name).toBe(newCategoryName);
                        expect(newCategory?.errors).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newCategory = policyCategories?.[newCategoryName];
                        expect(newCategory?.errors).toBeFalsy();
                        expect(newCategory?.pendingAction).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('renameWorkspaceCategory', () => {
        it('Rename category', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeCategories = (0, policyCategory_1.default)(3);
            const oldCategoryName = Object.keys(fakeCategories).at(0);
            const newCategoryName = 'Updated category';
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`, fakeCategories);
            Category.renamePolicyCategory(fakePolicy.id, {
                oldName: oldCategoryName ?? '',
                newName: newCategoryName,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[oldCategoryName ?? '']).toBeFalsy();
                        expect(policyCategories?.[newCategoryName]?.name).toBe(newCategoryName);
                        expect(policyCategories?.[newCategoryName]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policyCategories?.[newCategoryName]?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[newCategoryName]?.pendingAction).toBeFalsy();
                        expect(policyCategories?.[newCategoryName]?.pendingFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('setWorkspaceCategoriesEnabled', () => {
        it('Enable category', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeCategories = (0, policyCategory_1.default)(3);
            const categoryNameToUpdate = Object.keys(fakeCategories).at(0) ?? '';
            const categoriesToUpdate = {
                [categoryNameToUpdate]: {
                    name: categoryNameToUpdate,
                    enabled: true,
                },
            };
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`, fakeCategories);
            Category.setWorkspaceCategoryEnabled(fakePolicy.id, categoriesToUpdate);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[categoryNameToUpdate]?.enabled).toBeTruthy();
                        expect(policyCategories?.[categoryNameToUpdate]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policyCategories?.[categoryNameToUpdate]?.pendingFields?.enabled).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policyCategories?.[categoryNameToUpdate]?.errors).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[categoryNameToUpdate]?.pendingAction).toBeFalsy();
                        expect(policyCategories?.[categoryNameToUpdate]?.pendingFields?.enabled).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('deleteWorkspaceCategories', () => {
        it('Delete category', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeCategories = (0, policyCategory_1.default)(3);
            const categoryNameToDelete = Object.keys(fakeCategories).at(0) ?? '';
            const categoriesToDelete = [categoryNameToDelete];
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`, fakeCategories);
            Category.deleteWorkspaceCategories(fakePolicy.id, categoriesToDelete);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[categoryNameToDelete]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyCategories) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyCategories?.[categoryNameToDelete]).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
});
