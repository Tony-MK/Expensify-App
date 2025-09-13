"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flash_list_1 = require("@shopify/flash-list");
const sortBy_1 = require("lodash/sortBy");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FormAlertWrapper_1 = require("@components/FormAlertWrapper");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const CardUtils_1 = require("@libs/CardUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function dismissError(item) {
    if (item.cardID) {
        (0, PaymentMethods_1.clearDeletePaymentMethodError)(ONYXKEYS_1.default.CARD_LIST, item.cardID);
        return;
    }
    const isBankAccount = item.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT;
    const paymentList = isBankAccount ? ONYXKEYS_1.default.BANK_ACCOUNT_LIST : ONYXKEYS_1.default.FUND_LIST;
    const paymentID = isBankAccount ? item.accountData?.bankAccountID : item.accountData?.fundID;
    if (!paymentID) {
        Log_1.default.info('Unable to clear payment method error: ', undefined, item);
        return;
    }
    if (item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
        (0, PaymentMethods_1.clearDeletePaymentMethodError)(paymentList, paymentID);
        if (!isBankAccount) {
            (0, PaymentMethods_1.clearDeletePaymentMethodError)(ONYXKEYS_1.default.FUND_LIST, paymentID);
        }
    }
    else {
        (0, PaymentMethods_1.clearAddPaymentMethodError)(paymentList, paymentID);
        if (!isBankAccount) {
            (0, PaymentMethods_1.clearAddPaymentMethodError)(ONYXKEYS_1.default.FUND_LIST, paymentID);
        }
    }
}
function shouldShowDefaultBadge(filteredPaymentMethods, isDefault = false) {
    if (!isDefault) {
        return false;
    }
    const defaultPaymentMethodCount = filteredPaymentMethods.filter((method) => method.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT || method.accountType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD).length;
    return defaultPaymentMethodCount > 1;
}
function isPaymentMethodActive(actionPaymentMethodType, activePaymentMethodID, paymentMethod) {
    return paymentMethod.accountType === actionPaymentMethodType && paymentMethod.methodID === activePaymentMethodID;
}
function keyExtractor(item) {
    if (typeof item === 'string') {
        return item;
    }
    return item.key ?? '';
}
function PaymentMethodList({ actionPaymentMethodType = '', activePaymentMethodID = '', buttonRef = () => { }, filterType = '', listHeaderComponent, onPress, shouldShowSelectedState = false, shouldShowAddPaymentMethodButton = true, shouldShowAddBankAccountButton = false, shouldShowAddBankAccount = true, shouldShowEmptyListMessage = true, shouldShowAssignedCards = false, selectedMethodID = '', onListContentSizeChange = () => { }, style = {}, listItemStyle = {}, shouldShowRightIcon = true, invoiceTransferBankAccountID, shouldShowBankAccountSections = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [bankAccountList = (0, EmptyObject_1.getEmptyObject)(), bankAccountListResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const isLoadingBankAccountList = (0, isLoadingOnyxValue_1.default)(bankAccountListResult);
    const [cardList = (0, EmptyObject_1.getEmptyObject)(), cardListResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const isLoadingCardList = (0, isLoadingOnyxValue_1.default)(cardListResult);
    // Temporarily disabled because P2P debit cards are disabled.
    // const [fundList = getEmptyObject<FundList>()] = useOnyx(ONYXKEYS.FUND_LIST);
    const [isLoadingPaymentMethods = true, isLoadingPaymentMethodsResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_PAYMENT_METHODS, { canBeMissing: true });
    const isLoadingPaymentMethodsOnyx = (0, isLoadingOnyxValue_1.default)(isLoadingPaymentMethodsResult);
    const filteredPaymentMethods = (0, react_1.useMemo)(() => {
        if (shouldShowAssignedCards) {
            const assignedCards = Object.values(isLoadingCardList ? {} : (cardList ?? {}))
                // Filter by active cards associated with a domain
                .filter((card) => !!card.domainName && CONST_1.default.EXPENSIFY_CARD.ACTIVE_STATES.includes(card.state ?? 0));
            const assignedCardsSorted = (0, sortBy_1.default)(assignedCards, CardUtils_1.getAssignedCardSortKey);
            const assignedCardsGrouped = [];
            assignedCardsSorted.forEach((card) => {
                const isDisabled = card.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || !!card.errors;
                const icon = (0, CardUtils_1.getCardFeedIcon)(card.bank, illustrations);
                if (!(0, CardUtils_1.isExpensifyCard)(card)) {
                    const pressHandler = onPress;
                    const lastFourPAN = (0, CardUtils_1.lastFourNumbersFromCardName)(card.cardName);
                    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(card.bank);
                    assignedCardsGrouped.push({
                        key: card.cardID.toString(),
                        plaidUrl,
                        title: (0, CardUtils_1.maskCardNumber)(card.cardName, card.bank),
                        description: lastFourPAN
                            ? `${lastFourPAN} ${CONST_1.default.DOT_SEPARATOR} ${(0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(card.domainName)}`
                            : (0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(card.domainName),
                        interactive: !isDisabled,
                        disabled: isDisabled,
                        canDismissError: false,
                        shouldShowRightIcon,
                        errors: card.errors,
                        pendingAction: card.pendingAction,
                        brickRoadIndicator: card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN || card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.INDIVIDUAL
                            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                            : undefined,
                        icon,
                        iconStyles: [styles.cardIcon],
                        iconWidth: variables_1.default.cardIconWidth,
                        iconHeight: variables_1.default.cardIconHeight,
                        iconRight: Expensicons.ThreeDots,
                        isMethodActive: activePaymentMethodID === card.cardID,
                        onPress: (e) => pressHandler(e, card, {
                            icon,
                            iconStyles: [styles.cardIcon],
                            iconWidth: variables_1.default.cardIconWidth,
                            iconHeight: variables_1.default.cardIconHeight,
                        }, card.cardID),
                    });
                    return;
                }
                const isAdminIssuedVirtualCard = !!card?.nameValuePairs?.issuedBy && !!card?.nameValuePairs?.isVirtual;
                const isTravelCard = !!card?.nameValuePairs?.isVirtual && !!card?.nameValuePairs?.isTravelCard;
                // The card should be grouped to a specific domain and such domain already exists in a assignedCardsGrouped
                if (assignedCardsGrouped.some((item) => item.isGroupedCardDomain && item.description === card.domainName) && !isAdminIssuedVirtualCard && !isTravelCard) {
                    const domainGroupIndex = assignedCardsGrouped.findIndex((item) => item.isGroupedCardDomain && item.description === card.domainName);
                    const assignedCardsGroupedItem = assignedCardsGrouped.at(domainGroupIndex);
                    if (domainGroupIndex >= 0 && assignedCardsGroupedItem) {
                        assignedCardsGroupedItem.errors = { ...assignedCardsGrouped.at(domainGroupIndex)?.errors, ...card.errors };
                        if (card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN || card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.INDIVIDUAL) {
                            assignedCardsGroupedItem.brickRoadIndicator = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
                        }
                    }
                    return;
                }
                // The card shouldn't be grouped or it's domain group doesn't exist yet
                const cardDescription = card?.nameValuePairs?.issuedBy && card?.lastFourPAN
                    ? `${card?.lastFourPAN} ${CONST_1.default.DOT_SEPARATOR} ${(0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(card.domainName)}`
                    : (0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(card.domainName);
                assignedCardsGrouped.push({
                    key: card.cardID.toString(),
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    title: isTravelCard ? translate('cardPage.expensifyTravelCard') : card?.nameValuePairs?.cardTitle || card.bank,
                    description: isTravelCard ? translate('cardPage.expensifyTravelCard') : cardDescription,
                    onPress: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(String(card.cardID))),
                    cardID: card.cardID,
                    isGroupedCardDomain: !isAdminIssuedVirtualCard && !isTravelCard,
                    shouldShowRightIcon: true,
                    interactive: !isDisabled,
                    disabled: isDisabled,
                    canDismissError: true,
                    errors: card.errors,
                    pendingAction: card.pendingAction,
                    brickRoadIndicator: card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN || card.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.INDIVIDUAL
                        ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                        : undefined,
                    icon,
                    iconStyles: [styles.cardIcon],
                    iconWidth: variables_1.default.cardIconWidth,
                    iconHeight: variables_1.default.cardIconHeight,
                });
            });
            return assignedCardsGrouped;
        }
        // Hide any billing cards that are not P2P debit cards for now because you cannot make them your default method, or delete them
        // All payment cards are temporarily disabled for use as a payment method
        // const paymentCardList = fundList ?? {};
        // const filteredCardList = Object.values(paymentCardList).filter((card) => !!card.accountData?.additionalData?.isP2PDebitCard);
        const filteredCardList = {};
        let combinedPaymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(isLoadingBankAccountList ? {} : (bankAccountList ?? {}), filteredCardList, styles);
        if (filterType !== '') {
            combinedPaymentMethods = combinedPaymentMethods.filter((paymentMethod) => paymentMethod.accountType === filterType);
        }
        if (!isOffline) {
            combinedPaymentMethods = combinedPaymentMethods.filter((paymentMethod) => paymentMethod.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || !(0, EmptyObject_1.isEmptyObject)(paymentMethod.errors));
        }
        combinedPaymentMethods = combinedPaymentMethods.map((paymentMethod) => {
            const pressHandler = onPress;
            const isMethodActive = isPaymentMethodActive(actionPaymentMethodType, activePaymentMethodID, paymentMethod);
            return {
                ...paymentMethod,
                onPress: (e) => pressHandler(e, paymentMethod.accountType, paymentMethod.accountData, {
                    icon: paymentMethod.icon,
                    iconHeight: paymentMethod?.iconHeight,
                    iconWidth: paymentMethod?.iconWidth,
                    iconStyles: paymentMethod?.iconStyles,
                    iconSize: paymentMethod?.iconSize,
                }, paymentMethod.isDefault, paymentMethod.methodID, paymentMethod.description),
                wrapperStyle: isMethodActive ? [StyleUtils.getButtonBackgroundColorStyle(CONST_1.default.BUTTON_STATES.PRESSED)] : null,
                disabled: paymentMethod.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                isMethodActive,
                iconRight: Expensicons.ThreeDots,
                shouldShowRightIcon,
            };
        });
        return combinedPaymentMethods;
    }, [
        shouldShowAssignedCards,
        bankAccountList,
        styles,
        filterType,
        isOffline,
        cardList,
        actionPaymentMethodType,
        activePaymentMethodID,
        StyleUtils,
        shouldShowRightIcon,
        onPress,
        isLoadingBankAccountList,
        isLoadingCardList,
        illustrations,
        translate,
    ]);
    /**
     * Render placeholder when there are no payments methods
     */
    const renderListEmptyComponent = () => <Text_1.default style={styles.popoverMenuItem}>{translate('paymentMethodList.addFirstPaymentMethod')}</Text_1.default>;
    const onPressItem = (0, react_1.useCallback)(() => {
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute(), ROUTES_1.default.SETTINGS_ADD_BANK_ACCOUNT.route));
            return;
        }
        onPress();
    }, [isUserValidated, onPress]);
    const renderListFooterComponent = (0, react_1.useCallback)(() => shouldShowAddBankAccountButton ? (<Button_1.default ref={buttonRef} key="addBankAccountButton" text={translate('bankAccount.addBankAccount')} large success onPress={onPress}/>) : (<MenuItem_1.default onPress={onPressItem} title={translate('bankAccount.addBankAccount')} icon={Expensicons.Plus} wrapperStyle={[styles.paymentMethod, listItemStyle]} ref={buttonRef}/>), [shouldShowAddBankAccountButton, onPressItem, translate, onPress, buttonRef, styles.paymentMethod, listItemStyle]);
    const itemsToRender = (0, react_1.useMemo)(() => {
        if (!shouldShowBankAccountSections) {
            return filteredPaymentMethods;
        }
        if (filteredPaymentMethods.find((method) => method.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.PERSONAL) &&
            filteredPaymentMethods.find((method) => method.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS)) {
            return [
                translate('walletPage.personalBankAccounts'),
                ...filteredPaymentMethods.filter((method) => method.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.PERSONAL),
                translate('walletPage.businessBankAccounts'),
                ...filteredPaymentMethods.filter((method) => method.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS),
            ];
        }
        return filteredPaymentMethods;
    }, [filteredPaymentMethods, shouldShowBankAccountSections, translate]);
    /**
     * Create a menuItem for each passed paymentMethod
     */
    const renderItem = (0, react_1.useCallback)(({ item, index }) => {
        if (typeof item === 'string') {
            return (<react_native_1.View style={[listItemStyle, index === 0 ? styles.mt4 : styles.mt6, styles.mb1]}>
                        <Text_1.default style={[styles.textLabel, styles.colorMuted]}>{item}</Text_1.default>
                    </react_native_1.View>);
        }
        return (<OfflineWithFeedback_1.default onClose={() => dismissError(item)} pendingAction={item.pendingAction} errors={item.errors} errorRowStyles={styles.ph6} canDismissError={item.canDismissError}>
                    <MenuItem_1.default onPress={item.onPress} title={item.title} description={item.description} icon={item.icon} plaidUrl={item.plaidUrl} disabled={item.disabled} iconType={item.plaidUrl ? CONST_1.default.ICON_TYPE_PLAID : CONST_1.default.ICON_TYPE_ICON} displayInDefaultIconColor iconHeight={item.iconHeight ?? item.iconSize} iconWidth={item.iconWidth ?? item.iconSize} iconStyles={item.iconStyles} badgeText={shouldShowDefaultBadge(filteredPaymentMethods, invoiceTransferBankAccountID ? invoiceTransferBankAccountID === item.methodID : item.methodID === userWallet?.walletLinkedAccountID)
                ? translate('paymentMethodList.defaultPaymentMethod')
                : undefined} wrapperStyle={[styles.paymentMethod, listItemStyle]} iconRight={item.iconRight} badgeStyle={styles.badgeBordered} shouldShowRightIcon={item.shouldShowRightIcon} shouldShowSelectedState={shouldShowSelectedState} isSelected={selectedMethodID.toString() === item.methodID?.toString()} interactive={item.interactive} brickRoadIndicator={item.brickRoadIndicator} success={item.isMethodActive}/>
                </OfflineWithFeedback_1.default>);
    }, [
        styles.ph6,
        styles.paymentMethod,
        styles.badgeBordered,
        styles.mt4,
        styles.mt6,
        styles.mb1,
        styles.textLabel,
        styles.colorMuted,
        filteredPaymentMethods,
        invoiceTransferBankAccountID,
        userWallet?.walletLinkedAccountID,
        translate,
        listItemStyle,
        shouldShowSelectedState,
        selectedMethodID,
    ]);
    return (<>
            <react_native_1.View style={[style, { minHeight: (filteredPaymentMethods.length + (shouldShowAddBankAccount ? 1 : 0)) * variables_1.default.optionRowHeight }]}>
                <flash_list_1.FlashList estimatedItemSize={variables_1.default.optionRowHeight} data={itemsToRender} renderItem={renderItem} keyExtractor={keyExtractor} ListEmptyComponent={shouldShowEmptyListMessage ? renderListEmptyComponent : null} ListHeaderComponent={listHeaderComponent} onContentSizeChange={onListContentSizeChange}/>
                {shouldShowAddBankAccount && renderListFooterComponent()}
            </react_native_1.View>
            {shouldShowAddPaymentMethodButton && (<FormAlertWrapper_1.default>
                    {(isFormOffline) => (<Button_1.default text={translate('paymentMethodList.addPaymentMethod')} icon={Expensicons.CreditCard} onPress={onPress} 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            isDisabled={isLoadingPaymentMethods || isFormOffline || isLoadingPaymentMethodsOnyx} style={[styles.mh4, styles.buttonCTA]} key="addPaymentMethodButton" success shouldShowRightIcon large ref={buttonRef}/>)}
                </FormAlertWrapper_1.default>)}
        </>);
}
PaymentMethodList.displayName = 'PaymentMethodList';
exports.default = PaymentMethodList;
