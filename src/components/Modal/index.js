"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const StatusBar_1 = require("@libs/StatusBar");
const CONST_1 = require("@src/CONST");
const BaseModal_1 = require("./BaseModal");
function Modal({ fullscreen = true, onModalHide = () => { }, type, onModalShow = () => { }, children, shouldHandleNavigationBack, ...rest }) {
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [previousStatusBarColor, setPreviousStatusBarColor] = (0, react_1.useState)();
    const setStatusBarColor = (color = theme.appBG) => {
        if (!fullscreen) {
            return;
        }
        StatusBar_1.default.setBackgroundColor(color);
    };
    const hideModal = () => {
        onModalHide();
    };
    const handlePopStateRef = (0, react_1.useRef)(() => {
        rest.onClose?.();
    });
    const showModal = () => {
        if (shouldHandleNavigationBack) {
            window.history.pushState({ shouldGoBack: true }, '', null);
            window.addEventListener('popstate', handlePopStateRef.current);
        }
        onModalShow?.();
    };
    (0, react_1.useEffect)(() => () => {
        window.removeEventListener('popstate', handlePopStateRef.current);
    }, []);
    const onModalWillShow = () => {
        const statusBarColor = StatusBar_1.default.getBackgroundColor() ?? theme.appBG;
        const isFullScreenModal = type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED ||
            type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE ||
            type === CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED ||
            type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT;
        if (statusBarColor) {
            setPreviousStatusBarColor(statusBarColor);
            // If it is a full screen modal then match it with appBG, otherwise we use the backdrop color
            setStatusBarColor(isFullScreenModal ? theme.appBG : StyleUtils.getThemeBackgroundColor(statusBarColor));
        }
        rest.onModalWillShow?.();
    };
    const onModalWillHide = () => {
        setStatusBarColor(previousStatusBarColor);
        rest.onModalWillHide?.();
        if (window.history.state?.shouldGoBack && shouldHandleNavigationBack) {
            window.history.back();
        }
    };
    return (<BaseModal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} onModalHide={hideModal} onModalShow={showModal} onModalWillShow={onModalWillShow} onModalWillHide={onModalWillHide} avoidKeyboard={false} fullscreen={fullscreen} useNativeDriver={false} useNativeDriverForBackdrop={false} type={type}>
            {children}
        </BaseModal_1.default>);
}
Modal.displayName = 'Modal';
exports.default = Modal;
