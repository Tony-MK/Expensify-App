"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Text_1 = require("./Text");
function UnreadActionIndicator({ reportActionID, shouldHideThreadDividerLine }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const containerStyle = shouldHideThreadDividerLine ? styles.topUnreadIndicatorContainer : styles.unreadIndicatorContainer;
    return (<react_native_1.View accessibilityLabel={translate('accessibilityHints.newMessageLineIndicator')} data-action-id={reportActionID} style={[containerStyle, styles.userSelectNone, styles.pointerEventsNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
            <react_native_1.View style={styles.unreadIndicatorLine}/>
            <Text_1.default style={styles.unreadIndicatorText}>{translate('common.new')}</Text_1.default>
        </react_native_1.View>);
}
UnreadActionIndicator.displayName = 'UnreadActionIndicator';
exports.default = UnreadActionIndicator;
