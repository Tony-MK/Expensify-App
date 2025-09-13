"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useSidePanel_1 = require("@hooks/useSidePanel");
const HelpModal_1 = require("./HelpModal");
const useSyncSidePanelWithHistory_1 = require("./useSyncSidePanelWithHistory");
function SidePanel() {
    const { sidePanelNVP, isSidePanelTransitionEnded, shouldHideSidePanel, sidePanelTranslateX, shouldHideSidePanelBackdrop, closeSidePanel } = (0, useSidePanel_1.default)();
    // Hide side panel once animation ends
    // This hook synchronizes the side panel visibility with the browser history when it is displayed as RHP.
    // This means when you open or close the side panel, an entry connected with it is added to or removed from the browser history,
    // allowing this modal to be toggled using browser's "go back" and "go forward" buttons.
    (0, useSyncSidePanelWithHistory_1.default)();
    // Side panel can't be displayed if NVP is undefined
    if (!sidePanelNVP) {
        return null;
    }
    if (isSidePanelTransitionEnded && shouldHideSidePanel) {
        return null;
    }
    return (<HelpModal_1.default shouldHideSidePanel={shouldHideSidePanel} sidePanelTranslateX={sidePanelTranslateX} closeSidePanel={closeSidePanel} shouldHideSidePanelBackdrop={shouldHideSidePanelBackdrop}/>);
}
SidePanel.displayName = 'SidePanel';
exports.default = SidePanel;
