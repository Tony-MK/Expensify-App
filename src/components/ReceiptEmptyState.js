"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
// Returns an SVG icon indicating that the user should attach a receipt
function ReceiptEmptyState({ onPress, disabled = false, isThumbnail = false, isInMoneyRequestView = false, shouldUseFullHeight = false, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const Wrapper = onPress ? PressableWithoutFeedback_1.default : react_native_1.View;
    const containerStyle = [
        styles.alignItemsCenter,
        styles.justifyContentCenter,
        styles.moneyRequestViewImage,
        isThumbnail && !isInMoneyRequestView ? styles.moneyRequestAttachReceiptThumbnail : styles.moneyRequestAttachReceipt,
        shouldUseFullHeight && styles.receiptEmptyStateFullHeight,
        style,
    ];
    return (<Wrapper accessibilityRole="imagebutton" accessibilityLabel={translate('receipt.upload')} onPress={onPress} disabled={disabled} disabledStyle={styles.cursorDefault} style={containerStyle}>
            <react_native_1.View>
                <Icon_1.default fill={theme.border} src={Expensicons.Receipt} width={variables_1.default.eReceiptEmptyIconWidth} height={variables_1.default.eReceiptEmptyIconWidth}/>
                {!isThumbnail && (<Icon_1.default src={Expensicons.ReceiptPlaceholderPlus} width={variables_1.default.avatarSizeSmall} height={variables_1.default.avatarSizeSmall} additionalStyles={styles.moneyRequestAttachReceiptThumbnailIcon}/>)}
            </react_native_1.View>
        </Wrapper>);
}
ReceiptEmptyState.displayName = 'ReceiptEmptyState';
exports.default = ReceiptEmptyState;
