"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptAuditMessages = ReceiptAuditMessages;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const RenderHTML_1 = require("./RenderHTML");
const Text_1 = require("./Text");
function ReceiptAudit({ notes, shouldShowAuditResult }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    let auditText = '';
    if (notes.length > 0 && shouldShowAuditResult) {
        auditText = translate('iou.receiptIssuesFound', { count: notes.length });
    }
    else if (!notes.length && shouldShowAuditResult) {
        auditText = translate('common.verified');
    }
    return (<react_native_1.View style={[styles.ph5, styles.mbn1]}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                <Text_1.default style={[styles.textLabelSupporting]}>{translate('common.receipt')}</Text_1.default>
                {!!auditText && (<>
                        <Text_1.default style={[styles.textLabelSupporting]}>{` • ${auditText}`}</Text_1.default>
                        <Icon_1.default width={12} height={12} src={notes.length ? Expensicons.DotIndicator : Expensicons.Checkmark} fill={notes.length ? theme.danger : theme.success} additionalStyles={styles.ml1}/>
                    </>)}
            </react_native_1.View>
        </react_native_1.View>);
}
function ReceiptAuditMessages({ notes = [] }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.mtn1, styles.mb2, styles.ph5, styles.gap1]}>
            {notes.length > 0 &&
            notes.map((message) => (<react_native_1.View key={message}>
                        <RenderHTML_1.default html={`<rbr>${message}</rbr>`}/>
                    </react_native_1.View>))}
        </react_native_1.View>);
}
exports.default = ReceiptAudit;
