"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const CarouselItem_1 = require("@components/Attachments/AttachmentCarousel/CarouselItem");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const Localize_1 = require("@libs/Localize");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('CarouselItem', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
    });
    it('should hide flagged attachments initially', async () => {
        // Given a CarouselItem component with a valid attributes
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <LocaleContextProvider_1.LocaleContextProvider>
                    <PlaybackContext_1.PlaybackContextProvider>
                        <AttachmentModalContext_1.AttachmentModalContextProvider>
                            <CarouselItem_1.default item={{
                reportActionID: '1',
                attachmentID: '1_1',
                source: 'img.jpeg',
                hasBeenFlagged: true,
            }} isFocused/>
                        </AttachmentModalContext_1.AttachmentModalContextProvider>
                    </PlaybackContext_1.PlaybackContextProvider>
                </LocaleContextProvider_1.LocaleContextProvider>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        // Then initially the attachment should be hidden so the reveal button should be displayed.
        expect(react_native_1.screen.getByTestId('moderationButton')).toHaveTextContent((0, Localize_1.translateLocal)('moderation.revealMessage'));
    });
});
