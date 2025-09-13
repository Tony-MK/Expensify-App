"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PopoverMenu_1 = require("@components/PopoverMenu");
const VideoPopoverMenuContext_1 = require("@components/VideoPlayerContexts/VideoPopoverMenuContext");
function VideoPopoverMenu({ isPopoverVisible = false, hidePopover = () => { }, anchorPosition = {
    horizontal: 0,
    vertical: 0,
}, }) {
    const { menuItems } = (0, VideoPopoverMenuContext_1.useVideoPopoverMenuContext)();
    const videoPlayerMenuRef = (0, react_1.useRef)(null);
    return (<PopoverMenu_1.default onClose={hidePopover} onItemSelected={hidePopover} isVisible={isPopoverVisible} anchorPosition={anchorPosition} menuItems={menuItems} anchorRef={videoPlayerMenuRef} shouldUseScrollView/>);
}
VideoPopoverMenu.displayName = 'VideoPopoverMenu';
exports.default = VideoPopoverMenu;
