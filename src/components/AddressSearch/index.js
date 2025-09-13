"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_google_places_autocomplete_1 = require("react-native-google-places-autocomplete");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const LocationErrorMessage_1 = require("@components/LocationErrorMessage");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const UserLocation_1 = require("@libs/actions/UserLocation");
const ApiUtils_1 = require("@libs/ApiUtils");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const GooglePlacesUtils_1 = require("@libs/GooglePlacesUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const CurrentLocationButton_1 = require("./CurrentLocationButton");
const isCurrentTargetInsideContainer_1 = require("./isCurrentTargetInsideContainer");
/**
 * Check if the place matches the search by the place name or description.
 * @param search The search string for a place
 * @param place The place to check for a match on the search
 * @returns true if search is related to place, otherwise it returns false.
 */
function isPlaceMatchForSearch(search, place) {
    if (!search) {
        return true;
    }
    if (!place) {
        return false;
    }
    const fullSearchSentence = `${place.name ?? ''} ${place.description}`;
    return search.split(' ').every((searchTerm) => !searchTerm || fullSearchSentence.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
}
// The error that's being thrown below will be ignored until we fork the
// react-native-google-places-autocomplete repo and replace the
// VirtualizedList component with a VirtualizedList-backed instead
react_native_1.LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
function AddressSearch({ canUseCurrentLocation = false, containerStyles, defaultValue, errorText = '', hint = '', inputID, limitSearchesToCountry, label, maxInputLength, onFocus, onBlur, onInputChange, onPress, onCountryChange, predefinedPlaces = [], renamedInputKeys = {
    street: 'addressStreet',
    street2: 'addressStreet2',
    city: 'addressCity',
    state: 'addressState',
    zipCode: 'addressZipCode',
    lat: 'addressLat',
    lng: 'addressLng',
}, resultTypes = 'address', shouldSaveDraft = false, value, locationBias, caretHidden, }, ref) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [displayListViewBorder, setDisplayListViewBorder] = (0, react_1.useState)(false);
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const [locationErrorCode, setLocationErrorCode] = (0, react_1.useState)(null);
    const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = (0, react_1.useState)(false);
    const shouldTriggerGeolocationCallbacks = (0, react_1.useRef)(true);
    const [shouldHidePredefinedPlaces, setShouldHidePredefinedPlaces] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    const query = (0, react_1.useMemo)(() => ({
        language: preferredLocale,
        types: resultTypes,
        components: limitSearchesToCountry ? `country:${limitSearchesToCountry.toLocaleLowerCase()}` : undefined,
        ...(locationBias && { locationbias: locationBias }),
    }), [preferredLocale, resultTypes, limitSearchesToCountry, locationBias]);
    const shouldShowCurrentLocationButton = canUseCurrentLocation && searchValue.trim().length === 0 && isFocused;
    const saveLocationDetails = (autocompleteData, details) => {
        const addressComponents = details?.address_components;
        if (!addressComponents) {
            // When there are details, but no address_components, this indicates that some predefined options have been passed
            // to this component which don't match the usual properties coming from auto-complete. In that case, only a limited
            // amount of data massaging needs to happen for what the parent expects to get from this function.
            if (details) {
                onPress?.({
                    address: autocompleteData.description ?? '',
                    lat: details.geometry.location.lat ?? 0,
                    lng: details.geometry.location.lng ?? 0,
                    name: details.name,
                });
            }
            return;
        }
        // Gather the values from the Google details
        const { street_number: streetNumber, route: streetName, subpremise, locality, sublocality, postal_town: postalTown, postal_code: zipCode, administrative_area_level_1: state, administrative_area_level_2: stateFallback, country: countryPrimary, } = (0, GooglePlacesUtils_1.getAddressComponents)(addressComponents, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            street_number: 'long_name',
            route: 'long_name',
            subpremise: 'long_name',
            locality: 'long_name',
            sublocality: 'long_name',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            postal_town: 'long_name',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            postal_code: 'long_name',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            administrative_area_level_1: 'short_name',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            administrative_area_level_2: 'long_name',
            country: 'short_name',
        });
        // The state's iso code (short_name) is needed for the StatePicker component but we also
        // need the state's full name (long_name) when we render the state in a TextInput.
        const { administrative_area_level_1: longStateName } = (0, GooglePlacesUtils_1.getAddressComponents)(addressComponents, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            administrative_area_level_1: 'long_name',
        });
        // Make sure that the order of keys remains such that the country is always set above the state.
        // Refer to https://github.com/Expensify/App/issues/15633 for more information.
        const { country: countryFallbackLongName = '', state: stateAutoCompleteFallback = '', city: cityAutocompleteFallback = '' } = (0, GooglePlacesUtils_1.getPlaceAutocompleteTerms)(autocompleteData?.terms ?? []);
        const countryFallback = Object.keys(CONST_1.default.ALL_COUNTRIES).find((country) => country === countryFallbackLongName);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const country = countryPrimary || countryFallback || '';
        const values = {
            street: `${streetNumber} ${streetName}`.trim(),
            name: details.name ?? '',
            // Autocomplete returns any additional valid address fragments (e.g. Apt #) as subpremise.
            street2: subpremise,
            // Make sure country is updated first, since city and state will be reset if the country changes
            country: '',
            state: state || stateAutoCompleteFallback,
            // When locality is not returned, many countries return the city as postalTown (e.g. 5 New Street
            // Square, London), otherwise as sublocality (e.g. 384 Court Street Brooklyn). If postalTown is
            // returned, the sublocality will be a city subdivision so shouldn't take precedence (e.g.
            // Salagatan, Uppsala, Sweden).
            city: locality || postalTown || sublocality || cityAutocompleteFallback,
            zipCode,
            lat: details.geometry.location.lat ?? 0,
            lng: details.geometry.location.lng ?? 0,
            address: autocompleteData.description || details.formatted_address || '',
        };
        // If the address is not in the US, use the full length state name since we're displaying the address's
        // state / province in a TextInput instead of in a picker.
        if (country !== CONST_1.default.COUNTRY.US && country !== CONST_1.default.COUNTRY.CA) {
            values.state = longStateName;
        }
        // UK addresses return countries (e.g. England) in the state field (administrative_area_level_1)
        // So we use a secondary field (administrative_area_level_2) as a fallback
        if (country === CONST_1.default.COUNTRY.GB) {
            values.state = stateFallback;
        }
        // Set the state to be the same as the city in case the state is empty.
        if (!values.state) {
            values.state = values.city;
        }
        // Some edge-case addresses may lack both street_number and route in the API response, resulting in an empty "values.street"
        // We are setting up a fallback to ensure "values.street" is populated with a relevant value
        if (!values.street && details.adr_address) {
            const streetAddressRegex = /<span class="street-address">([^<]*)<\/span>/;
            const adrAddress = details.adr_address.match(streetAddressRegex);
            const streetAddressFallback = adrAddress ? adrAddress?.[1] : null;
            if (streetAddressFallback) {
                values.street = streetAddressFallback;
            }
        }
        // Not all pages define the Address Line 2 field, so in that case we append any additional address details
        // (e.g. Apt #) to Address Line 1
        if (subpremise && typeof renamedInputKeys?.street2 === 'undefined') {
            values.street += `, ${subpremise}`;
        }
        const isValidCountryCode = !!Object.keys(CONST_1.default.ALL_COUNTRIES).find((foundCountry) => foundCountry === country);
        if (isValidCountryCode) {
            values.country = country;
        }
        if (inputID) {
            Object.entries(values).forEach(([key, inputValue]) => {
                const inputKey = renamedInputKeys?.[key] ?? key;
                if (!inputKey) {
                    return;
                }
                onInputChange?.(inputValue, inputKey);
            });
        }
        else {
            onInputChange?.(values);
        }
        onCountryChange?.(values.country);
        onPress?.(values);
    };
    /** Gets the user's current location and registers success/error callbacks */
    const getCurrentLocation = () => {
        if (isFetchingCurrentLocation) {
            return;
        }
        setIsTyping(false);
        setIsFocused(false);
        setDisplayListViewBorder(false);
        setIsFetchingCurrentLocation(true);
        react_native_1.Keyboard.dismiss();
        (0, getCurrentPosition_1.default)((successData) => {
            if (!shouldTriggerGeolocationCallbacks.current) {
                return;
            }
            setIsFetchingCurrentLocation(false);
            setLocationErrorCode(null);
            const { latitude, longitude } = successData.coords;
            const location = {
                lat: latitude,
                lng: longitude,
                address: CONST_1.default.YOUR_LOCATION_TEXT,
                name: CONST_1.default.YOUR_LOCATION_TEXT,
            };
            // Update the current user location
            (0, UserLocation_1.setUserLocation)({ longitude, latitude });
            onPress?.(location);
        }, (errorData) => {
            if (!shouldTriggerGeolocationCallbacks.current) {
                return;
            }
            setIsFetchingCurrentLocation(false);
            setLocationErrorCode(errorData?.code ?? null);
        }, {
            maximumAge: 0, // No cache, always get fresh location info
            timeout: 30000,
        });
    };
    const renderHeaderComponent = () => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
            {(predefinedPlaces?.length ?? 0) > 0 && (<react_native_1.View style={styles.overflowAuto}>
                    {/* This will show current location button in list if there are some recent destinations */}
                    {shouldShowCurrentLocationButton && (<CurrentLocationButton_1.default onPress={getCurrentLocation} isDisabled={isOffline}/>)}
                    {!value && <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.pv2, styles.ph3, styles.overflowAuto]}>{translate('common.recentDestinations')}</Text_1.default>}
                </react_native_1.View>)}
        </>);
    // eslint-disable-next-line arrow-body-style
    (0, react_1.useEffect)(() => {
        return () => {
            // If the component unmounts we don't want any of the callback for geolocation to run.
            shouldTriggerGeolocationCallbacks.current = false;
        };
    }, []);
    const filteredPredefinedPlaces = (0, react_1.useMemo)(() => {
        if (!searchValue) {
            return predefinedPlaces ?? [];
        }
        if (shouldHidePredefinedPlaces) {
            return [];
        }
        return predefinedPlaces?.filter((predefinedPlace) => isPlaceMatchForSearch(searchValue, predefinedPlace)) ?? [];
    }, [predefinedPlaces, searchValue, shouldHidePredefinedPlaces]);
    const listEmptyComponent = (0, react_1.useMemo)(() => (!isTyping ? undefined : <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.pv4, styles.ph3, styles.overflowAuto]}>{translate('common.noResultsFound')}</Text_1.default>), [isTyping, styles, translate]);
    const listLoader = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pv4]}>
                <react_native_1.ActivityIndicator color={theme.spinner} size="small"/>
            </react_native_1.View>), [styles.pv4, theme.spinner]);
    return (
    /*
     * The GooglePlacesAutocomplete component uses a VirtualizedList internally,
     * and VirtualizedLists cannot be directly nested within other VirtualizedLists of the same orientation.
     * To work around this, we wrap the GooglePlacesAutocomplete component with a horizontal ScrollView
     * that has scrolling disabled and would otherwise not be needed
     */
    <>
            <ScrollView_1.default horizontal contentContainerStyle={styles.flex1} scrollEnabled={false} 
    // keyboardShouldPersistTaps="always" is required for Android native,
    // otherwise tapping on a result doesn't do anything. More information
    // here: https://github.com/FaridSafi/react-native-google-places-autocomplete#use-inside-a-scrollview-or-flatlist
    keyboardShouldPersistTaps="always">
                <react_native_1.View style={styles.w100} ref={containerRef}>
                    <react_native_google_places_autocomplete_1.GooglePlacesAutocomplete disableScroll fetchDetails suppressDefaultStyles enablePoweredByContainer={false} predefinedPlaces={filteredPredefinedPlaces} listEmptyComponent={listEmptyComponent} listLoaderComponent={listLoader} renderHeaderComponent={renderHeaderComponent} renderRow={(data) => {
            const title = data.isPredefinedPlace ? data.name : data.structured_formatting.main_text;
            const subtitle = data.isPredefinedPlace ? data.description : data.structured_formatting.secondary_text;
            return (<react_native_1.View>
                                    {!!title && <Text_1.default style={styles.googleSearchText}>{title}</Text_1.default>}
                                    <Text_1.default style={[title ? styles.textLabelSupporting : styles.googleSearchText]}>{subtitle}</Text_1.default>
                                </react_native_1.View>);
        }} onPress={(data, details) => {
            saveLocationDetails(data, details);
            setIsTyping(false);
            // After we select an option, we set displayListViewBorder to false to prevent UI flickering
            setDisplayListViewBorder(false);
            setIsFocused(false);
            // Clear location error code after address is selected
            setLocationErrorCode(null);
        }} query={query} requestUrl={{
            useOnPlatform: 'all',
            url: isOffline ? '' : (0, ApiUtils_1.getCommandURL)({ command: 'Proxy_GooglePlaces?proxyUrl=' }),
        }} textInputProps={{
            InputComp: TextInput_1.default,
            ref,
            label,
            containerStyles,
            errorText,
            hint: displayListViewBorder || (predefinedPlaces?.length === 0 && shouldShowCurrentLocationButton) || (canUseCurrentLocation && isTyping) ? undefined : hint,
            value,
            defaultValue,
            inputID,
            shouldSaveDraft,
            onFocus: () => {
                setIsFocused(true);
                onFocus?.();
            },
            onBlur: (event) => {
                if (!(0, isCurrentTargetInsideContainer_1.default)(event, containerRef)) {
                    setDisplayListViewBorder(false);
                    setIsFocused(false);
                    setIsTyping(false);
                }
                onBlur?.();
            },
            autoComplete: 'off',
            onInputChange: (text) => {
                setSearchValue(text);
                setIsTyping(true);
                setShouldHidePredefinedPlaces(!isOffline);
                if (inputID) {
                    onInputChange?.(text);
                }
                else {
                    onInputChange?.({ street: text });
                }
                // If the text is empty and we have no predefined places, we set displayListViewBorder to false to prevent UI flickering
                if (!text && !predefinedPlaces?.length) {
                    setDisplayListViewBorder(false);
                }
            },
            maxLength: maxInputLength,
            spellCheck: false,
            selectTextOnFocus: true,
            caretHidden,
        }} styles={{
            textInputContainer: [styles.flexColumn],
            listView: [StyleUtils.getGoogleListViewStyle(displayListViewBorder), styles.borderLeft, styles.borderRight, !isFocused && styles.h0],
            row: [styles.pv4, styles.ph3, styles.overflowAuto],
            description: [styles.googleSearchText],
            separator: [styles.googleSearchSeparator, styles.overflowAuto],
            container: [styles.mh100],
        }} numberOfLines={2} isRowScrollable={false} listHoverColor={theme.border} listUnderlayColor={theme.buttonPressedBG} onLayout={(event) => {
            // We use the height of the element to determine if we should hide the border of the listView dropdown
            // to prevent a lingering border when there are no address suggestions.
            setDisplayListViewBorder(event.nativeEvent.layout.height > variables_1.default.googleEmptyListViewHeight);
        }} inbetweenCompo={
        // We want to show the current location button even if there are no recent destinations
        predefinedPlaces?.length === 0 && shouldShowCurrentLocationButton ? (<react_native_1.View style={[StyleUtils.getGoogleListViewStyle(true), styles.overflowAuto, styles.borderLeft, styles.borderRight]}>
                                    <CurrentLocationButton_1.default onPress={getCurrentLocation} isDisabled={isOffline}/>
                                </react_native_1.View>) : undefined} placeholder="" listViewDisplayed>
                        <LocationErrorMessage_1.default onClose={() => setLocationErrorCode(null)} locationErrorCode={locationErrorCode}/>
                    </react_native_google_places_autocomplete_1.GooglePlacesAutocomplete>
                </react_native_1.View>
            </ScrollView_1.default>
            {isFetchingCurrentLocation && <FullscreenLoadingIndicator_1.default />}
        </>);
}
AddressSearch.displayName = 'AddressSearchWithRef';
exports.default = (0, react_1.forwardRef)(AddressSearch);
