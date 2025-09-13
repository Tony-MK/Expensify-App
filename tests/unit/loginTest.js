"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("react-native");
// Note: `react-test-renderer` renderer must be required after react-native.
const react_test_renderer_1 = require("react-test-renderer");
const App_1 = require("@src/App");
// Needed for: https://stackoverflow.com/questions/76903168/mocking-libraries-in-jest
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: {
        ignoreLogs: jest.fn(),
        ignoreAllLogs: jest.fn(),
    },
}));
describe('AppComponent', () => {
    it('renders correctly', () => {
        react_test_renderer_1.default.create(<App_1.default />);
    });
});
