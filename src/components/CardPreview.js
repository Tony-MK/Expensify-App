"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ImageSVG_1 = require("./ImageSVG");
const Text_1 = require("./Text");
function CardPreview() {
    const styles = (0, useThemeStyles_1.default)();
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const { legalFirstName, legalLastName } = privatePersonalDetails ?? {};
    const cardHolder = legalFirstName && legalLastName ? `${legalFirstName} ${legalLastName}` : (session?.email ?? '');
    return (<react_native_1.View style={styles.walletCard}>
            <ImageSVG_1.default contentFit="contain" src={expensify_card_svg_1.default} pointerEvents="none" height={variables_1.default.cardPreviewHeight} width={variables_1.default.cardPreviewWidth}/>
            <Text_1.default style={styles.walletCardHolder} numberOfLines={1} ellipsizeMode="tail">
                {cardHolder}
            </Text_1.default>
        </react_native_1.View>);
}
CardPreview.displayName = 'CardPreview';
exports.default = CardPreview;
