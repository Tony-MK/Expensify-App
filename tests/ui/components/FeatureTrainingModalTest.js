"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const receipt_doc_png_1 = require("@assets/images/receipt-doc.png");
const ComposeProviders_1 = require("@components/ComposeProviders");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const Illustrations = require("@components/Icon/Illustrations");
const FullScreenContext_1 = require("@components/VideoPlayerContexts/FullScreenContext");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const VideoPopoverMenuContext_1 = require("@components/VideoPlayerContexts/VideoPopoverMenuContext");
const VolumeContext_1 = require("@components/VideoPlayerContexts/VolumeContext");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CONFIRM_TEXT = 'Start';
jest.mock('@libs/Navigation/Navigation', () => ({
    isTopmostRouteModalScreen: jest.fn(),
    isNavigationReady: jest.fn(() => Promise.resolve()),
    getActiveRouteWithoutParams: jest.fn(() => '/'),
    getActiveRoute: jest.fn(() => '/'),
}));
jest.mock('expo-av', () => {
    const { View } = require('react-native');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        ...jest.requireActual('expo-av'),
        Video: class extends View {
            constructor() {
                super(...arguments);
                this.setStatusAsync = jest.fn().mockResolvedValue(undefined);
            }
        },
    };
});
jest.mock('@components/ImageSVG', () => {
    const { View } = require('react-native');
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (props) => <View {...props}/>;
});
jest.unmock('react-native-reanimated');
describe('FeatureTrainingModal', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                [ONYXKEYS_1.default.NETWORK]: {
                    isOffline: false,
                },
            },
        });
    });
    describe('renderIllustration', () => {
        it('renders video', () => {
            (0, react_native_1.render)(<ComposeProviders_1.default components={[PlaybackContext_1.PlaybackContextProvider, FullScreenContext_1.FullScreenContextProvider, VolumeContext_1.VolumeContextProvider, VideoPopoverMenuContext_1.VideoPopoverMenuContextProvider]}>
                    <FeatureTrainingModal_1.default confirmText={CONFIRM_TEXT} videoURL={CONST_1.default.WELCOME_VIDEO_URL}/>
                </ComposeProviders_1.default>);
            expect(react_native_1.screen.getByTestId(CONST_1.default.VIDEO_PLAYER_TEST_ID)).toBeOnTheScreen();
        });
        it('renders svg image', () => {
            (0, react_native_1.render)(<FeatureTrainingModal_1.default confirmText={CONFIRM_TEXT} image={Illustrations.HoldExpense}/>);
            expect(react_native_1.screen.getByTestId(CONST_1.default.IMAGE_SVG_TEST_ID)).toBeOnTheScreen();
        });
        it('renders non-svg image', () => {
            (0, react_native_1.render)(<FeatureTrainingModal_1.default confirmText={CONFIRM_TEXT} image={receipt_doc_png_1.default} shouldRenderSVG={false}/>);
            expect(react_native_1.screen.getByTestId(CONST_1.default.IMAGE_TEST_ID)).toBeOnTheScreen();
        });
        it('renders animation', () => {
            (0, react_native_1.render)(<FeatureTrainingModal_1.default confirmText={CONFIRM_TEXT}/>);
            expect(react_native_1.screen.getByTestId(CONST_1.default.LOTTIE_VIEW_TEST_ID)).toBeOnTheScreen();
        });
    });
});
