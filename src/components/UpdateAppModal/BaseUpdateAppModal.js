"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const useLocalize_1 = require("@hooks/useLocalize");
function BaseUpdateAppModal({ onSubmit }) {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(true);
    const { translate } = (0, useLocalize_1.default)();
    /**
     * Execute the onSubmit callback and close the modal.
     */
    const submitAndClose = () => {
        onSubmit?.();
        setIsModalOpen(false);
    };
    return (<ConfirmModal_1.default title={translate('baseUpdateAppModal.updateApp')} isVisible={isModalOpen} onConfirm={submitAndClose} onCancel={() => setIsModalOpen(false)} prompt={translate('baseUpdateAppModal.updatePrompt')} confirmText={translate('baseUpdateAppModal.updateApp')} cancelText={translate('common.cancel')}/>);
}
BaseUpdateAppModal.displayName = 'BaseUpdateAppModal';
exports.default = react_1.default.memo(BaseUpdateAppModal);
