"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const WalletStatementModal_1 = require("@components/WalletStatementModal");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemePreference_1 = require("@hooks/useThemePreference");
const Environment_1 = require("@libs/Environment/Environment");
const fileDownload_1 = require("@libs/fileDownload");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UrlUtils_1 = require("@libs/UrlUtils");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WalletStatementPage({ route }) {
    const [walletStatement] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_STATEMENT, { canBeMissing: true });
    const themePreference = (0, useThemePreference_1.default)();
    const yearMonth = route.params.yearMonth ?? null;
    const isWalletStatementGenerating = walletStatement?.isGenerating ?? false;
    const prevIsWalletStatementGenerating = (0, usePrevious_1.default)(isWalletStatementGenerating);
    const [isDownloading, setIsDownloading] = (0, react_1.useState)(isWalletStatementGenerating);
    const { translate } = (0, useLocalize_1.default)();
    const { environment } = (0, useEnvironment_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const baseURL = (0, UrlUtils_1.default)((0, Environment_1.getOldDotURLFromEnvironment)(environment));
    (0, react_1.useEffect)(() => {
        const currentYearMonth = (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.YEAR_MONTH_FORMAT);
        if (!yearMonth || yearMonth.length !== 6 || yearMonth > currentYearMonth) {
            Navigation_1.default.dismissModal();
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we want this effect to run only on mount
    }, []);
    const processDownload = (0, react_1.useCallback)(() => {
        if (isWalletStatementGenerating) {
            return;
        }
        setIsDownloading(true);
        if (walletStatement?.[yearMonth]) {
            // We already have a file URL for this statement, so we can download it immediately
            const downloadFileName = `Expensify_Statement_${yearMonth}.pdf`;
            const fileName = walletStatement[yearMonth];
            const pdfURL = `${baseURL}secure?secureType=pdfreport&filename=${fileName}&downloadName=${downloadFileName}`;
            (0, fileDownload_1.default)(pdfURL, downloadFileName).finally(() => setIsDownloading(false));
            return;
        }
        (0, User_1.generateStatementPDF)(yearMonth);
    }, [baseURL, isWalletStatementGenerating, walletStatement, yearMonth]);
    // eslint-disable-next-line rulesdir/prefer-early-return
    (0, react_1.useEffect)(() => {
        // If the statement generate is complete, download it automatically.
        if (prevIsWalletStatementGenerating && !isWalletStatementGenerating) {
            if (walletStatement?.[yearMonth]) {
                processDownload();
            }
            else {
                setIsDownloading(false);
            }
        }
    }, [prevIsWalletStatementGenerating, isWalletStatementGenerating, processDownload, walletStatement, yearMonth]);
    const year = yearMonth?.substring(0, 4) || (0, date_fns_1.getYear)(new Date());
    const month = yearMonth?.substring(4) || (0, date_fns_1.getMonth)(new Date());
    const monthName = (0, date_fns_1.format)(new Date(Number(year), Number(month) - 1), CONST_1.default.DATE.MONTH_FORMAT);
    const title = translate('statementPage.title', { year, monthName });
    const url = `${baseURL}statement.php?period=${yearMonth}${themePreference === CONST_1.default.THEME.DARK ? '&isDarkMode=true' : ''}`;
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator={false} enableEdgeToEdgeBottomSafeAreaPadding testID={WalletStatementPage.displayName}>
            <HeaderWithBackButton_1.default title={expensify_common_1.Str.recapitalize(title)} shouldShowDownloadButton={!isOffline || isDownloading} isDownloading={isDownloading} onDownloadButtonPress={processDownload}/>
            <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                <WalletStatementModal_1.default statementPageURL={url}/>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
WalletStatementPage.displayName = 'WalletStatementPage';
exports.default = WalletStatementPage;
