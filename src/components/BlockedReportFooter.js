"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Banner_1 = require("./Banner");
function BlockedReportFooter() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const text = translate('youHaveBeenBanned');
    return (<Banner_1.default containerStyles={[styles.chatFooterBanner]} text={text} shouldShowIcon shouldRenderHTML/>);
}
BlockedReportFooter.displayName = 'ArchivedReportFooter';
exports.default = BlockedReportFooter;
