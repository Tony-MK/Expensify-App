"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Modal_1 = require("@components/Modal");
const HelpContent_1 = require("@components/SidePanel/HelpComponents/HelpContent");
const CONST_1 = require("@src/CONST");
function Help({ shouldHideSidePanel, closeSidePanel }) {
    // SidePanel isn't a native screen, this handles the back button press on Android
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', () => {
            closeSidePanel();
            // Return true to indicate that the back button press is handled here
            return true;
        });
        return () => backHandler.remove();
    }, [closeSidePanel]));
    return (<Modal_1.default onClose={() => closeSidePanel()} isVisible={!shouldHideSidePanel} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} shouldHandleNavigationBack>
            <HelpContent_1.default closeSidePanel={closeSidePanel}/>
        </Modal_1.default>);
}
Help.displayName = 'Help';
exports.default = Help;
