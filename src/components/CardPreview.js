"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var variables_1 = require("@styles/variables");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ImageSVG_1 = require("./ImageSVG");
var Text_1 = require("./Text");
function CardPreview() {
    var _a;
    var styles = (0, useThemeStyles_1.default)();
    var privatePersonalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true })[0];
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true })[0];
    var _b = privatePersonalDetails !== null && privatePersonalDetails !== void 0 ? privatePersonalDetails : {}, legalFirstName = _b.legalFirstName, legalLastName = _b.legalLastName;
    var cardHolder = legalFirstName && legalLastName ? "".concat(legalFirstName, " ").concat(legalLastName) : ((_a = session === null || session === void 0 ? void 0 : session.email) !== null && _a !== void 0 ? _a : '');
    return (<react_native_1.View style={styles.walletCard}>
            <ImageSVG_1.default contentFit="contain" src={expensify_card_svg_1.default} pointerEvents="none" height={variables_1.default.cardPreviewHeight} width={variables_1.default.cardPreviewWidth}/>
            <Text_1.default style={styles.walletCardHolder} numberOfLines={1} ellipsizeMode="tail">
                {cardHolder}
            </Text_1.default>
        </react_native_1.View>);
}
CardPreview.displayName = 'CardPreview';
exports.default = CardPreview;
