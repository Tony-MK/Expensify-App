"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
// eslint-disable-next-line rulesdir/no-negated-variables
function NotFoundPage({ onBackButtonPress = () => Navigation_1.default.goBack(), isReportRelatedPage, shouldShowOfflineIndicator, ...fullPageNotFoundViewProps }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to go back to the not found page on large screens and to the home page on small screen
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const topmostReportId = Navigation_1.default.getTopmostReportId();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${topmostReportId}`);
    return (<ScreenWrapper_1.default testID={NotFoundPage.displayName} shouldShowOfflineIndicator={shouldShowOfflineIndicator}>
            <FullPageNotFoundView_1.default shouldShow onBackButtonPress={() => {
            if (!isReportRelatedPage || !isSmallScreenWidth) {
                onBackButtonPress();
                return;
            }
            // detect the report is invalid
            if (topmostReportId && (!report || report.errorFields?.notFound)) {
                Navigation_1.default.dismissModal();
                return;
            }
            onBackButtonPress();
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...fullPageNotFoundViewProps}/>
        </ScreenWrapper_1.default>);
}
NotFoundPage.displayName = 'NotFoundPage';
exports.default = NotFoundPage;
