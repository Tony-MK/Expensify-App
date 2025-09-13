"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const AttachmentContext_1 = require("@components/AttachmentContext");
const VideoRenderer_1 = require("@components/HTMLEngineProvider/HTMLRenderers/VideoRenderer");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
jest.mock('@libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
}));
// Mock VideoPlayerPreview to simplify testing
jest.mock('@components/VideoPlayerPreview', () => {
    return ({ onShowModalPress, fileName }) => {
        // Get PressableWithoutFeedback inside the component to avoid Jest mock issues
        const { PressableWithoutFeedback } = require('@components/Pressable');
        const handlePress = () => {
            onShowModalPress?.();
        };
        return (<PressableWithoutFeedback testID="show-modal-button" onPress={handlePress} accessibilityRole="button" accessibilityLabel={fileName}/>);
    };
});
const mockShowContextMenuValue = {
    anchor: null,
    report: undefined,
    isReportArchived: false,
    action: undefined,
    transactionThreadReport: undefined,
    checkIfContextMenuActive: () => { },
    isDisabled: true,
    onShowContextMenu: (callback) => callback(),
};
const mockTNodeAttributes = {
    [CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE]: 'video/test.mp4',
    [CONST_1.default.ATTACHMENT_THUMBNAIL_URL_ATTRIBUTE]: 'thumbnail/test.jpg',
    [CONST_1.default.ATTACHMENT_THUMBNAIL_WIDTH_ATTRIBUTE]: '640',
    [CONST_1.default.ATTACHMENT_THUMBNAIL_HEIGHT_ATTRIBUTE]: '480',
    [CONST_1.default.ATTACHMENT_DURATION_ATTRIBUTE]: '60',
};
describe('VideoRenderer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should open the report attachment with isAuthTokenRequired=true', () => {
        // Given a VideoRenderer component with a valid attributes
        (0, react_native_1.render)(<ShowContextMenuContext_1.ShowContextMenuContext.Provider value={mockShowContextMenuValue}>
                <AttachmentContext_1.AttachmentContext.Provider value={{ type: CONST_1.default.ATTACHMENT_TYPE.SEARCH }}>
                    {/* @ts-expect-error - Ignoring type errors for testing purposes */}
                    <VideoRenderer_1.default tnode={{ attributes: mockTNodeAttributes }}/>
                </AttachmentContext_1.AttachmentContext.Provider>
            </ShowContextMenuContext_1.ShowContextMenuContext.Provider>);
        // When the user presses the show modal button
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId('show-modal-button'));
        expect(Navigation_1.default.navigate).toHaveBeenCalled();
        // Then it should navigate to the attachments route with isAuthTokenRequired=true
        const mockNavigate = jest.spyOn(Navigation_1.default, 'navigate');
        const firstCall = mockNavigate.mock.calls.at(0);
        const navigateArgs = firstCall?.at(0);
        expect(navigateArgs).toContain('isAuthTokenRequired=true');
    });
});
