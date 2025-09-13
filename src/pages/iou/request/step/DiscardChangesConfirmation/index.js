"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
function DiscardChangesConfirmation({ getHasUnsavedChanges, onCancel }) {
    const navigation = (0, native_1.useNavigation)();
    const { translate } = (0, useLocalize_1.default)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const blockedNavigationAction = (0, react_1.useRef)(undefined);
    const shouldNavigateBack = (0, react_1.useRef)(false);
    (0, useBeforeRemove_1.default)((0, react_1.useCallback)((e) => {
        if (!getHasUnsavedChanges() || shouldNavigateBack.current) {
            return;
        }
        e.preventDefault();
        blockedNavigationAction.current = e.data.action;
        (0, navigateAfterInteraction_1.default)(() => setIsVisible((prev) => !prev));
    }, [getHasUnsavedChanges]));
    /**
     * We cannot programmatically stop the browser's back navigation like react-navigation's beforeRemove
     * Events like popstate and transitionStart are triggered AFTER the back navigation has already completed
     * So we need to go forward to get back to the current page
     */
    (0, react_1.useEffect)(() => {
        // transitionStart is triggered before the previous page is fully loaded so RHP sliding animation
        // could be less "glitchy" when going back and forth between the previous and current pages
        const unsubscribe = navigation.addListener('transitionStart', ({ data: { closing } }) => {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            if (!getHasUnsavedChanges()) {
                return;
            }
            shouldNavigateBack.current = true;
            if (closing) {
                window.history.go(1);
                return;
            }
            // Navigation.navigate() rerenders the current page and resets its states
            window.history.go(1);
            (0, navigateAfterInteraction_1.default)(() => setIsVisible((prev) => !prev));
        });
        return unsubscribe;
    }, [navigation, getHasUnsavedChanges]);
    return (<ConfirmModal_1.default isVisible={isVisible} title={translate('discardChangesConfirmation.title')} prompt={translate('discardChangesConfirmation.body')} danger confirmText={translate('discardChangesConfirmation.confirmText')} cancelText={translate('common.cancel')} onConfirm={() => {
            setIsVisible(false);
            if (blockedNavigationAction.current) {
                navigationRef_1.default.current?.dispatch(blockedNavigationAction.current);
                return;
            }
            if (!shouldNavigateBack.current) {
                return;
            }
            navigationRef_1.default.current?.goBack();
        }} onCancel={() => {
            setIsVisible(false);
            blockedNavigationAction.current = undefined;
            shouldNavigateBack.current = false;
        }} onModalHide={() => {
            shouldNavigateBack.current = false;
            onCancel?.();
        }} shouldIgnoreBackHandlerDuringTransition/>);
}
exports.default = (0, react_1.memo)(DiscardChangesConfirmation);
