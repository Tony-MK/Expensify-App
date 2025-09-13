"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const ConfirmModal_1 = require("./ConfirmModal");
function AccountingConnectionConfirmationModal({ integrationToConnect, onCancel, onConfirm }) {
    const { translate } = (0, useLocalize_1.default)();
    return (<ConfirmModal_1.default title={translate('workspace.accounting.connectTitle', { connectionName: integrationToConnect })} isVisible onConfirm={onConfirm} onCancel={onCancel} prompt={translate('workspace.accounting.connectPrompt', { connectionName: integrationToConnect })} confirmText={translate('workspace.accounting.setup')} cancelText={translate('common.cancel')} success/>);
}
AccountingConnectionConfirmationModal.displayName = 'AccountingConnectionConfirmationModal';
exports.default = AccountingConnectionConfirmationModal;
