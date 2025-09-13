"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useShortMentionsList;
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const LoginUtils_1 = require("@libs/LoginUtils");
const useCurrentUserPersonalDetails_1 = require("./useCurrentUserPersonalDetails");
/**
 * This hook returns data to be used with short mentions in LiveMarkdown/Composer.
 * Short mentions have the format `@username`, where username is the first part of user's login (email).
 * All the personal data from Onyx is formatted into short-mentions.
 * In addition, currently logged-in user is returned separately since it requires special styling.
 */
function useShortMentionsList() {
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const availableLoginsList = (0, react_1.useMemo)(() => {
        if (!personalDetails) {
            return [];
        }
        return Object.values(personalDetails)
            .map((personalDetail) => {
            if (!personalDetail?.login) {
                return;
            }
            // If the emails are not in the same private domain, we don't want to highlight them
            if (!(0, LoginUtils_1.areEmailsFromSamePrivateDomain)(personalDetail.login, currentUserPersonalDetails.login ?? '')) {
                return;
            }
            const [username] = personalDetail.login.split('@');
            return username;
        })
            .filter((login) => !!login);
    }, [currentUserPersonalDetails.login, personalDetails]);
    // We want to highlight both short and long version of current user login
    const currentUserMentions = (0, react_1.useMemo)(() => {
        if (!currentUserPersonalDetails.login) {
            return [];
        }
        const [baseName] = currentUserPersonalDetails.login.split('@');
        return [baseName, currentUserPersonalDetails.login];
    }, [currentUserPersonalDetails.login]);
    return { availableLoginsList, currentUserMentions };
}
