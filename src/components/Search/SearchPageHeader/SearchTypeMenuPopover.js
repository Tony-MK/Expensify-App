"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const PopoverMenu_1 = require("@components/PopoverMenu");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useSearchTypeMenu_1 = require("@hooks/useSearchTypeMenu");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Expensicons = require("@src/components/Icon/Expensicons");
function SearchTypeMenuPopover({ queryJSON }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isPopoverVisible, delayPopoverMenuFirstRender, openMenu, closeMenu, allMenuItems, DeleteConfirmModal, windowHeight } = (0, useSearchTypeMenu_1.default)(queryJSON);
    const buttonRef = (0, react_1.useRef)(null);
    const { unmodifiedPaddings } = (0, useSafeAreaPaddings_1.default)();
    return (<>
            <Button_1.default icon={Expensicons.Menu} onPress={openMenu}/>
            {!delayPopoverMenuFirstRender && (<PopoverMenu_1.default menuItems={allMenuItems} isVisible={isPopoverVisible} anchorPosition={styles.createMenuPositionSidebar(windowHeight)} onClose={closeMenu} onItemSelected={closeMenu} anchorRef={buttonRef} shouldUseScrollView shouldUseModalPaddingStyle={false} innerContainerStyle={{ paddingBottom: unmodifiedPaddings.bottom }} shouldAvoidSafariException scrollContainerStyle={styles.pv0}/>)}
            {/* DeleteConfirmModal is a stable JSX element returned by the hook.
            Returning the element directly keeps the component identity across re-renders so React
            can play its exit animation instead of removing it instantly. */}
            {DeleteConfirmModal}
        </>);
}
SearchTypeMenuPopover.displayName = 'SearchTypeMenuPopover';
exports.default = SearchTypeMenuPopover;
