"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
function DiscardChangesConfirmation({ getHasUnsavedChanges }) {
    const { translate } = (0, useLocalize_1.default)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const blockedNavigationAction = (0, react_1.useRef)(undefined);
    (0, useBeforeRemove_1.default)((0, react_1.useCallback)((e) => {
        if (!getHasUnsavedChanges()) {
            return;
        }
        e.preventDefault();
        blockedNavigationAction.current = e.data.action;
        setIsVisible(true);
    }, [getHasUnsavedChanges]));
    return (<ConfirmModal_1.default isVisible={isVisible} title={translate('discardChangesConfirmation.title')} prompt={translate('discardChangesConfirmation.body')} danger confirmText={translate('discardChangesConfirmation.confirmText')} cancelText={translate('common.cancel')} onConfirm={() => {
            setIsVisible(false);
            if (blockedNavigationAction.current) {
                navigationRef_1.default.current?.dispatch(blockedNavigationAction.current);
            }
        }} onCancel={() => setIsVisible(false)} shouldHandleNavigationBack/>);
}
exports.default = (0, react_1.memo)(DiscardChangesConfirmation);
