"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Log_1 = require("./Log");
const accountIDToNameMap = {};
const reportIDToNameMap = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            return;
        }
        Object.values(value).forEach((report) => {
            if (!report) {
                return;
            }
            reportIDToNameMap[report.reportID] = report.reportName ?? report.reportID;
        });
    },
});
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (personalDetailsList) => {
        Object.values(personalDetailsList ?? {}).forEach((personalDetails) => {
            if (!personalDetails) {
                return;
            }
            accountIDToNameMap[personalDetails.accountID] = personalDetails.login ?? personalDetails.displayName ?? '';
        });
    },
});
class ExpensiMarkWithContext extends expensify_common_1.ExpensiMark {
    htmlToMarkdown(htmlString, extras) {
        return super.htmlToMarkdown(htmlString, {
            reportIDToName: extras?.reportIDToName ?? reportIDToNameMap,
            accountIDToName: extras?.accountIDToName ?? accountIDToNameMap,
            cacheVideoAttributes: extras?.cacheVideoAttributes,
        });
    }
    htmlToText(htmlString, extras) {
        return super.htmlToText(htmlString, {
            reportIDToName: extras?.reportIDToName ?? reportIDToNameMap,
            accountIDToName: extras?.accountIDToName ?? accountIDToNameMap,
            cacheVideoAttributes: extras?.cacheVideoAttributes,
        });
    }
    truncateHTML(htmlString, limit, extras) {
        return super.truncateHTML(htmlString, limit, extras);
    }
}
ExpensiMarkWithContext.setLogger(Log_1.default);
const Parser = new ExpensiMarkWithContext();
exports.default = Parser;
