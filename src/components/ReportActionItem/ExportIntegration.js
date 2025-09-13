"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-array-index-key */
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportActionUtils = require("@libs/ReportActionsUtils");
function ExportIntegration({ action }) {
    const styles = (0, useThemeStyles_1.default)();
    const fragments = ReportActionUtils.getExportIntegrationActionFragments(action);
    return (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.flexWrap]}>
            {fragments.map((fragment, index) => {
            if (!fragment.url) {
                return (<Text_1.default key={index} style={[styles.chatItemMessage, styles.colorMuted]}>
                            {fragment.text}{' '}
                        </Text_1.default>);
            }
            return (<TextLink_1.default key={index} href={fragment.url}>
                        {fragment.text}{' '}
                    </TextLink_1.default>);
        })}
        </react_native_1.View>);
}
ExportIntegration.displayName = 'ExportIntegration';
exports.default = ExportIntegration;
