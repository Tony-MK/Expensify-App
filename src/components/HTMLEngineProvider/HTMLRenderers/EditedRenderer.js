"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function EditedRenderer({ tnode, TDefaultRenderer, style, ...defaultRendererProps }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isPendingDelete = !!(tnode.attributes.deleted !== undefined);
    return (<Text_1.default fontSize={variables_1.default.fontSizeSmall}>
            <Text_1.default fontSize={variables_1.default.fontSizeSmall}> </Text_1.default>
            <Text_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...defaultRendererProps} fontSize={variables_1.default.fontSizeSmall} color={theme.textSupporting} style={[styles.editedLabelStyles, isPendingDelete && styles.offlineFeedback.deleted]}>
                {translate('reportActionCompose.edited')}
            </Text_1.default>
        </Text_1.default>);
}
EditedRenderer.displayName = 'EditedRenderer';
exports.default = EditedRenderer;
