"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useShortMentionsList;
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var LoginUtils_1 = require("@libs/LoginUtils");
var useCurrentUserPersonalDetails_1 = require("./useCurrentUserPersonalDetails");
/**
 * This hook returns data to be used with short mentions in LiveMarkdown/Composer.
 * Short mentions have the format `@username`, where username is the first part of user's login (email).
 * All the personal data from Onyx is formatted into short-mentions.
 * In addition, currently logged-in user is returned separately since it requires special styling.
 */
function useShortMentionsList() {
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var availableLoginsList = (0, react_1.useMemo)(function () {
        if (!personalDetails) {
            return [];
        }
        return Object.values(personalDetails)
            .map(function (personalDetail) {
            var _a;
            if (!(personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.login)) {
                return;
            }
            // If the emails are not in the same private domain, we don't want to highlight them
            if (!(0, LoginUtils_1.areEmailsFromSamePrivateDomain)(personalDetail.login, (_a = currentUserPersonalDetails.login) !== null && _a !== void 0 ? _a : '')) {
                return;
            }
            var username = personalDetail.login.split('@')[0];
            return username;
        })
            .filter(function (login) { return !!login; });
    }, [currentUserPersonalDetails.login, personalDetails]);
    // We want to highlight both short and long version of current user login
    var currentUserMentions = (0, react_1.useMemo)(function () {
        if (!currentUserPersonalDetails.login) {
            return [];
        }
        var baseName = currentUserPersonalDetails.login.split('@')[0];
        return [baseName, currentUserPersonalDetails.login];
    }, [currentUserPersonalDetails.login]);
    return { availableLoginsList: availableLoginsList, currentUserMentions: currentUserMentions };
}
