"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const Provider_1 = require("@components/DragAndDrop/Provider");
const DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const Search_1 = require("@components/Search");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchPageFooter_1 = require("@components/Search/SearchPageFooter");
const SearchFiltersBar_1 = require("@components/Search/SearchPageHeader/SearchFiltersBar");
const SearchPageHeader_1 = require("@components/Search/SearchPageHeader/SearchPageHeader");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const App_1 = require("@libs/actions/App");
const Report_1 = require("@libs/actions/Report");
const Search_2 = require("@libs/actions/Search");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchPageNarrow_1 = require("./SearchPageNarrow");
function SearchPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { selectedTransactions, clearSelectedTransactions, selectedReports, lastSearchType, setLastSearchType, areAllMatchingItemsSelected, selectAllMatchingItems } = (0, SearchContext_1.useSearchContext)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [lastPaymentMethods] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const newReportID = (0, ReportUtils_1.generateReportID)();
    const [newReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${newReportID}`, { canBeMissing: true });
    const [newParentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${newReport?.parentReportID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [integrationsExportTemplates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTEGRATION_SERVER_EXPORT_TEMPLATES, { canBeMissing: true });
    const [csvExportLayouts] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_CSV_EXPORT_LAYOUTS, { canBeMissing: true });
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const [isDownloadErrorModalVisible, setIsDownloadErrorModalVisible] = (0, react_1.useState)(false);
    const [isDeleteExpensesConfirmModalVisible, setIsDeleteExpensesConfirmModalVisible] = (0, react_1.useState)(false);
    const [isDownloadExportModalVisible, setIsDownloadExportModalVisible] = (0, react_1.useState)(false);
    const [isExportWithTemplateModalVisible, setIsExportWithTemplateModalVisible] = (0, react_1.useState)(false);
    const queryJSON = (0, react_1.useMemo)(() => (0, SearchQueryUtils_1.buildSearchQueryJSON)(route.params.q), [route.params.q]);
    const { saveScrollOffset } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    // eslint-disable-next-line rulesdir/no-default-id-values
    const [currentSearchResults] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${queryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID}`, { canBeMissing: true });
    const lastNonEmptySearchResults = (0, react_1.useRef)(undefined);
    (0, react_1.useEffect)(() => {
        (0, App_1.confirmReadyToOpenApp)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!currentSearchResults?.search?.type) {
            return;
        }
        setLastSearchType(currentSearchResults.search.type);
        if (currentSearchResults.data) {
            lastNonEmptySearchResults.current = currentSearchResults;
        }
    }, [lastSearchType, queryJSON, setLastSearchType, currentSearchResults]);
    const { status, hash } = queryJSON ?? {};
    const selectedTransactionsKeys = Object.keys(selectedTransactions ?? {});
    const beginExportWithTemplate = (0, react_1.useCallback)((templateName, templateType, policyID) => {
        // If the user has selected a large number of items, we'll use the queryJSON to search for the reportIDs and transactionIDs necessary for the export
        if (areAllMatchingItemsSelected) {
            (0, Search_2.queueExportSearchWithTemplate)({ templateName, templateType, jsonQuery: JSON.stringify(queryJSON), reportIDList: [], transactionIDList: [], policyID });
        }
        else {
            // Otherwise, we will use the selected transactionIDs and reportIDs directly
            const selectedTransactionReportIDs = [...new Set(Object.values(selectedTransactions).map((transaction) => transaction.reportID))];
            (0, Search_2.queueExportSearchWithTemplate)({
                templateName,
                templateType,
                jsonQuery: '{}',
                reportIDList: selectedTransactionReportIDs,
                transactionIDList: selectedTransactionsKeys,
                policyID,
            });
        }
        setIsExportWithTemplateModalVisible(true);
    }, [queryJSON, selectedTransactions, selectedTransactionsKeys, areAllMatchingItemsSelected]);
    const headerButtonsOptions = (0, react_1.useMemo)(() => {
        if (selectedTransactionsKeys.length === 0 || status == null || !hash) {
            return CONST_1.default.EMPTY_ARRAY;
        }
        const options = [];
        const isAnyTransactionOnHold = Object.values(selectedTransactions).some((transaction) => transaction.isHeld);
        // Gets the list of options for the export sub-menu
        const getExportOptions = () => {
            // We provide the basic and expense level export options by default
            const exportOptions = [
                {
                    text: translate('export.basicExport'),
                    icon: Expensicons.Table,
                    onSelected: () => {
                        if (isOffline) {
                            setIsOfflineModalVisible(true);
                            return;
                        }
                        if (areAllMatchingItemsSelected) {
                            setIsDownloadExportModalVisible(true);
                            return;
                        }
                        (0, Search_2.exportSearchItemsToCSV)({
                            query: status,
                            jsonQuery: JSON.stringify(queryJSON),
                            reportIDList: selectedReports?.filter((report) => !!report).map((report) => report.reportID) ?? [],
                            transactionIDList: selectedTransactionsKeys,
                        }, () => {
                            setIsDownloadErrorModalVisible(true);
                        });
                        clearSelectedTransactions(undefined, true);
                    },
                    shouldCloseModalOnSelect: true,
                    shouldCallAfterModalHide: true,
                },
                {
                    text: translate('export.expenseLevelExport'),
                    icon: Expensicons.Table,
                    onSelected: () => {
                        // The report level export template is not policy specific, so we don't need to pass a policyID
                        beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, undefined);
                    },
                    shouldCloseModalOnSelect: true,
                    shouldCallAfterModalHide: true,
                },
            ];
            // Determine if only full reports are selected by comparing the reportIDs of the selected transactions and the reportIDs of the selected reports
            const selectedTransactionReportIDs = [...new Set(Object.values(selectedTransactions).map((transaction) => transaction.reportID))];
            const selectedReportIDs = Object.values(selectedReports).map((report) => report.reportID);
            const areFullReportsSelected = selectedTransactionReportIDs.length === selectedReportIDs.length && selectedTransactionReportIDs.every((id) => selectedReportIDs.includes(id));
            const groupByReports = queryJSON?.groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS;
            const typeInvoice = queryJSON?.type === CONST_1.default.REPORT.TYPE.INVOICE;
            // Add the report level export if fully reports are selected and we're on the report page
            if ((groupByReports || typeInvoice) && areFullReportsSelected) {
                exportOptions.push({
                    text: translate('export.reportLevelExport'),
                    icon: Expensicons.Table,
                    onSelected: () => {
                        // The report level export template is not policy specific, so we don't need to pass a policyID
                        beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, undefined);
                    },
                    shouldCloseModalOnSelect: true,
                    shouldCallAfterModalHide: true,
                });
            }
            // If the user has any custom integration export templates, add them as export options
            if (integrationsExportTemplates && integrationsExportTemplates.length > 0) {
                for (const template of integrationsExportTemplates) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        onSelected: () => {
                            // Custom IS templates are not policy specific, so we don't need to pass a policyID
                            beginExportWithTemplate(template.name, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, undefined);
                        },
                        shouldCloseModalOnSelect: true,
                        shouldCallAfterModalHide: true,
                    });
                }
            }
            // Collate a list of policyIDs from the selected transactions
            const selectedPolicyIDs = [
                ...new Set(Object.values(selectedTransactions)
                    .map((transaction) => transaction.policyID)
                    .filter(Boolean)),
            ];
            // If all of the transactions are on the same policy, add the policy-level in-app export templates as export options
            if (selectedPolicyIDs.length === 1) {
                const policyID = selectedPolicyIDs.at(0);
                const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
                const templates = Object.entries(policy?.exportLayouts ?? {}).map(([templateName, layout]) => ({
                    ...layout,
                    templateName,
                }));
                for (const template of templates) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        description: policy?.name,
                        onSelected: () => {
                            beginExportWithTemplate(template.templateName, CONST_1.default.EXPORT_TEMPLATE_TYPES.IN_APP, policyID);
                        },
                        shouldCloseModalOnSelect: true,
                        shouldCallAfterModalHide: true,
                    });
                }
            }
            // Collate a list of the user's account level in-app export templates, excluding the Default CSV template
            const accountInAppTemplates = Object.entries(csvExportLayouts ?? {})
                .filter(([, layout]) => layout.name !== CONST_1.default.REPORT.EXPORT_OPTION_LABELS.DEFAULT_CSV)
                .map(([templateName, layout]) => ({
                ...layout,
                templateName,
            }));
            if (accountInAppTemplates && accountInAppTemplates.length > 0) {
                for (const template of accountInAppTemplates) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        onSelected: () => {
                            // Account level in-app export templates are not policy specific, so we don't need to pass a policyID
                            beginExportWithTemplate(template.templateName, CONST_1.default.EXPORT_TEMPLATE_TYPES.IN_APP, undefined);
                        },
                        shouldCloseModalOnSelect: true,
                        shouldCallAfterModalHide: true,
                    });
                }
            }
            return exportOptions;
        };
        const exportButtonOption = {
            icon: Expensicons.Export,
            rightIcon: Expensicons.ArrowRight,
            text: translate('common.export'),
            backButtonText: translate('common.export'),
            value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.EXPORT,
            shouldCloseModalOnSelect: true,
            subMenuItems: getExportOptions(),
        };
        // If all matching items are selected, we don't give the user additional options, we only allow them to export the selected items
        if (areAllMatchingItemsSelected) {
            return [exportButtonOption];
        }
        // Otherwise, we provide the full set of options depending on the state of the selected transactions and reports
        const shouldShowApproveOption = !isOffline &&
            !isAnyTransactionOnHold &&
            (selectedReports.length
                ? selectedReports.every((report) => report.allActions.includes(CONST_1.default.SEARCH.ACTION_TYPES.APPROVE))
                : selectedTransactionsKeys.every((id) => selectedTransactions[id].action === CONST_1.default.SEARCH.ACTION_TYPES.APPROVE));
        if (shouldShowApproveOption) {
            options.push({
                icon: Expensicons.ThumbsUp,
                text: translate('search.bulkActions.approve'),
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.APPROVE,
                shouldCloseModalOnSelect: true,
                onSelected: () => {
                    if (isOffline) {
                        setIsOfflineModalVisible(true);
                        return;
                    }
                    const transactionIDList = selectedReports.length ? undefined : Object.keys(selectedTransactions);
                    const reportIDList = !selectedReports.length
                        ? Object.values(selectedTransactions).map((transaction) => transaction.reportID)
                        : (selectedReports?.filter((report) => !!report).map((report) => report.reportID) ?? []);
                    (0, Search_2.approveMoneyRequestOnSearch)(hash, reportIDList, transactionIDList);
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        clearSelectedTransactions();
                    });
                },
            });
        }
        const shouldShowPayOption = !isOffline &&
            !isAnyTransactionOnHold &&
            (selectedReports.length
                ? selectedReports.every((report) => report.allActions.includes(CONST_1.default.SEARCH.ACTION_TYPES.PAY) && report.policyID && (0, Search_2.getLastPolicyPaymentMethod)(report.policyID, lastPaymentMethods))
                : selectedTransactionsKeys.every((id) => selectedTransactions[id].action === CONST_1.default.SEARCH.ACTION_TYPES.PAY &&
                    selectedTransactions[id].policyID &&
                    (0, Search_2.getLastPolicyPaymentMethod)(selectedTransactions[id].policyID, lastPaymentMethods)));
        if (shouldShowPayOption) {
            options.push({
                icon: Expensicons.MoneyBag,
                text: translate('search.bulkActions.pay'),
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.PAY,
                shouldCloseModalOnSelect: true,
                onSelected: () => {
                    if (isOffline) {
                        setIsOfflineModalVisible(true);
                        return;
                    }
                    const activeRoute = Navigation_1.default.getActiveRoute();
                    const transactionIDList = selectedReports.length ? undefined : Object.keys(selectedTransactions);
                    const items = selectedReports.length ? selectedReports : Object.values(selectedTransactions);
                    for (const item of items) {
                        const itemPolicyID = item.policyID;
                        const lastPolicyPaymentMethod = (0, Search_2.getLastPolicyPaymentMethod)(itemPolicyID, lastPaymentMethods);
                        if (!lastPolicyPaymentMethod) {
                            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({
                                reportID: item.reportID,
                                backTo: activeRoute,
                            }));
                            return;
                        }
                        const hasPolicyVBBA = (0, PolicyUtils_1.hasVBBA)(itemPolicyID);
                        if (lastPolicyPaymentMethod !== CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE && !hasPolicyVBBA) {
                            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({
                                reportID: item.reportID,
                                backTo: activeRoute,
                            }));
                            return;
                        }
                    }
                    const paymentData = (selectedReports.length
                        ? selectedReports.map((report) => ({
                            reportID: report.reportID,
                            amount: report.total,
                            paymentType: (0, Search_2.getLastPolicyPaymentMethod)(report.policyID, lastPaymentMethods),
                        }))
                        : Object.values(selectedTransactions).map((transaction) => ({
                            reportID: transaction.reportID,
                            amount: transaction.amount,
                            paymentType: (0, Search_2.getLastPolicyPaymentMethod)(transaction.policyID, lastPaymentMethods),
                        })));
                    (0, Search_2.payMoneyRequestOnSearch)(hash, paymentData, transactionIDList);
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        clearSelectedTransactions();
                    });
                },
            });
        }
        options.push(exportButtonOption);
        const shouldShowHoldOption = !isOffline && selectedTransactionsKeys.every((id) => selectedTransactions[id].canHold);
        if (shouldShowHoldOption) {
            options.push({
                icon: Expensicons.Stopwatch,
                text: translate('search.bulkActions.hold'),
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.HOLD,
                shouldCloseModalOnSelect: true,
                onSelected: () => {
                    if (isOffline) {
                        setIsOfflineModalVisible(true);
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_HOLD_REASON_RHP);
                },
            });
        }
        const shouldShowUnholdOption = !isOffline && selectedTransactionsKeys.every((id) => selectedTransactions[id].canUnhold);
        if (shouldShowUnholdOption) {
            options.push({
                icon: Expensicons.Stopwatch,
                text: translate('search.bulkActions.unhold'),
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.UNHOLD,
                shouldCloseModalOnSelect: true,
                onSelected: () => {
                    if (isOffline) {
                        setIsOfflineModalVisible(true);
                        return;
                    }
                    (0, Search_2.unholdMoneyRequestOnSearch)(hash, selectedTransactionsKeys);
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        clearSelectedTransactions();
                    });
                },
            });
        }
        const canAllTransactionsBeMoved = selectedTransactionsKeys.every((id) => selectedTransactions[id].canChangeReport);
        if (canAllTransactionsBeMoved) {
            options.push({
                text: translate('iou.moveExpenses', { count: selectedTransactionsKeys.length }),
                icon: Expensicons.DocumentMerge,
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.CHANGE_REPORT,
                shouldCloseModalOnSelect: true,
                onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.MOVE_TRANSACTIONS_SEARCH_RHP),
            });
        }
        const shouldShowDeleteOption = !isOffline && selectedTransactionsKeys.every((id) => selectedTransactions[id].canDelete);
        if (shouldShowDeleteOption) {
            options.push({
                icon: Expensicons.Trashcan,
                text: translate('search.bulkActions.delete'),
                value: CONST_1.default.SEARCH.BULK_ACTION_TYPES.DELETE,
                shouldCloseModalOnSelect: true,
                onSelected: () => {
                    if (isOffline) {
                        setIsOfflineModalVisible(true);
                        return;
                    }
                    // Use InteractionManager to ensure this runs after the dropdown modal closes
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        setIsDeleteExpensesConfirmModalVisible(true);
                    });
                },
            });
        }
        if (options.length === 0) {
            const emptyOptionStyle = {
                interactive: false,
                iconFill: theme.icon,
                iconHeight: variables_1.default.iconSizeLarge,
                iconWidth: variables_1.default.iconSizeLarge,
                numberOfLinesTitle: 2,
                titleStyle: { ...styles.colorMuted, ...styles.fontWeightNormal, ...styles.textWrap },
            };
            options.push({
                icon: Expensicons.Exclamation,
                text: translate('search.bulkActions.noOptionsAvailable'),
                value: undefined,
                ...emptyOptionStyle,
            });
        }
        return options;
    }, [
        selectedTransactionsKeys,
        status,
        hash,
        selectedTransactions,
        translate,
        areAllMatchingItemsSelected,
        isOffline,
        selectedReports,
        queryJSON,
        clearSelectedTransactions,
        lastPaymentMethods,
        theme.icon,
        styles.colorMuted,
        styles.fontWeightNormal,
        styles.textWrap,
        beginExportWithTemplate,
        integrationsExportTemplates,
        csvExportLayouts,
        policies,
    ]);
    const handleDeleteExpenses = () => {
        if (selectedTransactionsKeys.length === 0 || !hash) {
            return;
        }
        setIsDeleteExpensesConfirmModalVisible(false);
        // Translations copy for delete modal depends on amount of selected items,
        // We need to wait for modal to fully disappear before clearing them to avoid translation flicker between singular vs plural
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Search_2.deleteMoneyRequestOnSearch)(hash, selectedTransactionsKeys);
            clearSelectedTransactions();
        });
    };
    const saveFileAndInitMoneyRequest = (files) => {
        const initialTransaction = (0, IOU_1.initMoneyRequest)({
            isFromGlobalCreate: true,
            reportID: newReportID,
            newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
            report: newReport,
            parentReport: newParentReport,
            currentDate,
        });
        const newReceiptFiles = [];
        files.forEach((file, index) => {
            const source = URL.createObjectURL(file);
            const transaction = index === 0
                ? initialTransaction
                : (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction: initialTransaction,
                    currentUserPersonalDetails,
                    reportID: newReportID,
                });
            const transactionID = transaction.transactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID;
            newReceiptFiles.push({
                file,
                source,
                transactionID,
            });
            (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, file.name ?? '', true);
        });
        if ((0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            const activePolicyExpenseChat = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy?.id);
            const setParticipantsPromises = newReceiptFiles.map((receiptFile) => (0, IOU_1.setMoneyRequestParticipantsFromReport)(receiptFile.transactionID, activePolicyExpenseChat));
            Promise.all(setParticipantsPromises).then(() => Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, initialTransaction?.transactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, activePolicyExpenseChat?.reportID)));
        }
        else {
            (0, IOUUtils_1.navigateToParticipantPage)(CONST_1.default.IOU.TYPE.CREATE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, newReportID);
        }
    };
    const { validateFiles, PDFValidationComponent, ErrorModal } = (0, useFilesValidation_1.default)(saveFileAndInitMoneyRequest);
    const initScanRequest = (e) => {
        const files = Array.from(e?.dataTransfer?.files ?? []);
        if (files.length === 0) {
            return;
        }
        files.forEach((file) => {
            // eslint-disable-next-line no-param-reassign
            file.uri = URL.createObjectURL(file);
        });
        validateFiles(files, Array.from(e.dataTransfer?.items ?? []));
    };
    const createExportAll = (0, react_1.useCallback)(() => {
        if (selectedTransactionsKeys.length === 0 || status == null || !hash) {
            return [];
        }
        setIsDownloadExportModalVisible(false);
        const reportIDList = selectedReports?.filter((report) => !!report).map((report) => report.reportID) ?? [];
        (0, Search_2.queueExportSearchItemsToCSV)({
            query: status,
            jsonQuery: JSON.stringify(queryJSON),
            reportIDList,
            transactionIDList: selectedTransactionsKeys,
        });
        selectAllMatchingItems(false);
        clearSelectedTransactions();
    }, [selectedTransactionsKeys, status, hash, selectedReports, queryJSON, selectAllMatchingItems, clearSelectedTransactions]);
    const handleOnBackButtonPress = () => Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
    const { resetVideoPlayerData } = (0, PlaybackContext_1.usePlaybackContext)();
    const searchResults = currentSearchResults?.data ? currentSearchResults : lastNonEmptySearchResults.current;
    const metadata = searchResults?.search;
    const shouldShowOfflineIndicator = !!searchResults?.data;
    const shouldShowFooter = !!metadata?.count;
    const offlineIndicatorStyle = (0, react_1.useMemo)(() => {
        if (shouldShowFooter) {
            return [styles.mtAuto, styles.pAbsolute, styles.h10, styles.b0];
        }
        return [styles.mtAuto];
    }, [shouldShowFooter, styles]);
    // Handles video player cleanup:
    // 1. On mount: Resets player if navigating from report screen
    // 2. On unmount: Stops video when leaving this screen
    // in narrow layout, the reset will be handled by the attachment modal, so we don't need to do it here to preserve autoplay
    (0, react_1.useEffect)(() => {
        if (shouldUseNarrowLayout) {
            return;
        }
        resetVideoPlayerData();
        return () => {
            if (shouldUseNarrowLayout) {
                return;
            }
            resetVideoPlayerData();
        };
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSearchAction = (0, react_1.useCallback)((value) => {
        if (typeof value === 'string') {
            (0, Report_1.searchInServer)(value);
        }
        else {
            (0, Search_2.search)(value);
        }
    }, []);
    const footerData = (0, react_1.useMemo)(() => {
        const shouldUseClientTotal = selectedTransactionsKeys.length > 0 && !areAllMatchingItemsSelected;
        const currency = metadata?.currency;
        const count = shouldUseClientTotal ? selectedTransactionsKeys.length : metadata?.count;
        const total = shouldUseClientTotal ? Object.values(selectedTransactions).reduce((acc, transaction) => acc - (transaction.convertedAmount ?? 0), 0) : metadata?.total;
        return { count, total, currency };
    }, [areAllMatchingItemsSelected, metadata?.count, metadata?.currency, metadata?.total, selectedTransactions, selectedTransactionsKeys.length]);
    if (shouldUseNarrowLayout) {
        return (<>
                <Provider_1.default>
                    {PDFValidationComponent}
                    <SearchPageNarrow_1.default queryJSON={queryJSON} metadata={metadata} headerButtonsOptions={headerButtonsOptions} searchResults={searchResults} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled} footerData={footerData}/>
                    <Consumer_1.default onDrop={initScanRequest}>
                        <DropZoneUI_1.default icon={Expensicons.SmartScan} dropTitle={translate('dropzone.scanReceipts')} dropStyles={styles.receiptDropOverlay(true)} dropTextStyles={styles.receiptDropText} dropWrapperStyles={{ marginBottom: variables_1.default.bottomTabHeight }} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                    </Consumer_1.default>
                    {ErrorModal}
                </Provider_1.default>
                {!!isMobileSelectionModeEnabled && (<react_native_1.View>
                        <ConfirmModal_1.default isVisible={isDeleteExpensesConfirmModalVisible} onConfirm={handleDeleteExpenses} onCancel={() => {
                    setIsDeleteExpensesConfirmModalVisible(false);
                }} title={translate('iou.deleteExpense', { count: selectedTransactionsKeys.length })} prompt={translate('iou.deleteConfirmation', { count: selectedTransactionsKeys.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                        <DecisionModal_1.default title={translate('common.youAppearToBeOffline')} prompt={translate('common.offlinePrompt')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsOfflineModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isOfflineModalVisible} onClose={() => setIsOfflineModalVisible(false)}/>
                        <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadErrorModalVisible} onClose={() => setIsDownloadErrorModalVisible(false)}/>
                        <ConfirmModal_1.default isVisible={isExportWithTemplateModalVisible} onConfirm={() => {
                    setIsExportWithTemplateModalVisible(false);
                    clearSelectedTransactions(undefined, true);
                }} onCancel={() => setIsExportWithTemplateModalVisible(false)} title={translate('export.exportInProgress')} prompt={translate('export.conciergeWillSend')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                    </react_native_1.View>)}
            </>);
    }
    return (<ScreenWrapper_1.default testID={Search_1.default.displayName} shouldEnableMaxHeight headerGapStyles={[styles.searchHeaderGap, styles.h0]}>
            <FullPageNotFoundView_1.default shouldForceFullScreen shouldShow={!queryJSON} onBackButtonPress={handleOnBackButtonPress} shouldShowLink={false}>
                {!!queryJSON && (<react_native_1.View style={styles.searchSplitContainer}>
                        <ScreenWrapper_1.default testID={Search_1.default.displayName} shouldShowOfflineIndicatorInWideScreen={!!shouldShowOfflineIndicator} offlineIndicatorStyle={offlineIndicatorStyle}>
                            <Provider_1.default>
                                {PDFValidationComponent}
                                <SearchPageHeader_1.default queryJSON={queryJSON} headerButtonsOptions={headerButtonsOptions} handleSearch={handleSearchAction} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>
                                <SearchFiltersBar_1.default queryJSON={queryJSON} headerButtonsOptions={headerButtonsOptions} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>
                                <Search_1.default key={queryJSON.hash} queryJSON={queryJSON} searchResults={searchResults} handleSearch={handleSearchAction} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled} onSearchListScroll={(e) => {
                if (!e.nativeEvent.contentOffset.y) {
                    return;
                }
                saveScrollOffset(route, e.nativeEvent.contentOffset.y);
            }}/>
                                {shouldShowFooter && (<SearchPageFooter_1.default count={footerData.count} total={footerData.total} currency={footerData.currency}/>)}
                                <Consumer_1.default onDrop={initScanRequest}>
                                    <DropZoneUI_1.default icon={Expensicons.SmartScan} dropTitle={translate('dropzone.scanReceipts')} dropStyles={styles.receiptDropOverlay(true)} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                                </Consumer_1.default>
                            </Provider_1.default>
                        </ScreenWrapper_1.default>
                        {ErrorModal}
                    </react_native_1.View>)}
                <ConfirmModal_1.default isVisible={isDeleteExpensesConfirmModalVisible} onConfirm={handleDeleteExpenses} onCancel={() => {
            setIsDeleteExpensesConfirmModalVisible(false);
        }} title={translate('iou.deleteExpense', { count: selectedTransactionsKeys.length })} prompt={translate('iou.deleteConfirmation', { count: selectedTransactionsKeys.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <ConfirmModal_1.default isVisible={isDownloadExportModalVisible} onConfirm={createExportAll} onCancel={() => {
            setIsDownloadExportModalVisible(false);
        }} title={translate('search.exportSearchResults.title')} prompt={translate('search.exportSearchResults.description')} confirmText={translate('search.exportSearchResults.title')} cancelText={translate('common.cancel')}/>
                <ConfirmModal_1.default isVisible={isExportWithTemplateModalVisible} onConfirm={() => {
            setIsExportWithTemplateModalVisible(false);
            clearSelectedTransactions(undefined, true);
        }} onCancel={() => setIsExportWithTemplateModalVisible(false)} title={translate('export.exportInProgress')} prompt={translate('export.conciergeWillSend')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                <DecisionModal_1.default title={translate('common.youAppearToBeOffline')} prompt={translate('common.offlinePrompt')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsOfflineModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isOfflineModalVisible} onClose={() => setIsOfflineModalVisible(false)}/>
                <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadErrorModalVisible} onClose={() => setIsDownloadErrorModalVisible(false)}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
SearchPage.displayName = 'SearchPage';
SearchPage.whyDidYouRender = true;
exports.default = SearchPage;
