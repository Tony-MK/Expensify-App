"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUpdateManager_1 = require("@libs/actions/OnyxUpdateManager");
const Tag_1 = require("@libs/actions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const policyTags_1 = require("../utils/collections/policyTags");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/Policy', () => {
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
    describe('SetPolicyRequiresTag', () => {
        it('enable require tag', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.requiresTag = false;
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                (0, Tag_1.setPolicyRequiresTag)(fakePolicy.id, true);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // RequiresTag is enabled and pending
                        expect(policy?.requiresTag).toBeTruthy();
                        expect(policy?.pendingFields?.requiresTag).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.pendingFields?.requiresTag).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('disable require tag', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.requiresTag = true;
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                (0, Tag_1.setPolicyRequiresTag)(fakePolicy.id, false);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // RequiresTag is disabled and pending
                        expect(policy?.requiresTag).toBeFalsy();
                        expect(policy?.pendingFields?.requiresTag).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.pendingFields?.requiresTag).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('reset require tag when api returns an error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.requiresTag = true;
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.setPolicyRequiresTag)(fakePolicy.id, false);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.pendingFields?.requiresTag).toBeFalsy();
                        expect(policy?.errors).toBeTruthy();
                        expect(policy?.requiresTag).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
        it('should update required field in policy tag list', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const tagListName = 'Tag';
            fakePolicy.requiresTag = false;
            const fakePolicyTags = (0, policyTags_1.default)(tagListName);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            (0, Tag_1.setPolicyRequiresTag)(fakePolicy.id, true);
            await (0, waitForBatchedUpdates_1.default)();
            let updatePolicyTags;
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                callback: (val) => (updatePolicyTags = val),
            });
            expect(updatePolicyTags?.[tagListName]?.required).toBeTruthy();
        });
    });
    describe('renamePolicyTagList', () => {
        it('rename policy tag list', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const oldTagListName = 'Old tag list name';
            const newTagListName = 'New tag list name';
            const fakePolicyTags = (0, policyTags_1.default)(oldTagListName);
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                (0, Tag_1.renamePolicyTagList)(fakePolicy.id, {
                    oldName: oldTagListName,
                    newName: newTagListName,
                }, fakePolicyTags, Object.values(fakePolicyTags).at(0)?.orderWeight ?? 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Tag list name is updated and pending
                        expect(Object.keys(policyTags?.[oldTagListName] ?? {}).length).toBe(0);
                        expect(policyTags?.[newTagListName]?.name).toBe(newTagListName);
                        expect(policyTags?.[newTagListName]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyTags?.[newTagListName]?.pendingAction).toBeFalsy();
                        expect(Object.keys(policyTags?.[oldTagListName] ?? {}).length).toBe(0);
                        resolve();
                    },
                });
            }));
        });
        it('reset the policy tag list name when api returns error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const oldTagListName = 'Old tag list name';
            const newTagListName = 'New tag list name';
            const fakePolicyTags = (0, policyTags_1.default)(oldTagListName);
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.renamePolicyTagList)(fakePolicy.id, {
                    oldName: oldTagListName,
                    newName: newTagListName,
                }, fakePolicyTags, Object.values(fakePolicyTags).at(0)?.orderWeight ?? 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policyTags?.[newTagListName]).toBeFalsy();
                        expect(policyTags?.[oldTagListName]).toBeTruthy();
                        expect(policyTags?.[oldTagListName]?.errors).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('CreatePolicyTag', () => {
        it('create new policy tag', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const newTagName = 'new tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName);
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                (0, Tag_1.createPolicyTag)(fakePolicy.id, newTagName);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTag = policyTags?.[tagListName]?.tags?.[newTagName];
                        expect(newTag?.name).toBe(newTagName);
                        expect(newTag?.enabled).toBe(true);
                        expect(newTag?.errors).toBeFalsy();
                        expect(newTag?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTag = policyTags?.[tagListName]?.tags?.[newTagName];
                        expect(newTag?.errors).toBeFalsy();
                        expect(newTag?.pendingAction).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('reset new policy tag when api returns error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const newTagName = 'new tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName);
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.createPolicyTag)(fakePolicy.id, newTagName);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTag = policyTags?.[tagListName]?.tags?.[newTagName];
                        expect(newTag?.errors).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('SetPolicyTagsEnabled', () => {
        it('set policy tag enable', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const tagsToUpdate = Object.keys(fakePolicyTags?.[tagListName]?.tags ?? {}).reduce((acc, key) => {
                acc[key] = {
                    name: fakePolicyTags?.[tagListName]?.tags[key].name,
                    enabled: false,
                };
                return acc;
            }, {});
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                (0, Tag_1.setWorkspaceTagEnabled)(fakePolicy.id, tagsToUpdate, 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.keys(tagsToUpdate).forEach((key) => {
                            const updatedTag = policyTags?.[tagListName]?.tags[key];
                            expect(updatedTag?.enabled).toBeFalsy();
                            expect(updatedTag?.errors).toBeFalsy();
                            expect(updatedTag?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                            expect(updatedTag?.pendingFields?.enabled).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        });
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.keys(tagsToUpdate).forEach((key) => {
                            const updatedTag = policyTags?.[tagListName]?.tags[key];
                            expect(updatedTag?.errors).toBeFalsy();
                            expect(updatedTag?.pendingAction).toBeFalsy();
                            expect(updatedTag?.pendingFields?.enabled).toBeFalsy();
                        });
                        resolve();
                    },
                });
            }));
        });
        it('reset policy tag enable when api returns error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const tagsToUpdate = Object.keys(fakePolicyTags?.[tagListName]?.tags ?? {}).reduce((acc, key) => {
                acc[key] = {
                    name: fakePolicyTags?.[tagListName]?.tags[key].name,
                    enabled: false,
                };
                return acc;
            }, {});
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.setWorkspaceTagEnabled)(fakePolicy.id, tagsToUpdate, 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.keys(tagsToUpdate).forEach((key) => {
                            const updatedTag = policyTags?.[tagListName]?.tags[key];
                            expect(updatedTag?.errors).toBeTruthy();
                            expect(updatedTag?.pendingAction).toBeFalsy();
                            expect(updatedTag?.pendingFields?.enabled).toBeFalsy();
                        });
                        resolve();
                    },
                });
            }));
        });
    });
    describe('RenamePolicyTag', () => {
        it('rename policy tag', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const oldTagName = Object.keys(fakePolicyTags?.[tagListName]?.tags).at(0);
            const newTagName = 'New tag';
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                (0, Tag_1.renamePolicyTag)(fakePolicy.id, {
                    oldName: oldTagName ?? '',
                    newName: newTagName,
                }, 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const tags = policyTags?.[tagListName]?.tags;
                        expect(tags?.[oldTagName ?? '']).toBeFalsy();
                        expect(tags?.[newTagName]?.name).toBe(newTagName);
                        expect(tags?.[newTagName]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(tags?.[newTagName]?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const tags = policyTags?.[tagListName]?.tags;
                        expect(tags?.[newTagName]?.pendingAction).toBeFalsy();
                        expect(tags?.[newTagName]?.pendingFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('reset policy tag name when api returns error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const oldTagName = Object.keys(fakePolicyTags?.[tagListName]?.tags).at(0) ?? '';
            const newTagName = 'New tag';
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.renamePolicyTag)(fakePolicy.id, {
                    oldName: oldTagName,
                    newName: newTagName,
                }, 0);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const tags = policyTags?.[tagListName]?.tags;
                        expect(tags?.[newTagName]).toBeFalsy();
                        expect(tags?.[oldTagName]?.errors).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('DeletePolicyTags', () => {
        it('delete policy tag', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const tagsToDelete = Object.keys(fakePolicyTags?.[tagListName]?.tags ?? {});
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                (0, Tag_1.deletePolicyTags)(fakePolicy.id, tagsToDelete);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        tagsToDelete.forEach((tagName) => {
                            expect(policyTags?.[tagListName]?.tags[tagName]?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        });
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        tagsToDelete.forEach((tagName) => {
                            expect(policyTags?.[tagListName]?.tags[tagName]).toBeFalsy();
                        });
                        resolve();
                    },
                });
            }));
        });
        it('reset the deleted policy tag when api returns error', () => {
            const fakePolicy = (0, policies_1.default)(0);
            fakePolicy.areTagsEnabled = true;
            const tagListName = 'Fake tag';
            const fakePolicyTags = (0, policyTags_1.default)(tagListName, 2);
            const tagsToDelete = Object.keys(fakePolicyTags?.[tagListName]?.tags ?? {});
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy)
                .then(() => {
                react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`, fakePolicyTags);
            })
                .then(() => {
                mockFetch?.fail?.();
                (0, Tag_1.deletePolicyTags)(fakePolicy.id, tagsToDelete);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policyTags) => {
                        react_native_onyx_1.default.disconnect(connection);
                        tagsToDelete.forEach((tagName) => {
                            expect(policyTags?.[tagListName]?.tags[tagName].pendingAction).toBeFalsy();
                            expect(policyTags?.[tagListName]?.tags[tagName].errors).toBeTruthy();
                        });
                        resolve();
                    },
                });
            }));
        });
    });
});
