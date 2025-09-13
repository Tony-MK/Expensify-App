"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const Modal_1 = require("@components/Modal");
const ScreenWrapperContainer_1 = require("@components/ScreenWrapper/ScreenWrapperContainer");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useViewportOffsetTop_1 = require("@hooks/useViewportOffsetTop");
const Browser_1 = require("@libs/Browser");
const CONST_1 = require("@src/CONST");
const SearchRouter_1 = require("./SearchRouter");
const SearchRouterContext_1 = require("./SearchRouterContext");
const isMobileWebIOS = (0, Browser_1.isMobileIOS)();
function SearchRouterModal() {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isSearchRouterDisplayed, closeSearchRouter } = (0, SearchRouterContext_1.useSearchRouterContext)();
    const viewportOffsetTop = (0, useViewportOffsetTop_1.default)();
    // On mWeb Safari, the input caret stuck for a moment while the modal is animating. So, we hide the caret until the animation is done.
    const [shouldHideInputCaret, setShouldHideInputCaret] = (0, react_1.useState)(isMobileWebIOS);
    const modalType = shouldUseNarrowLayout ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT : CONST_1.default.MODAL.MODAL_TYPE.POPOVER;
    // For now were only enabling shouldUseReanimatedModal narrow layouts. On wide ones it's a popover and it is not migrated yet.
    return (<Modal_1.default type={modalType} isVisible={isSearchRouterDisplayed} innerContainerStyle={{ paddingTop: viewportOffsetTop }} popoverAnchorPosition={{ right: 6, top: 6 }} fullscreen propagateSwipe swipeDirection={shouldUseNarrowLayout ? CONST_1.default.SWIPE_DIRECTION.RIGHT : undefined} onClose={closeSearchRouter} onModalHide={() => setShouldHideInputCaret(isMobileWebIOS)} onModalShow={() => setShouldHideInputCaret(false)} shouldApplySidePanelOffset={!shouldUseNarrowLayout} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapperContainer_1.default testID={SearchRouterModal.displayName} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding includePaddingTop={false}>
                <FocusTrapForModal_1.default active={isSearchRouterDisplayed}>
                    <SearchRouter_1.default onRouterClose={closeSearchRouter} shouldHideInputCaret={shouldHideInputCaret} isSearchRouterDisplayed={isSearchRouterDisplayed}/>
                </FocusTrapForModal_1.default>
            </ScreenWrapperContainer_1.default>
        </Modal_1.default>);
}
SearchRouterModal.displayName = 'SearchRouterModal';
exports.default = SearchRouterModal;
