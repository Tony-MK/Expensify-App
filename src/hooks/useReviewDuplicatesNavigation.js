"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function useReviewDuplicatesNavigation(stepNames, currentScreenName, threadReportID, backTo) {
    const [nextScreen, setNextScreen] = (0, react_1.useState)();
    const [prevScreen, setPrevScreen] = (0, react_1.useState)();
    const [currentScreenIndex, setCurrentScreenIndex] = (0, react_1.useState)(0);
    const intersection = (0, react_1.useMemo)(() => CONST_1.default.REVIEW_DUPLICATES_ORDER.filter((element) => stepNames.includes(element)), [stepNames]);
    (0, react_1.useEffect)(() => {
        if (currentScreenName === 'confirmation') {
            setPrevScreen(intersection.at(-1));
            return;
        }
        const currentIndex = intersection.indexOf(currentScreenName);
        const nextScreenIndex = currentIndex + 1;
        const prevScreenIndex = currentIndex - 1;
        setCurrentScreenIndex(currentIndex);
        setNextScreen(intersection.at(nextScreenIndex));
        setPrevScreen(prevScreenIndex !== -1 ? intersection.at(prevScreenIndex) : undefined);
    }, [currentScreenName, intersection]);
    const goBack = () => {
        switch (prevScreen) {
            case 'merchant':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_MERCHANT_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'category':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_CATEGORY_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'tag':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAG_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'description':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_DESCRIPTION_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'taxCode':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAX_CODE_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'reimbursable':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_REIMBURSABLE_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'billable':
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_BILLABLE_PAGE.getRoute(threadReportID, backTo));
                break;
            default:
                Navigation_1.default.goBack(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_PAGE.getRoute(threadReportID, backTo));
                break;
        }
    };
    const navigateToNextScreen = () => {
        switch (nextScreen) {
            case 'merchant':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_MERCHANT_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'category':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_CATEGORY_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'tag':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAG_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'description':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_DESCRIPTION_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'taxCode':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAX_CODE_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'reimbursable':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_REIMBURSABLE_PAGE.getRoute(threadReportID, backTo));
                break;
            case 'billable':
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_BILLABLE_PAGE.getRoute(threadReportID, backTo));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_CONFIRMATION_PAGE.getRoute(threadReportID, backTo));
                break;
        }
    };
    return { navigateToNextScreen, goBack, currentScreenIndex };
}
exports.default = useReviewDuplicatesNavigation;
