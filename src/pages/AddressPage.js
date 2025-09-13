"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressForm_1 = require("@components/AddressForm");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const HomeAddressForm_1 = require("@src/types/form/HomeAddressForm");
function AddressPage({ title, address, updateAddress, isLoadingApp = true, backTo, defaultCountry }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // Check if country is valid
    const { street } = address ?? {};
    const [street1, street2] = street ? street.split('\n') : [undefined, undefined];
    const [currentCountry, setCurrentCountry] = (0, react_1.useState)(address?.country ?? defaultCountry);
    const [state, setState] = (0, react_1.useState)(address?.state);
    const [city, setCity] = (0, react_1.useState)(address?.city);
    const [zipcode, setZipcode] = (0, react_1.useState)(address?.zip);
    (0, react_1.useEffect)(() => {
        if (!address) {
            return;
        }
        setState(address.state);
        setCurrentCountry(address.country);
        setCity(address.city);
        setZipcode(address.zip);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [address?.state, address?.country, address?.city, address?.zip]);
    const handleAddressChange = (0, react_1.useCallback)((value, key) => {
        const addressPart = value;
        const addressPartKey = key;
        if (addressPartKey !== HomeAddressForm_1.default.COUNTRY && addressPartKey !== HomeAddressForm_1.default.STATE && addressPartKey !== HomeAddressForm_1.default.CITY && addressPartKey !== HomeAddressForm_1.default.ZIP_POST_CODE) {
            return;
        }
        if (addressPartKey === HomeAddressForm_1.default.COUNTRY && addressPart !== currentCountry) {
            setCurrentCountry(addressPart);
            setState('');
            setCity('');
            setZipcode('');
            return;
        }
        if (addressPartKey === HomeAddressForm_1.default.STATE) {
            setState(addressPart);
            setCity('');
            setZipcode('');
            return;
        }
        if (addressPartKey === HomeAddressForm_1.default.CITY) {
            setCity(addressPart);
            setZipcode('');
            return;
        }
        setZipcode(addressPart);
    }, [currentCountry]);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={AddressPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={title} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<AddressForm_1.default formID={ONYXKEYS_1.default.FORMS.HOME_ADDRESS_FORM} onSubmit={updateAddress} submitButtonText={translate('common.save')} city={city} country={currentCountry} onAddressChanged={handleAddressChange} state={state} street1={street1} street2={street2} zip={zipcode}/>)}
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
AddressPage.displayName = 'AddressPage';
exports.default = AddressPage;
