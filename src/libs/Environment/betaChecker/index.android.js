"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const semver_1 = require("semver");
const AppUpdate = require("@libs/actions/AppUpdate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const package_json_1 = require("../../../../package.json");
let isLastSavedBeta = false;
// We have opted for `connectWithoutView` here as this is a strictly non-UI data.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.IS_BETA,
    callback: (value) => {
        isLastSavedBeta = !!value;
    },
});
/**
 * Check the GitHub releases to see if the current build is a beta build or production build
 */
function isBetaBuild() {
    return new Promise((resolve) => {
        fetch(CONST_1.default.GITHUB_RELEASE_URL)
            .then((res) => res.json())
            .then((json) => {
            const productionVersion = json.tag_name;
            if (!productionVersion) {
                AppUpdate.setIsAppInBeta(false);
                resolve(false);
            }
            // If the current version we are running is greater than the production version, we are on a beta version of Android
            const isBeta = semver_1.default.gt(package_json_1.default.version, productionVersion);
            AppUpdate.setIsAppInBeta(isBeta);
            resolve(isBeta);
        })
            .catch(() => {
            // Use isLastSavedBeta in case we fail to fetch the new one, e.g. when we are offline
            resolve(isLastSavedBeta);
        });
    });
}
exports.default = {
    isBetaBuild,
};
