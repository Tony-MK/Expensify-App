"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const defaultPrivatePersonalDetails = {
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
function CardDetails({ pan = '', expiration = '', cvv = '', domain }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    return (<react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            {pan?.length > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.cardNumber')} title={pan} interactive={false} copyValue={pan} copyable/>)}
            {expiration?.length > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.expiration')} title={expiration} interactive={false} copyable/>)}
            {cvv?.length > 0 && (<MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.cvv')} title={cvv} interactive={false} copyable/>)}
            {pan?.length > 0 && (<>
                    <MenuItemWithTopDescription_1.default description={translate('cardPage.cardDetails.address')} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        title={(0, PersonalDetailsUtils_1.getFormattedAddress)(privatePersonalDetails || defaultPrivatePersonalDetails)} interactive={false} copyable/>
                    <TextLink_1.default style={[styles.link, styles.mh5, styles.mb3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_CARD_DIGITAL_DETAILS_UPDATE_ADDRESS.getRoute(domain))}>
                        {translate('cardPage.cardDetails.updateAddress')}
                    </TextLink_1.default>
                </>)}
        </react_native_1.View>);
}
CardDetails.displayName = 'CardDetails';
exports.default = CardDetails;
