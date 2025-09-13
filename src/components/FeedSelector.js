"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CaretWrapper_1 = require("./CaretWrapper");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PlaidCardFeedIcon_1 = require("./PlaidCardFeedIcon");
const Pressable_1 = require("./Pressable");
const Text_1 = require("./Text");
function FeedSelector({ onFeedSelect, cardIcon, shouldChangeLayout, feedName, supportingText, shouldShowRBR = false, plaidUrl = null }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<Pressable_1.PressableWithFeedback onPress={onFeedSelect} style={[styles.flexRow, styles.alignItemsCenter, styles.gap3, shouldChangeLayout && styles.mb3]} accessibilityLabel={feedName ?? ''}>
            {plaidUrl ? (<PlaidCardFeedIcon_1.default plaidUrl={plaidUrl}/>) : (<Icon_1.default src={cardIcon} height={variables_1.default.cardIconHeight} width={variables_1.default.cardIconWidth} additionalStyles={styles.cardIcon}/>)}
            <react_native_1.View style={styles.flex1}>
                <react_native_1.View style={[styles.flexRow, styles.gap1, styles.alignItemsCenter]}>
                    <CaretWrapper_1.default style={styles.flex1}>
                        <Text_1.default style={[styles.textStrong, styles.flexShrink1]}>{feedName}</Text_1.default>
                    </CaretWrapper_1.default>
                    {shouldShowRBR && (<Icon_1.default src={Expensicons.DotIndicator} fill={theme.danger}/>)}
                </react_native_1.View>
                <Text_1.default style={styles.textLabelSupporting}>{supportingText}</Text_1.default>
            </react_native_1.View>
        </Pressable_1.PressableWithFeedback>);
}
exports.default = FeedSelector;
