"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ComposeProviders_1 = require("@src/components/ComposeProviders");
const LocaleContextProvider_1 = require("@src/components/LocaleContextProvider");
const withKeyboardState_1 = require("@src/components/withKeyboardState");
const Localize = require("@src/libs/Localize");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportActionCompose_1 = require("@src/pages/home/report/ReportActionCompose/ReportActionCompose");
const LHNTestUtils = require("../utils/LHNTestUtils");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// mock PortalStateContext
jest.mock('@gorhom/portal');
jest.mock('react-native-reanimated', () => ({
    ...jest.requireActual('react-native-reanimated/mock'),
    useAnimatedRef: jest.fn(),
    LayoutAnimationConfig: ({ children }) => children,
    Keyframe: jest.fn().mockImplementation(() => ({
        duration: jest.fn().mockReturnThis(),
        delay: jest.fn().mockReturnThis(),
        easing: jest.fn().mockReturnThis(),
        withCallback: jest.fn().mockReturnThis(),
    })),
}));
jest.mock('../../src/libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
    getReportRHPActiveRoute: jest.fn(),
    isTopmostRouteModalScreen: jest.fn(() => false),
}));
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            addListener: () => jest.fn(),
        }),
        useIsFocused: () => true,
        useNavigationState: () => { },
        useFocusEffect: jest.fn(),
    };
});
jest.mock('@src/libs/actions/EmojiPickerAction', () => {
    const actualEmojiPickerAction = jest.requireActual('@src/libs/actions/EmojiPickerAction');
    return {
        ...actualEmojiPickerAction,
        emojiPickerRef: {
            current: {
                isEmojiPickerVisible: false,
            },
        },
        showEmojiPicker: jest.fn(),
        hideEmojiPicker: jest.fn(),
        isActive: () => true,
    };
});
beforeAll(() => react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
    evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
}));
// Initialize the network key for OfflineWithFeedback
beforeEach(() => {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
});
function ReportActionComposeWrapper() {
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, withKeyboardState_1.KeyboardStateProvider]}>
            <ReportActionCompose_1.default onSubmit={() => jest.fn()} reportID="1" report={LHNTestUtils.getFakeReport()} isComposerFullSize/>
        </ComposeProviders_1.default>);
}
const mockEvent = { preventDefault: jest.fn() };
test('[ReportActionCompose] should render Composer with text input interactions', async () => {
    const scenario = async () => {
        // Query for the composer
        const composer = await react_native_1.screen.findByTestId('composer');
        react_native_1.fireEvent.changeText(composer, '@test');
    };
    await (0, waitForBatchedUpdates_1.default)();
    await (0, reassure_1.measureRenders)(<ReportActionComposeWrapper />, { scenario });
});
test('[ReportActionCompose] should press create button', async () => {
    const scenario = async () => {
        // Query for the create button
        const hintAttachmentButtonText = Localize.translateLocal('common.create');
        const createButton = await react_native_1.screen.findByLabelText(hintAttachmentButtonText);
        react_native_1.fireEvent.press(createButton, mockEvent);
    };
    await (0, waitForBatchedUpdates_1.default)();
    await (0, reassure_1.measureRenders)(<ReportActionComposeWrapper />, { scenario });
});
test('[ReportActionCompose] should press send message button', async () => {
    const scenario = async () => {
        // Query for the send button
        const hintSendButtonText = Localize.translateLocal('common.send');
        const sendButton = await react_native_1.screen.findByLabelText(hintSendButtonText);
        react_native_1.fireEvent.press(sendButton);
    };
    await (0, waitForBatchedUpdates_1.default)();
    await (0, reassure_1.measureRenders)(<ReportActionComposeWrapper />, { scenario });
});
