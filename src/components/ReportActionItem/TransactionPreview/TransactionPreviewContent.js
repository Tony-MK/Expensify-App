"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const truncate_1 = require("lodash/truncate");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ReportActionItemImages_1 = require("@components/ReportActionItem/ReportActionItemImages");
const UserInfoCellsWithArrow_1 = require("@components/SelectionList/Search/UserInfoCellsWithArrow");
const Text_1 = require("@components/Text");
const TransactionPreviewSkeletonView_1 = require("@components/TransactionPreviewSkeletonView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const IOUUtils_1 = require("@libs/IOUUtils");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const TransactionPreviewUtils_1 = require("@libs/TransactionPreviewUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TransactionPreviewContent({ action, isWhisper, isHovered, chatReport, personalDetails, report, transaction, violations, transactionRawAmount, offlineWithFeedbackOnClose, containerStyles, transactionPreviewWidth, isBillSplit, areThereDuplicates, sessionAccountID, walletTermsErrors, reportPreviewAction, shouldHideOnDelete = true, shouldShowPayerAndReceiver, navigateToReviewFields, isReviewDuplicateTransactionPage = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const transactionDetails = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(transaction, undefined, policy) ?? {}, [transaction, policy]);
    const { amount, comment: requestComment, merchant, tag, category, currency: requestCurrency } = transactionDetails;
    const managerID = report?.managerID ?? reportPreviewAction?.childManagerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const ownerAccountID = report?.ownerAccountID ?? reportPreviewAction?.childOwnerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isReportAPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport);
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${(0, getNonEmptyStringOnyxID_1.default)(report?.reportID)}`, { canBeMissing: true });
    const transactionPreviewCommonArguments = (0, react_1.useMemo)(() => ({
        iouReport: report,
        transaction,
        action,
        isBillSplit,
        violations,
        transactionDetails,
    }), [action, report, isBillSplit, transaction, transactionDetails, violations]);
    const conditionals = (0, react_1.useMemo)(() => (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)({
        ...transactionPreviewCommonArguments,
        areThereDuplicates,
        isReportAPolicyExpenseChat,
    }), [areThereDuplicates, transactionPreviewCommonArguments, isReportAPolicyExpenseChat]);
    const { shouldShowRBR, shouldShowMerchant, shouldShowSplitShare, shouldShowTag, shouldShowCategory, shouldShowSkeleton, shouldShowDescription } = conditionals;
    const firstViolation = violations.at(0);
    const isIOUActionType = (0, ReportActionsUtils_1.isMoneyRequestAction)(action);
    const canEdit = isIOUActionType && (0, ReportUtils_1.canEditMoneyRequest)(action, transaction);
    const violationMessage = firstViolation ? ViolationsUtils_1.default.getViolationTranslation(firstViolation, translate, canEdit) : undefined;
    const previewText = (0, react_1.useMemo)(() => (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)({
        ...transactionPreviewCommonArguments,
        shouldShowRBR,
        violationMessage,
        reportActions,
    }), [transactionPreviewCommonArguments, shouldShowRBR, violationMessage, reportActions]);
    const getTranslatedText = (item) => (item.translationPath ? translate(item.translationPath) : (item.text ?? ''));
    const previewHeaderText = previewText.previewHeaderText.reduce((text, currentKey) => {
        return `${text}${getTranslatedText(currentKey)}`;
    }, '');
    const RBRMessage = getTranslatedText(previewText.RBRMessage);
    const displayAmountText = getTranslatedText(previewText.displayAmountText);
    const displayDeleteAmountText = getTranslatedText(previewText.displayDeleteAmountText);
    const isDeleted = action?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || transaction?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    const shouldShowCategoryOrTag = shouldShowCategory || shouldShowTag;
    const shouldShowMerchantOrDescription = shouldShowDescription || shouldShowMerchant;
    const description = (0, truncate_1.default)(StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(requestComment ?? '')), { length: CONST_1.default.REQUEST_PREVIEW.MAX_LENGTH });
    const requestMerchant = (0, truncate_1.default)(merchant, { length: CONST_1.default.REQUEST_PREVIEW.MAX_LENGTH });
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isIOUSettled = (0, ReportUtils_1.isSettled)(report?.reportID);
    const isSettlementOrApprovalPartial = !!report?.pendingFields?.partial;
    const isTransactionScanning = (0, TransactionUtils_1.isScanning)(transaction);
    const displayAmount = isDeleted ? displayDeleteAmountText : displayAmountText;
    const receiptImages = [{ ...(0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction), transaction }];
    const merchantOrDescription = shouldShowMerchant ? requestMerchant : description || '';
    const participantAccountIDs = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && isBillSplit ? ((0, ReportActionsUtils_1.getOriginalMessage)(action)?.participantAccountIDs ?? []) : [managerID, ownerAccountID];
    const isCardTransaction = (0, TransactionUtils_1.isCardTransaction)(transaction);
    // Compute the from/to data only for IOU reports
    const { from, to } = (0, react_1.useMemo)(() => {
        if (!shouldShowPayerAndReceiver) {
            return {
                from: undefined,
                to: undefined,
            };
        }
        // For IOU or Split, we want the unprocessed amount because it is important whether the amount was positive or negative
        const payerAndReceiver = (0, TransactionPreviewUtils_1.getIOUPayerAndReceiver)(managerID, ownerAccountID, personalDetails, transactionRawAmount);
        return {
            from: payerAndReceiver.from,
            to: payerAndReceiver.to,
        };
    }, [managerID, ownerAccountID, personalDetails, shouldShowPayerAndReceiver, transactionRawAmount]);
    const shouldShowIOUHeader = !!from && !!to;
    // If available, retrieve the split share from the splits object of the transaction, if not, display an even share.
    const actorAccountID = action?.actorAccountID;
    const splitShare = (0, react_1.useMemo)(() => {
        if (!shouldShowSplitShare) {
            return 0;
        }
        const splitAmount = transaction?.comment?.splits?.find((split) => split.accountID === sessionAccountID)?.amount;
        if (splitAmount !== undefined) {
            return splitAmount;
        }
        let originalParticipantCount = participantAccountIDs.length;
        if (isBillSplit) {
            // Try to get the participant count from transaction splits data
            const transactionSplitsCount = transaction?.comment?.splits?.length;
            if (transactionSplitsCount && transactionSplitsCount > 0) {
                originalParticipantCount = transactionSplitsCount;
            }
            else if ((0, ReportActionsUtils_1.isMoneyRequestAction)(action)) {
                originalParticipantCount = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.participantAccountIDs?.length ?? participantAccountIDs.length;
            }
        }
        return (0, IOUUtils_1.calculateAmount)(isReportAPolicyExpenseChat ? 1 : originalParticipantCount - 1, amount ?? 0, requestCurrency ?? '', actorAccountID === sessionAccountID);
    }, [
        shouldShowSplitShare,
        isReportAPolicyExpenseChat,
        participantAccountIDs.length,
        transaction?.comment?.splits,
        amount,
        requestCurrency,
        sessionAccountID,
        isBillSplit,
        action,
        actorAccountID,
    ]);
    const shouldWrapDisplayAmount = !(isBillSplit || shouldShowMerchantOrDescription || isTransactionScanning);
    const previewTextViewGap = (shouldShowCategoryOrTag || !shouldWrapDisplayAmount) && styles.gap2;
    const previewTextMargin = shouldShowIOUHeader && shouldShowMerchantOrDescription && !isBillSplit && !shouldShowCategoryOrTag && styles.mbn1;
    const transactionWrapperStyles = [styles.border, styles.moneyRequestPreviewBox, (isIOUSettled || isApproved) && isSettlementOrApprovalPartial && styles.offlineFeedback.pending];
    return (<react_native_1.View style={[transactionWrapperStyles, containerStyles]}>
            <OfflineWithFeedback_1.default errors={walletTermsErrors} onClose={() => offlineWithFeedbackOnClose} errorRowStyles={[styles.mbn1]} needsOffscreenAlphaCompositing pendingAction={action?.pendingAction} shouldDisableStrikeThrough={isDeleted} shouldDisableOpacity={isDeleted} shouldHideOnDelete={shouldHideOnDelete}>
                <react_native_1.View style={[(isTransactionScanning || isWhisper) && [styles.reportPreviewBoxHoverBorder, styles.reportContainerBorderRadius]]}>
                    <ReportActionItemImages_1.default images={receiptImages} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    isHovered={isHovered || isTransactionScanning} size={1} shouldUseAspectRatio/>
                    {shouldShowSkeleton ? (<TransactionPreviewSkeletonView_1.default transactionPreviewWidth={transactionPreviewWidth}/>) : (<react_native_1.View style={[styles.expenseAndReportPreviewBoxBody, styles.mtn1]}>
                            <react_native_1.View style={styles.gap3}>
                                {shouldShowIOUHeader && (<UserInfoCellsWithArrow_1.default shouldShowToRecipient participantFrom={from} participantFromDisplayName={from.displayName ?? from.login ?? translate('common.hidden')} participantToDisplayName={to.displayName ?? to.login ?? translate('common.hidden')} participantTo={to} avatarSize="mid-subscript" infoCellsTextStyle={{ ...styles.textMicroBold, lineHeight: 14 }} infoCellsAvatarStyle={styles.pr1} style={[styles.flex1, styles.dFlex, styles.alignItemsCenter, styles.gap2, styles.flexRow]}/>)}
                                <react_native_1.View style={previewTextViewGap}>
                                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                        <Text_1.default style={[isDeleted && styles.lineThrough, styles.textLabelSupporting, styles.flex1, styles.lh16, previewTextMargin]}>{previewHeaderText}</Text_1.default>
                                        {isBillSplit && (<react_native_1.View style={styles.moneyRequestPreviewBoxAvatar}>
                                                <ReportActionAvatars_1.default accountIDs={participantAccountIDs} horizontalStacking={{
                    sort: CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.ID,
                    useCardBG: true,
                }} size={CONST_1.default.AVATAR_SIZE.SUBSCRIPT}/>
                                            </react_native_1.View>)}
                                        {shouldWrapDisplayAmount && (<Text_1.default fontSize={variables_1.default.fontSizeNormal} style={[isDeleted && styles.lineThrough, styles.flexShrink0]} numberOfLines={1}>
                                                {displayAmount}
                                            </Text_1.default>)}
                                    </react_native_1.View>
                                    <react_native_1.View>
                                        <react_native_1.View style={[styles.flexRow]}>
                                            <react_native_1.View style={[
                styles.flex1,
                styles.flexRow,
                styles.alignItemsCenter,
                isBillSplit && !shouldShowMerchantOrDescription ? styles.justifyContentEnd : styles.justifyContentBetween,
                styles.gap2,
            ]}>
                                                {shouldShowMerchantOrDescription && (<Text_1.default fontSize={variables_1.default.fontSizeNormal} style={[isDeleted && styles.lineThrough, styles.flexShrink1]} numberOfLines={1}>
                                                        {merchantOrDescription}
                                                    </Text_1.default>)}
                                                {!shouldWrapDisplayAmount && (<Text_1.default fontSize={variables_1.default.fontSizeNormal} style={[isDeleted && styles.lineThrough, styles.flexShrink0]} numberOfLines={1}>
                                                        {displayAmount}
                                                    </Text_1.default>)}
                                            </react_native_1.View>
                                        </react_native_1.View>
                                        <react_native_1.View style={[styles.flexRow, styles.justifyContentEnd]}>
                                            {!!splitShare && (<Text_1.default style={[isDeleted && styles.lineThrough, styles.textLabel, styles.colorMuted, styles.amountSplitPadding]}>
                                                    {translate('iou.yourSplit', { amount: (0, CurrencyUtils_1.convertToDisplayString)(splitShare, requestCurrency) })}
                                                </Text_1.default>)}
                                        </react_native_1.View>
                                    </react_native_1.View>
                                    {shouldShowCategoryOrTag && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                            {shouldShowCategory && (<react_native_1.View style={[
                        styles.flexRow,
                        styles.alignItemsCenter,
                        styles.gap1,
                        shouldShowTag && styles.mw50,
                        shouldShowTag && styles.pr1,
                        styles.flexShrink1,
                    ]}>
                                                    <Icon_1.default src={Expensicons_1.Folder} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                                                    <Text_1.default numberOfLines={1} style={[isDeleted && styles.lineThrough, styles.textMicroSupporting, styles.pre, styles.flexShrink1]}>
                                                        {category}
                                                    </Text_1.default>
                                                </react_native_1.View>)}
                                            {shouldShowTag && !!tag && (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.gap1, category && styles.pl1]}>
                                                    <Icon_1.default src={Expensicons_1.Tag} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                                                    <Text_1.default numberOfLines={1} style={[isDeleted && styles.lineThrough, styles.textMicroSupporting, styles.pre, styles.flexShrink1]}>
                                                        {(0, PolicyUtils_1.getCommaSeparatedTagNameWithSanitizedColons)(tag)}
                                                    </Text_1.default>
                                                </react_native_1.View>)}
                                        </react_native_1.View>)}
                                </react_native_1.View>
                                {!isIOUSettled && shouldShowRBR && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
                                        <Icon_1.default src={Expensicons_1.DotIndicator} fill={theme.danger} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall}/>
                                        <Text_1.default numberOfLines={1} style={[isDeleted && styles.lineThrough, styles.textMicroSupporting, styles.pre, styles.flexShrink1, { color: theme.danger }]}>
                                            {RBRMessage}
                                        </Text_1.default>
                                    </react_native_1.View>)}
                            </react_native_1.View>
                        </react_native_1.View>)}
                    {isReviewDuplicateTransactionPage && !isIOUSettled && !isApproved && !isCardTransaction && areThereDuplicates && (<Button_1.default text={translate('violations.keepThisOne')} success style={[styles.ph4, styles.pb4]} onPress={navigateToReviewFields}/>)}
                </react_native_1.View>
            </OfflineWithFeedback_1.default>
        </react_native_1.View>);
}
TransactionPreviewContent.displayName = 'TransactionPreviewContent';
exports.default = TransactionPreviewContent;
