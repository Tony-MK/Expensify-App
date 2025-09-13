"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var TextLink_1 = require("@components/TextLink");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var defaultPrivatePersonalDetails = {
    addresses: [
        {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
    ],
};
function CardDetails(_a) {
    var _b = _a.pan, pan = _b === void 0 ? '' : _b, _c = _a.expiration, expiration = _c === void 0 ? '' : _c, _d = _a.cvv, cvv = _d === void 0 ? '' : _d, domain = _a.domain;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var privatePersonalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true })[0];
    return (<react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            {(pan === null || pan === void 0 ? void 0 : pan.length) > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.cardNumber')} title={pan} interactive={false} copyValue={pan} copyable/>)}
            {(expiration === null || expiration === void 0 ? void 0 : expiration.length) > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.expiration')} title={expiration} interactive={false} copyable/>)}
            {(cvv === null || cvv === void 0 ? void 0 : cvv.length) > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.cvv')} title={cvv} interactive={false} copyable/>)}
            {(pan === null || pan === void 0 ? void 0 : pan.length) > 0 && (<>
                    <MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.address')} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        title={(0, PersonalDetailsUtils_1.getFormattedAddress)(privatePersonalDetails || defaultPrivatePersonalDetails)} interactive={false} copyable/>
                    <TextLink_1.default style={[styles.link, styles.mh5, styles.mb3]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_CARD_DIGITAL_DETAILS_UPDATE_ADDRESS.getRoute(domain)); }}>
                        {translate('cardPage.cardDetails.updateAddress')}
                    </TextLink_1.default>
                </>)}
        </react_native_1.View>);
}
CardDetails.displayName = 'CardDetails';
exports.default = CardDetails;
