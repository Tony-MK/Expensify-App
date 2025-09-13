"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const ConfirmModal_1 = require("./ConfirmModal");
function SupportalActionRestrictedModal({ isModalOpen, hideSupportalModal }) {
    const { translate } = (0, useLocalize_1.default)();
    return (<ConfirmModal_1.default title={translate('supportalNoAccess.title')} isVisible={isModalOpen} onConfirm={hideSupportalModal} prompt={translate('supportalNoAccess.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>);
}
SupportalActionRestrictedModal.displayName = 'SupportalActionRestrictedModal';
exports.default = SupportalActionRestrictedModal;
