"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressComponents = getAddressComponents;
exports.getPlaceAutocompleteTerms = getPlaceAutocompleteTerms;
/**
 * Finds an address component by type, and returns the value associated to key. Each address component object
 * inside the addressComponents array has the following structure:
 * [{
 *   long_name: "New York",
 *   short_name: "New York",
 *   types: [ "locality", "political" ]
 * }]
 */
function getAddressComponents(addressComponents, fieldsToExtract) {
    const result = {};
    Object.keys(fieldsToExtract).forEach((key) => (result[key] = ''));
    addressComponents.forEach((addressComponent) => {
        addressComponent.types.forEach((addressType) => {
            if (!(addressType in fieldsToExtract) || !(addressType in result && result[addressType] === '')) {
                return;
            }
            const value = addressComponent[fieldsToExtract[addressType]] ? addressComponent[fieldsToExtract[addressType]] : '';
            result[addressType] = value;
        });
    });
    return result;
}
/**
 * Finds an address term by type, and returns the value associated to key. Note that each term in the address must
 * conform to the following ORDER: <street, city, state, country>
 */
function getPlaceAutocompleteTerms(addressTerms) {
    const fieldsToExtract = ['country', 'state', 'city', 'street'];
    const result = {};
    fieldsToExtract.forEach((fieldToExtract, index) => {
        const fieldTermIndex = addressTerms.length - (index + 1);
        result[fieldToExtract] = fieldTermIndex >= 0 ? addressTerms.at(fieldTermIndex)?.value : '';
    });
    return result;
}
