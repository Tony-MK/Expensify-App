"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Modal_1 = require("@components/Modal");
const HelpContent_1 = require("@components/SidePanel/HelpComponents/HelpContent");
const CONST_1 = require("@src/CONST");
function Help({ shouldHideSidePanel, closeSidePanel }) {
    return (<Modal_1.default onClose={() => closeSidePanel()} isVisible={!shouldHideSidePanel} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} shouldHandleNavigationBack propagateSwipe swipeDirection={CONST_1.default.SWIPE_DIRECTION.RIGHT}>
            <HelpContent_1.default closeSidePanel={closeSidePanel}/>
        </Modal_1.default>);
}
Help.displayName = 'Help';
exports.default = Help;
