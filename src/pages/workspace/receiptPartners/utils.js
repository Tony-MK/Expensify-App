"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptPartnersIntegrationData = getReceiptPartnersIntegrationData;
exports.getSynchronizationErrorMessage = getSynchronizationErrorMessage;
var react_1 = require("react");
var Expensicons = require("@components/Icon/Expensicons");
var Text_1 = require("@components/Text");
var CONST_1 = require("@src/CONST");
function getReceiptPartnersIntegrationData(receiptPartnerName, translate) {
    switch (receiptPartnerName) {
        case CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER:
            return {
                title: CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME_USER_FRIENDLY[CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER],
                description: translate('workspace.receiptPartners.uber.subtitle'),
                icon: Expensicons.Uber,
                pendingFields: {},
                errorFields: {},
            };
        default:
            return undefined;
    }
}
function getSynchronizationErrorMessage(receiptPartnerName, translate, styles) {
    return (<Text_1.default style={[styles === null || styles === void 0 ? void 0 : styles.formError]}>
            <Text_1.default style={[styles === null || styles === void 0 ? void 0 : styles.formError]}>{translate('workspace.common.authenticationError', { connectionName: receiptPartnerName })}</Text_1.default>
        </Text_1.default>);
}
