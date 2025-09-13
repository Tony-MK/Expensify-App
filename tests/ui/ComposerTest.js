"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const Composer_1 = require("@components/Composer");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const RNMarkdownTextInput_1 = require("@components/RNMarkdownTextInput");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@components/RNMarkdownTextInput', () => {
    return jest.fn().mockImplementation(() => null);
});
describe('Composer', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
    });
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    it('should show large emoji size if only has header markdown + emoji', async () => {
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <Composer_1.default value="# 😄"/>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        const props = RNMarkdownTextInput_1.default.mock.calls.at(0)?.at(0);
        expect(props).toEqual(expect.objectContaining({
            markdownStyle: expect.objectContaining({
                emoji: expect.objectContaining({
                    fontSize: variables_1.default.fontSizeOnlyEmojis,
                }),
            }),
        }));
    });
});
